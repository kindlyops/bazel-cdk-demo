package main

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// HandleRequest is the main entry point for the lambda processing.
func HandleRequest(ctx context.Context, request events.CodePipelineEvent) {
	fmt.Println("Lambda is running")

	return
}

func main() {
	lambda.Start(HandleRequest)
}
