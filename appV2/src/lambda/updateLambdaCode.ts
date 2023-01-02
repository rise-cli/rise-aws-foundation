const AWS = require('aws-sdk')

export type UpdateLambdaCodeInput = {
    name: string
    bucket: string
    filePath: string
    region: string
}

export async function updateLambdaCode({
    name,
    bucket,
    filePath,
    region
}: UpdateLambdaCodeInput) {
    const functionCodeParams = {
        FunctionName: name,
        Publish: true,
        S3Bucket: bucket,
        S3Key: filePath
    }

    const theRegion = region || process.env.AWS_REGION || 'us-east-1'
    const lambda = new AWS.Lambda({
        region: theRegion
    })

    const res = await lambda.updateFunctionCode(functionCodeParams).promise()
    return res.FunctionArn
}
