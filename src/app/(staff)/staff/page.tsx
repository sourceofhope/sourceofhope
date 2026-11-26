import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { UtilityTemplate } from "@/components/layout/templates";
import { Alert } from "@/components/ui/alert";
import { Button, LinkButton } from "@/components/ui/button";
import { requireStaffPage } from "@/lib/auth/guard";

export const metadata: Metadata = { title: "Overview" };

/* /staff: placeholder overview behind the session guard. The portal shell is Phase 5. */
export default async function StaffOverviewPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const { staff } = await requireStaffPage();
  const t = await getTranslations("Staff.overview");
  const { denied } = await searchParams;
  return (
    <UtilityTemplate title={t("title", { name: staff.name })} lead={t("lead")}>
      {denied ? <Alert tone="warning">{t("denied")}</Alert> : null}
      <div className="flex flex-wrap gap-3">
        <LinkButton href="/staff/security" variant="secondary">
          {t("security")}
        </LinkButton>
        <form action="/staff/sign-out" method="post">
          <Button type="submit" variant="tertiary">
            {t("signOut")}
          </Button>
        </form>
      </div>
    </UtilityTemplate>
  );
}
