import * as ct from "@aws-cdk/aws-cloudtrail";
import * as cdk from "@aws-cdk/core";
import * as cb from "@aws-cdk/aws-codebuild";
import * as cp from "@aws-cdk/aws-codepipeline";
import * as cpa from "@aws-cdk/aws-codepipeline-actions";
import * as s3 from "@aws-cdk/aws-s3";
import * as cxapi from "@aws-cdk/cx-api";
import * as lambda from "@aws-cdk/aws-lambda";
import * as asset from "@aws-cdk/aws-s3-assets";
import { stringToCloudFormation } from "@aws-cdk/core";
import { CfnParametersCode } from "@aws-cdk/aws-lambda";
import { DeployableStack } from "./deployable";

interface CodeBuildExampleStackProps extends cdk.StackProps {
  repoOwner: string;
  repo: string;
  branch: string;
  builderProjectName: string;
  stacks: Array<DeployableStack>;
  /**
   * The runOrder for the CodePipeline action creating the ChangeSet.
   *
   * @default 1
   */
  readonly createChangeSetRunOrder?: number;

  /**
   * The runOrder for the CodePipeline action executing the ChangeSet.
   *
   * @default ``createChangeSetRunOrder + 1``
   */
  readonly executeChangeSetRunOrder?: number;
}

