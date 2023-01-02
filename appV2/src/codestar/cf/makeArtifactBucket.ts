export function makeArtifactBucket(name: string) {
    return {
        Resources: {
            CodePipelineArtifactStoreBucket: {
                Type: 'AWS::S3::Bucket',
                DeletionPolicy: 'Retain',
                UpdateReplacePolicy: 'Retain',
                Properties: {
                    VersioningConfiguration: {
                        Status: 'Enabled'
                    },
                    BucketEncryption: {
                        ServerSideEncryptionConfiguration: [
                            {
                                ServerSideEncryptionByDefault: {
                                    SSEAlgorithm: 'AES256'
                                }
                            }
                        ]
                    }
                }
            },
            CodePipelineArtifactStoreBucketPolicy: {
                Type: 'AWS::S3::BucketPolicy',
                Properties: {
                    Bucket: {
                        Ref: 'CodePipelineArtifactStoreBucket'
                    },
                    PolicyDocument: {
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Sid: 'DenyUnEncryptedObjectUploads',
                                Effect: 'Deny',
                                Principal: '*',
                                Action: 's3:PutObject',
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'CodePipelineArtifactStoreBucket',
                                                    'Arn'
                                                ]
                                            },
                                            '/*'
                                        ]
                                    ]
                                },
                                Condition: {
                                    StringNotEquals: {
                                        's3:x-amz-server-side-encryption':
                                            'aws:kms'
                                    }
                                }
                            },
                            {
                                Sid: 'DenyInsecureConnections',
                                Effect: 'Deny',
                                Principal: '*',
                                Action: 's3:*',
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'CodePipelineArtifactStoreBucket',
                                                    'Arn'
                                                ]
                                            },
                                            '/*'
                                        ]
                                    ]
                                },
                                Condition: {
                                    Bool: {
                                        'aws:SecureTransport': false
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }
    }
}
