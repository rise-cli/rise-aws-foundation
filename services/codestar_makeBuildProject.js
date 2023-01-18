/**
 * @param {object} props
 * @param {string} props.name
 * @param {string} props.buildSpec
 * @param {object} props.env Record<string, string>
 */
export function makeBuildProject(props) {
    const envVariables = Object.keys(props.env).map((k) => {
        return {
            Name: k,
            Value: props.env[k]
        }
    })

    return {
        Resources: {
            ['CodeBuild' + props.name]: {
                Type: 'AWS::CodeBuild::Project',
                Properties: {
                    Artifacts: {
                        Type: 'CODEPIPELINE'
                    },
                    Environment: {
                        Type: 'LINUX_CONTAINER',
                        ComputeType: 'BUILD_GENERAL1_SMALL',
                        Image: 'aws/codebuild/standard:5.0',
                        PrivilegedMode: true
                        // EnvironmentVariables: [
                        //     {
                        //         Name: 'ARTIFACT_BUCKET',
                        //         Value: {
                        //             Ref: 'CodePipelineArtifactStoreBucket'
                        //         }
                        //     },
                        //     ...envVariables
                        // ]
                    },
                    ServiceRole: {
                        'Fn::GetAtt': ['CodeBuildServiceRole', 'Arn']
                    },
                    Name: props.name,
                    QueuedTimeoutInMinutes: 5,
                    Source: {
                        Type: 'CODEPIPELINE',
                        BuildSpec: props.buildSpec //'app/build.yml'
                    }
                }
            },

            CodeBuildServiceRole: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Effect: 'Allow',
                                Action: 'sts:AssumeRole',
                                Principal: {
                                    Service: ['codebuild.amazonaws.com']
                                }
                            }
                        ]
                    },
                    Path: '/',
                    Policies: [
                        {
                            PolicyName: 'CodeBuildLogs',
                            PolicyDocument: {
                                Version: '2012-10-17',
                                Statement: [
                                    {
                                        Effect: 'Allow',
                                        Action: [
                                            'logs:CreateLogGroup',
                                            'logs:CreateLogStream',
                                            'logs:PutLogEvents'
                                        ],
                                        Resource: ['*']
                                    }
                                ]
                            }
                        },
                        {
                            PolicyName: 'CodeBuildArtifactsBucket',
                            PolicyDocument: {
                                Version: '2012-10-17',
                                Statement: [
                                    {
                                        Effect: 'Allow',
                                        Action: [
                                            's3:GetObject',
                                            's3:GetObjectVersion',
                                            's3:PutObject'
                                        ],
                                        Resource: [
                                            {
                                                'Fn::Sub':
                                                    'arn:aws:s3:::${CodePipelineArtifactStoreBucket}/*'
                                            },
                                            '*'
                                        ]
                                    },
                                    {
                                        Effect: 'Allow',
                                        Action: [
                                            'kms:Decrypt',
                                            'kms:Encrypt',
                                            'kms:GenerateDataKey'
                                        ],
                                        Resource: ['*']
                                    }
                                ]
                            }
                        },
                        {
                            PolicyName: 'CodeBuildParameterStore',
                            PolicyDocument: {
                                Version: '2012-10-17',
                                Statement: [
                                    {
                                        Effect: 'Allow',
                                        Action: 'ssm:GetParameters',
                                        Resource: '*'
                                    }
                                ]
                            }
                        },
                        {
                            PolicyName: 'CodeConnection',
                            PolicyDocument: {
                                Version: '2012-10-17',
                                Statement: [
                                    {
                                        Effect: 'Allow',
                                        Action: [
                                            'codestar-connections:CreateConnection',
                                            'codestar-connections:DeleteConnection',
                                            'codestar-connections:UseConnection',
                                            'codestar-connections:GetConnection',
                                            'codestar-connections:ListConnections',
                                            'codestar-connections:TagResource',
                                            'codestar-connections:ListTagsForResource',
                                            'codestar-connections:UntagResource'
                                        ],
                                        Resource: '*'
                                    }
                                ]
                            }
                        },
                        {
                            PolicyName: 'CodeBuildDeploy',
                            PolicyDocument: {
                                Version: '2012-10-17',
                                Statement: [
                                    {
                                        Effect: 'Allow',
                                        Action: [
                                            'cloudformation:CreateStack',
                                            'cloudformation:DescribeStacks',
                                            'cloudformation:DeleteStack',
                                            'cloudformation:UpdateStack',
                                            'cloudformation:CreateChangeSet',
                                            'cloudformation:ExecuteChangeSet',
                                            'cloudformation:DeleteChangeSet',
                                            'cloudformation:DescribeChangeSet',
                                            'cloudformation:SetStackPolicy',
                                            'cloudformation:SetStackPolicy',
                                            'cloudformation:ValidateTemplate'
                                        ],
                                        Resource: ['*']
                                    },
                                    {
                                        Effect: 'Allow',
                                        Action: '*',
                                        Resource: '*'
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
