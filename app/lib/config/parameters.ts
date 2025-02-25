import { Environment } from "aws-cdk-lib";
export interface DevInstancServiceProps {
  ec2InstanceUsername?: string;
  ec2KeyPairName: string;
  ec2KeyPairPublicKeypath?: string;
}
export interface EnvironmentConfig {
  env: Environment;
  devInstancServiceProps: DevInstancServiceProps;
}

const AppParameters: Record<string, EnvironmentConfig> = {
  dev: {
    // Stack environment (account and region) for the CDK app
    env: {
      account: process.env.AWS_ACCOUNT_ID,
      region: process.env.AWS_DEFAULT_REGION,
    },
    // Service based separation for parameters
    devInstancServiceProps: {
      ec2InstanceUsername: "prasad",
      ec2KeyPairName: "devInstnaceAdmin",
      // ec2KeyPairPublicKeypath: "../tmp/MyEc2Key.pem.pub",
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
