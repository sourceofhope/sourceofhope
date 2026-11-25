import type { ReactNode } from "react";
import { Body, Button, Container, Head, Hr, Html, Preview, Section, Text } from "@react-email/components";
import { ORGANIZATION } from "@/content/organization";

/*
 * The base layout every TSOH email uses (receipts, sign-in links, volunteer
 * links, staff notices). Email clients need inline styles, so the brand
 * values are copied from the tokens in globals.css here, once.
 */

export const EMAIL_COLORS = {
  ink: "#0b1026",
  inkSoft: "#374151",
  muted: "#4b5563",
  line: "#d9dce1",
  surface: "#ffffff",
  surfaceMuted: "#f5f7fb",
  action: "#1b75bc",
} as const;

const FONT = "Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export type EmailLayoutProps = {
  /** BCP 47 locale for `<html lang>`. */
  lang: string;
  /** The inbox preview line, under the subject. */
  preview: string;
  /** Why the person is getting this email ("You signed up to volunteer…"). Required: every email says why. */
  reason: string;
  children: ReactNode;
};

export function EmailLayout({ lang, preview, reason, children }: EmailLayoutProps) {
  return (
    <Html lang={lang}>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: EMAIL_COLORS.surfaceMuted, fontFamily: FONT, margin: 0, padding: "24px 0" }}>
        <Container style={{ backgroundColor: EMAIL_COLORS.surface, borderRadius: 8, maxWidth: 560, padding: "32px 32px 24px", border: `1px solid ${EMAIL_COLORS.line}` }}>
          <Text style={{ color: EMAIL_COLORS.ink, fontSize: 18, fontWeight: 700, margin: "0 0 24px" }}>{ORGANIZATION.name}</Text>
          <Section>{children}</Section>
          <Hr style={{ borderColor: EMAIL_COLORS.line, margin: "32px 0 16px" }} />
          <Text style={{ color: EMAIL_COLORS.muted, fontSize: 13, lineHeight: "20px", margin: 0 }}>{reason}</Text>
          <Text style={{ color: EMAIL_COLORS.muted, fontSize: 13, lineHeight: "20px", margin: "8px 0 0" }}>
            {ORGANIZATION.name} · {ORGANIZATION.address.street}, {ORGANIZATION.address.city} · {ORGANIZATION.phone.display}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

/** A paragraph in the email body. */
export function EmailText({ children }: { children: ReactNode }) {
  return <Text style={{ color: EMAIL_COLORS.inkSoft, fontSize: 16, lineHeight: "26px", margin: "0 0 16px" }}>{children}</Text>;
}

/** The email's heading. */
export function EmailHeading({ children }: { children: ReactNode }) {
  return <Text style={{ color: EMAIL_COLORS.ink, fontSize: 24, fontWeight: 700, lineHeight: "32px", margin: "0 0 16px" }}>{children}</Text>;
}

/** The one main action, as a button. Always give the same link in text too, for clients that block buttons. */
export function EmailButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button
      href={href}
      style={{ backgroundColor: EMAIL_COLORS.action, borderRadius: 4, color: EMAIL_COLORS.surface, display: "inline-block", fontSize: 16, fontWeight: 600, padding: "12px 20px", textDecoration: "none" }}
    >
      {children}
    </Button>
  );
}
