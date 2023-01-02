type LambdaRowInput = {
    type: 'LAMBDAROW'
    verticalPosition: number
    region: string
    name: string
    docs?: string
    functionName: string
    invocationGoal?: number
    invocationAlarm?: number
    errorGoal?: number
    errorAlarm?: number
    durationGoal?: number
    durationAlarm?: number
}

type Row = LambdaRowInput

type MakeDashboardInput = {
    name: string
    rows: Row[]
}

const getPosition = (h: number, v: number) => {
    return {
        x: h * 6,
        y: v * 6
    }
}

const makeAnnotations = (goal?: number, alarm?: number) => {
    let annotations = []
    if (goal !== undefined) {
        annotations.push({
            color: '#2ca02c',
            label: 'Goal',
            value: goal
        })
    }
    if (alarm !== undefined) {
        annotations.push({
            color: '#d62728',
            label: 'Alarm',
            value: alarm
        })
    }
    return annotations
}

const makeDocBlock = (config: { h: number; content: string }) => ({
    type: 'text',
    x: 0,
    y: getPosition(config.h, 0).y,
    width: 6,
    height: 6,
    properties: {
        markdown: config.content
    }
})

const makeLambdaTrafficBlock = (config: {
    h: number
    functionName: string
    region: string
    goal?: number
    alarm?: number
}) => {
    return {
        type: 'metric',
        x: 6,
        y: getPosition(config.h, 0).y,
        width: 6,
        height: 6,
        properties: {
            metrics: [
                [
                    'AWS/Lambda',
                    'Invocations',
                    'FunctionName',
                    config.functionName
                ]
            ],
            view: 'timeSeries',
            stacked: false,
            region: config.region,
            period: 300,
            annotations: {
                horizontal: makeAnnotations(config.goal, config.alarm)
            },
            stat: 'Sum',
            title: 'Traffic'
        }
    }
}

const makeLambdaErrorBlock = (config: {
    h: number
    functionName: string
    region: string
    goal?: number
    alarm?: number
}) => {
    return {
        type: 'metric',
        x: 12,
        y: getPosition(config.h, 0).y,
        width: 6,
        height: 6,
        properties: {
            metrics: [
                ['AWS/Lambda', 'Errors', 'FunctionName', config.functionName]
            ],
            view: 'timeSeries',
            stacked: false,
            region: config.region,
            period: 300,
            annotations: {
                horizontal: makeAnnotations(config.goal, config.alarm)
            },
            stat: 'Sum',
            title: 'Availability (Errors)'
        }
    }
}

const makeLambdaDurationBlock = (config: {
    h: number
    functionName: string
    region: string
    goal?: number
    alarm?: number
}) => {
    return {
        type: 'metric',
        x: 18,
        y: getPosition(config.h, 0).y,
        width: 6,
        height: 6,
        properties: {
            metrics: [
                ['AWS/Lambda', 'Duration', 'FunctionName', config.functionName]
            ],
            view: 'timeSeries',
            stacked: false,
            region: config.region,
            period: 300,
            annotations: {
                horizontal: makeAnnotations(config.goal, config.alarm)
            },
            stat: 'p99',
            title: 'Latency (duration)'
        }
    }
}

const makeLambdaRow = (row: LambdaRowInput) => {
    return [
        makeDocBlock({
            h: row.verticalPosition,
            content: row.docs || ''
        }),
        makeLambdaTrafficBlock({
            h: row.verticalPosition,
            functionName: row.functionName,
            region: row.region,
            goal: row.invocationGoal,
            alarm: row.invocationAlarm
        }),
        makeLambdaErrorBlock({
            h: row.verticalPosition,
            functionName: row.functionName,
            region: row.region,
            goal: row.errorGoal,
            alarm: row.errorAlarm
        }),
        makeLambdaDurationBlock({
            h: row.verticalPosition,
            functionName: row.functionName,
            region: row.region,
            goal: row.durationGoal,
            alarm: row.durationAlarm
        })
    ]
}

export function makeDashboard(config: MakeDashboardInput) {
    const widgets: any = []
    config.rows.forEach((x) => {
        if (x.type === 'LAMBDAROW') {
            makeLambdaRow(x).forEach((x) => widgets.push(x))
        }
    })

    return {
        Resources: {
            [config.name + 'Dashboard']: {
                Type: 'AWS::CloudWatch::Dashboard',
                Properties: {
                    DashboardName: config.name,
                    DashboardBody: JSON.stringify({ widgets })
                }
            }
        },
        Outputs: {}
    }
}
