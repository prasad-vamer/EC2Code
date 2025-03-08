import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { SecurityGroupConstructProps } from "lib/types";

export class SecurityGroupConstruct extends Construct {
  public readonly securityGroup: ec2.SecurityGroup;

  constructor(
    scope: Construct,
    id: string,
    props: SecurityGroupConstructProps
  ) {
    super(scope, id);

    // ✅ Create a Security Group
    this.securityGroup = new ec2.SecurityGroup(this, "DevSecurityGroup", {
      vpc: props.vpc,
      description: "Allow SSH and VS Code remote access",
      allowAllOutbound: true,
    });

    // ✅ Allow SSH & VS Code
    this.securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "Allow SSH access"
    );
    this.securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      "Allow VS Code remote access"
    );

    // ✅ Ensure deletion on `cdk destroy`
    (
      this.securityGroup.node.defaultChild as cdk.CfnResource
    ).applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
  }
}
