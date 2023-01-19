# DynamoDB

## Introduction

Its common to require a database in serverless apps. DynamoDB is the best option
as it is itself a serverless service that does not require much supervision. This
abstraction is built with single table design in mind.

This abstraction also comes with a special keyword to help create uuid's. If `@id` is included in a string, these functions will be replaced that keyword with a unique id on every execution.

This abstratcion also assumes your database has the following schema:

-   PartitionKey: pk
-   SortKey: sk

-   GSI1: pk2
-   SortKey on GSI1: sk

-   GSI2: pk3
-   SortKey on GSI1: sk

## db.get

```ts
import * as aws from 'rise-aws-foundation'
const item = await aws.db.get({
    pk: 'note',
    sk: 'note_1234'
})
```

## db.list

Query with begins_with on the sk

```ts
import * as aws from 'rise-aws-foundation'
const items = await aws.db.list({
    pk: 'note',
    sk: 'note_'
})
```

## db.set

```ts
import * as aws from 'rise-aws-foundation'
await aws.db.set({
    pk: 'note',
    sk: 'note_@id',
    content: 'hello'
})
```

## db.remove

```ts
import * as aws from 'rise-aws-foundation'
await aws.db.remove({
    pk: 'note',
    sk: 'note_1234'
})
```

## db.makeDb

```ts
import * as aws from 'rise-aws-foundation'
const db = aws.db.makeDb('myDbName')
```
