import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";

const client = new SFNClient({});

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log(
      `step function executor lambda triggered ${new Date().toDateString()}`
    );
    const command = new StartExecutionCommand({
      stateMachineArn: process.env.STATE_MACHINE_ARN,
      input: JSON.stringify(event.body ? JSON.parse(event.body) : {}),
    });

    const result = await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "success",
        executionArn: result.executionArn,
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: "failed",
        message: "Step function execution failed",
      }),
    };
  }
};
