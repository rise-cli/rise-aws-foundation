/**
 * @param {string} name
 */
export function makeGithubConnection(name) {
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
