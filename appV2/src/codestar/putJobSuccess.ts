import AWS from 'aws-sdk'

export async function putJobSuccess(props: { event: any; context: any }) {
    const codepipeline = new AWS.CodePipeline()

    if (props.event['CodePipeline.job']) {
        const jobId = props.event['CodePipeline.job'].id

        const params = {
            jobId: jobId
        }
        await codepipeline.putJobSuccessResult(params).promise()
    }
}
