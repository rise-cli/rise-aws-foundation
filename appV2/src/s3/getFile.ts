const AWS = require('aws-sdk')

export type GetS3FileInput = {
    bucket: string
    key: string
    AWS?: any
}

/**
 * GetFile
 * @param props.bucket Name of bucket @example my-globally-unique-bucket
 * @param props.key Path and name of file in bucket @example /pictures/pic1.jpg
 * @returns true
 */
export default async function getFile(
    props: GetS3FileInput
): Promise<{ body: Buffer }> {
    const aws = props.AWS || AWS
    const s3 = new aws.S3()
    const params = {
        Bucket: props.bucket,
        Key: props.key
    }
    const x = await s3.getObject(params).promise()
    return {
        body: x.Body
    }
}
