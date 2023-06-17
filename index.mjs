// Account
import { getKeyword } from './services/account_getKeyword.mjs'

// ApiGateway
import { makeHttpApi } from './services/apigateway_makeHttpApi.mjs'
import { makeHttpApiRoute } from './services/apigateway_makeHttpApiRoute.mjs'
import { makeLambdaEndpoint } from './services/apigateway_makeLambdaEndpoint.mjs'
import { makeLambdaGetEndpoint } from './services/apigateway_makeLambdaGetEndpoint.mjs'

// CloudFormation
import { deployStack } from './services/cloudformation_deployStack.mjs'
import { getDeployStatus } from './services/cloudformation_getDeployStatus.mjs'
import { getOutputs } from './services/cloudformation_getOutputs.mjs'
import { removeStack } from './services/cloudformation_removeStack.mjs'

// CloudWatch
import { makeLambdaErrorAlarm } from './services/cloudwatch_makeLambdaErrorAlarm.mjs'
import { runLogInsightsQuery } from './services/cloudwatch_runLogInsightsQuery.mjs'

// Amplify
import { deployAmplify } from './services/amplify_deploy.mjs'
import { makeAmplifyApp } from './services/amplify_makeApp.mjs'

// DynamoDB
import { makeDb } from './services/dynamodb_makeDb.mjs'
import * as dynamodb from './services/dynamodb_crud.mjs'

// EventBridge
import { makeEventRule } from './services/eventbridge_makeEventRule.mjs'
import { emit } from './services/eventbridge_emit.mjs'

// Lambda
import { invokeLambda } from './services/lambda_invokeLambda.mjs'
import { makeInlineLambda } from './services/lambda_makeInlineLambda.mjs'
import { makeLambda } from './services/lambda_makeLambda.mjs'
import { updateLambdaCode } from './services/lambda_updateLambdaCode.mjs'

// S3
import { getFile } from './services/s3_getFile.mjs'
import { getFileUrl } from './services/s3_getFileUrl.mjs'
import { makeBucket } from './services/s3_makeBucket.mjs'
import { makeSimpleBucket } from './services/s3_makeSimpleBucket.mjs'
import { removeFile } from './services/s3_removeFile.mjs'
import { uploadFile } from './services/s3_uploadFile.mjs'
import { emptyBucket } from './services/s3_emptyBucket.mjs'

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
    uploadFile,
    emptyBucket
}

export const amplify = {
    deploy: deployAmplify,
    makeApp: makeAmplifyApp
}
