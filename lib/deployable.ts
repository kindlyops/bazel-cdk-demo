import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";

export class DeployableStack extends cdk.Stack {
  public readonly lambdaCodes: Array<{
    code: lambda.CfnParametersCode;
    name: string;
  }>;

  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    this.lambdaCodes = [];
  }
}
