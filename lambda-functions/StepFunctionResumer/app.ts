import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  SendTaskSuccessCommand,
  SendTaskFailureCommand,
} from "@aws-sdk/client-sfn";
import { sfnClient } from "./Config/stepfunction.config";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event);

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
    body: "Step function resumed successfully",
  };
};
