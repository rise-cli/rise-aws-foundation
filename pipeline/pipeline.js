module.exports = {
    name: 'rise-aws-foundation-pipeline',
    stages: [
        {
            name: 'Source',
            actions: [
                {
                    type: 'SOURCE',
                    name: 'GithubRepo',
                    repo: 'rise-aws-foundation',
                    owner: 'rise-cli',
                    outputArtifact: 'sourceZip'
                }
            ]
        },
        {
            name: 'Staging',
            actions: [
                {
                    type: 'DEPLOY',
                    name: 'DeployBase',
                    inputArtifact: 'sourceZip',
                    stackName: 'RiseAWSFoundationTestBase',
                    template: 'app/infrastructure/baseStack.json'
                },
                {
                    type: 'DEPLOY',
                    name: 'DeployInlineLambda',
                    inputArtifact: 'sourceZip',
                    stackName: 'RiseAWSFoundationTestInlineLambda',
                    template: 'app/infrastructure/inlineLambdaStack.json'
                },
                {
                    type: 'DEPLOY',
                    name: 'DeployS3',
                    inputArtifact: 'sourceZip',
                    stackName: 'RiseAWSFoundationTestS3',
                    template: 'app/infrastructure/s3Stack.json'
                },
                {
                    type: 'DEPLOY',
                    name: 'DeployLambda',
                    inputArtifact: 'sourceZip',
                    stackName: 'RiseAWSFoundationTestLambda',
                    template: 'app/infrastructure/lambdaStack.json'
                },
                {
                    type: 'BUILD',
                    name: 'Test',
                    script: '/test.yml',
                    inputArtifact: 'sourceZip',
                    outputArtifact: 'testZip'
                },
                {
                    type: 'APPROVAL',
                    name: 'PublishNewVersion'
                }
            ]
        },
        {
            name: 'Prod',
            actions: [
                {
                    type: 'BUILD',
                    name: 'PublishToNpm',
                    script: '/publish.yml',
                    env: {
                        NPM_TOKEN: '@secret.NPM_KEY'
                    },
                    inputArtifact: 'sourceZip',
                    outputArtifact: 'publishedZip'
                },
                {
                    type: 'BUILD',
                    name: 'DeployDocumentation',
                    script: '/docs.yml',
                    inputArtifact: 'sourceZip',
                    outputArtifact: 'docZip'
                }
            ]
        }
    ]
}
