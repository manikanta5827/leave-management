import { sendEmail } from "../Shared/ses/helper/email-sender";
import Token from "../Shared/dynamo/models/tokenModel";

const PROJECT_EMAIL = process.env.PROJECT_EMAIL;

if (!PROJECT_EMAIL) throw new Error("PROJECT_EMAIL is not passes in env");

export const handler = async (event: {
  Error: string;
  Cause: string;
}): Promise<{ status: string; message: string }> => {
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
