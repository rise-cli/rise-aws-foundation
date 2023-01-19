import AWS from 'aws-sdk'
const region = process.env.AWS_REGION || 'us-east-1'
const eventBridge = new AWS.EventBridge({
    region: region
})

/**
 * @param {object} props
 * @param {string} props.source
 * @param {string} props.event
 * @param {object} props.payload
 * @param {string} [props.eventBusName]
 */
export async function emit(input) {
    const params = {
        Entries: [
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
        ]
    }
    return await eventBridge.putEvents(params).promise()
}
