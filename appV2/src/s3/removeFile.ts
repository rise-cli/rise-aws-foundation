const AWS = require('aws-sdk')

export type RemoveInput = {
    bucket: string
    key: string
    AWS?: any
}

/**
 * RemoveFile
 * @param props.bucket Name of bucket @example my-globally-unique-bucket
 * @param props.key Path and name of file in bucket @example /pictures/pic1.jpg
 * @returns true
 */
export default async function removeFile(props: RemoveInput): Promise<true> {
    const aws = props.AWS || AWS
    const s3 = new aws.S3()
    const params = {
        Bucket: props.bucket,
        Key: props.key
    }
    const x = await s3.deleteObject(params).promise()
    return true
}
