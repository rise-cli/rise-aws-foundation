import { getKeyword } from '../services/account_getKeyword.mjs'
import test from 'node:test'
import assert from 'assert'

const STACK_NAME = 'RiseFoundationTestBase'
const STACK_OUTPUT = 'Bucket'
const PARAM = 'FOUNDATION_TEST'
const BUCKET_NAME =
    'risefoundationtestbase-risefoundationtestresource-1t9zvuvpt44vb'
const ACCOUNT = '511402963278'

test('keywords will get outputs, ssm, and accountIds', async () => {
    let state = {
        '@region': 'us-east-1'
    }
    const keyword = `BucketName: {@output.${STACK_NAME}.${STACK_OUTPUT}}`
    const res = await getKeyword(state, keyword)

    assert.strictEqual(res.result, `BucketName: ${BUCKET_NAME}`)

    const keyword2 = `MyUser-{@ssm.${PARAM}}`
    const res2 = await getKeyword(state, keyword2)
    assert.strictEqual(res2.result, 'MyUser-TEST')

    const keyword3 = `arn:{@accountId}:123`
    const res3 = await getKeyword(state, keyword3)

    assert.strictEqual(res3.result, `arn:${ACCOUNT}:123`)
    assert.deepEqual(res3.state, {
        '@stage': 'dev',
        '@region': 'us-east-1',
        '@output.RiseFoundationTestBase.Bucket': BUCKET_NAME,
        '@ssm.FOUNDATION_TEST': 'TEST',
        '@accountId': ACCOUNT
    })
})