export class CodeBuildExampleStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props: CodeBuildExampleStackProps
  ) {
    super(scope, id, props);

    // simplest possible codebuild has no source, so requires a buildspec
    const codebuild = new cb.Project(this, "NoSourceCodeBuild", {
      buildSpec: cb.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          build: {
            commands: ['echo "whats up youtube!"']
          }
        }
      })
    });

    // codebuild with a connection to GitHubSource
    const gitHubSource = cb.Source.gitHub({
      owner: props.repoOwner,
      repo: props.repo,
      webhook: true,
      webhookFilters: [
        cb.FilterGroup.inEventOf(cb.EventAction.PUSH).andBranchIs(props.branch)
      ]
    });

    const buildEnvironment: cb.BuildEnvironment = {
      buildImage: cb.LinuxBuildImage.STANDARD_2_0
    };

    const artifactBucket = new s3.Bucket(this, "CodeBuildArtifacts", {
      versioned: true,
      encryption: s3.BucketEncryption.KMS_MANAGED
    });

    const artifactPrefix = "codebuild";
    const artifactName = "stacks.zip";
    const artifactKey = artifactPrefix + "/" + artifactName;
    const createChangeSetRunOrder = props.createChangeSetRunOrder || 1;
    const executeChangeSetRunOrder =
      props.executeChangeSetRunOrder || createChangeSetRunOrder + 1;

    // To use s3 event triggers rather than polling with CodePipeline,
    // we must use a cloud trail.
    // https://docs.aws.amazon.com/codepipeline/latest/userguide/create-cloudtrail-S3-source.html
    // https://docs.aws.amazon.com/cdk/api/latest/python/aws_cdk.aws_codepipeline_actions.README.html#aws-s3
    const cloudTrail = new ct.Trail(this, "PipelineEventTrigger");
    cloudTrail.addS3EventSelector([artifactBucket.arnForObjects(artifactKey)], {
      readWriteType: ct.ReadWriteType.WRITE_ONLY
    });

    // excerpt from https://docs.aws.amazon.com/cdk/api/latest/docs/aws-codebuild-readme.html
    // before this is deployed, you have to visit AWS CodeBuild Console to
    // connect GitHub or call ImportSourceCredentials in order to persist
    // an access token
    // aws codebuild import-source-credentials --server-type GITHUB --auth-type PERSONAL_ACCESS_TOKEN --token <token_value>
    // see also https://docs.aws.amazon.com/codebuild/latest/userguide/sample-access-tokens.html
    const codebuild2 = new cb.Project(this, "GitHubSourceCodeBuild", {
      source: gitHubSource,
      buildSpec: cb.BuildSpec.fromSourceFilename(".codebuild/cdk-build.yml"),
      badge: true,
      cache: cb.Cache.local(
        cb.LocalCacheMode.DOCKER_LAYER,
        cb.LocalCacheMode.CUSTOM,
        cb.LocalCacheMode.SOURCE
      ),
      environment: buildEnvironment,
      projectName: props.builderProjectName,
      artifacts: cb.Artifacts.s3({
        path: artifactPrefix,
        name: artifactName,
        bucket: artifactBucket,
        // we set this to false to make it easier to trigger CodePipelines from these artifacts
        includeBuildId: false
      })
    });

    // TODO: add a secondary output artifact that contains all the lambda zips
    // then add an S3DeployAction that extracts those zips into s3.

    const pipelineOutput = new cp.Artifact();

    const infraPipeline = new cp.Pipeline(this, "InfraPipeline", {
      artifactBucket: artifactBucket,
      restartExecutionOnUpdate: true // needed for self-updating pipelines
    });

    infraPipeline.addStage({
      stageName: "Source",
      actions: [
        new cpa.S3SourceAction({
          actionName: "sourceArtifactArrived",
          bucket: artifactBucket,
          bucketKey: artifactKey,
          trigger: cpa.S3Trigger.EVENTS,
          output: pipelineOutput
        })
      ]
    });

    const test = infraPipeline.addStage({ stageName: "Changeset" });

    // each stack has an action, actions run in parallel
    for (const stack of props.stacks) {
      this.addStackChangesetActions(
        test,
        stack,
        pipelineOutput,
        createChangeSetRunOrder
      );
    }
  }

  getParameterOverrides(
    stack: DeployableStack,
    input: cp.Artifact
  ): { [name: string]: any } {
    // walk the Construct tree looking for assets metadata
    // const stuff = stack.node.findAll();
    // let parameters = {} as { [name: string]: any };
    // for (const item of stuff) {
    //   if (item instanceof lambda.Function) {
    //     //const code = item.assign() as CfnParametersCode;
    //     //item.props.code.assign(input.atPath("dist/foo.zip"));
    //     parameters[`${stack.stackName}AssetBucketName`] = input.bucketName;
    // parameters[
    //   `${stack.stackName}${item.node.id}LambdaCode`
    //   // this is generating an invalid parameterOverride
    //   // TODO: debug why using input.atPath is generating super bogus CFN code
    //   // see what it does for templatePath as a contrast
    //   //] = input.atPath(`lambdas/${item.node.id}/lambda.zip`);
    // ] = `Artifact_Source_sourceArtifactArrived::lambdas/monitor/lambda.zip`;
    // We may also need a codepipeline S3 delivery action to pull this lambda zip out of the stacks.zip and drop it in S3

    // This approach using CDK Assets turned into a complicated battle to
    // undo some of what CDK was trying to do automatically.

    // for (const resource of item.node.children) {
    //   if (resource instanceof asset.Asset) {
    //     const md = resource.node.metadata.filter(
    //       md => md.type === cxapi.ASSET_METADATA
    //     );
    //     if (md.length > 1) {
    //       throw new Error(
    //         `Unexpected extra Lambda function asset metadata in ${stack.stackName}`
    //       );
    //     }
    //     const lambdaData = md[0].data;
    // parameters[lambdaData.s3KeyParameter] = lambdaData.path;
    // parameters[lambdaData.s3BucketParameter] = input.bucketName;
    // }
    //   }
    // }
    let parameters = {} as { [name: string]: any };
    for (const item of stack.lambdaCodes) {
      const result = item.code.assign({
        bucketName: input.bucketName,
        objectKey: input.atPath(`services/${item.name}/lambda.zip`).location
      });
      parameters = { ...parameters, ...result };
    }
    return parameters;
  }

  addStackChangesetActions(
    stage: cp.IStage,
    stack: DeployableStack,
    input: cp.Artifact,
    runOrder: number
  ): void {
    const overrides = this.getParameterOverrides(stack, input);
    const create = new cpa.CloudFormationCreateReplaceChangeSetAction({
      actionName: `${stack}Prepare`,
      stackName: stack.stackName,
      changeSetName: `${stack}ChangeSet`,
      adminPermissions: true,
      parameterOverrides: overrides,
      //templateConfiguration: input.atPath(`${stack}.template.parameters`),
      // TODO: role: role,
      templatePath: input.atPath(`${stack}.template.json`),
      runOrder: runOrder
      // TODO: is extraInputs needed?
    });
    // TODO: cross-environment actions are coming in the next release after cdk 1.8
    // https://github.com/aws/aws-cdk/pull/3694
    stage.addAction(create);
  }
}
