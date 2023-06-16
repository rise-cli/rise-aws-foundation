import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

/**
 * @param {string} props.bucket
 * @param {string} props.key
 */
export async function getFile(props) {
    const client = new S3Client({})
    const input = {
        Bucket: props.bucket,
        Key: props.key
    }

    const command = new GetObjectCommand(input)
    const x = await client.send(command)
    return {
        body: x.Body
    }
}
