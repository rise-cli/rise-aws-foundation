import aws from 'aws-sdk'
import { makePassword } from './utils/password'
const cognito = new aws.CognitoIdentityServiceProvider({
    region: process.env.REGION || 'us-east-1'
})

export type CreateUserInput = {
    email: string
    userPoolId?: string
    attributes?: {
        name: string
        value: string
    }[]
}

export async function createUser(props: CreateUserInput) {
    if (!props.email) {
        throw new Error('CreateUser must have an email defined')
    }

    if (!process.env.USERPOOL_ID && !props.userPoolId) {
        throw new Error('CreateUser must have process.env.USERPOOL_ID defined')
    }

    const pass = makePassword()
    const params = {
        UserPoolId: props.userPoolId || process.env.USERPOOL_ID || '',
        Username: props.email,
        TemporaryPassword: pass,
        MessageAction: 'SUPPRESS',
        UserAttributes: [
            {
                Name: 'name',
                Value: props.email
            },
            {
                Name: 'email',
                Value: props.email
            },
            {
                Name: 'email_verified',
                Value: 'True'
            }
        ]
    }

    if (props.attributes) {
        params.UserAttributes = [
            ...params.UserAttributes,
            ...props.attributes.map((x) => ({
                Name: x.name,
                Value: x.value
            }))
        ]
    }

    try {
        await cognito.adminCreateUser(params).promise()
        return {
            email: props.email,
            password: pass
        }
    } catch (err: any) {
        throw new Error(err)
    }
}
