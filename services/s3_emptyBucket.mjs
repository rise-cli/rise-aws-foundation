import {
    S3Client,
    ListObjectsV2Command,
    DeleteObjectsCommand
} from '@aws-sdk/client-s3'

/**
 * @param {string} props.bucket
 * @param {string} props.key
 */
export async function emptyBucket(props) {
    const client = new S3Client({})
    const input = {
        Bucket: props.bucketName
    }

    const command = new ListObjectsV2Command(input)
    const resp = await client.send(command)

    const contents = resp.Contents
    let testPrefix = false
    let prefixRegexp

    if (!contents[0]) {
        return Promise.resolve()
    }

    if (props.keyPrefix) {
        testPrefix = true
        prefixRegexp = new RegExp('^' + props.keyPrefix)
    }

    const objectsToDelete = contents
        .map((content) => ({ Key: content.Key }))
        .filter((content) => !testPrefix || prefixRegexp.test(content.Key))

    const willEmptyBucket = objectsToDelete.length === contents.length

    if (objectsToDelete.length === 0) {
        return Promise.resolve(willEmptyBucket)
    }

    const params = {
        Bucket: props.bucketName,
        Delete: { Objects: objectsToDelete }
    }

    const command2 = new DeleteObjectsCommand(params)
    await client.send(command2)

    return willEmptyBucket
}
