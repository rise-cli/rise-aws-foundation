const AWS = require('aws-sdk')

module.exports.getOutputs = async function getCloudFormationOutputs(props) {
    const aws = props.AWS || AWS
    const cloudformation = new aws.CloudFormation({
        region: props.region || process.env.AWS_REGION || 'us-east-1'
    })
    function getOutput(outputs, value) {
        const v = outputs.find((x) => x.OutputKey === value)
        return v ? v.OutputValue : false
    }

    const params = {
        StackName: props.stack
    }

    const x = await cloudformation.describeStacks(params).promise()
    const details = x.Stacks[0]
    const outputs = details.Outputs

    let res = {}
    for (const o of props.outputs) {
        res[o] = getOutput(outputs, o)
    }
    return res
}
