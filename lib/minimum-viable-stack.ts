import * as cdk from "@aws-cdk/core";
import * as sns from "@aws-cdk/aws-sns";
import { DeployableStack, DeployableStackProps } from "./deployable";

export class MinimumViableStack extends DeployableStack {
  constructor(scope: cdk.Construct, id: string, props: DeployableStackProps) {
    super(scope, id, props);

    // when building out a new stack it is useful to start with
    // a minimal stack and iterate on changes. Idea from:
    // https://adamj.eu/tech/2019/08/19/cloudformation-minimum-viable-template/
    const topic = new sns.Topic(this, "MVPTopic", {
      displayName: "MVP SNS topic"
    });
  }
}
