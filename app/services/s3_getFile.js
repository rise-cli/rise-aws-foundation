import AWS from 'aws-sdk'

/**
 * @param {string} props.bucket
 * @param {string} props.key
 */
export async function getFile(props) {
    const s3 = new AWS.S3()
    const params = {
        Bucket: props.bucket,
        Key: props.key
    }
    const x = await s3.getObject(params).promise()
    return {
        body: x.Body
    }
}
