import Token from "../Shared/dynamo/models/tokenModel";
import { sendEmail } from "../Shared/ses/helper/email-sender.helper";
import { InputPayload } from "./@types/input-request.types";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const PROJECT_EMAIL = process.env.PROJECT_EMAIL;

if (!ADMIN_EMAIL) throw new Error("ADMIN_EMAIL is not passes in env");
if (!PROJECT_EMAIL) throw new Error("PROJECT_EMAIL is not passes in env");
export const handler = async (event: InputPayload): Promise<{}> => {
  /* 
    store the token in db so that when admin accept responds back,
    that trigger lambda can fetch the token and resume the execution
  */
  const token = event.TaskToken;
  const apiUrl = event.Payload.apiUrl;
  const userEmail = event.Payload.email;
  const noOfDays = event.Payload.noOfDays;
  const username = event.Payload.username;
  const reason = event.Payload.reason;
  const requestId = event.Context.Execution.Id;

  await Token.create({
    requestId: requestId,
    token: token,
    userEmail: userEmail,
    noOfDays: noOfDays,
    username: username,
    reason: reason,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // send email to admin with request id in url, so we can fetch the token back
  await sendEmail(
    PROJECT_EMAIL,
    ADMIN_EMAIL,
    `user leave request`,
    `user ${username} is requesting for ${noOfDays} days of leave
    if you want to approve click on this link ${apiUrl}/leave-response?requestId=${requestId}&status=accept or
    if you want to reject click on this link ${apiUrl}/leave-response?requestId=${requestId}&status=reject `
  );
  return {
    status: "success",
  };
};
