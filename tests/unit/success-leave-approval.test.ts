import { handler } from "../../lambda-functions/SuccessLeaveApproval/app";

import Token from "../../lambda-functions/Shared/dynamo/models/tokenModel";
import { describe, expect, it } from "@jest/globals";
import { mockClient } from "aws-sdk-client-mock";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { getSecret } from "../../lambda-functions/Shared/secrets-manager/helper/secrets-getter";
const sesMock = mockClient(SESClient);

jest.mock("../../lambda-functions/Shared/dynamo/models/tokenModel", () => ({
  __esModule: true,
  default: {
    update: jest.fn(),
  },
}));

jest.mock(
  "../../lambda-functions/Shared/secrets-manager/helper/secrets-getter"
);

describe("success leave approval lambda Test", () => {
  it("Send Email and update db", async () => {
    // mock token table update command
    (Token.update as jest.Mock).mockResolvedValue({});

    // mock ses send email command
    sesMock.on(SendEmailCommand).resolves({
      MessageId: "Test MessageId",
    });

    // mock secrets manager
    (getSecret as jest.Mock).mockImplementation(async (secret_key: string) => {
      switch (secret_key) {
        case "PROJECT_EMAIL":
          return "thummurimanikanta7@gmail.com";
        default:
          throw new Error(`${secret_key} :: secret_key is not valid`);
      }
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
