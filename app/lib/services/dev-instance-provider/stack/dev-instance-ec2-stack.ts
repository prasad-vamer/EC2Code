import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Environment } from "aws-cdk-lib";
import {
  Ec2Construct,
  Ec2ConstructProps,
} from "dev-instance-provider/constructs/Ec2Construct";

interface DevInstanceEc2StackProps extends cdk.StackProps, Ec2ConstructProps {
  env?: Environment;
}

export class DevInstanceEc2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: DevInstanceEc2StackProps) {
    super(scope, id, props);

    new Ec2Construct(this, "Ec2Construct", {
      vpc: props.vpc,
      securityGroup: props.securityGroup,
      keyPairName: props.keyPairName,
      keyPairPublicKeypath: props.keyPairPublicKeypath,
      ec2InstanceUsername: props.ec2InstanceUsername,
      ec2InstanceType: props.ec2InstanceType,
    });
  }
}
