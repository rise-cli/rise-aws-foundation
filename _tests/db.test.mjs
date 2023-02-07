import test from 'node:test'
import assert from 'assert'
import { makeDb } from '../services/dynamodb_makeDb.mjs'
import { get, list, set, remove } from '../services/dynamodb_crud.mjs'
import { deployStack } from '../services/cloudformation_deployStack.mjs'
const STACK_NAME = 'RiseFoundationTestDB'
process.env.TABLE_NAME = 'mytestdb'

test('dynamodb_makeDb creates Cloudformation correctly', async () => {
    const x = makeDb('mytestdb')
    const res = await deployStack({
        name: STACK_NAME,
        template: JSON.stringify(x)
    })

    assert.strictEqual(res.status, 'nothing')
})

test('db works', async () => {
    /**
     * Testing Set
     */
    const item = await set({
        pk: 'user_1234',
        sk: 'item_1234',
        pk2: 'team_1234',
        pk3: 'org_1234'
    })

    assert.deepEqual(item, {
        pk: 'user_1234',
        sk: 'item_1234',
        pk2: 'team_1234',
        pk3: 'org_1234'
    })

    await set({
        pk: 'user_1235',
        sk: 'item_1235',
        pk2: 'team_1234',
        pk3: 'org_1234'
    })
    await set({
        pk: 'user_1236',
        sk: 'item_1236',
        pk2: 'team_1235',
        pk3: 'org_1234'
    })

    /**
     * Testing Get
     */
    const getItem = await get({
        pk: 'user_1234',
        sk: 'item_1234'
    })

    assert.deepEqual(getItem, {
        pk3: 'org_1234',
        sk: 'item_1234',
        pk2: 'team_1234',
        pk: 'user_1234'
    })

    /**
     * Testing List
     */
    const listItem = await list({
        pk: 'user_1234',
        sk: 'item_'
    })

    assert.deepEqual(listItem, [
        {
            pk3: 'org_1234',
            sk: 'item_1234',
            pk2: 'team_1234',
            pk: 'user_1234'
        }
    ])

    const listItem2 = await list({
        pk2: 'team_1234',
        sk: 'item_'
    })

    assert.deepEqual(listItem2, [
        {
            pk3: 'org_1234',
            sk: 'item_1234',
            pk2: 'team_1234',
            pk: 'user_1234'
        },
        {
            pk3: 'org_1234',
            sk: 'item_1235',
            pk2: 'team_1234',
            pk: 'user_1235'
        }
    ])

    const listItem3 = await list({
        pk3: 'org_1234',
        sk: 'item_'
    })

    assert.deepEqual(listItem3, [
        {
            pk3: 'org_1234',
            sk: 'item_1234',
            pk2: 'team_1234',
            pk: 'user_1234'
        },
        {
            pk3: 'org_1234',
            sk: 'item_1235',
            pk2: 'team_1234',
            pk: 'user_1235'
        },
        {
            pk3: 'org_1234',
            sk: 'item_1236',
            pk2: 'team_1235',
            pk: 'user_1236'
        }
    ])

    /**
     * Testing Remove
     */
    const removedItem = await remove({
        pk: 'user_1234',
        sk: 'item_1234'
    })

    await remove({
        pk: 'user_1235',
        sk: 'item_1235'
    })

    await remove({
        pk: 'user_1236',
        sk: 'item_1236'
    })

    assert.deepEqual(removedItem, { pk: 'user_1234', sk: 'item_1234' })

    /**
     * Testing Get Empty
     */
    const noItem = await get({
        pk: 'user_1234',
        sk: 'item_1234'
    })

    assert.strictEqual(noItem, false)

    /**
     * Testing @id
     */
    const idTestItem = await set({
        pk: 'user_1235',
        sk: 'item_@id'
    })

    await remove(idTestItem)
})

test('db pagination works', async () => {
    const item = await set({
        pk: 'team_1234',
        sk: 'item_1234'
    })

    const item2 = await set({
        pk: 'team_1234',
        sk: 'item_1235'
    })

    const item3 = await set({
        pk: 'team_1234',
        sk: 'item_1236'
    })

    const item4 = await set({
        pk: 'team_1234',
        sk: 'item_1237'
    })

    const list1 = await list({
        pk: 'team_1234',
        sk: 'item',
        limit: 2
    })

    assert.deepEqual(list1, [
        { pk: 'team_1234', sk: 'item_1234' },
        { pk: 'team_1234', sk: 'item_1235' }
    ])

    const list2 = await list({
        pk: 'team_1234',
        sk: 'item',
        limit: 2,
        startAt: list1[1]
    })

    assert.deepEqual(list2, [
        { pk: 'team_1234', sk: 'item_1236' },
        { pk: 'team_1234', sk: 'item_1237' }
    ])

    await remove(item)
    await remove(item2)
    await remove(item3)
    await remove(item4)
})
