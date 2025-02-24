import { Environment } from "aws-cdk-lib";

export interface EnvironmentConfig {
  env?: Environment;
  ec2InstanceUsername?: string;
  keyPairName: string;
}

const AppParameters: Record<string, EnvironmentConfig> = {
  dev: {
    // Stack environment (account and region) for the CDK app
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
    keyPairName: "kp-dev-instance",
    ec2InstanceUsername: "prasad",
  },
};

export const getAppParameters = (): EnvironmentConfig => {
  const appEnv = process.env.ENVIRONMENT;
  if (!appEnv || !AppParameters[appEnv]) {
    throw new Error(`Invalid app environment: ${appEnv}`);
  }
  return AppParameters[appEnv];
};
