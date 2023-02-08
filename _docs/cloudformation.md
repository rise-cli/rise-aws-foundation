# CloudFormation

## Introduction

CloudFormation is the way we deploy things into an AWS account. Every other resource within "rise-aws-foundations" has methods that will create JSON objects representing AWS resources. With this information, we can deploy a Cloudformation stack.

## cloudformation.deployStack

```js
import * as aws from 'rise-aws-foundation'
const createResult = await aws.cloudformation.deployStack({
    name: 'testingstack',
    template: myTemplate
})
```

## cloudformation.getDeployStatus

```js
import * as aws from 'rise-aws-foundation'
const deployResult = await aws.cloudformation.getDeployStatus({
    config: {
        stackName: 'testingstack',
        minRetryInterval: 1000,
        maxRetryInterval: 5000,
        backoffRate: 1.2,
        maxRetries: 50,
        onCheck: (x) => {
            // code to handle every status update
        }
    }
})
```

## cloudformation.removeStack

```js
import * as aws from 'rise-aws-foundation'
const removeResult = await aws.cloudformation.removeStack({
    name: 'testingstack',
    template: myTemplate
})
```

## cloudformation.getRemoveStatus

```js
import * as aws from 'rise-aws-foundation'
const removeResult = await aws.cloudformation.getRemoveStatus({
    config: {
        stackName: 'testingstack',
        minRetryInterval: 1000,
        maxRetryInterval: 5000,
        backoffRate: 1.2,
        maxRetries: 50,
        onCheck: (x) => {
            // code to handle every status update
        }
    }
})
```

## cloudformation.getCloudFormationOutputs

```js
import * as aws from 'rise-aws-foundation'
const outputResult = await aws.cloudformation.getOutputs({
    stack: 'nameOfStack',
    outputs: ['Output1', 'Output2']
})
```
