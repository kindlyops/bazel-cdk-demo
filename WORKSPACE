# Bazel workspace created by @bazel/create 0.37.1

# Declares that this directory is the root of a Bazel workspace.
# See https://docs.bazel.build/versions/master/build-ref.html#workspace
workspace(
    # How this workspace would be referenced with absolute labels from another workspace
    name = "com_kindlyops_bazel_cdk_demo",
    # Map the @npm bazel workspace to the node_modules directory.
    # This lets Bazel use the same node_modules as other local tooling.
    managed_directories = {"@npm": ["node_modules"]},
)

# Install the nodejs "bootstrap" package
# This provides the basic tools for running and packaging nodejs programs in Bazel
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "1249a60f88e4c0a46d78de06be04d3d41e7421dcfa0c956de65309a7b7ecf6f4",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/0.38.0/rules_nodejs-0.38.0.tar.gz"],
)

http_archive(
    name = "io_bazel_rules_go",
    sha256 = "4e1cddcb58e973732547a23330964377ff1c37eda9980c149d0727960b09caea",
    strip_prefix = "rules_go-0.19.4",
    urls = ["https://github.com/bazelbuild/rules_go/archive/0.19.4.tar.gz"],
)

load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")

go_rules_dependencies()

go_register_toolchains(
    go_version = "1.12.9",
)

# to easily generate the http_archive with sha use a command like
# bzl use bazelbuild/bazel-gazelle 0.18.2
http_archive(
    name = "bazel_gazelle",
    sha256 = "6bf18fbc02f7e999335f38933b4eeb292853b516fbc3ed64be837063f0c412a0",
    strip_prefix = "bazel-gazelle-0.18.2",
    urls = ["https://github.com/bazelbuild/bazel-gazelle/archive/0.18.2.tar.gz"],
)

load("@bazel_gazelle//:deps.bzl", "gazelle_dependencies", "go_repository")

gazelle_dependencies()

buildtools_version = "0.28.0"

http_archive(
    name = "io_bazel_buildtools",
    sha256 = "5ec71602e9b458b01717fab1d37492154c1c12ea83f881c745dbd88e9b2098d8",
    strip_prefix = "buildtools-{0}".format(buildtools_version),
    urls = ["https://github.com/bazelbuild/buildtools/archive/{0}.tar.gz".format(buildtools_version)],
)

# https://github.com/bazelbuild/rules_pkg/pull/97
http_archive(
    name = "com_github_bazelbuild_rules_pkg",
    sha256 = "135a94754b05e06d1e6601fb4872ff0df9efa09813fb1bb67e0a40465784ad39",
    strip_prefix = "rules_pkg-c87df3e066ef3391be21e09534bea153856f707d",
    urls = ["https://github.com/kindlyops/rules_pkg/archive/c87df3e066ef3391be21e09534bea153856f707d.tar.gz"],
)

# The npm_install rule runs yarn anytime the package.json or package-lock.json file changes.
# It also extracts any Bazel rules distributed in an npm package.
load("@build_bazel_rules_nodejs//:defs.bzl", "npm_install")

npm_install(
    # Name this npm so that Bazel Label references look like @npm//package
    name = "npm",
    package_json = "//:package.json",
    package_lock_json = "//:package-lock.json",
)

# Install any Bazel rules which were extracted earlier by the npm_install rule.
load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")

install_bazel_dependencies()

# Setup TypeScript toolchain
load("@npm_bazel_typescript//:index.bzl", "ts_setup_workspace")

ts_setup_workspace()

load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version")

check_bazel_version("0.29.0", "You must use a newer version of bazel")

go_repository(
    name = "com_github_aws_aws_lambda_go",
    importpath = "github.com/aws/aws-lambda-go",
    sum = "h1:8lYuRVn6rESoUNZXdbCmtGB4bBk4vcVYojiHjE4mMrM=",
    version = "v1.13.2",
)

go_repository(
    name = "com_github_aws_aws_sdk_go",
    importpath = "github.com/aws/aws-sdk-go",
    sum = "h1:y13oPwCkhayDvc1GyKCSUUWC2vIv1FOCqPc4nwPEXH0=",
    version = "v1.25.2",
)

go_repository(
    name = "com_github_google_go_github",
    importpath = "github.com/google/go-github",
    sum = "h1:N0LgJ1j65A7kfXrZnUDaYCs/Sf4rEjNlfyDHW9dolSY=",
    version = "v17.0.0+incompatible",
)

go_repository(
    name = "com_github_jmespath_go_jmespath",
    importpath = "github.com/jmespath/go-jmespath",
    sum = "h1:pmfjZENx5imkbgOkpRUYLnmbU7UEFbjtDA2hxJ1ichM=",
    version = "v0.0.0-20180206201540-c2b33e8439af",
)
