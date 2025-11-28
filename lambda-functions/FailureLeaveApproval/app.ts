import { sendEmail } from "../Shared/ses/email-sender.helper";

const PROJECT_EMAIL = process.env.PROJECT_EMAIL;

if (!PROJECT_EMAIL) throw new Error("PROJECT_EMAIL is not passes in env");

export const handler = async (event: {
  Error: string;
  Cause: string;
}): Promise<{}> => {
  const { userEmail } = JSON.parse(event.Cause) as {
    reason: string;
    userEmail: string;
  };

  await sendEmail(
    PROJECT_EMAIL,
    userEmail,
    `Leave Approval Status`,
    `Leave approval is Rejected, Better luck next Time..:)`
  );
  return {};
};
