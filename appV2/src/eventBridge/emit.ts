const AWS = require('aws-sdk')
const region = process.env.AWS_REGION || 'us-east-1'
const eventBridge = new AWS.EventBridge({
    region: region
})

type Input = {
    source: string
    event: string
    payload: any
    eventBusName?: string
}

export async function emit(input: Input) {
    const params = {
        Entries: [
            /* required */
            {
                Detail: JSON.stringify(input.payload),
                DetailType: input.event,
                EventBusName: input.eventBusName || 'default',
                Resources: [],
                Source: input.source,
                Time:
                    new Date() ||
                    'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' ||
                    123456789
            }
            /* more items */
        ],
        EndpointId: 'STRING_VALUE'
    }
    return await eventBridge.putEvents(params).promise()
}
