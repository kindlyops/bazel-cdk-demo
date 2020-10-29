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
    sha256 = "f2194102720e662dbf193546585d705e645314319554c6ce7e47d8b59f459e9c",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/2.2.2/rules_nodejs-2.2.2.tar.gz"],
)

http_archive(
    name = "io_bazel_rules_go",
    sha256 = "a8d6b1b354d371a646d2f7927319974e0f9e52f73a2452d2b3877118169eb6bb",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.23.3/rules_go-v0.23.3.tar.gz",
        "https://github.com/bazelbuild/rules_go/releases/download/v0.23.3/rules_go-v0.23.3.tar.gz",
    ],
)

load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")

go_rules_dependencies()

go_register_toolchains(
    go_version = "1.14.4",
)

# to easily generate the http_archive with sha use a command like
# bzl use bazelbuild/bazel-gazelle 0.18.2
http_archive(
    name = "bazel_gazelle",
    sha256 = "cdb02a887a7187ea4d5a27452311a75ed8637379a1287d8eeb952138ea485f7d",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-gazelle/releases/download/v0.21.1/bazel-gazelle-v0.21.1.tar.gz",
        "https://github.com/bazelbuild/bazel-gazelle/releases/download/v0.21.1/bazel-gazelle-v0.21.1.tar.gz",
    ],
)

load("@bazel_gazelle//:deps.bzl", "gazelle_dependencies", "go_repository")

gazelle_dependencies()

buildtools_version = "0.29.0"

http_archive(
    name = "io_bazel_buildtools",
    sha256 = "f3ef44916e6be705ae862c0520bac6834dd2ff1d4ac7e5abc61fe9f12ce7a865",
    strip_prefix = "buildtools-{0}".format(buildtools_version),
    urls = ["https://github.com/bazelbuild/buildtools/archive/{0}.tar.gz".format(buildtools_version)],
)

# The npm_install rule runs yarn anytime the package.json or package-lock.json file changes.
# It also extracts any Bazel rules distributed in an npm package.
load("@build_bazel_rules_nodejs//:index.bzl", "check_bazel_version", "node_repositories", "yarn_install")

# rules_manifest
http_archive(
    name = "com_kindlyops_rules_manifest",
    sha256 = "476f374a5b125032ffdeca8541302fc87fb37207bba4792c4f4baa1e19ee5222",
    strip_prefix = "rules_manifest-0.2.1",
    urls = ["https://github.com/kindlyops/rules_manifest/archive/v0.2.1.tar.gz"],
)

# NOTE: this rule installs nodejs, npm, and yarn, but does NOT install
# your npm dependencies into your node_modules folder.
# You must still run the package manager to do this.
node_repositories(
    node_version = "12.13.0",
    package_json = ["//:package.json"],
    yarn_version = "1.19.1",
)

yarn_install(
    # Name this npm so that Bazel Label references look like @npm//package
    name = "npm",
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)

check_bazel_version("0.29.0", "You must use a newer version of bazel")

# rules_docker
rules_docker_version = "0.14.3"

http_archive(
    name = "io_bazel_rules_docker",
    sha256 = "6287241e033d247e9da5ff705dd6ef526bac39ae82f3d17de1b69f8cb313f9cd",
    strip_prefix = "rules_docker-{}".format(rules_docker_version),
    urls = ["https://github.com/bazelbuild/rules_docker/releases/download/v{0}/rules_docker-v{0}.tar.gz".format(rules_docker_version)],
)

load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)

container_repositories()

load(
    "@io_bazel_rules_docker//go:image.bzl",
    docker_go_image_repos = "repositories",
)

docker_go_image_repos()

go_repository(
    name = "com_github_containous_whoami",
    importpath = "github.com/containous/whoami",
    sum = "h1:67C6ZyBsINZJW5OC00Z5aX2caOC1++UuHdoHz4wb9dw=",
    version = "v1.4.0",
)

# TODO: get rid of these go_repositories and use vendor mode
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

go_repository(
    name = "com_github_gorilla_websocket",
    importpath = "github.com/gorilla/websocket",
    sum = "h1:q7AeDBpnBk8AogcD4DSag/Ukw/KV+YhzLj2bP5HvKCM=",
    version = "v1.4.1",
)

# use local_repository when testing local changes to pipeline-monitor
# local_repository should be commented out before committing.
# local_repository(
#     name = "com_github_kindlyops_pipeline_monitor",
#     path = "/Users/emurphy/go/src/github.com/kindlyops/pipeline-monitor",
# )

http_archive(
    name = "com_github_kindlyops_pipeline_monitor",
    sha256 = "a8f970646aea9159a5529d9cb763f39157ed6139edc78f4c9496f84c4c3841a4",
    strip_prefix = "pipeline-monitor-0.2.12",
    urls = ["https://github.com/kindlyops/pipeline-monitor/archive/v0.2.12.tar.gz"],
)
