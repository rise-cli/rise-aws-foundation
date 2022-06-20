const AWS = require('aws-sdk')

async function createStack(props) {
    const params = {
        StackName: props.name,
        Capabilities: [
            'CAPABILITY_IAM',
            'CAPABILITY_AUTO_EXPAND',
            'CAPABILITY_NAMED_IAM'
        ],
        TemplateBody: props.template
    }

    return await props.cloudformation.createStack(params).promise()
}

async function updateStack(props) {
    const params = {
        StackName: props.name,
        Capabilities: [
            'CAPABILITY_IAM',
            'CAPABILITY_AUTO_EXPAND',
            'CAPABILITY_NAMED_IAM'
        ],
        TemplateBody: props.template
    }

    return await props.cloudformation.updateStack(params).promise()
}

module.exports.deployStack = async function deployStack(props) {
    const aws = props.AWS || AWS
    const cloudformation = new aws.CloudFormation({
        region: props.region || process.env.AWS_REGION || 'us-east-1'
    })
    try {
        const res = await updateStack({
            cloudformation,
            name: props.name,
            template: props.template
        })
        return {
            status: 'updating',
            id: res.StackId
        }
    } catch (e) {
        if (e.message.includes('does not exist')) {
            const res = await createStack({
                cloudformation,
                name: props.name,
                template: props.template
            })

            return {
                status: 'creating',
                id: res.StackId
            }
        }

        if (e.message.includes('No updates are to be performed.')) {
            return {
                status: 'nothing'
            }
        }

        if (e.message.includes('CREATE_IN_PROGRESS')) {
            return {
                status: 'createinprogress'
            }
        }

        if (e.message.includes('UPDATE_IN_PROGRESS')) {
            return {
                status: 'updateinprogress'
            }
        }

        if (e.message.includes('DELETE_IN_PROGRESS')) {
            return {
                status: 'deleteinprogress'
            }
        }
        throw new Error(e)
    }
}
