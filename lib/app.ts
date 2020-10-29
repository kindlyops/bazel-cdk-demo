#!/usr/bin/env node
//import "source-map-support/register";
import * as tar from "tar";
import cdk = require("@aws-cdk/core");
import { MinimumViableStack } from "./minimum-viable-stack";
import { CodeBuildExampleStack } from "./codebuild-example";
import { PipelineMonitorStack } from "./pipeline-monitor";
import { DeployableStack } from "./deployable";
import { exec } from "child_process";
import { ECANCELED } from "constants";
const outdir = "cdk.out";

// this is looking up a location in the runfiles directory, we have specified
// "@com_github_kindlyops_pipeline_monitor//:lambda_deploy" as a data dependency
// in the nodejs_binary rule for the cdk command
// so this does not reach outside our workspace and will pull the proper artiface
// that was generated by @com_github_kindlyops_pipeline_monitor repo


// helpful for debugging what is in the runfiles tree when this is executed
// console.log("process.argv", process.argv);
// exec("pwd", (error, stdout, stderr) => {
//   console.log(`stdout: ${stdout}`);
// });


const pipelineLambda =
  "../com_github_kindlyops_pipeline_monitor/lambda_deploy.zip";
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
