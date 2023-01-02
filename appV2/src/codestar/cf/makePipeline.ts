type SourcePlatform = 'code-commit' | 'github'

type SourceActionInput = {
    type: 'SOURCE'
    name: string
    repo: string
    outputArtifact: string
    owner?: string
    platform?: SourcePlatform
}

const makeSourceAction = (config: SourceActionInput) => {
    if (config.platform && config.platform == 'code-commit') {
        return {
            OutputArtifacts: [
                {
                    Name: config.outputArtifact
                }
            ],
            InputArtifacts: [],
            Name: 'source',
            Configuration: {
                RepositoryName: config.repo,
                BranchName: 'main',
                PollForSourceChanges: 'false'
            },
            ActionTypeId: {
                Version: '1',
                Provider: 'CodeCommit',
                Category: 'Source',
                Owner: 'AWS'
            }
        }
    }
    if (!config.owner) {
        throw new Error('Github Source needs to have an owner defined')
    }
    return {
        Name: config.name,
        ActionTypeId: {
            Category: 'Source',
            Owner: 'AWS',
            Provider: 'CodeStarSourceConnection',
            Version: '1'
        },
        Configuration: {
            ConnectionArn: {
                Ref: 'CodeStarConnection'
            },
            FullRepositoryId: `${config.owner}/${config.repo}`,
            BranchName: 'main'
        },
        OutputArtifacts: [
            {
                Name: config.outputArtifact
            }
        ]
    }
}

type BuildActionInput = {
    type: 'BUILD'
    name: string
    projectCFName: string
    env: Record<string, string>
    inputArtifact: string
    outputArtifact: string
}
const makeBuildAction = (config: BuildActionInput) => {
    type EnvType = 'PARAMETER_STORE' | 'SECRETS_MANAGER' | 'PLAINTEXT'
    const envVariables = Object.keys(config.env).map((k: string) => {
        let v = config.env[k]
        let type: EnvType = 'PLAINTEXT'

        if (v.startsWith('@ssm.')) {
            v = v.split('@ssm.').slice(1).join()
            type = 'PARAMETER_STORE'
        }

        if (v.startsWith('@secret.')) {
            v = v.split('@secret.').slice(1).join()
            type = 'SECRETS_MANAGER'
        }

        return {
            name: k,
            value: v,
            type
        }
    })
    return {
        Name: config.name,
        ActionTypeId: {
            Category: 'Build',
            Owner: 'AWS',
            Provider: 'CodeBuild',
            Version: '1'
        },
        Configuration: {
            ProjectName: config.projectCFName,
            EnvironmentVariables: JSON.stringify(envVariables)
        },
        InputArtifacts: [
            {
                Name: config.inputArtifact
            }
        ],
        OutputArtifacts: [
            {
                Name: config.outputArtifact
            }
        ]
    }
}

type InvokeActionInput = {
    type: 'INVOKE'
    name: string
    functionName: string
    region: string
}
const makeInvokeAction = (config: InvokeActionInput) => {
    return {
        Name: config.name,
        ActionTypeId: {
            Category: 'Invoke',
            Owner: 'AWS',
            Provider: 'Lambda',
            Version: '1'
        },
        Configuration: {
            FunctionName: config.functionName
        },
        OutputArtifacts: [],
        InputArtifacts: [],
        Region: config.region
    }
}

type ApprovalActionInput = {
    type: 'APPROVAL'
    name: string
}
const makeApprovalAction = (config: ApprovalActionInput) => {
    return {
        Name: config.name,
        ActionTypeId: {
            Category: 'Approval',
            Owner: 'AWS',
            Provider: 'Manual',
            Version: '1'
        }
    }
}

type DeployActionInput = {
    type: 'DEPLOY'
    name: string
    inputArtifact: string
    stackName: string
    template: string
    parameters: Record<string, string>
}
const makeDeployAction = (config: DeployActionInput) => {
    return {
        Name: config.name,
        ActionTypeId: {
            Category: 'Deploy',
            Owner: 'AWS',
            Provider: 'CloudFormation',
            Version: '1'
        },
        Configuration: {
            ActionMode: 'CREATE_UPDATE',
            Capabilities: 'CAPABILITY_NAMED_IAM,CAPABILITY_AUTO_EXPAND',
            ParameterOverrides: JSON.stringify(config.parameters),
            RoleArn: {
                'Fn::GetAtt': ['CodePipelineServiceRole', 'Arn']
            },
            StackName: config.stackName,

            TemplatePath: `${config.inputArtifact}::${config.template}`
        },
        OutputArtifacts: [],
        InputArtifacts: [
            {
                Name: config.inputArtifact
            }
        ]
    }
}

