# Lambda

## Introduction

There are many ways to run your code on the cloud. Rise AWS Foundation purposely only provides 1 option, AWS Lambda. Lambda functions are:

-   pay per execution
-   can scale automatically
-   cost nothing if they are not triggered
-   are a managed service. You only need to care about code, you dont have to care about operating systems, patching, or any server configuration.
-   is cheap (first 1 million invocations a month are free)

## lambda.updateCode

```js
const rise = require('rise-aws-foundation')
const functionArn = await rise.lambda.updateCode({
    name: 'myFunctionName',
    bucket: 'myBucketName',
    filePath: '/path/to/file.zip'
})
```

## lambda.cf.makeLambda

```js
const rise = require('rise-aws-foundation')
const lambdaCloudformation = rise.lambda.makeLambda({
    // required
    appName: 'nameOfApp',
    name: 'nameOfFunction',
    stage: 'dev',
    bucketArn: 'arn:s3:::mybucket',
    bucketKey: '/path/to/file.zip',
    permissions: [
        {
            Action: 'something',
            Resources: '*'
        }
    ],
    // optional
    env: {
        DB: 'mydb'
    },
    handler: 'src/custom.action',
    timeout: 900, // defaults to 6
    layers: ['arn:of:my:layer']
})
```
