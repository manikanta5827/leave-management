import {
  StartExecutionCommand,
  StartExecutionCommandOutput,
} from "@aws-sdk/client-sfn";
import { sfnClient } from "../Config/stepfunction.config";

export const startStepFunctionExecution = async (
  stateMachineArn: string,
  body: any
): Promise<StartExecutionCommandOutput> => {
  const command = new StartExecutionCommand({
    stateMachineArn: stateMachineArn,
    input: JSON.stringify(body ? body : {}),
  });

  const result = await sfnClient.send(command);
  return result;
};
