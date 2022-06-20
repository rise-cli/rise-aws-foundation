const { deployStack } = require('./cloudformation/deployStack')
const { getDeployStatus } = require('./cloudformation/getDeployStatus')
const { getOutputs } = require('./cloudformation/getOutputs')
const { removeStack } = require('./cloudformation/removeStack')

const { makeInlineLambda } = require('./lambda/cfMakeInlineLambda')
const { invokeLambda } = require('./lambda/invokeLambda')

module.exports = (config) => {
    if (config.type === 'real') {
        return {
            cloudformation: {
                deployStack,
                getDeployStatus,
                getOutputs,
                removeStack
            },
            lambda: {
                makeInlineLambda,
                invokeLambda
            }
        }
    }

    if (config.type === 'mock') {
        return {}
    }
}
