// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#adminSetUserPassword-property

import aws from 'aws-sdk'
import { makePassword } from './utils/password'
const cognito = new aws.CognitoIdentityServiceProvider({
    region: process.env.REGION || 'us-east-1'
})

export type ResetPasswordInput = {
    email: string
    userPoolId?: string
}

export async function resetPassword(props: ResetPasswordInput) {
    if (!props.email) {
        throw new Error('CreateUser must have an email defined')
    }

    if (!process.env.USERPOOL_ID && !props.userPoolId) {
        throw new Error('CreateUser must have process.env.USERPOOL_ID defined')
    }

    const pass = makePassword()
    const params = {
        Password: pass,
        UserPoolId: props.userPoolId || process.env.USERPOOL_ID || '',
        Username: props.email,
        Permanent: false
    }

    try {
        await cognito.adminSetUserPassword(params).promise()
        return {
            email: props.email,
            password: pass
        }
    } catch (err: any) {
        throw new Error(err)
    }
}
