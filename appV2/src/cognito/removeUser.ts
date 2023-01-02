import aws from 'aws-sdk'
const cognito = new aws.CognitoIdentityServiceProvider({
    region: process.env.REGION || 'us-east-1'
})

export type RemoveUserInput = {
    email: string
    userPoolId?: string
}

export async function removeUser(props: RemoveUserInput) {
    if (!props.email) {
        throw new Error('RemoveUser must have an email defined')
    }

    if (!process.env.USERPOOL_ID && !props.userPoolId) {
        throw new Error('CreateUser must have process.env.USERPOOL_ID defined')
    }

    const params = {
        UserPoolId: props.userPoolId || process.env.USERPOOL_ID || '',
        Username: props.email
    }

    try {
        await cognito.adminDeleteUser(params).promise()
        return true
    } catch (err: any) {
        throw new Error(err)
    }
}
