#!/usr/bin/env node
//import "source-map-support/register";
import * as tar from "tar";
import cdk = require("@aws-cdk/core");
import { MinimumViableStack } from "./minimum-viable-stack";
import { CodeBuildExampleStack } from "./codebuild-example";
import { PipelineMonitorStack } from "./pipeline-monitor";
import { DeployableStack } from "./deployable";
const outdir = process.argv[2];
let deployStacks: Array<DeployableStack> = [];
const app = new cdk.App({
  outdir: outdir,
  stackTraces: false
});

const mvp = new MinimumViableStack(app, "MinimumViableStack", {});
deployStacks.push(mvp);
const deployMonitor = new PipelineMonitorStack(app, "PipelineMonitor", {
  env: {
    region: "us-west-2"
  }
});
deployStacks.push(deployMonitor);

new CodeBuildExampleStack(app, "CodeBuildExampleStack", {
  repo: "kindlyops",
  repoOwner: "kindlyops",
  branch: "master|build.*",
  builderProjectName: "github-source-example",
  deployMonitor: deployMonitor,
  stacks: deployStacks,
  env: {
    region: "us-west-2"
  }
});

const outfile = process.argv[3];
app.synth();
tar.create(
  {
    file: outfile,
    cwd: outdir,
    sync: true
  },
  ["."]
);
