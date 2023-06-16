import {
    CloudFormationClient,
    DescribeStacksCommand
} from '@aws-sdk/client-cloudformation'

/**
 * @param {object} props
 * @param {string} props.stack
 * @param {Array.<string>} props.outputs
 * @param {string} [props.region]
 */
export async function getOutputs(props) {
    const client = new CloudFormationClient({
        region: props.region || process.env.AWS_REGION || 'us-east-1'
    })

    function getOutput(outputs, value) {
        const v = outputs.find((x) => x.OutputKey === value)
        return v ? v.OutputValue : false
    }

    const input = {
        StackName: props.stack
    }

    const command = new DescribeStacksCommand(input)
    const x = await client.send(command)

    if (!x.Stacks || x.Stacks.length === 0) {
        throw new Error('No stacks found with the name ' + props.stack)
    }

    const details = x.Stacks[0]

    if (!details.Outputs) {
        return {}
    }

    const res = {}
    const outputs = details.Outputs

    for (const o of props.outputs) {
        res[o] = getOutput(outputs, o)
    }

    return res
}
