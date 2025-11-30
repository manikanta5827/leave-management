import { handler } from "../../lambda-functions/LeaveApproval/app";

import Token from "../../lambda-functions/Shared/dynamo/models/tokenModel";
import { describe, expect, it } from "@jest/globals";
import { mockClient } from "aws-sdk-client-mock";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const sesMock = mockClient(SESClient);

jest.mock("../../lambda-functions/Shared/dynamo/models/tokenModel", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

describe("Testing leave approval lambda", () => {
  it("Send Admin mail about the approval", async () => {
    // mock token table
    (Token.create as jest.Mock).mockResolvedValue({});

    // mock ses
    sesMock.on(SendEmailCommand).resolves({
      MessageId: "Test MessageId",
    });

    let event = {
      TaskToken: "Test token",
      Payload: {
        apiUrl: "Test api url",
        email: "Test email",
        noOfDays: 2,
        username: "Test username",
        reason: "Test reason",
      },
      Context: {
        Execution: {
          Id: " Test Id",
        },
      },
    };

    let result = await handler(event);

    expect(result.status).toBe("success");
  });
});
