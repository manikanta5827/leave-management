import { handler } from "../../lambda-functions/SuccessLeaveApproval/app";

import Token from "../../lambda-functions/Shared/dynamo/models/tokenModel";
import { describe, expect, it } from "@jest/globals";
import { mockClient } from "aws-sdk-client-mock";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const sesMock = mockClient(SESClient);

jest.mock("../../lambda-functions/Shared/dynamo/models/tokenModel", () => ({
  __esModule: true,
  default: {
    update: jest.fn(),
  },
}));

describe("success leave approval lambda Test", () => {
  it("Send Email and update db", async () => {
    // mock token table update command
    (Token.update as jest.Mock).mockResolvedValue({});

    // mock ses send email command
    sesMock.on(SendEmailCommand).resolves({
      MessageId: "Test MessageId",
    });

    let event = {
      status: "APPROVED",
      data: {
        userEmail: "test user-email",
        requestId: "test request id",
      },
    };
    const result = await handler(event);

    expect(result.status).toBe("success");
    expect(result.message).toBe("Success Leave approval send");
  });
});
