import AWS from 'aws-sdk'

const region = process.env.AWS_REGION || 'us-east-1'
const cloudwatchlogs = new AWS.CloudWatchLogs({
    apiVersion: '2014-03-28',
    region: region
})

function waitOneSecond() {
    return new Promise((resolve) => {
        setTimeout(resolve, 1000)
    })
}

async function startQuery({ start, end, query, limit, logGroups }) {
    const params = {
        endTime: end,
        queryString: query,
        startTime: start,
        limit: limit,
        logGroupNames: logGroups
    }
    const x = await cloudwatchlogs.startQuery(params).promise()
    return x.queryId
}

async function getQueryResult(id) {
    const params = {
        queryId: id
    }
    const x = await cloudwatchlogs.getQueryResults(params).promise()
    return x
}

export async function runLogInsightsQuery(props) {
    const start = props.start || new Date(Date.now() - 60 * 60 * 1000)
    const end = props.end || new Date()
    const query =
        props.query ||
        'fields @timestamp, @message | sort @timestamp desc | limit 20'
    const limit = props.limit || 20
    const logGroups = props.logGroups
    const id = await startQuery({ start, end, query, limit, logGroups })
    let result = await getQueryResult(id)
    while (result.status === 'Running') {
        await waitOneSecond()
        result = await getQueryResult(id)
    }
    if (result.status !== 'Complete') {
        throw new Error('Query failed')
    }
    return result.results
}
