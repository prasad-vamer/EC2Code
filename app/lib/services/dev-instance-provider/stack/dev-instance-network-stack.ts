import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { VpcConstruct } from "dev-instance-provider/constructs/VpcConstruct";
import { DevInstanceNetworkStackProps } from "lib/types";

export class DevInstanceNetworkStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

  constructor(
    scope: Construct,
    id: string,
    props: DevInstanceNetworkStackProps
  ) {
    super(scope, id, props);

    // ✅ Deploy VPC
    const vpcStack = new VpcConstruct(this, "VpcStack", {
      whitelistIps: props.whitelistIps,
    });

    this.vpc = vpcStack.vpc;
  }
}