type Action =
    | SourceActionInput
    | BuildActionInput
    | InvokeActionInput
    | ApprovalActionInput
    | DeployActionInput

type StageInput = {
    name: string
    actions: Action[]
}

const makeStage = (config: StageInput) => {
    const actions = config.actions.map((x) => {
        if (x.type === 'SOURCE') return makeSourceAction(x)
        if (x.type === 'BUILD') return makeBuildAction(x)
        if (x.type === 'INVOKE') return makeInvokeAction(x)
        if (x.type === 'APPROVAL') return makeApprovalAction(x)
        if (x.type === 'DEPLOY') return makeDeployAction(x)
        throw new Error('Not a valid action')
    })

    return {
        Name: config.name,
        Actions: actions.map((x, i) => {
            return {
                ...x,
                RunOrder: i + 1
            }
        })
    }
}

type PipelineInput = {
    pipelineName: string
    stages: StageInput[]
}

export function makePipeline(config: PipelineInput) {
    const stages = config.stages.map(makeStage)

    return {
        Resources: {
            AppPipeline: {
                Type: 'AWS::CodePipeline::Pipeline',
                Properties: {
                    Name: config.pipelineName,
                    RoleArn: {
                        'Fn::GetAtt': ['CodePipelineServiceRole', 'Arn']
                    },
                    ArtifactStore: {
                        Type: 'S3',
                        Location: {
                            Ref: 'CodePipelineArtifactStoreBucket'
                        }
                    },
                    Stages: stages
                }
            },
            CodePipelineServiceRole: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Effect: 'Allow',
                                Principal: {
                                    Service: ['codepipeline.amazonaws.com']
                                },
                                Action: 'sts:AssumeRole'
                            }
                        ]
                    },
                    Path: '/',
                    Policies: [
                        {
                            PolicyName: 'AWS-CodePipeline-Service-3',
                            PolicyDocument: {
                                Version: '2012-10-17',
                                Statement: [
                                    {
                                        Effect: 'Allow',
                                        Action: [
                                            'codecommit:CancelUploadArchive',
                                            'codecommit:GetBranch',
                                            'codecommit:GetCommit',
                                            'codecommit:GetUploadArchiveStatus',
                                            'codecommit:UploadArchive'
                                        ],
                                        Resource: '*'
                                    },
                                    {
                                        Effect: 'Allow',
                                        Action: [
                                            'codedeploy:CreateDeployment',
                                            'codedeploy:GetApplicationRevision',
                                            'codedeploy:GetDeployment',
                                            'codedeploy:GetDeploymentConfig',
                                            'codedeploy:RegisterApplicationRevision'
                                        ],
                                        Resource: '*'
                                    },
                                    {
                                        Effect: 'Allow',
                                        Action: [
                                            'codebuild:BatchGetBuilds',
                                            'codebuild:StartBuild'
                                        ],
                                        Resource: '*'
                                    },
                                    {
                                        Effect: 'Allow',
                                        Action: [
                                            'lambda:InvokeFunction',
                                            'lambda:ListFunctions'
                                        ],
                                        Resource: '*'
                                    },
                                    {
                                        Effect: 'Allow',
                                        Action: ['iam:PassRole'],
                                        Resource: '*'
                                    },
                                    {
                                        Effect: 'Allow',
                                        Action: [
                                            'elasticbeanstalk:*',
                                            'ec2:*',
                                            'elasticloadbalancing:*',
                                            'autoscaling:*',
                                            'cloudwatch:*',
                                            's3:*',
                                            'sns:*',
                                            'cloudformation:*',
                                            'rds:*',
                                            'sqs:*',
                                            'ecs:*'
                                        ],
                                        Resource: '*'
                                    },
                                    {
                                        Effect: 'Allow',
                                        Action: [
                                            'codestar-connections:UseConnection'
                                        ],
                                        Resource: [
                                            {
                                                Ref: 'CodeStarConnection'
                                            },
                                            '*'
                                        ]
                                    },
                                    {
                                        Effect: 'Allow',
                                        Action: [
                                            's3:GetObject',
                                            's3:GetObjectVersion',
                                            's3:PutObject'
                                        ],
                                        Resource: ['*']
                                    },
                                    {
                                        Effect: 'Allow',
                                        Action: ['*'],
                                        Resource: ['*']
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        }
    }
}
