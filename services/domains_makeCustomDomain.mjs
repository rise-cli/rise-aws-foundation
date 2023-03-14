/* 
Parameters:
  AdminEmail:
    Type: String
    Description: Email address for administrator
    Default: garysjennings@gmail.com
  DomainName:
    Type: String
  ZoneId:
    Type: String
    Description: Zone ID
Resources:
  DomainCertificate:
    Type: AWS::CertificateManager::Certificate
    Properties:
      DomainName:
        Ref: DomainName
      ValidationMethod: DNS
    Metadata:
      SamResourceId: DomainCertificate
  CustomDomainName:
    Type: AWS::ApiGatewayV2::DomainName
    Properties:
      DomainName:
        Ref: DomainName
      DomainNameConfigurations:
      - EndpointType: REGIONAL
        CertificateArn:
          Ref: DomainCertificate
    Metadata:
      SamResourceId: CustomDomainName
  RecordSet:
    Type: AWS::Route53::RecordSet
    Properties:
      Name:
        Ref: DomainName
      HostedZoneId:
        Ref: ZoneId
      AliasTarget:
        DNSName:
          Fn::GetAtt:
          - CustomDomainName
          - RegionalDomainName
        HostedZoneId:
          Fn::GetAtt:
          - CustomDomainName
          - RegionalHostedZoneId
      Type: A
    Metadata:
      SamResourceId: RecordSet
*/