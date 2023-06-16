import { LambdaClient, UpdateFunctionCodeCommand } from '@aws-sdk/client-lambda'

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
    const client = new LambdaClient({
        region: theRegion
    })

    const command = new UpdateFunctionCodeCommand(functionCodeParams)
    const res = await client.send(command)
    return res.FunctionArn
}
