# Cognito

## Introduction

Cognito is a great way to manage users for you app, and to handle authenticated http calls and
user login.

## cognito.createUser

```ts
import * as aws from 'rise-aws-foundation'
const user = await aws.cognito.createUser({
    email: 'example@gmail.com',
    userPoolId: 'pool_1234'
})
```

## cognito.resetPassword

```ts
import * as aws from 'rise-aws-foundation'
await aws.cognito.resetPassword({
    email: 'example@gmail.com',
    userPoolId: 'pool_1234'
})
```

## cognito.removeUser

```ts
import * as aws from 'rise-aws-foundation'
const removedUser = await aws.cognito.removeUser({
    email: 'example@gmail.com',
    userPoolId: 'pool_1234'
})
```

## cognito.makeCognitoPoolAndClient

```ts
import * as aws from 'rise-aws-foundation'
const cognito = foundation.cognito.makeCognitoPoolAndClient('myAppName')
```
