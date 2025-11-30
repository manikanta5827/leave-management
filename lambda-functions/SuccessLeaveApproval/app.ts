import Token from "../Shared/dynamo/models/tokenModel";
import { sendEmail } from "../Shared/ses/helper/email-sender.helper";

const PROJECT_EMAIL = process.env.PROJECT_EMAIL;

if (!PROJECT_EMAIL) throw new Error("PROJECT_EMAIL is not passed in env");

export const handler = async (event: {
  status: string;
  data: { userEmail: string; requestId: string };
}): Promise<{}> => {
  console.log("event::", event);
  const userEmail = event.data.userEmail;
  const requestId = event.data.requestId;

  await Token.update({ requestId: requestId }, { status: "Success" });
  await sendEmail(
    PROJECT_EMAIL,
    userEmail,
    `Leave Approval Status`,
    `Leave approval is Accepted, enjoy..:)`
  );
  return {};
};
