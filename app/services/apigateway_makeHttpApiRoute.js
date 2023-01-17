/**
 * @param {object} props
 * @param {string} props.route
 * @param {string} props.method
 * @param {string} props.functionReference
 * @param {string} [props.authorizerRef]
 */
export const makeHttpApiRoute = ({
    route,
    method,
    functionReference,
    authorizerRef
}) => {
    // cloudformation keys do not support /{proxy+} as it
    // contains special characters CF doesnt handle
    const routeKeyName = route === '/{proxy+}' || '{proxy+}' ? 'all' : route

    const permissionKey = `${functionReference}PermissionHttp`
    const integrationKey = `HttpApiIntegration${functionReference}`
    const routeKey = `HttpApi${routeKeyName}${method}${functionReference}`

    const template = {
        Resources: {
            // Route
            [permissionKey]: {
                Type: 'AWS::Lambda::Permission',
                Properties: {
                    FunctionName: {
                        'Fn::GetAtt': [functionReference, 'Arn']
                    },
                    Action: 'lambda:InvokeFunction',
                    Principal: 'apigateway.amazonaws.com',
                    SourceArn: {
                        'Fn::Sub': `arn:aws:execute-api:\${AWS::Region}:\${AWS::AccountId}:\${ApiRoot}/*`
                    }
                }
            },
            [integrationKey]: {
                Type: 'AWS::ApiGatewayV2::Integration',
                Properties: {
                    ApiId: {
                        Ref: 'ApiRoot'
                    },
                    IntegrationType: 'AWS_PROXY',
                    IntegrationUri: {
                        'Fn::GetAtt': [functionReference, 'Arn']
                    },
                    PayloadFormatVersion: '2.0',
                    TimeoutInMillis: 6500
                }
            },
            [routeKey]: {
                Type: 'AWS::ApiGatewayV2::Route',
                Properties: {
                    ApiId: {
                        Ref: 'ApiRoot'
                    },
                    RouteKey: `${method} /${route}`,
                    Target: {
                        'Fn::Join': [
                            '/',
                            [
                                'integrations',
                                {
                                    Ref: integrationKey
                                }
                            ]
                        ]
                    }
                },
                DependsOn: [integrationKey]
            }
        },
        Outputs: {}
    }

    if (authorizerRef) {
        const routeAuthConfig = {
            AuthorizationType: 'JWT',
            AuthorizerId: {
                Ref: authorizerRef
            }
            // AuthorizationScopes: ['user.id', 'user.email']
        }

        // @ts-ignore
        template.Resources[routeKey].DependsOn.push('ApiAuthorizer')

        template.Resources[routeKey].Properties = {
            ...template.Resources[routeKey].Properties,
            ...routeAuthConfig
        }
    }
    return template
}
