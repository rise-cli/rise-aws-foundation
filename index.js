// Account
import { getKeyword } from './services/account_getKeyword.js'

// ApiGateway
import { makeHttpApi } from './services/apigateway_makeHttpApi.js'
import { makeHttpApiRoute } from './services/apigateway_makeHttpApiRoute.js'
import { makeLambdaEndpoint } from './services/apigateway_makeLambdaEndpoint.js'
import { makeLambdaGetEndpoint } from './services/apigateway_makeLambdaGetEndpoint.js'

// CloudFormation
import { deployStack } from './services/cloudformation_deployStack.js'
import { getDeployStatus } from './services/cloudformation_getDeployStatus.js'
import { getOutputs } from './services/cloudformation_getOutputs.js'
import { removeStack } from './services/cloudformation_removeStack.js'

// CloudWatch
import { makeLambdaErrorAlarm } from './services/cloudwatch_makeLambdaErrorAlarm.js'
import { runLogInsightsQuery } from './services/cloudwatch_runLogInsightsQuery.js'

// CodeStar
import { makeArtifactBucket } from './services/codestar_makeArtifactBucket.js'
import { makeBuildProject } from './services/codestar_makeBuildProject.js'
import { makeGithubConnection } from './services/codestar_makeGithubConnection.js'
import { makePipeline } from './services/codestar_makePipeline.js'

// Cognito
import { makeCognito } from './services/cognito_makeCognito.js'
import {
    createUser,
    removeUser,
    resetPassword,
    getUser
} from './services/cognito_crud.js'

// DynamoDB
import { makeDb } from './services/dynamodb_makeDb.js'
import * as dynamodb from './services/dynamodb_crud.js'

// EventBridge
import { makeEventRule } from './services/eventbridge_makeEventRule.js'
import { emit } from './services/eventbridge_emit.js'

// Lambda
import { invokeLambda } from './services/lambda_invokeLambda.js'
import { makeInlineLambda } from './services/lambda_makeInlineLambda.js'
import { makeLambda } from './services/lambda_makeLambda.js'
import { updateLambdaCode } from './services/lambda_updateLambdaCode.js'

// S3
import { getFile } from './services/s3_getFile.js'
import { getFileUrl } from './services/s3_getFileUrl.js'
import { makeBucket } from './services/s3_makeBucket.js'
import { makeSimpleBucket } from './services/s3_makeSimpleBucket.js'
import { removeFile } from './services/s3_removeFile.js'
import { uploadFile } from './services/s3_uploadFile.js'

export const account = {
    getKeyword
}

export const apigateway = {
    makeHttpApi,
    makeHttpApiRoute,
    makeLambdaEndpoint,
    makeLambdaGetEndpoint
}

export const cloudformation = {
    deployStack,
    getDeployStatus,
    getOutputs,
    removeStack
}

export const cloudwatch = {
    makeLambdaErrorAlarm,
    runLogInsightsQuery
}

export const codestar = {
    makeArtifactBucket,
    makeBuildProject,
    makeGithubConnection,
    makePipeline
}

export const cognito = {
    makeCognito,
    getUser,
    createUser,
    removeUser,
    resetPassword
}

export const db = {
    makeDb,
    get: dynamodb.get,
    list: dynamodb.list,
    create: dynamodb.create,
    set: dynamodb.set,
    remove: dynamodb.remove
}

export const eventbridge = {
    makeEventRule,
    emit
}

export const lambda = {
    invokeLambda,
    makeInlineLambda,
    makeLambda,
    updateLambdaCode
}

export const s3 = {
    getFile,
    getFileUrl,
    makeBucket,
    makeSimpleBucket,
    removeFile,
    uploadFile
}
