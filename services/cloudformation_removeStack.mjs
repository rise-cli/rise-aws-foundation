import AWS from 'aws-sdk'

/**
 * @param {object} props
 * @param {string} props.stack
 * @param {string} props.template
 * @param {string} [props.region]
 */
export async function removeStack(props) {
    const cloudformation = new AWS.CloudFormation({
        region: props.region || process.env.AWS_REGION || 'us-east-1'
    })

    const params = {
        StackName: props.name
    }

    return await cloudformation.deleteStack(params).promise()
}
