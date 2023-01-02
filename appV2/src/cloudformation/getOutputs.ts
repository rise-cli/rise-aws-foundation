import AWS from 'aws-sdk'

export type GetCloudFormationOutputsInput = {
    stack: string
    outputs: string[]
    region?: string
}

export async function getOutputs(props: GetCloudFormationOutputsInput) {
    const cloudformation = new AWS.CloudFormation({
        region: props.region || process.env.AWS_REGION || 'us-east-1'
    })
    function getOutput(outputs: any[], value: string) {
        const v = outputs.find((x) => x.OutputKey === value)
        return v ? v.OutputValue : false
    }

    const params = {
        StackName: props.stack
    }

    const x = await cloudformation.describeStacks(params).promise()

    if (!x.Stacks || x.Stacks.length === 0) {
        throw new Error('No stacks found with the name ' + props.stack)
    }

    const details = x.Stacks[0]

    if (!details.Outputs) {
        return {}
    }

    const res: Record<string, string> = {}
    const outputs = details.Outputs

    for (const o of props.outputs) {
        res[o] = getOutput(outputs, o)
    }

    return res
}
