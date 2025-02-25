import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { VpcConstruct } from "../constructs/VpcConstruct";
import { SecurityConstruct } from "../constructs/SecurityConstruct";

export class DevInstanceNetworkStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly securityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    // ✅ Deploy VPC
    const vpcStack = new VpcConstruct(this, "VpcStack");

    // ✅ Deploy Security Group
    const securityStack = new SecurityConstruct(this, "SecurityStack", {
      vpc: vpcStack.vpc,
    });

    this.vpc = vpcStack.vpc;
    this.securityGroup = securityStack.securityGroup;
  }
}
