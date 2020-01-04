#!/usr/bin/env node
//import "source-map-support/register";
import * as tar from "tar";
import cdk = require("@aws-cdk/core");
import { MinimumViableStack } from "./minimum-viable-stack";
import { CodeBuildExampleStack } from "./codebuild-example";
import { PipelineMonitorStack } from "./pipeline-monitor";
import { DeployableStack } from "./deployable";
const outdir = "cdk.out";
const pipelineLambda =
  "../com_github_kindlyops_pipeline_monitor/lambda_deploy.zip";
console.log("process.argv", process.argv);
let deployStacks: Array<DeployableStack> = [];
const app = new cdk.App({
  outdir: outdir,
  stackTraces: false
});

const mvp = new MinimumViableStack(app, "MinimumViableStack", {
  artifactBucketName: "foo"
});
deployStacks.push(mvp);

const deployMonitor = new PipelineMonitorStack(app, "PipelineMonitor", {
  env: {
    region: "us-west-2"
  },
  artifactBucketName: "foo",
  monitorFunctionZip: pipelineLambda
});
deployStacks.push(deployMonitor);

// new CodeBuildExampleStack(app, "CodeBuildExampleStack", {
//   repo: "kindlyops",
//   repoOwner: "kindlyops",
//   branch: "master|build.*",
//   builderProjectName: "github-source-example",
//   deployMonitor: deployMonitor,
//   stacks: deployStacks,
//   env: {
//     region: "us-west-2"
//   }
// });

app.synth();
