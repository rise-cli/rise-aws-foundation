# CloudStar

## Introduction

CodeStar is a umbrella term refering to all of AWS's code services, such as:

-   CodeCommit (a repo service like github or bitbucket)
-   CodeBuild (a service that spins up a terminal to run build, test, and deploy commands)
-   CodeDeploy (a service that manages deploying CloudFormation templates)
-   CodePipeline (a service to arrange the above services in a sequence)

## codestar.cf.makeGithubConnection

```ts
import * as aws from 'rise-aws-foundation'
const result = aws.codestar.makeGithubConnection('nameOfMyPipeline')
```

## codestar.cf.makeArtifactBucket

```ts
import * as aws from 'rise-aws-foundation'
const result = aws.codestar.makeArtifactBucket('nameOfMyPipeline')
```

## codestar.cf.makeBuildProject

```ts
import * as aws from 'rise-aws-foundation'
const buildSpec = `version: 0.2
phases:
    install:
        runtime-versions:
            nodejs: 14

    build:
        commands:
            - echo "building test $REGION"
`
const result = aws.codestar.makeBuildProject({
    name: 'cfNameOfResource',
    buildSpec: buildSpec,
    env: {
        DB: 'mydb'
    }
})
```

## codestar.makePipeline

A pipeline definition includes a name and an array of stages, which also
have a name and an array of actions. The basic structure is as follows:

```ts
const pipelineDefinition = {
    name: 'mypipeline',
    stages: [
        {
            name: 'StageA',
            actions: [actionA, actionB, actionC, actionD]
        },
        {
            name: 'StageB',
            actions: [actionA, actionB, actionC, actionD]
        }
    ]
}
```

Pipelines can take the following actions:

#### Source Action

Github:

```ts
const action = {
    type: 'SOURCE',
    name: 'nameOfAction',
    owner: 'githubAccount',
    repo: 'githubRepo',
    // optional
    outputArtifact: 'nameOfZip'
}
```

CodeCommit:

```ts
const action = {
    type: 'SOURCE',
    name: 'nameOfAction',
    repo: 'codeCommitRepo',
    platform: 'code-commit',
    // optional
    outputArtifact: 'nameOfZip'
}
```

#### Build Action

```ts
const action = {
    type: 'BUILD',
    name: 'nameOfAction',
    projectCFName: 'cloudFormationNameOfBuildProject',
    // optional
    env: {
        ENVNAME: 'ENVVALUE'
    },
    // optional
    inputArtifact: 'nameOfSourceZip',
    // optional
    outputArtifact: 'nameOfZip'
}
```

#### Deploy Action

```ts
const action = {
    type: 'DEPLOY',
    name: 'nameOfAction',
    stackName: 'myStack',
    template: 'path/to/my/tamplate.yml',
    //optional
    inputArtifact: 'nameOfZip',
    // optional
    parameters: {
        ENVNAME: 'ENVVALUE'
    }
}
```

#### Invoke Action

```ts
const action = {
    type: 'INVOKE',
    name: 'nameOfAction',
    functionName: 'nameOfLambdaFunction',
    region: 'us-east-1'
}
```

#### Approval Action

```ts
const action = {
    type: 'APPROVAL',
    name: 'nameOfAction'
}
```

#### Pipeline Example

```ts
import * as aws from 'rise-aws-foundation'
const result = aws.codestar.makePipeline({
    pipelineName: 'nameOfMyPipeline',
    stages: [
        {
            name: 'source',
            actions: [
                {
                    type: 'SOURCE',
                    name: 'source',
                    repo: 'myRepo',
                    owner: 'myGithubName',
                    outputArtifact: 'sourceZip'
                }
            ]
        },
        {
            name: 'build',
            actions: [
                {
                    type: 'BUILD',
                    name: 'build',
                    projectCFName: 'cfNameOfResource',
                    env: {
                        REGION: 'ca-central-1'
                    },
                    inputArtifact: 'sourceZip',
                    outputArtifact: 'buildZip'
                }
            ]
        },
        {
            name: 'Prod',
            actions: [
                {
                    type: 'APPROVAL',
                    name: 'designerappoval'
                },
                {
                    type: 'INVOKE',
                    name: 'integrationtests',
                    functionName: 'nameOfMyLambda',
                    region: 'us-east-1'
                }
            ]
        }
    ]
})
```
