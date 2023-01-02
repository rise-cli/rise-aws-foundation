import { deployStack } from '../deployStack'
import { getDeployStatus } from '../getDeployStatus'

const invalidTemplate = {
    Resources: {
        Invalid: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                FunctionName: `onvaladfv`,
                Handler: 'index.handler',
                MemorySize: 2024,

                Runtime: 'nodejs14.x'
            }
        }
    }
}

async function main() {
    const x = await deployStack({
        name: 'invalidinvalidinvalid',
        template: JSON.stringify(invalidTemplate)
    })

    console.log('THE RESULT 1::: ', x)

    const res = await getDeployStatus({
        region: 'us-east-1',
        config: {
            stackName: 'invalidinvalidinvalid',
            minRetryInterval: 5000,
            maxRetryInterval: 10000,
            backoffRate: 1.1,
            maxRetries: 200,
            onCheck: (resources) => {
                console.log('---- ')
                resources.forEach((item) => {
                    console.log(item)
                })
                console.log('---- ')
            }
        }
    })

    console.log('THE RESULT::: ', res)
}

main()
