import { getFile } from '../services/s3_getFile.mjs'
import { uploadFile } from '../services/s3_uploadFile.mjs'
import { removeFile } from '../services/s3_removeFile.mjs'
import test from 'node:test'
import process from 'node:process'
import assert from 'assert'
import * as fs from 'fs'
import { makeBucket } from '../services/s3_makeBucket.mjs'
import { makeSimpleBucket } from '../services/s3_makeSimpleBucket.mjs'
import { deployStack } from '../services/cloudformation_deployStack.mjs'
import { getOutputs } from '../services/cloudformation_getOutputs.mjs'

const STACK_NAME = 'RiseFoundationTestS3'

test('s3 makeBucket CloudFormation is valid', async () => {
    const x = makeBucket('mytestbucket')
    const xs = makeSimpleBucket('mysimpletestbucket')
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

    const res = await deployStack({
        name: STACK_NAME,
        template: JSON.stringify(template)
    })

    assert.strictEqual(res.status, 'nothing')
})

test('s3 functions can upload, get, and remove a file in a bucket', async () => {
    const { MysimpletestbucketBucket } = await getOutputs({
        stack: STACK_NAME,
        outputs: ['MysimpletestbucketBucket']
    })

    const BucketName = MysimpletestbucketBucket

    /**
     * Upload File
     */
    const file = fs.readFileSync(
        process.cwd() + '/_tests/utils/test_s3_img.zip'
    )

    const x = await uploadFile({
        file: file,
        bucket: BucketName,
        key: '/pics/mypic.zip'
    })

    assert.strictEqual(typeof x.etag, 'string')

    /**
     * Get File
     */
    const getResult = await getFile({
        bucket: BucketName,
        key: '/pics/mypic.zip'
    })

    assert.strictEqual(typeof getResult.body, 'object')

    /**
     * Remove File
     */
    const removeResult = await removeFile({
        bucket: BucketName,
        key: '/pics/mypic.zip'
    })
    assert.ok(removeResult)
})
