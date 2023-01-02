const aws = require('aws-sdk')

module.exports.invokeLambda = async ({ name, payload, region }) => {
    let params = {
        FunctionName: name
    }

    if (payload) {
        params.Payload = payload
    }

    const lambda = new aws.Lambda({
        region: region || process.env.AWS_REGION || 'us-east-1'
    })

    const executionResult = await lambda.invoke(params).promise()
    return executionResult.Payload
}
