import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export class VpcConstruct extends Construct {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ✅ Create a VPC with a Public Subnet (Ensures deletion on `cdk destroy`)

    this.vpc = new ec2.Vpc(this, "DevVpc", {
      maxAzs: 1,
      natGateways: 0,
      subnetConfiguration: [
        {
          name: "PublicSubnet",
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    // ✅ Ensure deletion on `cdk destroy`
    (this.vpc.node.defaultChild as cdk.CfnResource).applyRemovalPolicy(
      cdk.RemovalPolicy.DESTROY
    );

    // ✅ Ensure deletion on `cdk destroy`
    (this.vpc.node.defaultChild as cdk.CfnResource).applyRemovalPolicy(
      cdk.RemovalPolicy.DESTROY
    );
  }
}
