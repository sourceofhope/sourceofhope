import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isStyleguideEnabled } from "../../enabled";
import { TEMPLATE_DEMOS } from "../demos";

/* /styleguide/templates/<name>: one full sample page per template (spec §7, §10.12). */

type Props = { params: Promise<{ template: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(TEMPLATE_DEMOS).map((template) => ({ template }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { template } = await params;
  return { title: `${TEMPLATE_DEMOS[template]?.name ?? "Template"} template · Styleguide`, robots: { index: false, follow: false } };
}

export default async function TemplateDemoPage({ params }: Props) {
  if (!isStyleguideEnabled()) notFound();
  const { template } = await params;
  const demo = TEMPLATE_DEMOS[template];
  if (!demo) notFound();
  return <demo.Demo />;
}
