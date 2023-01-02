const AWS = require('aws-sdk')

type StackInput = {
    name: string
    template: string
    region?: string
}

export async function deployStack(props: StackInput) {
    const aws = AWS
    const cloudformation = new aws.CloudFormation({
        region: props.region || process.env.AWS_REGION || 'us-east-1'
    })
    try {
        const res = await cloudformation
            .updateStack({
                StackName: props.name,
                Capabilities: [
                    'CAPABILITY_IAM',
                    'CAPABILITY_AUTO_EXPAND',
                    'CAPABILITY_NAMED_IAM'
                ],
                TemplateBody: props.template
            })
            .promise()
        return {
            status: 'updating',
            id: res.StackId
        }
    } catch (e) {
        if (e instanceof Error) {
            if (e.message.includes('does not exist')) {
                const res = await cloudformation
                    .createStack({
                        StackName: props.name,
                        Capabilities: [
                            'CAPABILITY_IAM',
                            'CAPABILITY_AUTO_EXPAND',
                            'CAPABILITY_NAMED_IAM'
                        ],
                        TemplateBody: props.template
                    })
                    .promise()

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
            throw new Error(e.message)
        }
    }
}
