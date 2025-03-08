import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Environment } from "aws-cdk-lib";
import { EnvironmentConfig } from "config/parameters";

export interface Ec2KeyPairConstructProps {
  keyPairName: string; // Key Pair Name passed as a property
  keyPairPublicKeyPath?: string; // Path to the public key file
}
export interface IngressRule {
  port: number;
  source: string | ec2.IPeer; // e.g., "0.0.0.0/0" for any IP or "192.168.1.0/24"
}

export interface SecurityGroupConstructProps {
  vpc: ec2.Vpc;
  ingressRules: IngressRule[]; // Accept an array of ingress rules
}

export interface Ec2BaseProps extends Ec2KeyPairConstructProps {
  ec2InstanceUsername?: string;
  ec2InstanceType: ec2.InstanceType;
}

export interface SingleEc2InstanceProps extends Ec2BaseProps {
  ingressRules: IngressRule[];
}

export interface Ec2ConstructProps extends Ec2BaseProps {
  securityGroup: ec2.SecurityGroup;
  vpc: ec2.Vpc;
}

export interface DevInstanceEc2StackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  ec2Instances: SingleEc2InstanceProps[];
}

export interface DevInstanceNetworkStackProps extends cdk.StackProps {
  whitelistIps?: string[];
}

type DevInstanceServiceProps = EnvironmentConfig["devInstanceServiceProps"];
export interface DevInstanceStageProps
  extends cdk.StageProps,
    DevInstanceServiceProps {}
