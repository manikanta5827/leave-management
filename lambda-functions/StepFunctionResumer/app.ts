import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  SendTaskSuccessCommand,
  SendTaskFailureCommand,
} from "@aws-sdk/client-sfn";
import Token from "../Shared/dynamo/tokenModel";
import { sfnClient } from "../Shared/step-function/client";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { requestId, status } = event.queryStringParameters as {
    requestId: string;
    status: string;
  };

  // fetch token from Token table using requestId
  const data = await Token.get({ requestId });
  const token = data.token;

  if (status == "accept") {
    const command = new SendTaskSuccessCommand({
      taskToken: token,
      output: JSON.stringify({
        status: "APPROVED",
        data: "accept",
      }),
    });

    await sfnClient.send(command);
  } else {
    const command = new SendTaskFailureCommand({
      taskToken: token,
      error: "ApprovalRejected",
      cause: JSON.stringify({ reason: "Admin rejected the request" }),
    });

    await sfnClient.send(command);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Status send",
      time: new Date().toISOString(),
    }),
  };
};
