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
  // console.log(event);

  const { requestId, status } = event.queryStringParameters as {
    requestId: string;
    status: string;
  };

  // fetch token from Token table using requestId
  const data = await Token.get({ requestId });
  // const token = data.token;
  console.log(data);
  console.log(status);

  // const { taskToken, result } = JSON.parse(event.body as string);

  // if (!taskToken) {
  //   throw new Error("Missing taskToken");
  // }

  // const command = new SendTaskSuccessCommand({
  //   taskToken,
  //   output: JSON.stringify({
  //     status: "APPROVED",
  //     data: result,
  //   }),
  // });

  // await sfnClient.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify(event),
  };
};
