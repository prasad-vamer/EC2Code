import * as ec2 from "aws-cdk-lib/aws-ec2";
import { EnvironmentConfig } from "lib/types";

const AppParameters: Record<string, EnvironmentConfig> = {
  test: {
    // Stack environment (account and region) for the CDK app
    env: {
      account: process.env.AWS_ACCOUNT_ID,
      region: process.env.AWS_DEFAULT_REGION,
    },
    // Service based separation for parameters
    devInstancServiceProps: {
      keyPairName: "testInstnaceAdmin",
      keyPairPublicKeypath: "../tmp/MyEc2Key.pem.pub",
      ec2InstanceUsername: "testInstanceAdmin",
      ec2InstanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.NANO
      ),
      ingressRules: [
        { port: 22, source: ec2.Peer.anyIpv4() },
        { port: 443, source: ec2.Peer.anyIpv4() },
      ],
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
      keyPairName: "devInstnaceAdmin",
      keyPairPublicKeypath: "../tmp/MyEc2Key.pem.pub",
      ec2InstanceUsername: "devInstanceAdmin",
      ec2InstanceType: ec2.InstanceType.of(
        ec2.InstanceClass.R8G,
        ec2.InstanceSize.MEDIUM
      ),
      ingressRules: [],
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
