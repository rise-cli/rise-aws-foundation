type Input = {
    endpointName: string
    lambdaName: string
    stage: string
    path: string
}

export function makeLambdaGetEndpoint(props: Input) {
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
            ApiGatewayMethodGet: {
                Type: 'AWS::ApiGateway::Method',
                Properties: {
                    HttpMethod: 'GET',
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
                        IntegrationHttpMethod: 'GET',
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
                DependsOn: ['ApiGatewayMethodGet']
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
