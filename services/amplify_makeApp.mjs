/**
 * @param {string} name
 */
export function makeAmplifyApp(name) {
    return {
        Resources: {
            AmplifyApp: {
                Type: 'AWS::Amplify::App',
                Properties: {
                    Name: name
                }
            },
            AmplifyMainBranch: {
                Type: 'AWS::Amplify::Branch',
                Properties: {
                    AppId: { 'Fn::GetAtt': ['AmplifyApp', 'AppId'] },
                    BranchName: 'main'
                }
            }
        },
        Outputs: {
            AmplifyId: {
                Value: { 'Fn::GetAtt': ['AmplifyApp', 'AppId'] }
            }
        }
    }
}
