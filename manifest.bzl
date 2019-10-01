def _lambda_manifest_impl(ctx):
    args = [ctx.outputs.manifest.path] + [f.path for f in ctx.files.srcs]

    ctx.actions.run(
        inputs = ctx.files.srcs,
        arguments = args,
        outputs = [ctx.outputs.manifest],
        progress_message = "Generating %s manifest" % ctx.outputs.manifest,
        executable = ctx.executable._manifester,
    )

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
    outputs = {
        "manifest": "manifest.json",
    },
)
