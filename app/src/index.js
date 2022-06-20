// CloudFormation
const { deployStack } = require('./cloudformation/deployStack')
const { getDeployStatus } = require('./cloudformation/getDeployStatus')
const { getOutputs } = require('./cloudformation/getOutputs')
const { removeStack } = require('./cloudformation/removeStack')

// Lambda
const { makeInlineLambda } = require('./lambda/cfMakeInlineLambda')
const { makeLambda } = require('./lambda/cfMakeLambda')
const { updateLambdaCode } = require('./lambda/updateLambdaCode')
const { invokeLambda } = require('./lambda/invokeLambda')

// S3
const { makeSimpleBucket } = require('./s3/cfMakeSimpleBucket')
const { makeBucket } = require('./s3/cfMakeBucket')
const { getFile } = require('./s3/getFile')
const { getFileUrl } = require('./s3/getFileUrl')
const { removeFile } = require('./s3/removeFile')
const { uploadFile } = require('./s3/uploadFile')

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
                makeLambda,
                updateLambdaCode,
                invokeLambda
            },
            s3: {
                makeBucket,
                makeSimpleBucket,
                getFile,
                getFileUrl,
                removeFile,
                uploadFile
            }
        }
    }

    if (config.type === 'mock') {
        return {}
    }
}
