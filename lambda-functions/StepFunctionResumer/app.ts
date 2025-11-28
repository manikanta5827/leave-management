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
  try {
    const { requestId, status } = event.queryStringParameters as {
      requestId: string;
      status: string;
    };

    // fetch token from Token table using requestId
    const data = await Token.get({ requestId });
    const token = data.token;
    const userEmail = data.userEmail;

    console.log("status:: ", status);
    if (status == "accept") {
      const command = new SendTaskSuccessCommand({
        taskToken: token,
        output: JSON.stringify({
          status: "APPROVED",
          data: {
            userEmail: userEmail,
          },
        }),
      });

      await sfnClient.send(command);
    } else {
      const command = new SendTaskFailureCommand({
        taskToken: token,
        error: "ApprovalRejected",
        cause: JSON.stringify({
          reason: "Admin rejected the request",
          userEmail,
        }),
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
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Something went wrong",
        time: new Date().toISOString(),
      }),
    };
  }
};
