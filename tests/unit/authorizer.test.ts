import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult,
} from "aws-lambda";
import { handler } from "../../lambda-functions/Authorizer/app";
import { expect, describe, it } from "@jest/globals";

describe("Test Authoriser lambda", () => {
  it("Return Allow for valid secret", async () => {
    let event = {
      type: "TOKEN",
      methodArn:
        "arn:aws:execute-api:ap-south-1:379322108250:w0hemsq6yh/Prod/POST/leave-approval",
      authorizationToken: "Bearer somesecret",
    };

    const result: APIGatewayAuthorizerResult = await handler(
      event as APIGatewayTokenAuthorizerEvent
    );

    expect(result.policyDocument.Statement[0].Effect).toBe("Allow");
  });

  it("Return 403 for invalid secret", async () => {
    let event = {
      type: "TOKEN",
      methodArn:
        "arn:aws:execute-api:ap-south-1:379322108250:w0hemsq6yh/Prod/POST/leave-approval",
      authorizationToken: "Bearer secret",
    };

    const result: APIGatewayAuthorizerResult = await handler(
      event as APIGatewayTokenAuthorizerEvent
    );

    expect(result.policyDocument.Statement[0].Effect).toBe("Deny");
  });
});
