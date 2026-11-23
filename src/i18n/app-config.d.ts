import type messages from "../../messages/en-US.json";
import type { AppLocale } from "./locales";

// Typed messages and locales: a missing or misspelled key fails the type check.
declare module "next-intl" {
  interface AppConfig {
    Locale: AppLocale;
    Messages: typeof messages;
  }
}
