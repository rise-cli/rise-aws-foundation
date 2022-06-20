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
                    type: 'BUILD',
                    name: 'Test',
                    script: '/test.yml',
                    inputArtifact: 'sourceZip',
                    outputArtifact: 'testZip'
                },
                {
                    type: 'BUILD',
                    name: 'DeployDocumentation',
                    script: '/docs.yml',
                    inputArtifact: 'sourceZip',
                    outputArtifact: 'docZip'
                },
                {
                    type: 'APPROVAL',
                    name: 'GoToProd'
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
                }
            ]
        }
    ]
}
