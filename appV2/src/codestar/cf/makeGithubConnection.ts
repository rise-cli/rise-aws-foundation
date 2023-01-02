export function makeGithubConnection(name: string) {
    return {
        Resources: {
            CodeStarConnection: {
                Type: 'AWS::CodeStarConnections::Connection',
                Properties: {
                    ConnectionName: name,
                    ProviderType: 'GitHub'
                }
            }
        },
        Outputs: {}
    }
}
