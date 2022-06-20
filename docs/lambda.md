# Lambda

## Introduction

Lambda is...

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
