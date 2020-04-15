import { DeployableStack } from "./deployable";
import * as cdk from "@aws-cdk/core";
import '@aws-cdk/assert/jest';
import { SynthUtils } from '@aws-cdk/assert';

test('deployable', () => {

    const app = new cdk.App({
      stackTraces: false
    });

    // const stack1 = new DeployableStack(app, "MinimumViableStack", {
    // artifactBucketName: "foo"
    // });

    expect(app.node.id).toEqual('');

});

