## Loading bazel-generated docker image into local docker daemon for inspection

    # see https://github.com/bazelbuild/rules_docker#debugging-lang_image-rules
    # the -c dbg says to use the distroless container with extra debugging support
    # the --norun flag says to not invoke docker run
    # this command will take the generated docker tar layer and import it to
    # the local docker daemon so we can work with the image.
    bazel run -c dbg //tasks/hello:image -- --norun

    # take a look at the configured docker image entrypoints and metadata
    docker inspect bazel/tasks/hello:image

    # run the container locally in the background
    docker run --name hello --rm -p 8888:8080 bazel/tasks/hello:image &

    # see the running container
    docker ps

    # make an HTTP request to the locally running container
    curl http://localhost:8888

    # kill the running container by name
    docker kill hello

    # look around inside the image with a shell
    docker run -ti --rm --entrypoint=sh bazel/tasks/hello:image
