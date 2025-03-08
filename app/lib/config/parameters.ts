import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Environment } from "aws-cdk-lib";
import { SingleEc2InstanceProps } from "lib/types";

export interface EnvironmentConfig {
  env: Environment;
  devInstanceServiceProps: {
    ec2Instances: SingleEc2InstanceProps[];
    whitelistIps?: string[];
  };
}

const AppParameters: Record<string, EnvironmentConfig> = {
  test: {
    // Stack environment (account and region) for the CDK app
    env: {
      account: process.env.AWS_ACCOUNT_ID,
      region: process.env.AWS_DEFAULT_REGION,
    },
    // Service based separation for parameters
    devInstanceServiceProps: {
      ec2Instances: [
        {
          keyPairName: "testInstanceAdmin",
          keyPairPublicKeyPath: "../tmp/MyEc2Key.pem.pub",
          ec2InstanceUsername: "testInstanceAdmin",
          ec2InstanceType: ec2.InstanceType.of(
            ec2.InstanceClass.T4G,
            ec2.InstanceSize.SMALL
          ),
          ingressRules: [
            { port: 22, source: ec2.Peer.anyIpv4() }, // allow ssh from anywhere
            { port: 5173, source: ec2.Peer.anyIpv4() }, // post or vite react app
          ],
        },
      ],
      whitelistIps: [],
    },
  },
  dev: {
    // Stack environment (account and region) for the CDK app
    env: {
      account: process.env.AWS_ACCOUNT_ID,
      region: process.env.AWS_DEFAULT_REGION,
    },
    // Service based separation for parameters
    devInstanceServiceProps: {
      ec2Instances: [
        {
          keyPairName: "devInstanceAdmin",
          keyPairPublicKeyPath: "../tmp/MyEc2Key.pem.pub",
          ec2InstanceUsername: "devInstanceAdmin",
          ec2InstanceType: ec2.InstanceType.of(
            ec2.InstanceClass.R8G,
            ec2.InstanceSize.MEDIUM
          ),
          ingressRules: [
            { port: 22, source: ec2.Peer.anyIpv4() }, // allow ssh from anywhere
          ],
        },
      ],
      whitelistIps: [], // empty whitelist, no NetworkACl will be created
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
