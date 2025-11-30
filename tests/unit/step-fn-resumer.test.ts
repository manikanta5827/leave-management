import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handler } from "../../lambda-functions/StepFunctionResumer/app";
import Token from "../../lambda-functions/Shared/dynamo/models/tokenModel";
import { expect, it } from "@jest/globals";
import { mockClient } from "aws-sdk-client-mock";
import {
  SFNClient,
  SendTaskSuccessCommand,
  SendTaskFailureCommand,
} from "@aws-sdk/client-sfn";

const sfnMock = mockClient(SFNClient);

import { readFileSync } from "node:fs";
import path from "node:path";
const event: APIGatewayProxyEvent = JSON.parse(
  readFileSync(
    path.join(__dirname + "/../events/step-fn-resumer.event.json"),
    "utf8"
  )
);

jest.mock("../../lambda-functions/Shared/dynamo/models/tokenModel", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("Test step fn resumer lambda", () => {
  it("Admin accept the approval", async () => {
    // mock dynamoose library get method
    (Token.get as jest.Mock).mockResolvedValue({
      token: "test-token",
      userEmail: "test@email.com",
    });

    // mock sfn success command
    sfnMock.on(SendTaskSuccessCommand).resolves({});

    let result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(200);
    let body = JSON.parse(result.body);
    expect(body.message).toBe("Approval Status send");
  });

  it("Admin reject the approval", async () => {
    // mock dynamoose library get method
    (Token.get as jest.Mock).mockResolvedValue({
      token: "test-token",
      userEmail: "test@email.com",
    });

    // mock sfn success command
    sfnMock.on(SendTaskFailureCommand).resolves({});

    if (!event.queryStringParameters) {
      event.queryStringParameters = {};
    }
    event.queryStringParameters.status = "reject";

    let result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(200);
    let body = JSON.parse(result.body);
    expect(body.message).toBe("Reject Status send");
  });
});
