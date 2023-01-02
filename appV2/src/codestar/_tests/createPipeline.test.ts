import { deployStack } from '../../cloudformation/deployStack'
import { makeGithubConnection } from '../cf/makeGithubConnection'
import { makeArtifactBucket } from '../cf/makeArtifactBucket'
import { makeBuildProject } from '../cf/makeBuildProject'
import { makePipeline } from '../cf/makePipeline'
import { test, expect } from 'vitest'

test('testing pipeline creation', async () => {
    const build = makeBuildProject({
        name: 'fpipelineBuid',
        buildSpec: `version: 0.2
phases:
    install:
        runtime-versions:
            nodejs: 14

    build:
        commands:
            - echo "building test $REGION"
`,
        env: {}
    })

    const pipe = makePipeline({
        pipelineName: 'fpipeline',
        stages: [
            {
                name: 'source',
                actions: [
                    {
                        type: 'SOURCE',
                        name: 'source',
                        repo: 'rise-shopexample',
                        owner: 'dodgeblaster',
                        outputArtifact: 'sourceZip'
                    }
                ]
            },
            {
                name: 'build',
                actions: [
                    {
                        type: 'BUILD',
                        name: 'build',
                        projectCFName: 'fpipelineBuid',
                        env: {
                            REGION: 'ca-central-1'
                        },
                        inputArtifact: 'sourceZip',
                        outputArtifact: 'buildZip'
                    }
                ]
            },
            {
                name: 'Prod',
                actions: [
                    {
                        type: 'APPROVAL',
                        name: 'designerappoval'
                    },
                    {
                        type: 'INVOKE',
                        name: 'integrationtests',
                        functionName: 'pipelinetests-pipelinetester-dev',
                        region: 'us-east-1'
                    }
                ]
            }
        ]
    })

    const template = {
        Resources: {
            ...makeGithubConnection('foundationpipeline').Resources,
            ...makeArtifactBucket('foundationpipeline').Resources,
            ...build.Resources,
            ...pipe.Resources
        },
        Outputs: {}
    }

    console.log(JSON.stringify(template, null, 2))
    //return
    const x = await deployStack({
        name: 'foundationpipeline',
        template: JSON.stringify(template)
    })

    console.log(x)
})
