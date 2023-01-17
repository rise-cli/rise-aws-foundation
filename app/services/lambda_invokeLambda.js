import AWS from 'aws-sdk'

/**
 * @param {object} props
 * @param {string} props.name
 * @param {string} props.payload
 * @param {string} [props.region]
 */
export const invokeLambda = async ({ name, payload, region }) => {
    let params = {
        FunctionName: name
    }

    if (payload) {
        params.Payload = payload
    }

    const lambda = new AWS.Lambda({
        region: region || process.env.AWS_REGION || 'us-east-1'
    })

    const executionResult = await lambda.invoke(params).promise()
    return executionResult.Payload
}
