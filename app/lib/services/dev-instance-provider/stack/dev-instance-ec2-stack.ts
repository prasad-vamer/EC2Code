import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Ec2Construct } from "dev-instance-provider/constructs/Ec2Construct";

import { SecurityGroupConstruct } from "dev-instance-provider/constructs/SecurityGroupConstruct";
import { DevInstanceEc2StackProps } from "lib/types";

export class DevInstanceEc2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: DevInstanceEc2StackProps) {
    super(scope, id, props);

    props.ec2Instances.forEach((ec2Instance, index) => {
      // ✅ Deploy Security Group
      const sGConstruct = new SecurityGroupConstruct(
        this,
        `SecurityStack${ec2Instance.ec2InstanceUsername || index}`,
        {
          vpc: props.vpc,
          ingressRules: ec2Instance.ingressRules,
        }
      );

      // ✅ Deploy EC2 Instance
      new Ec2Construct(
        this,
        `Ec2Construct${ec2Instance.ec2InstanceUsername || index}`,
        {
          vpc: props.vpc,
          securityGroup: sGConstruct.securityGroup,
          keyPairName: ec2Instance.keyPairName,
          keyPairPublicKeypath: ec2Instance.keyPairPublicKeypath,
          ec2InstanceUsername: ec2Instance.ec2InstanceUsername,
          ec2InstanceType: ec2Instance.ec2InstanceType,
        }
      );
    });
  }
}
