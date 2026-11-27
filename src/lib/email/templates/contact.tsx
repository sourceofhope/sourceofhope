import { EmailHeading, EmailLayout, EmailText } from "../layout";

/* The staff notice for a contact-form message (slice 3.5). Staff-facing, English. */
export function ContactNotificationEmail({ name, email, phone, topic, message }: { name: string; email: string; phone: string | null; topic: string; message: string }) {
  return (
    <EmailLayout lang="en-US" preview={`New message from ${name}: ${topic}`} reason="Someone sent this through the contact form on thesourceofhope.org. Reply to this email to answer them.">
      <EmailHeading>New message: {topic}</EmailHeading>
      <EmailText>
        From {name} ({email}){phone ? `, ${phone}` : ""}
      </EmailText>
      {message.split(/\n+/).map((line, i) => (
        // Lines of one message, in order; the index is their identity.
        <EmailText key={i}>{line}</EmailText>
      ))}
    </EmailLayout>
  );
}
