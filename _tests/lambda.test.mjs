import { makeLambda } from '../services/lambda_makeLambda.mjs'
import { deployStack } from '../services/cloudformation_deployStack.mjs'
import { getOutputs } from '../services/cloudformation_getOutputs.mjs'
import { uploadFile } from '../services/s3_uploadFile.mjs'
import { invokeLambda } from '../services/lambda_invokeLambda.mjs'
import test from 'node:test'
import process from 'node:process'
import assert from 'assert'
import * as filesystem from 'rise-filesystem-foundation'

const STACK_BASE_NAME = 'RiseFoundationTestBase'
const STACK_NAME = 'RiseFoundationTestLambda'
test('makeLambda CloudFormation is valid', async () => {
    /**
     * Get bucket name
     */
    const { Bucket } = await getOutputs({
        stack: STACK_BASE_NAME,
        outputs: ['Bucket']
    })

    /**
     * Upload example lambda function code
     */
    const file = await filesystem.getFile({
        path: '/_tests/utils/code.zip',
        projectRoot: process.cwd()
    })

    await uploadFile({
        file,
        bucket: Bucket,
        key: 'code/lambda.zip'
    })

    /**
     * Test makeLambda deployment
     */
    const x = makeLambda({
        appName: 'risefoundationtest',
        name: 'lambda',
        stage: 'dev',
        bucketArn: 'arn:aws:s3:::' + Bucket,
        bucketKey: 'code/lambda.zip',
        permissions: []
    })

    const res = await deployStack({
        name: STACK_NAME,
        template: JSON.stringify(x)
    })

    assert.strictEqual(res.status, 'nothing')

    /**
     * Test that deployed lambda function works
     */
    const executionResult = await invokeLambda({
        name: 'risefoundationtest-lambda-dev',
        payload: JSON.stringify({}),
        region: 'us-east-1'
    })

    assert.strictEqual(executionResult, '2')
})
