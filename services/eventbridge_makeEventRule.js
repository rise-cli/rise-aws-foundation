/**
 * @param {object} props
 * @param {string} props.appName
 * @param {string} props.eventBus
 * @param {string} props.eventSource
 * @param {string} props.eventName
 * @param {string} props.lambdaName
 */
export function makeEventRule({
    appName,
    eventBus,
    eventSource,
    eventName,
    lambdaName
}) {
    return {
        Resources: {
            [`EventListener${appName}${eventName}`]: {
                Type: 'AWS::Events::Rule',
                Properties: {
                    EventBusName: eventBus,
                    EventPattern: {
                        source: [`custom.${eventSource}`],
                        'detail-type': [eventName]
                    },
                    Targets: [
                        {
                            Arn: {
                                'Fn::GetAtt': [lambdaName, 'Arn']
                            },
                            Id: `EventListener${appName}${eventName}`
                        }
                    ]
                }
            },

            [`EventRuleRole${appName}${eventName}`]: {
                Type: 'AWS::Lambda::Permission',
                Properties: {
                    FunctionName: {
                        'Fn::GetAtt': [lambdaName, 'Arn']
                    },
                    Action: 'lambda:InvokeFunction',
                    Principal: 'events.amazonaws.com',
                    SourceArn: {
                        'Fn::GetAtt': [
                            `EventListener${appName}${eventName}`,
                            'Arn'
                        ]
                    }
                }
            }
        },
        Outputs: {}
    }
}
