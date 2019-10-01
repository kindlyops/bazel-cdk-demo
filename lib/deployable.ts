import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";

export interface DeployableStackProps extends cdk.StackProps {
  // The bucket where this stack will load lambda assets from
  readonly artifactBucketName: string;
}

export class DeployableStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: DeployableStackProps) {
    super(scope, id, props);
  }
}
