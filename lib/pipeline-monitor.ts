import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as lambda from "@aws-cdk/aws-lambda";
import { DeployableStack } from "./deployable";
import path = require("path");
import fs = require("fs");

export interface PipelineMonitorStackProps extends cdk.StackProps {}

export class PipelineMonitorStack extends DeployableStack {
  public readonly notifyLambda: lambda.Function;
  constructor(
    scope: cdk.Construct,
    id: string,
    props: PipelineMonitorStackProps
  ) {
    super(scope, id, props);

    const functionName = "PipelineMonitorFunction";
    const codeParams = lambda.Code.fromCfnParameters();
    this.lambdaCodes.push({ code: codeParams, name: "monitor" });

    this.notifyLambda = new lambda.Function(this, functionName, {
      code: codeParams,
      runtime: lambda.Runtime.GO_1_X,
      handler: "main"
    });

    this.notifyLambda.addToRolePolicy(
      new iam.PolicyStatement({
        resources: ["*"], // TODO: permissions for reading CodePipeline status and getting github creds from SSM
        actions: ["*"]
      })
    );
  }
}
