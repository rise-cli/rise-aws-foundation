import AWS from 'aws-sdk'

/**
 * @param {any} props.file
 * @param {string} props.bucket
 * @param {string} props.key
 */
export async function uploadFile(props) {
    const s3 = new AWS.S3()
    const params = {
        Body: props.file,
        Bucket: props.bucket,
        Key: props.key
    }
    const x = await s3.putObject(params).promise()
    return {
        etag: x.ETag
    }
}
