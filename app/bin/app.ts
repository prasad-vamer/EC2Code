#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { getAppParameters } from "config/parameters";
import { DevInstanceStage } from "dev-instance-provider/stack/dev-instance-stage";
import * as ec2 from "aws-cdk-lib/aws-ec2";

const app = new cdk.App();
const envParameters = getAppParameters();

new DevInstanceStage(app, "DevInstanceStage", {
  env: envParameters.env,
  ec2Instaces: envParameters.devInstancServiceProps,
});
