/**
 * @param {object} config
 * @param {string} config.appName
 * @param {string} config.stage
 * @param {string} config.description
 * @param {string} config.functionName
 * @param {string} config.threshold
 * @param {string} [config.period]
 * @param {string} [config.evaluationPeriods]
 * @param {string} [config.snsTopic]
 */
export function makeLambdaErrorAlarm(config) {
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
