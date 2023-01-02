type ApiInput = {
    name: string
    stage: string
    auth?: {
        poolIdRef: string
        clientIdRef: string
    }
}

export const makeHttpApi = ({ name, stage, auth }: ApiInput) => {
    const template = {
        Resources: {
            ApiRoot: {
                Type: 'AWS::ApiGatewayV2::Api',
                Properties: {
                    Name: `${name}-${stage}`,
                    ProtocolType: 'HTTP'
                }
            },
            ApiStage: {
                Type: 'AWS::ApiGatewayV2::Stage',
                Properties: {
                    ApiId: {
                        Ref: 'ApiRoot'
                    },
                    StageName: '$default',
                    AutoDeploy: true,
                    DefaultRouteSettings: {
                        DetailedMetricsEnabled: true
                    }
                }
            }
        },
        Outputs: {
            ApiUrl: {
                Description: 'URL',
                Value: {
                    'Fn::Join': [
                        '',
                        [
                            'https://',
                            {
                                Ref: 'ApiRoot'
                            },
                            '.execute-api.',
                            {
                                Ref: 'AWS::Region'
                            },
                            '.',
                            {
                                Ref: 'AWS::URLSuffix'
                            }
                        ]
                    ]
                }
            }
        }
    }

    if (auth) {
        const cognitoAuthorizer = {
            ApiAuthorizer: {
                Type: 'AWS::ApiGatewayV2::Authorizer',
                Properties: {
                    ApiId: {
                        Ref: 'ApiRoot'
                    },
                    Name: 'JwtAuthorizer',
                    IdentitySource: ['$request.header.Authorization'],
                    AuthorizerType: 'JWT',
                    JwtConfiguration: {
                        Audience: [
                            {
                                Ref: auth.clientIdRef
                            }
                        ],
                        Issuer: {
                            'Fn::Sub': `https://cognito-idp.\${AWS::Region}.amazonaws.com/\${${auth.poolIdRef}}`
                        }
                    }
                }
            }
        }
        template.Resources = {
            ...template.Resources,
            ...cognitoAuthorizer
        }
    }
    return template
}
