import { MinimumViableStack } from './minimum-viable-stack';
import * as cdk from "@aws-cdk/core";
import '@aws-cdk/assert/jest';
import { SynthUtils } from '@aws-cdk/assert';

test('deployable', () => {

    const app = new cdk.App({
      stackTraces: false
    });

    const stack1 = new MinimumViableStack(app, "MinimumViableStack", {
    artifactBucketName: "foo"
    });

    expect(stack1.stackName).toEqual('TestRootA');

});

