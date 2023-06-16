import { Lambda } from "@aws-sdk/client-lambda";

/**
 * @param {object} props
 * @param {string} props.name
 * @param {string} props.payload
 * @param {string} [props.region]
 */
export const invokeLambda = async ({ name, payload, region }) => {
    let params = {
        FunctionName: name
    }

    if (payload) {
        params.Payload = payload
    }

    const lambda = new Lambda({
        region: region || process.env.AWS_REGION || 'us-east-1'
    })

    const executionResult = await lambda.invoke(params)
    return executionResult.Payload
}
