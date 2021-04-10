package main

import (
	"math/rand"

	"github.com/aws/aws-lambda-go/lambda"
)

type Input struct {
	Retry int `json:"retry"`
}

type Output struct {
	Retry int `json:"retry"`
	Value int `json:"value"`
}

func handler(in Input) (Output, error) {
	return Output{Retry: in.Retry + 1, Value: rand.Intn(10)}, nil
}

func main() {
	lambda.Start(handler)
}
