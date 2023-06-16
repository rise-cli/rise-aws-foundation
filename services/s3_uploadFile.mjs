import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

/**
 * @param {any} props.file
 * @param {string} props.bucket
 * @param {string} props.key
 */
export async function uploadFile(props) {
    const client = new S3Client({})
    const input = {
        Body: props.file,
        Bucket: props.bucket,
        Key: props.key
    }

    const command = new PutObjectCommand(input)
    const x = await client.send(command)
    return {
        etag: x.ETag
    }
}
