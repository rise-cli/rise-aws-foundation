module.exports.makeApiGateway = (props) => ({
    Resources: {
        ['HttpApi' + props.endpointName]: {
            Type: 'AWS::ApiGatewayV2::Api',
            Properties: {
                Name: props.endpointName,
                ProtocolType: 'HTTP'
            },
            DependsOn: props.lambdaName
        },
        ['HttpApiStage' + props.endpointName]: {
            Type: 'AWS::ApiGatewayV2::Stage',
            Properties: {
                ApiId: {
                    Ref: 'HttpApi' + props.endpointName
                },
                StageName: '$default',
                AutoDeploy: true,
                DefaultRouteSettings: {
                    DetailedMetricsEnabled: false
                }
            }
        },
        ['LambdaPermissionHttpApi' + props.endpointName]: {
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
                                Ref: 'HttpApi' + props.endpointName
                            },
                            '/*'
                        ]
                    ]
                }
            }
        },
        ['HttpApiIntegration' + props.endpointName]: {
            Type: 'AWS::ApiGatewayV2::Integration',
            Properties: {
                ApiId: {
                    Ref: 'HttpApi' + props.endpointName
                },
                IntegrationType: 'AWS_PROXY',
                IntegrationUri: {
                    'Fn::GetAtt': [props.lambdaName, 'Arn']
                },
                PayloadFormatVersion: '2.0',
                TimeoutInMillis: 6500
            }
        },
        ['HttpApiRouteDefault' + props.endpointName]: {
            Type: 'AWS::ApiGatewayV2::Route',
            Properties: {
                ApiId: {
                    Ref: 'HttpApi' + props.endpointName
                },
                RouteKey: '$default',
                Target: {
                    'Fn::Join': [
                        '/',
                        [
                            'integrations',
                            {
                                Ref: 'HttpApiIntegration' + props.endpointName
                            }
                        ]
                    ]
                }
            },
            DependsOn: 'HttpApiIntegration' + props.endpointName
        }
    },
    Outputs: {
        ['Endpoint' + props.endpointName]: {
            Description: 'URL of the HTTP API',
            Value: {
                'Fn::Join': [
                    '',
                    [
                        'https://',
                        {
                            Ref: 'HttpApi' + props.endpointName
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
})
