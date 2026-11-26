import { EmailButton, EmailHeading, EmailLayout, EmailText } from "../layout";

/* Staff sign-in and invite emails (slice 2.2). The Staff Portal is English only. */

export function StaffSignInEmail({ url }: { url: string }) {
  return (
    <EmailLayout lang="en-US" preview="Your sign-in link for the TSOH Staff Portal" reason="You asked to sign in to The Source of Hope Staff Portal. If you didn't, you can ignore this email.">
      <EmailHeading>Sign in to the Staff Portal</EmailHeading>
      <EmailText>This link works once, for one hour.</EmailText>
      <EmailButton href={url}>Sign in</EmailButton>
      <EmailText>Or paste this link into your browser: {url}</EmailText>
    </EmailLayout>
  );
}

export function StaffInviteEmail({ url }: { url: string }) {
  return (
    <EmailLayout lang="en-US" preview="You've been invited to the TSOH Staff Portal" reason="A Source of Hope admin invited you to the Staff Portal. If you weren't expecting this, you can ignore this email.">
      <EmailHeading>{"You're invited to the Staff Portal"}</EmailHeading>
      <EmailText>Use this link to sign in for the first time. It works once, for 24 hours.</EmailText>
      <EmailButton href={url}>Accept and sign in</EmailButton>
      <EmailText>Or paste this link into your browser: {url}</EmailText>
    </EmailLayout>
  );
}
