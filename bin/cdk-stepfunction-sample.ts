#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkStepfunctionSampleStack } from '../lib/cdk-stepfunction-sample-stack';

const app = new cdk.App();
new CdkStepfunctionSampleStack(app, 'CdkStepfunctionSampleStack');
