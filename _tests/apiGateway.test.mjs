import { deployStack } from '../services/cloudformation_deployStack.mjs'
import { makeHttpApi } from '../services/apigateway_makeHttpApi.mjs'
import { makeHttpApiRoute } from '../services/apigateway_makeHttpApiRoute.mjs'
import { makeInlineLambda } from '../services/lambda_makeInlineLambda.mjs'
import { getOutputs } from '../services/cloudformation_getOutputs.mjs'
import test from 'node:test'
import assert from 'assert'

const STACK_NAME = 'RiseFoundationTestApi'
test('apigateway CloudFormation is valid', async () => {
    /**
     * Make CF Tempalte
     */
    const api = makeHttpApi({
        name: 'mytestapi',
        stage: 'dev'
    })

    // get endpoint
    const apiRoute = makeHttpApiRoute({
        route: 'notes',
        method: 'get',
        functionReference: 'Lambdabluedev'
    })

    const lambda = makeInlineLambda({
        appName: 'mytestapi',
        name: 'blue',
        stage: 'dev',
        permissions: [],
        code: `module.exports.handler = async () => {
        return {
            statusCode: 200,
            body: JSON.stringify({ status: "notes"})
        }
    }`
    })

    // post endpoint
    const postRoute = makeHttpApiRoute({
        route: 'notes',
        method: 'post',
        functionReference: 'Lambdapostbluedev'
    })

    const postLambda = makeInlineLambda({
        appName: 'mytestapi',
        name: 'postblue',
        stage: 'dev',
        permissions: [],
        code: `module.exports.handler = async () => {
        return {
            statusCode: 200,
            body: JSON.stringify({ status: "postnotes"})
        }
    }`
    })

    const template = {
        Resources: {
            ...api.Resources,
            ...apiRoute.Resources,
            ...lambda.Resources,
            ...postRoute.Resources,
            ...postLambda.Resources
        },
        Outputs: {
            ...api.Outputs,
            ...apiRoute.Outputs,
            ...lambda.Outputs,
            ...postRoute.Outputs,
            ...postLambda.Outputs
        }
    }

    /**
     * Confirm the template deploys and is what we expect
     */
    const res = await deployStack({
        name: STACK_NAME,
        template: JSON.stringify(template)
    })

    assert.strictEqual(res.status, 'nothing')

    /**
     * Hit endpoint with lambda and confirm we get something back
     */
    const { ApiUrl } = await getOutputs({
        stack: STACK_NAME,
        outputs: ['ApiUrl']
    })

    const x = await fetch(ApiUrl + '/notes')
    const xx = await x.json()
    assert.strictEqual(xx.status, 'notes')

    const px = await fetch(ApiUrl + '/notes', {
        method: 'POST'
    })
    const pxx = await px.json()
    assert.strictEqual(pxx.status, 'postnotes')
})
