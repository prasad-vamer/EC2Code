import * as fs from "fs";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Ec2KeyPairConstructProps } from "lib/types";

export class Ec2KeyPairConstruct extends Construct {
  public readonly keyPair: ec2.IKeyPair;

  constructor(scope: Construct, id: string, props: Ec2KeyPairConstructProps) {
    super(scope, id);

    // Read the public key from the provided file path
    const publickKey = props.keyPairPublicKeypath
      ? fs.readFileSync(props.keyPairPublicKeypath, "utf8")
      : undefined;

    // import key pair to EC2 key pair or create new key pair in system manager parameter store
    const parameterStoreKeyPair = new ec2.CfnKeyPair(this, "ImportedKeyPair", {
      keyName: props.keyPairName,
      publicKeyMaterial: publickKey,
    });

    // Since CfnKeyPair only creates a key pair but cannot be used in EC2,
    // must convert it into an IKeyPair using: fromKeyPairName
    this.keyPair = ec2.KeyPair.fromKeyPairName(
      this,
      "KeyPairRef",
      props.keyPairName
    );

    // Ensure the key pair is removed on `cdk destroy`
    parameterStoreKeyPair.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    // output the key pair id
    new cdk.CfnOutput(this, "KeyPairId", {
      value: `/ec2/keypair/${parameterStoreKeyPair.attrKeyPairId}`,
    });
  }
}
