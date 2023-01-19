import AWS from 'aws-sdk'

const ResultStatus = {
    success: 'success',
    fail: 'fail',
    rollback: 'rollback',
    inprogress: 'inprogress'
}

const stackStateMap = {
    // create
    CREATE_IN_PROGRESS: ResultStatus.inprogress,
    CREATE_FAILED: ResultStatus.fail,
    CREATE_COMPLETE: ResultStatus.success,
    // rollback
    ROLLBACK_IN_PROGRESS: ResultStatus.inprogress,
    ROLLBACK_FAILED: ResultStatus.fail,
    ROLLBACK_COMPLETE: ResultStatus.rollback,
    // delete
    DELETE_IN_PROGRESS: ResultStatus.inprogress,
    DELETE_FAILED: ResultStatus.fail,
    DELETE_COMPLETE: ResultStatus.success,
    // update
    UPDATE_IN_PROGRESS: ResultStatus.inprogress,
    UPDATE_COMPLETE_CLEANUP_IN_PROGRESS: ResultStatus.inprogress,
    UPDATE_COMPLETE: ResultStatus.success,
    UPDATE_FAILED: ResultStatus.fail,
    // update rollback
    UPDATE_ROLLBACK_IN_PROGRESS: ResultStatus.inprogress,
    UPDATE_ROLLBACK_FAILED: ResultStatus.fail,
    UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS: ResultStatus.inprogress,
    UPDATE_ROLLBACK_COMPLETE: ResultStatus.rollback,
    // review
    REVIEW_IN_PROGRESS: ResultStatus.inprogress,
    // import
    IMPORT_IN_PROGRESS: ResultStatus.inprogress,
    IMPORT_COMPLETE: ResultStatus.success,
    IMPORT_ROLLBACK_IN_PROGRESS: ResultStatus.inprogress,
    IMPORT_ROLLBACK_FAILED: ResultStatus.fail,
    IMPORT_ROLLBACK_COMPLETE: ResultStatus.rollback
}

/**
 * GetStackInfo
 */
const getStackInfo = (region) => async (name) => {
    const cloudformation = new AWS.CloudFormation({
        region
    })

    const params = {
        StackName: name
    }

    try {
        const result = await cloudformation.describeStacks(params).promise()
        if (!result.Stacks || result.Stacks.length === 0) {
            throw new Error('No stacks found with the name ' + name)
        }

        return result.Stacks[0]
    } catch (e) {
        const message =
            e instanceof Error
                ? e.message
                : 'Something unexpected has gone wrong'
        throw new Error(message)
    }
}

/**
 * GetStackResourceStatus
 */
const getStackResourceStatus = (region) => async (name) => {
    const cloudformation = new AWS.CloudFormation({
        region
    })

    const params = {
        StackName: name
    }

    try {
        const result = await cloudformation
            .describeStackResources(params)
            .promise()

        if (!result.StackResources) {
            throw new Error('No stack resources found')
        }

        return result.StackResources
    } catch (e) {
        const message =
            e instanceof Error
                ? e.message
                : 'Something unexpected has gone wrong'
        throw new Error(message)
    }
}

/**
 * Get Cloudformation stack info and outputs
 */
async function getCloudFormationStackInfo(getInfo, name) {
    const data = await getInfo(name)
    const status = data.StackStatus
    const message = data.StackStatusReason || 'unknown'
    const outputs = data.Outputs || []
    const stackInfoStatus = stackStateMap[status] || ResultStatus.fail

    return {
        status: stackInfoStatus,
        message,
        outputs: outputs.map((o) => {
            if (!o.OutputKey) {
                throw new Error('Output does not have a key')
            }

            if (!o.OutputValue) {
                throw new Error('Output does not have a key')
            }

            return {
                key: o.OutputKey,
                value: o.OutputValue
            }
        })
    }
}

/**
 * Display current deploy status of all resources
 * wait some time
 * and check the status again
 */
async function checkAgainState(io, config, timer, times) {
    /**
     * Wait based on timer passed in to the function
     */
    const wait = (time) => new Promise((r) => setTimeout(() => r(), time))
    await wait(timer)

    /**
     * Get status of all resources
     */
    const resourceProgress = await io.getResources(config.stackName)

    /**
     * Display status in terminal
     */
    const resources = resourceProgress.map((x) => ({
        id: x.LogicalResourceId,
        status: x.ResourceStatus,
        type: x.ResourceType
    }))
    config.onCheck(resources, times)

    /**
     * Create increased timer for the next call
     */
    const increasedTimer = timer * config.backoffRate
    const newTimer =
        increasedTimer > config.maxRetryInterval
            ? config.maxRetryInterval
            : increasedTimer

    return await recursiveCheck(io, config, times + 1, newTimer)
}

/**
 * Display and return:
 * "we checked the max amount of times, and Cloudformation is still deploying"
 */
function stillInProgressState() {
    return {
        status: ResultStatus.inprogress,
        message: 'Cloudformation is still deploying...',
        outputs: {}
    }
}

/**
 * Display and return deploy failure message
 */
function failState(message) {
    return {
        status: ResultStatus.fail,
        message: message,
        outputs: {}
    }
}

/**
 * Display and return deploy success state
 * and deployed app resource details
 */
function completeState(stackInfo) {
    if (stackInfo.status === ResultStatus.rollback) {
        return {
            status: ResultStatus.rollback,
            message: 'Rollback Complete',
            outputs: stackInfo.outputs.reduce((acc, x) => {
                acc[x.key] = x.value
                return acc
            }, {})
        }
    }
    return {
        status: ResultStatus.success,
        message: 'Deployment Successful',
        outputs: stackInfo.outputs.reduce((acc, x) => {
            acc[x.key] = x.value
            return acc
        }, {})
    }
}

/**
 * Display and return an unkonwn state
 * this happens if cloudformation returns an unknown or undefined
 * status
 */
function unknownState() {
    return {
        status: 'fail',
        message: 'Cloudformation is in an unknown state',
        outputs: {}
    }
}

async function recursiveCheck(io, config, times, timer) {
    const stackInfo = await getCloudFormationStackInfo(
        io.getInfo,
        config.stackName
    )

    if (times === config.maxRetries) {
        return stillInProgressState()
    }

    if (stackInfo.status.includes(ResultStatus.inprogress)) {
        return await checkAgainState(io, config, timer, times)
    }

    if ([ResultStatus.fail, ResultStatus.rollback].includes(stackInfo.status)) {
        return failState(stackInfo.message)
    }

    if (stackInfo.status.includes(ResultStatus.success)) {
        return completeState(stackInfo)
    }

    return unknownState()
}

export async function getDeployStatus(props) {
    const region = props.region || process.env.AWS_REGION || 'us-east-1'
    return recursiveCheck(
        {
            getInfo: getStackInfo(region),
            getResources: getStackResourceStatus(region)
        },
        props.config,
        1,
        props.config.minRetryInterval
    )
}
