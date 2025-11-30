import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handler } from "../../lambda-functions/StepFunctionResumer/app";
import Token from "../../lambda-functions/Shared/dynamo/models/tokenModel";
import { it } from "@jest/globals";

jest.mock("../../lambda-functions/Shared/dynamo/models/tokenModel", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}));

describe("Test step fn resumer lambda", () => {
  it("Test accept api", () => {
    (Token.get as jest.Mock).mockResolvedValue({
      token: "test-token",
      userEmail: "test@email.com",
    });
  });
});
