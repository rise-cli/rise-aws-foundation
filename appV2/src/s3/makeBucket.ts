export default function makeBucket(name: string) {
    const theName = name.charAt(0).toUpperCase() + name.slice(1)
    const BucketName = `${theName}Bucket`
    const PolicyName = `${theName}BucketPolicy`

    return {
        Resources: {
            [BucketName]: {
                Type: 'AWS::S3::Bucket',
                Properties: {
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
            [PolicyName]: {
                Type: 'AWS::S3::BucketPolicy',
                Properties: {
                    Bucket: {
                        Ref: BucketName
                    },
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: 's3:*',
                                Effect: 'Deny',
                                Principal: '*',
                                Resource: [
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {
                                                    Ref: 'AWS::Partition'
                                                },
                                                ':s3:::',
                                                {
                                                    Ref: BucketName
                                                },
                                                '/*'
                                            ]
                                        ]
                                    }
                                ],
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
        },
        Outputs: {
            [BucketName]: {
                Value: {
                    Ref: BucketName
                }
            }
        }
    }
}
