import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../Config/ses-client.config";

export async function sendEmail(
  sender: string,
  receiver: string,
  subject: string,
  body: string
): Promise<void> {
  const params = {
    Source: sender,
    Destination: {
      ToAddresses: [receiver],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Text: {
          Data: body,
        },
      },
    },
  };

  try {
    const result = await sesClient.send(new SendEmailCommand(params));
    console.log("Email sent:", result.MessageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
