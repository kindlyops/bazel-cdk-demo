# bazel-cdk-demo

## initial setup

* yarn create @bazel com_kindlyops_bazel_cdk_demo --typescript


## updating after changing packages in package.json

After updating package versions or adding packages run

    bazel run @nodejs//:yarn
