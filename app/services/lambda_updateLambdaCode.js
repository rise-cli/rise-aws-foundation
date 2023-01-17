import AWS from 'aws-sdk'

/**
 * @param {object} props
 * @param {string} props.name
 * @param {string} props.bucket
 * @param {string} props.filePath
 * @param {string} props.region
 */
export async function updateLambdaCode({ name, bucket, filePath, region }) {
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
