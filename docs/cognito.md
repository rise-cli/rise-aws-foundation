# Cognito

## Introduction

Cognito is a great way to manage users for you app, and to handle authenticated http calls and
user login.

## cognito.createUser

```ts
import aws from 'aws-foundation'
const user = await aws.cognito.createUser({
    email: 'example@gmail.com',
    userPoolId: 'pool_1234'
})
```

## cognito.resetPassword

```ts
import aws from 'aws-foundation'
await aws.cognito.resetPassword({
    email: 'example@gmail.com',
    userPoolId: 'pool_1234'
})
```

## cognito.removeUser

```ts
import aws from 'aws-foundation'
const removedUser = await aws.cognito.removeUser({
    email: 'example@gmail.com',
    userPoolId: 'pool_1234'
})
```

## cognito.loginUser

```ts
import aws from 'aws-foundation'
const tokens = await aws.cognito.loginUser({
    userName: 'example@gmail.com',
    password: '****',
    userPoolId: 'pool_1234',
    clientId: 'client_1234'
})
```

## cognito.loginHandleNewPassword

```ts
import aws from 'aws-foundation'
const tokens = await aws.cognito.loginHandleNewPassword({
    session: 'session_string',
    userName: 'example@gmail.com',
    newPassword: '****',
    userPoolId: 'pool_1234',
    clientId: 'client_1234'
})
```

## cognito.validateToken

```ts
import aws from 'aws-foundation'
const validateResponse = await aws.cognito.validateToken({
    token: 'JWT_TOKEN',
    userPoolId: 'pool_1234'
})
```

## cognito.makeCognitoPoolAndClient

```ts
import aws from 'aws-foundation'
const cognito = foundation.cognito.makeCognitoPoolAndClient('myAppName')
```
