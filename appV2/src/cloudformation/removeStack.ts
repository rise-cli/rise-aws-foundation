import AWS from 'aws-sdk'

type StackInput = {
    name: string
    template: string
    region?: string
}

export async function removeStack(props: StackInput) {
    const cloudformation = new AWS.CloudFormation({
        region: props.region || process.env.AWS_REGION || 'us-east-1'
    })

    const params = {
        StackName: props.name
    }

    return await cloudformation.deleteStack(params).promise()
}
