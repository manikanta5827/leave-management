import { handler } from "../../lambda-functions/LeaveApproval/app";

import Token from "../../lambda-functions/Shared/dynamo/models/tokenModel";
import { describe, expect, it } from "@jest/globals";
import { mockClient } from "aws-sdk-client-mock";
import { getSecret } from "../../lambda-functions/Shared/secrets-manager/helper/secrets-getter";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const sesMock = mockClient(SESClient);

jest.mock("../../lambda-functions/Shared/dynamo/models/tokenModel", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

jest.mock(
  "../../lambda-functions/Shared/secrets-manager/helper/secrets-getter"
);

describe("Testing leave approval lambda", () => {
  it("Send Admin mail about the approval", async () => {
    // mock token table
    (Token.create as jest.Mock).mockResolvedValue({});

    // mock ses
    sesMock.on(SendEmailCommand).resolves({
      MessageId: "Test MessageId",
    });

    // mock secrets manager
    (getSecret as jest.Mock).mockImplementation(
      async (secret_name: string, secret_key: string) => {
        switch (secret_key) {
          case "ADMIN_EMAIL":
            return "postbox5827@gmail.com";
          case "PROJECT_EMAIL":
            return "thummurimanikanta7@gmail.com";
          default:
            throw new Error(`${secret_key} :: secret_key is not valid`);
        }
      }
    );

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
