# EventBridge

## Introduction

...

## eventBridge.emit

```ts
import * as aws from 'rise-aws-foundation'
const item = await aws.eventBridge.emit({
    source: 'myService',
    event: 'somethingHappened',
    payload: { id: 100 },
    eventBus: 'myBus' // defaults to 'default' when not provided
})
```

## eventBridge.makeEventRule

```ts
import * as aws from 'rise-aws-foundation'
const item = await aws.eventBridge.makeEventRule({
    appName: 'myapp',
    eventBus: 'myBus',
    eventSource: 'serviceA',
    eventName: 'somethingHappened',
    lambdaName: 'lambdaName'
})
```
