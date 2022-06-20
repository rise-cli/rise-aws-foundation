const aws = require('aws-sdk')
const lambda = new aws.Lambda({
    region: 'us-east-1'
})

module.exports.invokeLambda = async ({ name, payload }) => {
    let params = {
        FunctionName: name
    }

    if (payload) {
        params.Payload = payload
    }

    const executionResult = await lambda.invoke(params).promise()
    return executionResult.Payload
}
