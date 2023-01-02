import AWS from 'aws-sdk'

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
    region: process.env.REGION || 'us-east-1'
})

export type LoginUserInput = {
    clientId: string
    userPoolId: string
    userName: string
    password: string
}

type OutputSuccessful = {
    accessToken: string
    refreshToken: string
    idToken: string
}

type OutputNewPassword = {
    challenge: 'NEW_PASSWORD'
    session: string
    advice: 'Should use loginHandleNewPassword rise function in response'
}

export type LoginUserOutput = OutputSuccessful | OutputNewPassword

export async function loginUser(
    props: LoginUserInput
): Promise<LoginUserOutput> {
    var params = {
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        ClientId: props.clientId,
        UserPoolId: props.userPoolId,
        AuthParameters: {
            USERNAME: props.userName,
            PASSWORD: props.password
        }
    }
    const res = await cognitoidentityserviceprovider
        .adminInitiateAuth(params)
        .promise()

    if (res.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
        return {
            challenge: 'NEW_PASSWORD',
            session: res.Session || '',
            advice: 'Should use loginHandleNewPassword rise function in response'
        }
    }

    if (res.ChallengeName) {
        throw new Error(
            'rise foundation does not handle the following challenge: ' +
                res.ChallengeName
        )
    }

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
