const AWS = require('aws-sdk')

// export type UploadInput = {
//     file: any
//     bucket: string
//     key: string
//     AWS?: any
// }

/**
 * UploadFile
 * @param props.file A binary file
 * @param props.bucket Name of bucket @example my-globally-unique-bucket
 * @param props.key Path and name of file in bucket @example /pictures/pic1.jpg
 * @returns true
 */
module.exports.uploadFile = async function uploadFile(props) {
    const aws = props.AWS || AWS
    const s3 = new aws.S3()
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
