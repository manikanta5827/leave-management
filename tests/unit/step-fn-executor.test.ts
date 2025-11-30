import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handler } from "../../lambda-functions/StepFunctionExecutor/app";
import { expect, describe, it } from "@jest/globals";
import { mockClient } from "aws-sdk-client-mock";
import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";

import { readFileSync } from "node:fs";
import path from "node:path";
const event: APIGatewayProxyEvent = JSON.parse(
  readFileSync(
    path.join(__dirname + "/../events/step-fn-executor.event.json"),
    "utf8"
  )
);

// console.log("event:: ", event);
const sfnMock = mockClient(SFNClient);

describe("Test step fn executor lambda", () => {
  it("send all required fields return 200", async () => {
    sfnMock.on(StartExecutionCommand).resolves({
      executionArn: "some-arn",
    });

    let result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(200);

    let body = JSON.parse(result.body);
    expect(body.executionArn).toBeDefined();
  });

  it("return 400 for no username", async () => {
    sfnMock.on(StartExecutionCommand).resolves({
      executionArn: "some-arn",
    });

    let body = JSON.parse(event.body as string);
    delete body.username;
    event.body = JSON.stringify(body);

    let result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(400);

    body = JSON.parse(result.body);
    console.log(body);
    expect(body.message).toBe("username is required");
  });
});
