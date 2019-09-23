import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as lambda from "@aws-cdk/aws-lambda";
import { DeployableStack } from "./deployable";

export interface PipelineMonitorStackProps extends cdk.StackProps {}

export class PipelineMonitorStack extends DeployableStack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props: PipelineMonitorStackProps
  ) {
    super(scope, id, props);

    const functionName = "PipelineMonitorFunction";
    const codeParams = lambda.Code.fromCfnParameters();
    this.lambdaCodes.push({ code: codeParams, name: "monitor" });

    const fn = new lambda.Function(this, functionName, {
      code: codeParams,
      runtime: lambda.Runtime.GO_1_X,
      handler: "main"
    });

    fn.addToRolePolicy(
      new iam.PolicyStatement({
        resources: ["*"], // TODO: permissions for reading CodePipeline status and getting github creds from SSM
        actions: ["*"]
      })
    );
  }
}
