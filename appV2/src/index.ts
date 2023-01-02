// CloudFormation
import { deployStack } from './cloudformation/deployStack'
import { getDeployStatus } from './cloudformation/getDeployStatus'
import { getOutputs } from './cloudformation/getOutputs'
import { removeStack } from './cloudformation/removeStack'

// Lambda
import { makeInlineLambda } from './lambda/makeInlineLambda'
import { makeLambda } from './lambda/makeLambda'
import { updateLambdaCode } from './lambda/updateLambdaCode'
import { invokeLambda } from './lambda/invokeLambda'

// S3
import makeSimpleBucket from './s3/makeSimpleBucket'
import makeBucket from './s3/makeBucket'
import getFile from './s3/getFile'
import getFileUrl from './s3/getFileUrl'
import removeFile from './s3/removeFile'
import { uploadFile } from './s3/uploadFile'

// ApiGateway
import { makeHttpApi } from './apigateway/makeHttpApi'
import { makeHttpApiRoute } from './apigateway/makeHttpApiRoute'

// EventBridge
import { makeEventRule } from './eventBridge/makeEventRule'
import { emit } from './eventBridge/emit'

// Cognito
import { makeCognito } from './cognito/makeCognito'
import { createUser } from './cognito/createUser'
import { removeUser } from './cognito/removeUser'
import { resetPassword } from './cognito/resetPassword'
import { validateToken } from './cognito/validateJwtToken'
import { loginUser } from './cognito/loginUser'
import { loginHandleNewPassword } from './cognito/loginHandleNewPassword'
import { getUser } from './cognito/getUser'

// CodeStar
import { makeArtifactBucket } from './codestar/cf/makeArtifactBucket'
import { makeGithubConnection } from './codestar/cf/makeGithubConnection'
import { makeBuildProject } from './codestar/cf/makeBuildProject'
import { makePipeline } from './codestar/cf/makePipeline'

// Keywords
import { getKeyword } from './keywords/index'

// CloudWatch
import { makeDashboard } from './cloudwatch/makeDashboard'
import { makeLambdaErrorAlarm } from './cloudwatch/makeLambdaErrorAlarm'

// DB
import { getDbItem, listDbItems, setDbItem, removeDbItem } from './db/db'
import { makeDb } from './db/cf/makeDb'

export default {
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
    },
    apigateway: {
        makeHttpApi,
        makeHttpApiRoute
    },
    eventBridge: {
        makeEventRule,
        emit
    },

    cognito: {
        makeCognito,
        createUser,
        removeUser,
        resetPassword,
        validateToken,
        loginUser,
        loginHandleNewPassword,
        getUser
    },
    codestar: {
        makeArtifactBucket,
        makeGithubConnection,
        makeBuildProject,
        makePipeline
    },
    keywords: {
        getKeyword
    },
    cloudwatch: {
        makeDashboard,
        makeLambdaErrorAlarm
    },
    db: {
        makeDb,
        get: getDbItem,
        list: listDbItems,
        set: setDbItem,
        remove: removeDbItem
    }
}
