import AWS from 'aws-sdk'

export async function putJobFailure(props: {
    event: any
    context: any
    message: any
}) {
    const codepipeline = new AWS.CodePipeline()
    if (props.event['CodePipeline.job']) {
        const jobId = props.event['CodePipeline.job'].id

        const params = {
            jobId: jobId,
            failureDetails: {
                message: JSON.stringify(props.message),
                type: 'JobFailed',
                externalExecutionId: props.context.awsRequestId
            }
        }
        await codepipeline.putJobFailureResult(params)
        return props.message
    }
}
