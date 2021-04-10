import * as cdk from '@aws-cdk/core';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as tasks from '@aws-cdk/aws-stepfunctions-tasks';
import { Function, Code, Runtime } from '@aws-cdk/aws-lambda';
import * as path from 'path'

export class CdkStepfunctionSampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fetchScoreFunction = new Function(this, 'FetchScoreFunction', {
      runtime: Runtime.GO_1_X,
      code: Code.fromAsset(path.join(__dirname, 'lambda', 'fetchScore')),
      handler: "main"
    })

    const invokeFetchScoreFunction1 = new tasks.LambdaInvoke(this, 'Invoke FetchScoreFunction1', {
      lambdaFunction: fetchScoreFunction,
      outputPath: '$.Payload',
      retryOnServiceExceptions: false,
    })

    const invokeFetchScoreFunction2 = new tasks.LambdaInvoke(this, 'Invoke FetchScoreFunction2', {
      lambdaFunction: fetchScoreFunction,
      outputPath: '$.Payload',
      retryOnServiceExceptions: false,
    })

    const fetchScores = new sfn.Parallel(this, 'Fetch Scores').branch(
      invokeFetchScoreFunction1,
      invokeFetchScoreFunction2
    )

    const makeSummaryFunction = new Function(this, 'MakeSummaryFunction', {
      runtime: Runtime.GO_1_X,
      code: Code.fromAsset(path.join(__dirname, 'lambda', 'makeSummary')),
      handler: "main"
    })

    const invokeMakeSummaryFunction = new tasks.LambdaInvoke(this, 'Invoke MakeSummaryFunction', {
      lambdaFunction: makeSummaryFunction,
      outputPath: '$.Payload',
      retryOnServiceExceptions: false,
    })

    const definition = fetchScores.next(
      invokeMakeSummaryFunction
    ).next(
      new sfn.Choice(this, 'Check total is over 14')
        .when(sfn.Condition.numberGreaterThan('$.retry', 5),
          new sfn.Fail(this, 'Job Failed', {
            cause: 'AWS Batch Job Failed',
            error: 'DescribeJob returned FAILED',
          })
        )
        .when(sfn.Condition.numberLessThanEquals('$.total', 14), fetchScores)
        .otherwise(new sfn.Succeed(this, 'Job Succeeded'))
    )
  
    new sfn.StateMachine(this, 'StateMachine', {
      definition,
      timeout: cdk.Duration.minutes(5)
    });
  }
}
