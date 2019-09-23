# bazel-cdk-demo

## initial setup

* yarn create @bazel com_kindlyops_bazel_cdk_demo --typescript


## updating after changing packages in package.json

After updating package versions or adding packages run

    bazel run @nodejs//:yarn

## run cdk commands

    bazel run cdk -- ls

If you have direnv set up we have a wrapper script called cdk in `./scripts`

## generate a tar of the synthesized CDK output

This is useful as a build artifact for deployment in a pipeline

    bazel build synth

## TODO

* generate go lambda function and deployment zip
* generate json manifest file that describes file hash
* generate deploy binaries named by content hash
* push deploy binaries to S3 from codebuild
* Connect CfnCodeParameters to lambda artifacts using special Fn::GetParam pseudo-intrinsic
  https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline-parameter-override-functions.html