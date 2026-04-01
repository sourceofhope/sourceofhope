import { post } from "./client";

export async function sendEmail(emailData) {
  const response = await post("/email/send", emailData);

  if (response.error) {
    throw new Error(response.error || "Failed to send email");
  }

  return response.data;
}
