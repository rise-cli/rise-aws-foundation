import AWS from 'aws-sdk'

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
    region: process.env.REGION || 'us-east-1'
})

export type RefreshTokenInput = {
    clientId: string
    userPoolId: string
    refreshToken: string
}

export type RefreshTokenOutput = {
    accessToken: string
    refreshToken: string
    idToken: string
}

export async function refreshTokens(props: RefreshTokenInput): Promise<RefreshTokenOutput> {
    var params = {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: props.clientId,
        UserPoolId: props.userPoolId,
        AuthParameters: {
            REFRESH_TOKEN: props.refreshToken
        }
    }
    const res = await cognitoidentityserviceprovider.adminInitiateAuth(params).promise()

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
