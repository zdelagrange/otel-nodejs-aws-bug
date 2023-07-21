# Overview  
## Description
When using the recomended nodejs autoinstrumentation set up found here: https://opentelemetry.io/docs/instrumentation/js/getting-started/nodejs/#setup, 
While having a global S3 configuration, the autoinstrumentation causes an error to be thrown when the AWS_REGION is set to a region that is not `us-east-1` or `aws-global`. 
The requests will succeed when the instrumentation.js is not required.
## requirements
* aws-sdk v2
* s3 global configuration
## Reproduction steps
* pull the repository
* run `npm install`
### Request works without setting AWS_REGION and not requiring the instrumentation.js
```agsl
BUCKET=bucket_name KEY=path/to/file node ./index.js
s3.amazonaws.com
calling s3.getObject with params: {"Bucket":"bucket","Key":"path/to/file"}
(node:32015) NOTE: We are formalizing our plans to enter AWS SDK for JavaScript (v2) into maintenance mode in 2023.

Please migrate your code to use AWS SDK for JavaScript (v3).
For more information, check the migration guide at https://a.co/7PzMCcy
(Use `node --trace-warnings ...` to show where the warning was created)
Success!
```
### Request works setting AWS_REGION=us-east-1 and not requiring the instrumentation.js
```agsl
BUCKET=bucket_name KEY=path/to/file AWS_REGION=us-east-1 node ./index.js
s3.amazonaws.com
calling s3.getObject with params: {"Bucket":"bucket","Key":"path/to/file"}
(node:32273) NOTE: We are formalizing our plans to enter AWS SDK for JavaScript (v2) into maintenance mode in 2023.

Please migrate your code to use AWS SDK for JavaScript (v3).
For more information, check the migration guide at https://a.co/7PzMCcy
(Use `node --trace-warnings ...` to show where the warning was created)
Success!
```
### Request works setting AWS_REGION=us-west-1 and not requiring the instrumentation.js
```agsl
BUCKET=bucket_name KEY=path/to/file AWS_REGION=us-west-1 node ./index.js
s3.us-west-1.amazonaws.com
calling s3.getObject with params: {"Bucket":"bucket","Key":"path/to/file"}
(node:32541) NOTE: We are formalizing our plans to enter AWS SDK for JavaScript (v2) into maintenance mode in 2023.

Please migrate your code to use AWS SDK for JavaScript (v3).
For more information, check the migration guide at https://a.co/7PzMCcy
(Use `node --trace-warnings ...` to show where the warning was created)
Success!
```
### Request works setting AWS_REGION=us-east-1 and requiring the instrumentation.js
```agsl
BUCKET=bucket_name KEY=path/to/file AWS_REGION=us-east-1 node --require ./instrumentation.js ./index.js
s3.amazonaws.com
calling s3.getObject with params: {"Bucket":"bucket","Key":"path/to/file"}
(node:32801) NOTE: We are formalizing our plans to enter AWS SDK for JavaScript (v2) into maintenance mode in 2023.

Please migrate your code to use AWS SDK for JavaScript (v3).
For more information, check the migration guide at https://a.co/7PzMCcy
(Use `node --trace-warnings ...` to show where the warning was created)
Success!
```
### Request FAILS setting AWS_REGION=us-west-1 and requiring the instrumentation.js
```agsl
BUCKET=bucket_name KEY=path/to/file AWS_REGION=us-west-1 node --require ./instrumentation.js ./index.js
s3.us-west-1.amazonaws.com
calling s3.getObject with params: {"Bucket":"bucket","Key":"path/to/file"}
(node:33059) NOTE: We are formalizing our plans to enter AWS SDK for JavaScript (v2) into maintenance mode in 2023.

Please migrate your code to use AWS SDK for JavaScript (v3).
For more information, check the migration guide at https://a.co/7PzMCcy
(Use `node --trace-warnings ...` to show where the warning was created)
/Users/zdelagrange/src/otel-nodejs-aws-bug/node_modules/aws-sdk/lib/request.js:31
            throw err;
            ^

SignatureDoesNotMatch: The request signature we calculated does not match the signature you provided. Check your key and signing method.
    at Request.extractError (/Users/zdelagrange/src/otel-nodejs-aws-bug/node_modules/aws-sdk/lib/services/s3.js:711:35)
    at Request.callListeners (/Users/zdelagrange/src/otel-nodejs-aws-bug/node_modules/aws-sdk/lib/sequential_executor.js:106:20)
    at Request.emit (/Users/zdelagrange/src/otel-nodejs-aws-bug/node_modules/aws-sdk/lib/sequential_executor.js:78:10)
    at Request.emit (/Users/zdelagrange/src/otel-nodejs-aws-bug/node_modules/aws-sdk/lib/request.js:686:14)
    at Request.transition (/Users/zdelagrange/src/otel-nodejs-aws-bug/node_modules/aws-sdk/lib/request.js:22:10)
    at AcceptorStateMachine.runTo (/Users/zdelagrange/src/otel-nodejs-aws-bug/node_modules/aws-sdk/lib/state_machine.js:14:12)
    at /Users/zdelagrange/src/otel-nodejs-aws-bug/node_modules/aws-sdk/lib/state_machine.js:26:10
    at Request.<anonymous> (/Users/zdelagrange/src/otel-nodejs-aws-bug/node_modules/aws-sdk/lib/request.js:38:9)
    at Request.<anonymous> (/Users/zdelagrange/src/otel-nodejs-aws-bug/node_modules/aws-sdk/lib/request.js:688:12)
    at Request.callListeners (/Users/zdelagrange/src/otel-nodejs-aws-bug/node_modules/aws-sdk/lib/sequential_executor.js:116:18) {
  code: 'SignatureDoesNotMatch',
  region: null,
  time: 2023-07-21T14:49:13.821Z,
  requestId: 'xxx',
  extendedRequestId: 'xxx',
  cfId: undefined,
  statusCode: 403,
  retryable: false,
  retryDelay: 175.4145547667371
}
```