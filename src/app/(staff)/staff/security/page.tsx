import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { UtilityTemplate } from "@/components/layout/templates";
import { requireStaffPage } from "@/lib/auth/guard";
import { authClient } from "@/lib/auth/supabase-session";
import { SecurityForm } from "./security-form";

export const metadata: Metadata = { title: "Two-step sign-in" };

/* /staff/security: TOTP setup and step-up (02 §7: people.manage, integrations.manage, admin). */
export default async function StaffSecurityPage() {
  const { assurance } = await requireStaffPage();
  const t = await getTranslations("Staff.security");
  const auth = await authClient();
  const { data } = await auth.auth.mfa.listFactors();
  const verified = data?.totp.find((f) => f.status === "verified") ?? null;
  return (
    <UtilityTemplate title={t("title")} lead={t("lead")}>
      <SecurityForm verifiedFactorId={verified?.id ?? null} assurance={assurance} />
    </UtilityTemplate>
  );
}
