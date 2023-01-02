# DynamoDB

## Introduction

Its common to require a database in serverless apps. DynamoDB is the best option
as it is itself a serverless service that does not require much supervision. This
abstraction is built with single table design in mind.

This abstraction also comes with a special keyword to help create uuid's. If you
set a value to a string that contains `@id`, this special keyword will be replaced
with a different unique id on every execution.

## db.get

```ts
import aws from 'aws-foundation'
const item = await aws.db.get({
    pk: 'note',
    sk: 'note_1234'
})
```

## db.list

Query with begins_with on the sk

```ts
import aws from 'aws-foundation'
const items = await aws.db.list({
    pk: 'note',
    sk: 'note_'
})
```

## db.set

```ts
import aws from 'aws-foundation'
await aws.db.set({
    pk: 'note',
    sk: 'note_@id',
    content: 'hello'
})
```

## db.remove

```ts
import aws from 'aws-foundation'
await aws.db.remove({
    pk: 'note',
    sk: 'note_1234'
})
```

## db.makeDb

```ts
import aws from 'aws-foundation'
const db = foundation.db.makeDb('myDbName')
```
