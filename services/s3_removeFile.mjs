import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

/**
 * @param {string} props.bucket
 * @param {string} props.key
 */
export async function removeFile(props) {
    const client = new S3Client({})
    const input = {
        Bucket: props.bucket,
        Key: props.key
    }

    const command = new DeleteObjectCommand(input)
    await client.send(command)
    return true
}
