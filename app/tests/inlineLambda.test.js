const setupAwsFoundation = require('../src/index')
const foundation = setupAwsFoundation({
    type: 'real'
})

const STACK_NAME = 'RiseAWSFoundationTestInlineLambda'
test('cf.makeInlineLambda CloudFormation is valid', async () => {
    /**
     * Test makeLambda deployment
     */
    const x = foundation.lambda.makeInlineLambda({
        appName: 'riseawsfoundationinlinelambdatest',
        name: 'lambda',
        stage: 'dev',
        permissions: [],
        code: `module.exports.handler = async () => 2`
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
        name: 'riseawsfoundationinlinelambdatest-lambda-dev'
    })

    expect(executionResult).toBe('2')
})
