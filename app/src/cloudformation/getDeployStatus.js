const AWS = require('aws-sdk')

/**
 * GetStackInfo
 */
const getStackInfo = (AWS, region) => async (name) => {
    const cloudformation = new AWS.CloudFormation({
        region
    })
    const params = {
        StackName: name
    }

    const x = await cloudformation.describeStacks(params).promise()
    return x.Stacks[0]
}

/**
 * GetStackResourceStatus
 */
const getStackResourceStatus = (AWS, region) => async (name) => {
    const cloudformation = new AWS.CloudFormation({
        region
    })
    const params = {
        StackName: name
    }

    return await cloudformation.describeStackResources(params).promise()
}

/**
 * Get Cloudformation stack info and outputs
 */
async function getCloudFormationStackInfo(getInfo, name) {
    const data = await getInfo(name)
    const status = data.StackStatus
    const message = data.StackStatusReason
    const outputs = data.Outputs
    return {
        status,
        message,
        outputs
    }
}

/**
 * Display and return:
 * "we checked the max amount of times, and Cloudformation is still deploying"
 */
function stillInProgressState() {
    return {
        status: 'in progress',
        message: 'Cloudformation is still deploying...'
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
    const resources = resourceProgress.StackResources.map((x) => ({
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
 * Display and return deploy failure message
 */
function failState(message) {
    return {
        status: 'fail',
        message: message
    }
}

/**
 * Display and return deploy success state
 * and deployed app resource details
 */
function completeState(stackInfo) {
    return {
        status: 'success',
        message: 'success',
        info: stackInfo
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
        message: 'Cloudformation is in an unknown state'
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

    if (stackInfo.status.includes('PROGRESS')) {
        return await checkAgainState(io, config, timer, times)
    }

    if (stackInfo.status.includes('FAIL')) {
        return failState(stackInfo.message)
    }

    if (stackInfo.status.includes('COMPLETE')) {
        return completeState(stackInfo)
    }

    return unknownState()
}

module.exports.getDeployStatus = async function getDeployStatus(props) {
    const aws = props.AWS || AWS
    const region = props.region || process.env.AWS_REGION || 'us-east-1'
    return recursiveCheck(
        {
            getInfo: getStackInfo(aws, region),
            getResources: getStackResourceStatus(aws, region)
        },
        props.config,
        1,
        props.config.minRetryInterval
    )
}
