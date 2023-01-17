/**
 * @param {string} name
 */
export function makeSimpleBucket(name) {
    const theName = name.charAt(0).toUpperCase() + name.slice(1)
    const BucketName = `${theName}Bucket`

    return {
        Resources: {
            [BucketName]: {
                Type: 'AWS::S3::Bucket',
                DeletionPolicy: 'Delete'
            }
        },
        Outputs: {
            [BucketName]: {
                Value: {
                    Ref: BucketName
                }
            }
        }
    }
}
