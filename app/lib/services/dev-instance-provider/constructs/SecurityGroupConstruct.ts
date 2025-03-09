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
    this.securityGroup = new ec2.SecurityGroup(this, "SecurityGroup", {
      vpc: props.vpc,
      description: "Security Group with dynamic ingress rules",
      allowAllOutbound: true,
    });

    // ✅ Add dynamic ingress rules
    props.ingressRules.forEach((rule) => {
      const source =
        typeof rule.source === "string"
          ? ec2.Peer.ipv4(rule.source)
          : rule.source;

      this.securityGroup.addIngressRule(
        source, // Accept source as a parameter
        ec2.Port.tcp(rule.port), // Accept port dynamically
        `Allow access to port ${rule.port} from ${rule.source}`
      );
    });

    // ✅ Ensure deletion on `cdk destroy`
    (
      this.securityGroup.node.defaultChild as cdk.CfnResource
    ).applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
  }
}
