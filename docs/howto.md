# How to use AWS Foundation

## Introduction

AWS Foundation helps you:

-   Create AWS resources
-   Act on those AWS resources

## Creating AWS resources

CloudFormation is the best way to create resources in aws. Without Cloudformation,
you would have to execute individual sdk calls to create resources. This gets
very complicated when creating multiple resources that depend on eachother. You
will need to create resources in the correct order, and you will need to write
clean up logic if there is a failure in creating a resource in the middle of
the creation order.

CloudFormation handles all of this for you. All you need to do is define
a list of resources, CloudFormation will take care of creating them
in the correct order, and will take care of cleaning up resources if there
is a deployment failure. Cloudformation keeps a record of all your
deployments, and lists all events in each deployment. CloudFormation also
enables you to define outputs, properties about your deployed resources that are
available for reference. This is very good for exposing values that are
genereted during deployment such as S3 Bucket names or Lambda Function names.

For these reasons, AWS Foundation has no methods for creating AWS resources with
the sdk, but instead has methods for creating CloudFormation templates. Once all AWS resources
are defined in templates, we can combine them into 1 template and use the CloudFormation methods
to deploy that template.

### How CloudFormation is created in AWS Foundation

AWS Foundation resource categories (S3, Lambda) may have a `.cf` property containing
all of the create methods. These create methods will always return the following:

```js
const result = exampleResource.cf.create()
// Result will look like the following:
const myResult = {
    Resources: {
        MyAWSResource: {
            // ... CloudFormation Definition
        },
        MyAWSResource2: {
            // ... CloudFormation Definition
        }
    },
    Outputs: {
        MyResourceId: '234324233'
    }
}
```

You may create alot of resources. How do you combine them into 1 CloudFormation
template to deploy? Because we can always depend on every `.cf` method to output
the above structure, we can combine by doing the following:

```js
const result1 = exampleResource1.cf.create()
const result2 = exampleResource2.cf.create()
const result3 = exampleResource3.cf.create()

const template = {
    Resources: {
        ...result1.Resources,
        ...result2.Resources,
        ...result3.Resources
    },
    Outputs: {
        ...result1.Outputs,
        ...result2.Outputs,
        ...result3.Outputs
    }
}
```

We can now deploy this template using the CloudFormation methods in AWS Foundation:

```js
const aws = require('aws-foundation')
const createResult = await aws.cloudformation.deployStack({
    name: 'mystack',
    template: JSON.stringify(template)
})
```
