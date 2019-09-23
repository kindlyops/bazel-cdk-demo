#!/usr/bin/env node
//import "source-map-support/register";
import cdk = require("@aws-cdk/core");
import { MinimumViableStack } from "./minimum-viable-stack";
import { CodeBuildExampleStack } from "./codebuild-example";
import { PipelineMonitorStack } from "./pipeline-monitor";
import { DeployableStack } from "./deployable";

let deployStacks: Array<DeployableStack> = [];
const app = new cdk.App();

const mvp = new MinimumViableStack(app, "MinimumViableStack", {});
deployStacks.push(mvp);
deployStacks.push(
  new PipelineMonitorStack(app, "PipelineMonitor", {
    env: {
      region: "us-west-2"
    }
  })
);
new CodeBuildExampleStack(app, "CodeBuildExampleStack", {
  repo: "kindlyops",
  repoOwner: "kindlyops",
  branch: "master|build.*",
  builderProjectName: "github-source-example",
  stacks: deployStacks,
  env: {
    region: "us-west-2"
  }
});
