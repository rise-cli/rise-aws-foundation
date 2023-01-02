export const makeCognito = (appName: string, stage: string) => {
    return {
        Resources: {
            CognitoUserPool: {
                Type: 'AWS::Cognito::UserPool',
                Properties: {
                    UserPoolName: `${appName}${stage}-pool`,
                    AdminCreateUserConfig: {
                        AllowAdminCreateUserOnly: true,
                        UnusedAccountValidityDays: 365
                    }
                }
            },
            CognitoUserPoolClient: {
                Type: 'AWS::Cognito::UserPoolClient',
                Properties: {
                    ClientName: `${appName}${stage}-pool-client`,
                    UserPoolId: {
                        Ref: 'CognitoUserPool'
                    },
                    ExplicitAuthFlows: ['ADMIN_NO_SRP_AUTH'],
                    GenerateSecret: false
                }
            }
        },
        Outputs: {
            UserPoolId: {
                Value: {
                    Ref: 'CognitoUserPool'
                }
            },
            UserPoolClientId: {
                Value: {
                    Ref: 'CognitoUserPoolClient'
                }
            }
        }
    }
}
