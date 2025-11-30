import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { startStepFunctionExecution } from "./helper/sfn-execution.helper";
import { InputPayload } from "./@types/input-request.types";

const STATE_MACHINE_ARN = process.env.STATE_MACHINE_ARN;

if (!STATE_MACHINE_ARN)
  throw new Error("STATE_MACHINE_ARN is not passed in env");

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    let body = JSON.parse(event.body as string);
    console.log("body", body);
    body.apiUrl = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;

    const { email, username, noOfDays, reason } = body as InputPayload;

    if (!email) {
      return sendResponse(400, {
        status: "error",
        message: "email is required",
      });
    }

    if (!username) {
      return sendResponse(400, {
        status: "error",
        message: "username is required",
      });
    }

    if (!noOfDays || noOfDays < 0) {
      return sendResponse(400, {
        status: "error",
        message: "noOfDays is required",
      });
    }

    if (!reason) {
      return sendResponse(400, {
        status: "error",
        message: "reason is required",
      });
    }

    const result = await startStepFunctionExecution(STATE_MACHINE_ARN, body);

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "success",
        executionArn: result.executionArn,
      }),
    };
  } catch (err) {
    console.error(err);
    return sendResponse(500, {
      status: "failed",
      message: "Step function triggering failed",
    });
  }
};

function sendResponse(
  statusCode: number,
  body: { status: string; message: string }
) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
  };
}
