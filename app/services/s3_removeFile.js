import AWS from 'aws-sdk'

/**
 * @param {string} props.bucket
 * @param {string} props.key
 */
export async function removeFile(props) {
    const s3 = new AWS.S3()
    const params = {
        Bucket: props.bucket,
        Key: props.key
    }
    await s3.deleteObject(params).promise()
    return true
}
