import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Ec2Construct } from "dev-instance-provider/constructs/Ec2Construct";

import { SecurityGroupConstruct } from "dev-instance-provider/constructs/SecurityGroupConstruct";
import { DevInstanceEc2StackProps } from "lib/types";

export class DevInstanceEc2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: DevInstanceEc2StackProps) {
    super(scope, id, props);

    // ✅ Deploy Security Group
    const sGConstruct = new SecurityGroupConstruct(this, "SecurityStack", {
      vpc: props.vpc,
    });

    new Ec2Construct(this, "Ec2Construct", {
      vpc: props.vpc,
      securityGroup: sGConstruct.securityGroup,
      keyPairName: props.keyPairName,
      keyPairPublicKeypath: props.keyPairPublicKeypath,
      ec2InstanceUsername: props.ec2InstanceUsername,
      ec2InstanceType: props.ec2InstanceType,
    });
  }
}
