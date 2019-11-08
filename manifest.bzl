def _lambda_manifest_impl(ctx):
    tree = ctx.actions.declare_directory(ctx.attr.name + ".artifacts")
    output = ctx.actions.declare_file(ctx.attr.name + ".json")
    args = [output.path] + [f.path for f in ctx.files.srcs]

    ctx.actions.run(
        inputs = ctx.files.srcs,
        arguments = args,
        outputs = [tree],
        progress_message = "Copying inputs into manifest tree at %s" % output.path,
        executable = ctx.executable._manifester,
    )

    ctx.actions.run_shell(
        # Input files visible to the action.
        inputs = ctx.files.srcs,
        # Output files that must be created by the action.
        outputs = [output],
        # The progress message uses `short_path` (the workspace-relative path)
        # since that's most meaningful to the user. It omits details from the
        # full path that would help distinguish whether the file is a source
        # file or generated, and (if generated) what configuration it is built
        # for.
        progress_message = "Generating lambda manifest %s" % output.short_path,
        # The command to run. Alternatively we could use '$1', '$2', etc., and
        # pass the values for their expansion to `run_shell`'s `arguments`
        # param (see convert_to_uppercase below). This would be more robust
        # against escaping issues. Note that actions require the full `path`,
        # not the ambiguous truncated `short_path`.
        command = "echo 'fake contents' > '%s'" %
                  (output.path),
    )

    return [DefaultInfo(files = depset([tree, output]))]

lambda_manifest = rule(
    implementation = _lambda_manifest_impl,
    attrs = {
        "srcs": attr.label_list(),
        "_manifester": attr.label(
            default = Label("//manifester:manifester"),
            allow_single_file = True,
            executable = True,
            cfg = "host",
        ),
    },
)

def _docker_manifest_impl(ctx):
    output = ctx.actions.declare_file(ctx.attr.name + ".json")
    args = [output.path] + [f.path for f in ctx.files.srcs]

    # TODO
    # build a dict, where each key is the name of an input, and each
    # value is the content of that input file.
    # then use https://docs.bazel.build/versions/master/skylark/lib/struct.html#to_json
    # to turn the dict into a json manifest and write it to the file.

    # TODO alternative approach
    # extend manifester to do this! probably simpler
    # see https://stackoverflow.com/questions/50648052/how-can-i-build-custom-rules-using-the-output-of-workspace-status-command

    ctx.actions.run_shell(
        # Input files visible to the action.
        inputs = ctx.files.srcs,
        # Output files that must be created by the action.
        outputs = [output],
        # The progress message uses `short_path` (the workspace-relative path)
        # since that's most meaningful to the user. It omits details from the
        # full path that would help distinguish whether the file is a source
        # file or generated, and (if generated) what configuration it is built
        # for.
        progress_message = "Generating docker manifest %s" % output.short_path,
        # The command to run. Alternatively we could use '$1', '$2', etc., and
        # pass the values for their expansion to `run_shell`'s `arguments`
        # param (see convert_to_uppercase below). This would be more robust
        # against escaping issues. Note that actions require the full `path`,
        # not the ambiguous truncated `short_path`.
        command = "echo 'fake contents' > '%s'" %
                  (output.path),
    )

    return [DefaultInfo(files = depset([output]))]

docker_manifest = rule(
    implementation = _docker_manifest_impl,
    attrs = {
        "srcs": attr.label_list(),
    },
)
