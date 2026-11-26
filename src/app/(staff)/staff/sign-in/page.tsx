import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { UtilityTemplate } from "@/components/layout/templates";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function StaffSignInPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const t = await getTranslations("Staff.signIn");
  const { error } = await searchParams;
  return (
    <UtilityTemplate title={t("title")} lead={t("lead")}>
      <SignInForm linkProblem={error === "link"} />
    </UtilityTemplate>
  );
}
