import { Environment } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export interface DevInstancServiceProps {
  ec2InstanceUsername?: string;
  ec2KeyPairName: string;
  ec2KeyPairPublicKeypath?: string;
  ec2InstanceType: ec2.InstanceType;
}
export interface EnvironmentConfig {
  env: Environment;
  devInstancServiceProps: DevInstancServiceProps;
}

const AppParameters: Record<string, EnvironmentConfig> = {
  test: {
    // Stack environment (account and region) for the CDK app
    env: {
      account: process.env.AWS_ACCOUNT_ID,
      region: process.env.AWS_DEFAULT_REGION,
    },
    // Service based separation for parameters
    devInstancServiceProps: {
      ec2InstanceUsername: "testInstanceAdmin",
      ec2KeyPairName: "testInstnaceAdmin",
      ec2KeyPairPublicKeypath: "../tmp/MyEc2Key.pem.pub",
      ec2InstanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.NANO
      ),
    },
  },
  dev: {
    // Stack environment (account and region) for the CDK app
    env: {
      account: process.env.AWS_ACCOUNT_ID,
      region: process.env.AWS_DEFAULT_REGION,
    },
    // Service based separation for parameters
    devInstancServiceProps: {
      ec2InstanceUsername: "devInstanceAdmin",
      ec2KeyPairName: "devInstnaceAdmin",
      ec2KeyPairPublicKeypath: "../tmp/MyEc2Key.pem.pub",
      ec2InstanceType: ec2.InstanceType.of(
        ec2.InstanceClass.R8G,
        ec2.InstanceSize.MEDIUM
      ),
    },
  },
};

export const getAppParameters = (): EnvironmentConfig => {
  const appEnv = process.env.ENVIRONMENT;
  if (!appEnv || !AppParameters[appEnv]) {
    throw new Error(`Invalid app environment: ${appEnv}`);
  }
  return AppParameters[appEnv];
};
