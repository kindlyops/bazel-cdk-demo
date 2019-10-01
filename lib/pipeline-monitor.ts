import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import { DeployableStack, DeployableStackProps } from "./deployable";
import path = require("path");
import fs = require("fs");

export interface PipelineMonitorStackProps extends DeployableStackProps {}

export class PipelineMonitorStack extends DeployableStack {
  public readonly notifyLambda: lambda.Function;
  constructor(
    scope: cdk.Construct,
    id: string,
    props: PipelineMonitorStackProps
  ) {
    super(scope, id, props);

    const functionName = "lambdas/demo/PipelineMonitorFunction";
    const artifactBucket = s3.Bucket.fromBucketName(
      this,
      "ImportedArtifactBucket",
      props.artifactBucketName
    );
    const code = lambda.Code.fromBucket(artifactBucket, functionName);

    this.notifyLambda = new lambda.Function(this, functionName, {
      code: code,
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
