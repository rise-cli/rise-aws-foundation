const AWS = require('aws-sdk')

module.exports.removeStack = async function removeStack(props) {
    const aws = props.AWS || AWS
    const cloudformation = new aws.CloudFormation({
        region: props.region || process.env.AWS_REGION || 'us-east-1'
    })

    const params = {
        StackName: props.name
    }

    return await cloudformation.deleteStack(params).promise()
}
