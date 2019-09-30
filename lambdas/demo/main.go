package main

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/endpoints"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/secretsmanager"
)

// load the GitHub Oauth token when the lambda is loaded, not on every execution
// this reduces the call volume into SecretsManager
var gitHubToken string = getGitHubToken()

func getGitHubToken() string {
	secretName := "/github/access-token"
	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String(endpoints.UsWest2RegionID),
	}))

	svc := secretsmanager.New(sess)
	input := &secretsmanager.GetSecretValueInput{
		SecretId: aws.String(secretName),
	}

	result, err := svc.GetSecretValue(input)

	if err != nil {
		_ = fmt.Errorf("unable to retrieve GitHub auth token: %s", err.Error())
		return ""
	}

	return *result.SecretString
}

// HandleRequest is the main entry point for the lambda processing.
func HandleRequest(ctx context.Context, request events.CodePipelineEvent) {
	fmt.Println("Lambda is running")

	return
}

func main() {
	lambda.Start(HandleRequest)
}
