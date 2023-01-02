type Input = {
    endpointName: string
    lambdaName: string
    stage: string
    path: string
}

export function makeLambdaEndpoint(props: Input) {
    return {
        Resources: {
            ApiGatewayRestApi: {
                Type: 'AWS::ApiGateway::RestApi',
                Properties: {
                    Name: props.endpointName,
                    EndpointConfiguration: {
                        Types: ['EDGE']
                    },
                    Policy: ''
                }
            },
            ApiGatewayResource: {
                Type: 'AWS::ApiGateway::Resource',
                Properties: {
                    ParentId: {
                        'Fn::GetAtt': ['ApiGatewayRestApi', 'RootResourceId']
                    },
                    PathPart: props.path,
                    RestApiId: {
                        Ref: 'ApiGatewayRestApi'
                    }
                }
            },
            ApiGatewayMethodPost: {
                Type: 'AWS::ApiGateway::Method',
                Properties: {
                    HttpMethod: 'POST',
                    RequestParameters: {},
                    ResourceId: {
                        Ref: 'ApiGatewayResource'
                    },
                    RestApiId: {
                        Ref: 'ApiGatewayRestApi'
                    },
                    ApiKeyRequired: false,
                    AuthorizationType: 'NONE',
                    Integration: {
                        IntegrationHttpMethod: 'POST',
                        Type: 'AWS_PROXY',
                        Uri: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {
                                        Ref: 'AWS::Partition'
                                    },
                                    ':apigateway:',
                                    {
                                        Ref: 'AWS::Region'
                                    },
                                    ':lambda:path/2015-03-31/functions/',
                                    {
                                        'Fn::GetAtt': [props.lambdaName, 'Arn']
                                    },
                                    '/invocations'
                                ]
                            ]
                        }
                    },
                    MethodResponses: []
                }
            },
            ApiGatewayDeployment: {
                Type: 'AWS::ApiGateway::Deployment',
                Properties: {
                    RestApiId: {
                        Ref: 'ApiGatewayRestApi'
                    },
                    StageName: props.stage
                },
                DependsOn: ['ApiGatewayMethodPost']
            },
            MainLambdaPermissionApiGateway: {
                Type: 'AWS::Lambda::Permission',
                Properties: {
                    FunctionName: {
                        'Fn::GetAtt': [props.lambdaName, 'Arn']
                    },
                    Action: 'lambda:InvokeFunction',
                    Principal: 'apigateway.amazonaws.com',
                    SourceArn: {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {
                                    Ref: 'AWS::Partition'
                                },
                                ':execute-api:',
                                {
                                    Ref: 'AWS::Region'
                                },
                                ':',
                                {
                                    Ref: 'AWS::AccountId'
                                },
                                ':',
                                {
                                    Ref: 'ApiGatewayRestApi'
                                },
                                '/*/*'
                            ]
                        ]
                    }
                }
            }
        },
        Outputs: {
            Endpoint: {
                Description: 'URL of the endpoint',
                Value: {
                    'Fn::Join': [
                        '',
                        [
                            'https://',
                            {
                                Ref: 'ApiGatewayRestApi'
                            },
                            '.execute-api.',
                            {
                                Ref: 'AWS::Region'
                            },
                            '.',
                            {
                                Ref: 'AWS::URLSuffix'
                            },
                            '/dev'
                        ]
                    ]
                }
            }
        }
    }
}
