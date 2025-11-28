import { sendEmail } from "../Shared/ses/email-sender.helper";

const PROJECT_EMAIL = process.env.PROJECT_EMAIL;

if (!PROJECT_EMAIL) throw new Error("PROJECT_EMAIL is not passed in env");

export const handler = async (event: {
  status: string;
  data: { userEmail: string };
}): Promise<{}> => {
  const userEmail = event.data.userEmail;
  await sendEmail(
    PROJECT_EMAIL,
    userEmail,
    `Leave Approval Status`,
    `Leave approval is Accepted, enjoy..:)`
  );
  return {};
};
