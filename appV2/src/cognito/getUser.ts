import aws from 'aws-sdk'

const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({
    region: process.env.AWS_REGION || 'us-east-1'
})

type GetUserInput = {
    userPoolId: string
    email: string
}

type Output = { id: string } | false

export async function getUser({
    userPoolId,
    email
}: GetUserInput): Promise<Output> {
    try {
        const params = {
            UserPoolId: userPoolId,
            Username: email
        }

        const result = await cognitoidentityserviceprovider
            .adminGetUser(params)
            .promise()

        return {
            id: result.Username
        }
    } catch (e) {
        return false
    }
}
