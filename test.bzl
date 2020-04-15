load("@npm_bazel_typescript//:index.bzl", "ts_library")
load("@npm//jest-cli:index.bzl", _jest_test = "jest_test")

def ts_test(name, srcs, deps, jest_config = "//:jest.config.js", **kwargs):
    "A macro around the autogenerated jest_test rule, by the incomparable @spacerat"

    lib_name = name + "_lib"
    src_name = name + "_src"

    deps = deps + [
        "@npm//@aws-cdk/assert",
        # "@npm//@types/jest",
    ]

    # Compile the test and extract its js files

    ts_library(
        name = lib_name,
        srcs = srcs,
        deps = deps,
    )

    native.filegroup(
        name = src_name,
        srcs = [":" + lib_name],
        output_group = "es5_sources",
    )
    src_label = ":" + src_name

    # Run the test

    args = [
        "--no-cache",
        "--no-watchman",
        "--ci",
    ]
    args.extend(["--config", "$(rootpath %s)" % jest_config])
    args.extend(["--runTestsByPath", "$(rootpaths %s)" % src_label])

    _jest_test(
        name = name,
        data = [jest_config, src_label],  # + deps,
        templated_args = args,
        **kwargs
    )
