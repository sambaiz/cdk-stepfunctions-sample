package main

import (
	"github.com/aws/aws-lambda-go/lambda"
)

type Input struct {
	Retry int `json:"retry"`
	Value int `json:"value"`
}

type Output struct {
	Retry int `json:"retry"`
	Total int `json:"total"`
}

func handler(ins []Input) (Output, error) {
	retry := 0
	total := 0
	for _, in := range ins {
		retry = in.Retry
		total += in.Value
	}
	return Output{Retry: retry + 1, Total: total}, nil
}

func main() {
	lambda.Start(handler)
}
