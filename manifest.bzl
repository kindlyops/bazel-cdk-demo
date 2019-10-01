def _lambda_manifest_impl(ctx):
    tree = ctx.actions.declare_directory(ctx.attr.name + ".artifacts")
    output = ctx.actions.declare_file(ctx.attr.name + ".artifacts/manifest.json")
    args = [output.path] + [f.path for f in ctx.files.srcs]

    ctx.actions.run(
        inputs = ctx.files.srcs,
        arguments = args,
        outputs = [output, tree],
        progress_message = "Generating %s manifest" % output.path,
        executable = ctx.executable._manifester,
    )
    return [DefaultInfo(files = depset([tree]))]

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
