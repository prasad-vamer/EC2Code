import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { CloudInit } from "utils/cloud-init";
import {
  Ec2KeyPairConstruct,
  Ec2KeyPairConstructProps,
} from "dev-instance-provider/constructs/Ec2KeyPairConstruct";

export interface Ec2ConstructProps
  extends Ec2KeyPairConstructProps,
    cdk.StackProps {
  vpc: ec2.Vpc;
  securityGroup: ec2.SecurityGroup;
  ec2InstanceUsername?: string;
}

export class Ec2Construct extends Construct {
  constructor(scope: Construct, id: string, props: Ec2ConstructProps) {
    super(scope, id);

    // Lookup the latest Debian AMI
    const debianAmi = new ec2.LookupMachineImage({
      name: "debian-*-arm64-*", // Pattern for Debian AMIs
      owners: ["136693071363"], // Debian AMI owner ID (official AWS)
    });

    // ✅ Create an IAM Role for EC2
    const ec2Role = new iam.Role(this, "DevInstanceRole", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AmazonSSMManagedInstanceCore"
        ), // Enables AWS SSM access
      ],
    });

    // Key Pair for EC2 Instance generation / import the existing key pair
    const keyPairConstruct = new Ec2KeyPairConstruct(this, "KeyPair", {
      keyPairName: props.keyPairName,
      keyPairPublicKeypath: props.keyPairPublicKeypath,
    });

    // Create user data script
    const userData = CloudInit.createUserData({
      userName: props.ec2InstanceUsername,
    });

    // Create EC2 Instance
    const ec2Instance = new ec2.Instance(this, "DebianInstance", {
      vpc: props.vpc,
      securityGroup: props.securityGroup,
      machineImage: debianAmi,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.R8G,
        ec2.InstanceSize.MEDIUM
      ),
      keyPair: keyPairConstruct.keyPair,
      role: ec2Role,
      userData,
    });

    // Add tags to the EC2 instance
    cdk.Tags.of(ec2Instance).add(
      "Name",
      `Developer Instance ${
        props.ec2InstanceUsername ? `of ${props.ec2InstanceUsername}` : ""
      }`
    );

    // ✅ Ensure EC2 instance is removed on `cdk destroy`
    (ec2Instance.node.defaultChild as cdk.CfnResource).applyRemovalPolicy(
      cdk.RemovalPolicy.DESTROY
    );

    // Output the Public IP
    new cdk.CfnOutput(this, "InstancePublicIp", {
      value: ec2Instance.instancePublicIp,
    });
  }
}
