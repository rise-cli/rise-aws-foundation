import {
    AmplifyClient,
    StartDeploymentCommand,
    GetJobCommand
} from '@aws-sdk/client-amplify'

const client = new AmplifyClient({
    region: 'us-east-1'
})

const wait = () => new Promise((r) => setTimeout(r, 2000))

async function startDeployment(config) {
    const input = {
        appId: config.app.appId,
        branchName: 'main',
        sourceUrl: `s3://${config.app.bucketName}/${
            config.zipConfig.name + '.zip'
        }`
    }
    const command = new StartDeploymentCommand(input)
    return await client.send(command)
}

async function checkDeployStatus(amplify, appId, jobId, count) {
    if (count > 100) {
        throw new Error('Deployment is taking longer than usual')
    }

    const getJobInput = {
        appId: appId,
        branchName: 'main',
        jobId: jobId
    }

    const command = new GetJobCommand(getJobInput)
    const jobStatus = await client.send(command)

    if (
        jobStatus.job.summary.status === 'PENDING' ||
        jobStatus.job.summary.status === 'RUNNING'
    ) {
        await wait()
        return await checkDeployStatus(amplify, appId, jobId, count + 1)
    }

    return jobStatus.job.summary.status
}

export async function deployAmplify(config) {
    const res = await startDeployment(config)
    await checkDeployStatus(amplify, config.app.appId, res.jobSummary.jobId, 0)
}
