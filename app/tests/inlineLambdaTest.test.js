const { makeInlineLambda } = require('../src/lambda/cfMakeInlineLambda')
const { deployStack } = require('../src/cloudformation/deployStack')
const aws = require('aws-sdk')

const lambda = new aws.Lambda({
    region: 'us-east-1'
})

const STACK_NAME = 'RiseAWSFoundationTestInlineLambda'
test('cf.makeInlineLambda CloudFormation is valid', async () => {
    /**
     * Test makeLambda deployment
     */
    const x = makeInlineLambda({
        appName: 'riseawsfoundationinlinelambdatest',
        name: 'lambda',
        stage: 'dev',
        permissions: [],
        code: `module.exports.handler = async () => 2`
    })

    const res = await deployStack({
        name: STACK_NAME,
        template: JSON.stringify(x)
    })

    expect(res.status).toBe('nothing')

    /**
     * Test that deployed lambda function works
     */
    const executionResult = await lambda
        .invoke({
            FunctionName: 'riseawsfoundationinlinelambdatest-lambda-dev'
        })
        .promise()

    expect(executionResult.Payload).toBe('2')
})
