import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { DevInstanceNetworkStack } from "./dev-instance-network-stack";
import { DevInstanceEc2Stack } from "./dev-instance-ec2-stack";
import { DevInstanceStageProps } from "lib/types";

export class DevInstanceStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: DevInstanceStageProps) {
    super(scope, id, props);

    const networking = new DevInstanceNetworkStack(
      this,
      "DevInstanceNetworkStack",
      {
        // Added env here because If envParameters.env contains a different AWS account or region than DevInstanceNetworkStack,
        // CDK will not allow cross-stack references.
        env: props.env,
      }
    );

    new DevInstanceEc2Stack(this, "DevInstanceEC2Stack", {
      env: props.env,
      vpc: networking.vpc,
      keyPairName: props.keyPairName,
      keyPairPublicKeypath: props.keyPairPublicKeypath,
      ec2InstanceUsername: props.ec2InstanceUsername,
      ec2InstanceType: props.ec2InstanceType,
    });
  }
}
