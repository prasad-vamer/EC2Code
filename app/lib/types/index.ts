import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Environment } from "aws-cdk-lib";

export interface Ec2KeyPairConstructProps {
  keyPairName: string; // Key Pair Name passed as a property
  keyPairPublicKeypath?: string; // Path to the public key file
}

export interface SecurityGroupConstructProps {
  vpc: ec2.Vpc;
}

export interface Ec2BaseProps extends Ec2KeyPairConstructProps {
  ec2InstanceUsername?: string;
  ec2InstanceType: ec2.InstanceType;
}

export interface DevInstanceStageProps extends cdk.StageProps, Ec2BaseProps {}

export interface EnvironmentConfig {
  env: Environment;
  devInstancServiceProps: Ec2BaseProps;
}

export interface DevInstanceEc2StackProps extends cdk.StackProps, Ec2BaseProps {
  env?: Environment;
  vpc: ec2.Vpc;
}

export interface Ec2ConstructProps extends DevInstanceEc2StackProps {
  securityGroup: ec2.SecurityGroup;
}
