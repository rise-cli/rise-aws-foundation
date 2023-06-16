import crypto from 'crypto'
import {
    DynamoDBClient,
    GetItemCommand,
    QueryCommand,
    PutItemCommand,
    DeleteItemCommand
} from '@aws-sdk/client-dynamodb'

/**
 * UUID
 */
const byteToHex = []
for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).substr(1))
}

function bytesToUuid(buf, offset_) {
    const offset = offset_ || 0
    return (
        byteToHex[buf[offset + 0]] +
        byteToHex[buf[offset + 1]] +
        byteToHex[buf[offset + 2]] +
        byteToHex[buf[offset + 3]] +
        '-' +
        byteToHex[buf[offset + 4]] +
        byteToHex[buf[offset + 5]] +
        '-' +
        byteToHex[buf[offset + 6]] +
        byteToHex[buf[offset + 7]] +
        '-' +
        byteToHex[buf[offset + 8]] +
        byteToHex[buf[offset + 9]] +
        '-' +
        byteToHex[buf[offset + 10]] +
        byteToHex[buf[offset + 11]] +
        byteToHex[buf[offset + 12]] +
        byteToHex[buf[offset + 13]] +
        byteToHex[buf[offset + 14]] +
        byteToHex[buf[offset + 15]]
    ).toLowerCase()
}

function rng() {
    const rnds8 = new Uint8Array(16)
    return crypto.randomFillSync(rnds8)
}

function uuid() {
    const rnds = rng()
    rnds[6] = (rnds[6] & 0x0f) | 0x40
    rnds[8] = (rnds[8] & 0x3f) | 0x80
    return bytesToUuid(rnds, undefined)
}

/**
 * FormatKeys
 *
 * FormatKeys allows someone to put @id, which will
 * automatically replace it with a uuid
 *
 */
function formatKeys(oldInput) {
    const input = { ...oldInput }
    if (input.pk && input.pk !== '@id' && input.pk.includes('@id')) {
        input.pk = input.pk.replace('@id', uuid())
    }

    if (input.pk && input.pk === '@id') {
        input.pk = uuid()
    }

    if (input.sk && input.sk !== '@id' && input.sk.includes('@id')) {
        input.sk = input.sk.replace('@id', uuid())
    }

    if (input.sk && input.sk === '@id') {
        input.sk = uuid()
    }

    return input
}

/**
 * DB operations
 */
const region = process.env.AWS_REGION || 'us-east-1'

const client = new DynamoDBClient({
    region
})

/**
 * Get an item from a DynamoDB table
 */
export async function get(input, table = process.env.TABLE_NAME) {
    if (!input.sk) {
        throw new Error('Input must have sk defined')
    }

    if (input.pk) {
        const input = {
            TableName: table,
            Key: {
                pk: input.pk,
                sk: input.sk
            }
        }

        const command = new GetItemCommand(input)
        const item = await client.send(command)
        return item.Item || false
    }

    if (input.pk2) {
        const input = {
            TableName: table,
            IndexName: 'pk2',
            Key: {
                pk2: input.pk2,
                sk: input.sk
            }
        }

        const command = new GetItemCommand(input)
        const item = await client.send(command)
        return item.Item || false
    }
    if (input.pk3) {
        const input = {
            TableName: table,
            IndexName: 'pk3',
            Key: {
                pk3: input.pk3,
                sk: input.sk
            }
        }

        const command = new GetItemCommand(input)
        const item = await client.send(command)
        return item.Item || false
    }

    throw new Error('Input must have pk, pk2, or pk3 defined')
}

/**
 * Query items in a DynamoDB table with begins with
 */
export async function list(input, table = process.env.TABLE_NAME) {
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

    const command = new QueryCommand(params)
    const result = await client.send(command)

    return result.Items || []
}

/**
 * Put an item into a DynamoDB table.
 * This will error if item already exists in table
 */
export async function create(input, table = process.env.TABLE_NAME) {
    if (!input.pk && !input.pk2 && !input.pk3) {
        throw new Error('create must have either pk, pk2, or pk3 defined')
    }

    if (!input.sk) {
        throw new Error('create must have a sk defined')
    }

    const createItem = async () => {
        const formattedInput = formatKeys(input)
        const input = {
            TableName: table,
            Item: formattedInput,
            ConditionExpression: 'attribute_not_exists(sk)'
        }
        const command = new PutItemCommand(input)
        await client.send(command)

        return formattedInput
    }

    try {
        return await createItem()
    } catch (e) {
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
export async function set(input, table = process.env.TABLE_NAME) {
    if (!input.pk && !input.pk2 && !input.pk3) {
        throw new Error('create must have either pk, pk2, or pk3 defined')
    }

    if (!input.sk) {
        throw new Error('create must have a sk defined')
    }

    const formattedInput = formatKeys(input)

    const params = {
        TableName: table,
        Item: formattedInput
    }
    const command = new PutItemCommand(params)
    await client.send(command)

    return formattedInput
}

/**
 * Remove an item from a DynamoDB Tables
 */
export async function remove(input, table = process.env.TABLE_NAME) {
    const params = {
        TableName: table,
        Key: {
            pk: input.pk,
            sk: input.sk
        }
    }
    const command = new DeleteItemCommand(params)
    await client.send(command)
    return input
}
