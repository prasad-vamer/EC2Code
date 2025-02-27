#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { getAppParameters } from "config/parameters";
import { DevInstanceStage } from "dev-instance-provider/stack/dev-instance-stage";

const app = new cdk.App();
const envParameters = getAppParameters();

new DevInstanceStage(app, "DevInstanceStage", {
  env: envParameters.env,
  ...envParameters.devInstancServiceProps,
});
