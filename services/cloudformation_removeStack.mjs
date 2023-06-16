import {
    CloudFormationClient,
    DeleteStackCommand
} from '@aws-sdk/client-cloudformation'

/**
 * @param {object} props
 * @param {string} props.stack
 * @param {string} props.template
 * @param {string} [props.region]
 */
export async function removeStack(props) {
    const client = new CloudFormationClient({
        region: props.region || process.env.AWS_REGION || 'us-east-1'
    })

    const input = {
        StackName: props.name
    }

    const command = new DeleteStackCommand(input)
    return await client.send(command)
}
