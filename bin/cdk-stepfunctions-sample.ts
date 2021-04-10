#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkStepfunctionsSampleStack } from '../lib/cdk-stepfunctions-sample-stack';

const app = new cdk.App();
new CdkStepfunctionsSampleStack(app, 'CdkStepfunctionSampleStack');
