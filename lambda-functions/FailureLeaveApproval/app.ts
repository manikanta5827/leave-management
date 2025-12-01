import { sendEmail } from "../Shared/ses/helper/email-sender";
import Token from "../Shared/dynamo/models/tokenModel";
import { getSecret } from "../Shared/secrets-manager/helper/secrets-getter";

let PROJECT_EMAIL: string;

async function loadSecrets() {
  if (!PROJECT_EMAIL) PROJECT_EMAIL = await getSecret("PROJECT_EMAIL");
}

export const handler = async (event: {
  Error: string;
  Cause: string;
}): Promise<{ status: string; message: string }> => {
  // load secrets
  await loadSecrets();

  if (!PROJECT_EMAIL) throw new Error("PROJECT_EMAIL is not passes in env");

  console.log(event);
  const { userEmail, requestId } = JSON.parse(event.Cause) as {
    reason: string;
    userEmail: string;
    requestId: string;
  };

  await Token.update({ requestId: requestId }, { status: "Failed" });

  await sendEmail(
    PROJECT_EMAIL,
    userEmail,
    `Leave Approval Status`,
    `Leave approval is Rejected, Better luck next Time..:)`
  );
  return {
    status: "success",
    message: "Failure Leave approval send",
  };
};
