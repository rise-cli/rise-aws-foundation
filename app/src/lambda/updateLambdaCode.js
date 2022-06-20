const AWS = require('aws-sdk')
const region = process.env.AWS_REGION || 'us-east-1'
const lambda = new AWS.Lambda({
    region: region
})

// export type UpdateLambdaCodeInput = {
//     name: string
//     bucket: string
//     filePath: string
// }

module.exports.updateLambdaCode = async function updateLambdaCode({
    name,
    bucket,
    filePath
}) {
    const functionCodeParams = {
        FunctionName: name,
        Publish: true,
        S3Bucket: bucket,
        S3Key: filePath
    }

    const res = await lambda.updateFunctionCode(functionCodeParams).promise()
    return res.FunctionArn
}
