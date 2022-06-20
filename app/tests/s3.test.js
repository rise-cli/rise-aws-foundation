const setupAwsFoundation = require('../src/index')
const fs = require('fs')
const foundation = setupAwsFoundation({
    type: 'real'
})

const STACK_NAME = 'RiseAWSFoundationTestS3'

test('cf.makeBucket CloudFormation is valid', async () => {
    const x = foundation.s3.makeBucket('mytestbucket')
    const xs = foundation.s3.makeSimpleBucket('mysimpletestbucket')
    const template = {
        Resources: {
            ...x.Resources,
            ...xs.Resources
        },
        Outputs: {
            ...x.Outputs,
            ...xs.Outputs
        }
    }

    const res = await foundation.cloudformation.deployStack({
        name: STACK_NAME,
        template: JSON.stringify(template)
    })

    expect(res.status).toBe('nothing')
})

test('s3 functions can upload, get, and remove a file in a bucket', async () => {
    const { MysimpletestbucketBucket } =
        await foundation.cloudformation.getOutputs({
            stack: STACK_NAME,
            outputs: ['MysimpletestbucketBucket']
        })

    const BucketName = MysimpletestbucketBucket

    /**
     * Upload File
     */
    const file = fs.readFileSync(
        process.cwd() + '/src/s3/_test/test_s3_img.zip'
    )

    const x = await foundation.s3.uploadFile({
        file: file,
        bucket: BucketName,
        key: '/pics/mypic.zip'
    })

    expect(typeof x.etag).toBe('string')

    /**
     * Get File
     */
    const getResult = await foundation.s3.getFile({
        bucket: BucketName,
        key: '/pics/mypic.zip'
    })

    expect(typeof getResult.body).toBe('object')

    /**
     * Remove File
     *
     */
    const removeResult = await foundation.s3.removeFile({
        bucket: BucketName,
        key: '/pics/mypic.zip'
    })
    expect(removeResult).toEqual(true)
})
