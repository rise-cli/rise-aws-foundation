const { readFile } = require('fs-extra')
const setupAwsFoundation = require('../src/index')
const foundation = setupAwsFoundation({
    type: 'real'
})

const STACK_BASE_NAME = 'RiseAWSFoundationTestBase'
const STACK_NAME = 'RiseAWSFoundationTestLambda'
test('cf.makeLambda CloudFormation is valid', async () => {
    /**
     * Get bucket name
     */
    const { Bucket } = await foundation.cloudformation.getOutputs({
        stack: STACK_BASE_NAME,
        outputs: ['Bucket']
    })

    /**
     * Upload example lambda function code
     */
    const file = await readFile('test/utils/code.zip')

    await foundation.s3.uploadFile({
        file,
        bucket: Bucket,
        key: 'code/lambda.zip'
    })

    /**
     * Test makeLambda deployment
     */
    const x = foundation.lambda.makeLambda({
        appName: 'risefoundationtest',
        name: 'lambda',
        stage: 'dev',
        bucketArn: 'arn:aws:s3:::' + Bucket,
        bucketKey: 'code/lambda.zip',
        permissions: []
    })

    const res = await foundation.cloudformation.deployStack({
        name: STACK_NAME,
        template: JSON.stringify(x)
    })

    expect(res.status).toBe('nothing')

    /**
     * Test that deployed lambda function works
     */
    const executionResult = await foundation.lambda.invokeLambda({
        name: 'risefoundationtest-lambda-dev'
    })

    expect(executionResult).toBe('2')
})
