import { formatKeys } from './utils/format_keys'
const AWS = require('aws-sdk')
const region = process.env.AWS_REGION || 'us-east-1'
const db = new AWS.DynamoDB.DocumentClient({
    region: region
})

/** Get an item from a DynamoDB table */
export async function getDbItem(input: any, table = process.env.TABLE) {
    if (!input.sk) {
        throw new Error('Input must have sk defined')
    }

    if (input.pk) {
        const item = await db
            .get({
                TableName: table,
                Key: {
                    pk: input.pk,
                    sk: input.sk
                }
            })
            .promise()

        return item.Item || false
    }

    if (input.pk2) {
        const item = await db
            .get({
                TableName: table,
                IndexName: 'pk2',
                Key: {
                    pk2: input.pk2,
                    sk: input.sk
                }
            })
            .promise()

        return item.Item || false
    }
    if (input.pk3) {
        const item = await db
            .get({
                TableName: table,
                IndexName: 'pk3',
                Key: {
                    pk3: input.pk3,
                    sk: input.sk
                }
            })
            .promise()

        return item.Item || false
    }

    throw new Error('Input must have pk, pk2, or pk3 defined')
}

/** Query items in a DynamoDB table with begins with  */
export async function listDbItems(input: any, table = process.env.TABLE) {
    if (!input.sk) {
        throw new Error('Input must have sk defined')
    }

    if (!input.pk && !input.pk2 && !input.pk3) {
        throw new Error('Input must have either pk, pk2, or pk3 defined')
    }

    let params = {}

    if (input.pk) {
        params = {
            TableName: table,
            ...(input.limit ? { Limit: input.limit } : {}),
            ...(input.startAt ? { ExclusiveStartKey: input.startAt } : {}),
            KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
            ExpressionAttributeValues: {
                ':pk': input.pk,
                ':sk': input.sk
            }
        }
    }

    if (input.pk2) {
        params = {
            TableName: table,
            ...(input.limit ? { Limit: input.limit } : {}),
            ...(input.startAt ? { ExclusiveStartKey: input.startAt } : {}),
            IndexName: 'pk2',
            KeyConditionExpression: 'pk2 = :gsi AND begins_with(sk, :sk)',
            ExpressionAttributeValues: {
                ':gsi': input.pk2,
                ':sk': input.sk
            }
        }
    }

    if (input.pk3) {
        params = {
            TableName: table,
            ...(input.limit ? { Limit: input.limit } : {}),
            ...(input.startAt ? { ExclusiveStartKey: input.startAt } : {}),
            IndexName: 'pk3',
            KeyConditionExpression: 'pk3 = :gsi AND begins_with(sk, :sk)',
            ExpressionAttributeValues: {
                ':gsi': input.pk3,
                ':sk': input.sk
            }
        }
    }

    const result = await db.query(params).promise()
    return result.Items || []
}

/**
 * Put an item into a DynamoDB table.
 * This will error if item already exists in table
 */
export async function createDbItem(input: any, table = process.env.TABLE) {
    if (!input.pk && !input.pk2 && !input.pk3) {
        throw new Error('create must have either pk, pk2, or pk3 defined')
    }

    if (!input.sk) {
        throw new Error('create must have a sk defined')
    }

    const createItem = async () => {
        const formattedInput = formatKeys(input)

        await db
            .put({
                TableName: table,
                Item: formattedInput,
                ConditionExpression: 'attribute_not_exists(sk)'
            })
            .promise()

        return formattedInput
    }

    try {
        return await createItem()
    } catch (e: any) {
        if (
            e.message.includes('ConditionalCheckFailedException') &&
            input.sk.includes('@id')
        ) {
            return await createItem()
        }
        throw new Error(e)
    }
}

/**
 * Put an item into a DynamoDB table.
 * This will overwrite if item already exists in table
 */
export async function setDbItem(input: any, table = process.env.TABLE) {
    if (!input.pk && !input.pk2 && !input.pk3) {
        throw new Error('create must have either pk, pk2, or pk3 defined')
    }

    if (!input.sk) {
        throw new Error('create must have a sk defined')
    }

    const formattedInput = formatKeys(input)
    await db
        .put({
            TableName: table,
            Item: formattedInput
        })
        .promise()

    return formattedInput
}

/** Remove an item from a DynamoDB Tables */
export async function removeDbItem(input: any, table = process.env.TABLE) {
    await db
        .delete({
            TableName: table,
            Key: {
                pk: input.pk,
                sk: input.sk
            }
        })
        .promise()
    return input
}
