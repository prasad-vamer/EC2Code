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
        whitelistIps: props.whitelistIps,
      }
    );

    // props.ec2Instances.forEach((ec2Instance, index) => {
    new DevInstanceEc2Stack(this, `DevInstanceEC2Stack`, {
      vpc: networking.vpc,
      env: props.env,
      ec2Instances: props.ec2Instances,
    });
    // });
  }
}
