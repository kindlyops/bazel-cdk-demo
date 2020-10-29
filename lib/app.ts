#!/usr/bin/env node
//import "source-map-support/register";
import * as tar from "tar";
import * as path from 'path';
import cdk = require("@aws-cdk/core");
import { MinimumViableStack } from "./minimum-viable-stack";
import { CodeBuildExampleStack } from "./codebuild-example";
import { PipelineMonitorStack } from "./pipeline-monitor";
import { DeployableStack } from "./deployable";

let outdir = "cdk.out"
if (process.argv[2]) {
  outdir = process.argv[2]
}
let bindir = "."
if (process.env.BINDIR) {
  bindir = process.env.BINDIR;
} else if (process.argv[3]) {
  bindir = process.argv[3]
}

// helpful for debugging what is in the runfiles tree when this is executed
// console.log("process.argv", process.argv);
//import { exec } from "child_process";
// exec("pwd", (error, stdout, stderr) => {
//   console.log(`stdout: ${stdout}`);
// });


const pipelineLambda = path.join(
  bindir,
  "external/com_github_kindlyops_pipeline_monitor/lambda_deploy.zip",
);
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


const result = app.synth();

if (result.manifest.missing && result.manifest.missing.length !== 0) {
    const details = JSON.stringify(result.manifest.missing);
    console.log(`CDK Assembly has missing context reported, not deployable: ${details}`);
    process.exit(1); // bazel uses 1 for build failure exit code
}
