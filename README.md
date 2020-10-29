# bazel-cdk-demo

## initial setup

- yarn create @bazel com_kindlyops_bazel_cdk_demo --typescript

## updating after changing packages in package.json

After updating package versions or adding packages run

    bazel run @nodejs//:yarn

## run cdk commands

    bazel run cdk -- ls

If you have direnv set up we have a wrapper script called cdk in `./scripts`

## generate a tar of the synthesized CDK output

This is useful as a build artifact for deployment in a pipeline

    bazel build synth

## To add a new go dependency, run gazelle

For example, to add a dependency on the aws-sdk-go library, run

    bazel run //:gazelle -- update-repos github.com/aws/aws-sdk-go

