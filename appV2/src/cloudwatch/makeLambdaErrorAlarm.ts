type AlarmInput = {
    appName: string
    stage: string
    name: string
    description: string
    functionName: string
    threshold: number
    period?: number
    evaluationPeriods?: number
    snsTopic?: string
}

export function makeLambdaErrorAlarm(config: AlarmInput) {
    let cf = {
        Resources: {
            [`Alarm${config.name}${config.stage}`]: {
                Type: 'AWS::CloudWatch::Alarm',
                Properties: {
                    AlarmName: `${config.appName}-${config.name}-${config.stage}`,
                    AlarmDescription: config.description,
                    MetricName: 'Errors',
                    Namespace: 'AWS/Lambda',
                    Dimensions: [
                        {
                            Name: 'FunctionName',
                            Value: config.functionName
                        }
                    ],
                    Statistic: 'Sum',
                    Period: config.period || 60,
                    EvaluationPeriods: config.evaluationPeriods || 1,
                    Threshold: config.threshold,
                    ComparisonOperator: 'GreaterThanThreshold'
                }
            }
        },
        Outputs: {}
    }

    if (config.snsTopic) {
        cf.Resources[
            `Alarm${config.name}${config.stage}`
            // @ts-ignore
        ].Properties.AlarmActions = [config.snsTopic]
    }

    return cf
}
