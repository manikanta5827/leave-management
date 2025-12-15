import Token from "../Shared/dynamo/models/tokenModel";
import { sendEmail } from "../Shared/ses/helper/email-sender";
import { InputPayload } from "./@types/input-request.types";
import { getSecret } from "../Shared/secrets-manager/helper/secrets-getter";

let ADMIN_EMAIL: string;
let PROJECT_EMAIL: string;

const secretsPromise = loadSecrets();

async function loadSecrets() {
  const [adminEmail, projectEmail] = await Promise.all([
    getSecret("admin_email", "ADMIN_EMAIL"),
    getSecret("project_email", "PROJECT_EMAIL"),
  ]);
  ADMIN_EMAIL = adminEmail;
  PROJECT_EMAIL = projectEmail;
}

export const handler = async (
  event: InputPayload
): Promise<{ status: string }> => {

  await secretsPromise;

  if (!ADMIN_EMAIL) throw new Error("ADMIN_EMAIL secret is missing");
  if (!PROJECT_EMAIL) throw new Error("PROJECT_EMAIL secret is missing");

  /* 
    store the token in db so that when admin accept responds back,
    that trigger lambda can fetch the token and resume the execution
  */
  console.log(JSON.stringify(event));
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
