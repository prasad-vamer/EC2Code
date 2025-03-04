import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export class VpcConstruct extends Construct {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ✅ Create a VPC with a Public Subnet (Ensures deletion on `cdk destroy`)

    this.vpc = new ec2.Vpc(this, "DevVpc", {
      ipAddresses: ec2.IpAddresses.cidr("192.168.0.0/16"),
      vpcName: "DevVpc",
      natGateways: 0,
      maxAzs: 1,
      subnetConfiguration: [
        {
          name: "PublicSubnet1",
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 26, // 192.168.1.0 to 192.168.1.63 (64 IPs) - (59 usable IPs)
        },
      ],
    });

    // ✅ Ensure deletion on `cdk destroy`
    (this.vpc.node.defaultChild as cdk.CfnResource).applyRemovalPolicy(
      cdk.RemovalPolicy.DESTROY
    );
  }
}
