import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  SendTaskSuccessCommand,
  SendTaskFailureCommand,
} from "@aws-sdk/client-sfn";
import Token from "../Shared/dynamo/models/tokenModel";
import { sfnClient } from "../Shared/step-function/config/client";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log(JSON.stringify(event));
    const { requestId, status } = event.queryStringParameters as {
      requestId: string;
      status: string;
    };

    // fetch token from Token table using requestId
    const data = await Token.get({ requestId });
    const token = data.token;
    const userEmail = data.userEmail;

    if (status == "accept") {
      const command = new SendTaskSuccessCommand({
        taskToken: token,
        output: JSON.stringify({
          status: "APPROVED",
          data: {
            userEmail: userEmail,
            requestId: requestId,
          },
        }),
      });

      await sfnClient.send(command);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Approval Status send",
          time: new Date().toISOString(),
        }),
      };
    } else {
      const command = new SendTaskFailureCommand({
        taskToken: token,
        error: "ApprovalRejected",
        cause: JSON.stringify({
          reason: "Admin rejected the request",
          userEmail,
          requestId,
        }),
      });

      await sfnClient.send(command);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Reject Status send",
          time: new Date().toISOString(),
        }),
      };
    }
  } catch (error) {
    console.log(error);
    const errorName =
      error instanceof Error ? error.name : "Something went wrong";

    if (errorName === "TaskTimedOut") {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Leave Task doesn't exist or expired",
          time: new Date().toISOString(),
        }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Something went wrong",
        time: new Date().toISOString(),
      }),
    };
  }
};
