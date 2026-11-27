import { z } from "zod";

/** The contact form (spec §9.9, §11). One schema, checked in the browser and again on the server. */

export const CONTACT_TOPICS = ["general", "help", "volunteer", "giving", "media", "other"] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

/** Error messages are message keys, so the same schema serves every language. */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "name").max(120, "name"),
  email: z.email("email").max(200, "email"),
  phone: z
    .string()
    .trim()
    .max(30, "phone")
    .refine((v) => v === "" || v.replace(/\D/g, "").length >= 10, "phone")
    .optional()
    .or(z.literal("")),
  topic: z.enum(CONTACT_TOPICS, { error: "topic" }),
  message: z.string().trim().min(10, "message").max(2000, "messageLong"),
  /** Honeypot: hidden from people; bots fill it in. */
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactValues = z.output<typeof contactSchema>;

export type ContactResult = { status: "sent" } | { status: "invalid"; fields: Partial<Record<keyof ContactValues, string>> } | { status: "too_many" } | { status: "failed" };
