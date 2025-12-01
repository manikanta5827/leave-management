import { handler } from "../../lambda-functions/FailureLeaveApproval/app";

import Token from "../../lambda-functions/Shared/dynamo/models/tokenModel";
import { describe, expect, it } from "@jest/globals";
import { mockClient } from "aws-sdk-client-mock";
import { getSecret } from "../../lambda-functions/Shared/secrets-manager/helper/secrets-getter";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
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

describe("failure leave approval lambda Test", () => {
  it("Send Email and update db", async () => {
    // mock token table update command
    (Token.update as jest.Mock).mockResolvedValue({});

    // mock ses send email command
    sesMock.on(SendEmailCommand).resolves({
      MessageId: "Test MessageId",
    });

    // mock secrets manager
    (getSecret as jest.Mock).mockImplementation(
      async (secret_name: string, secret_key: string) => {
        switch (secret_key) {
          case "PROJECT_EMAIL":
            return "thummurimanikanta7@gmail.com";
          default:
            throw new Error(`${secret_key} :: secret_key is not valid`);
        }
      }
    );

    let event = {
      Error: "Test error",
      Cause:
        '{\n    "reason": "nandha",\n    "userEmail": "eldrago5827@gmail.com",\n    "requestId": "health"\n}',
    };
    const result = await handler(event);

    expect(result.status).toBe("success");
    expect(result.message).toBe("Failure Leave approval send");
  });
});
