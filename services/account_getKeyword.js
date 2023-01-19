import AWS from 'aws-sdk'

/**
 * @param {string} str
 * @param {string} region
 */
const getOutput = async (str, region) => {
    const cloudformation = new AWS.CloudFormation({
        region
    })

    const stack = str.split('.')[1]
    const value = str.split('.')[2]
    const params = {
        StackName: stack
    }

    const res = await cloudformation.describeStacks(params).promise()

    if (!res.Stacks) {
        throw new Error('There as an issue describing stack: ' + stack)
    }

    const outputs = res.Stacks[0].Outputs

    if (outputs.map((x) => x.OutputKey).includes(value)) {
        return outputs.map((x) => ({
            key: x.OutputKey,
            stack: stack,
            value: x.OutputValue
        }))
    } else {
        throw new Error(`${str} not found`)
    }
}

/**
 * @param {string} str
 * @param {string} region
 */
const getSsmParam = async (str, region) => {
    const v = str.split('.')[1]
    const ssm = new AWS.SSM({
        region: region
    })
    const params = {
        Name: v
    }
    const res = await ssm.getParameter(params).promise()
    if (!res.Parameter) {
        throw new Error('There as an issue getting param: ' + v)
    }
    return res.Parameter.Value
}

const getAccountId = async () => {
    const sts = new AWS.STS()
    const res = await sts.getCallerIdentity({}).promise()
    return res.Account
}

/**
 * @param {object} state Record<string, string>
 * @param {string} str
 */
export async function getKeyword(state, str) {
    let valueResultsMap = state

    if (!state['@stage']) {
        valueResultsMap['@stage'] = 'dev'
    }

    if (!state['@region']) {
        valueResultsMap['@region'] = 'us-east-1'
    }

    let region = valueResultsMap['@region']

    const getString = async (value) => {
        if (value.includes('{') && value.includes('}')) {
            let stringToUse = ''
            let replaceText = []
            let replaceIndex = -1

            let replace = false
            value.split('').forEach((ch, i, l) => {
                if (l[i] === '{' && l[i + 1] === '@') {
                    replaceIndex++
                    replace = true
                } else if (l[i] === '}' && replace) {
                    replace = false
                } else {
                    stringToUse = stringToUse + ch
                    if (replace) {
                        if (!replaceText[replaceIndex]) {
                            replaceText[replaceIndex] = ch
                        } else {
                            replaceText[replaceIndex] =
                                replaceText[replaceIndex] + ch
                        }
                    }
                }
            })

            for (const r of replaceText) {
                if (r.startsWith('@stage')) {
                    stringToUse = stringToUse.replace(
                        r,
                        valueResultsMap['@stage']
                    )
                }

                if (r.startsWith('@region')) {
                    stringToUse = stringToUse.replace(
                        r,
                        valueResultsMap['@region']
                    )
                }

                if (r.startsWith('@output')) {
                    if (valueResultsMap[r]) {
                        stringToUse = stringToUse.replace(r, valueResultsMap[r])
                    } else {
                        const outputs = await getOutput(r, region)
                        outputs.forEach((x) => {
                            valueResultsMap[`@output.${x.stack}.${x.key}`] =
                                x.value
                        })
                        const theOutput = valueResultsMap[r]

                        stringToUse = stringToUse.replace(r, theOutput)
                    }
                }

                if (r.startsWith('@accountId')) {
                    if (valueResultsMap[r]) {
                        stringToUse = stringToUse.replace(r, valueResultsMap[r])
                    } else {
                        const accountId = (await getAccountId()) || ''
                        valueResultsMap[`@accountId`] = accountId
                        const theOutput = accountId
                        stringToUse = stringToUse.replace(r, theOutput)
                    }
                }

                if (r.startsWith('@ssm')) {
                    if (valueResultsMap[r]) {
                        stringToUse = stringToUse.replace(r, valueResultsMap[r])
                    } else {
                        const v = (await getSsmParam(r, region)) || ''
                        valueResultsMap[r] = v
                        stringToUse = stringToUse.replace(r, v)
                    }
                }
            }

            return stringToUse
        } else {
            return value
        }
    }
    const result = await getString(str)
    return {
        result,
        state: valueResultsMap
    }
}
