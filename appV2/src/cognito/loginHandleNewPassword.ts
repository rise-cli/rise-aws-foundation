import AWS from 'aws-sdk'

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
    region: process.env.REGION || 'us-east-1'
})

export type LoginHandleNewPasswordInput = {
    session: string
    clientId: string
    userPoolId: string
    userName: string
    newPassword: string
}

export async function loginHandleNewPassword(
    props: LoginHandleNewPasswordInput
) {
    const params = {
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ClientId: props.clientId,
        UserPoolId: props.userPoolId,
        ChallengeResponses: {
            USERNAME: props.userName,
            NEW_PASSWORD: props.newPassword
        },

        Session: props.session
    }
    const res = await cognitoidentityserviceprovider
        .adminRespondToAuthChallenge(params)
        .promise()

    const result = res.AuthenticationResult || {}
    if (!result.AccessToken || !result.RefreshToken || !result.IdToken) {
        throw new Error('Unrecognized response from AWS Cognito')
    }

    return {
        accessToken: result.AccessToken,
        refreshToken: result.RefreshToken,
        idToken: result.IdToken
    }
}
