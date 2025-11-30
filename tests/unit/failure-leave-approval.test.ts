import { handler } from "../../lambda-functions/FailureLeaveApproval/app";

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

describe("failure leave approval lambda Test", () => {
  it("Send Email and update db", async () => {
    // mock token table update command
    (Token.update as jest.Mock).mockResolvedValue({});

    // mock ses send email command
    sesMock.on(SendEmailCommand).resolves({
      MessageId: "Test MessageId",
    });

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
