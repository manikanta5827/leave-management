import Token from "../Shared/dynamo/models/tokenModel";
import { sendEmail } from "../Shared/ses/helper/email-sender";
import { getSecret } from "../Shared/secrets-manager/helper/secrets-getter";

let PROJECT_EMAIL: string;

async function loadSecrets() {
  if (!PROJECT_EMAIL) PROJECT_EMAIL = await getSecret("PROJECT_EMAIL");
}

export const handler = async (event: {
  status: string;
  data: { userEmail: string; requestId: string };
}): Promise<{ status: string; message: string }> => {
  // load secrets
  await loadSecrets();
  
  if (!PROJECT_EMAIL) throw new Error("PROJECT_EMAIL is not passed in env");

  console.log(event);
  const userEmail = event.data.userEmail;
  const requestId = event.data.requestId;

  await Token.update({ requestId: requestId }, { status: "Success" });
  await sendEmail(
    PROJECT_EMAIL,
    userEmail,
    `Leave Approval Status`,
    `Leave approval is Accepted, enjoy..:)`
  );
  return {
    status: "success",
    message: "Success Leave approval send",
  };
};
