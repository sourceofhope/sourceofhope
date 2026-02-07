// Send email via server API
export async function sendEmail(emailData) {
  const apiUrl = import.meta.env.DEV
    ? "http://localhost:3001/api/email/send"
    : "https://thesourceofhope.org/api/email/send";

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to send email");
  }

  return response.json();
}
