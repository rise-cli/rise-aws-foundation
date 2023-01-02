const AWS = require('aws-sdk')

export const invokeLambda = async ({
    name,
    payload,
    region
}: {
    name: string
    payload: string
    region?: string
}) => {
    let params: any = {
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
