import test from 'node:test'
import process from 'node:process'
import assert from 'assert'
import fs from 'fs'
import { deployStack } from '../services/cloudformation_deployStack.mjs'
import { getDeployStatus } from '../services/cloudformation_getDeployStatus.mjs'
import { getOutputs } from '../services/cloudformation_getOutputs.mjs'
const STACK_NAME = 'RiseFoundationTestBase'
process.env.TABLE_NAME = 'mytestdb'

const TEMPLATE_PATH = process.cwd() + '/_tests/infrastructure/baseStack.json'

test('deployStack and getDeployStatus work', async () => {
    /**
     * deployStack test
     */
    const template = fs.readFileSync(TEMPLATE_PATH, { encoding: 'utf-8' })
    const res = await deployStack({
        name: STACK_NAME,
        template
    })

    assert.strictEqual(res.status, 'nothing')

    /**
     * getDeployStatus test
     */
    let checking = 'onCheckIsNotCalled'
    const res2 = await getDeployStatus({
        config: {
            stackName: STACK_NAME,
            minRetryInterval: 1000,
            maxRetryInterval: 1000,
            backoffRate: 1,
            maxRetries: 3,
            onCheck: (x) => {
                checking = x
            }
        }
    })

    assert.strictEqual(res2.status, 'success')
    assert.strictEqual(checking, 'onCheckIsNotCalled')
})

test('getCloudFormationOutputs will work', async () => {
    const x = await getOutputs({
        stack: STACK_NAME,
        outputs: ['Bucket']
    })

    assert.ok(x.Bucket)
})
