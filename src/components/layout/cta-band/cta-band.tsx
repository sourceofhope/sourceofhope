import { useId, type ReactNode } from "react";
import { Heading } from "@/components/ui/heading";
import { Container } from "../container";

export type CtaBandProps = {
  /** The h2, a plain invitation ("Help us serve more families"). */
  title: string;
  /** One sentence. */
  text?: ReactNode;
  /** Hub actions as LinkButtons with `surface="inverse"`. */
  actions: ReactNode;
};

/**
 * CtaBand: the navy band that closes Content and Program pages with the
 * Hub actions (spec §10.5). One per page at most, always last before the footer.
 */
export function CtaBand({ title, text, actions }: CtaBandProps) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="bg-surface-inverse py-section text-on-inverse">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex max-w-prose flex-col gap-2">
            <Heading level={2} id={id} surface="inverse">
              {title}
            </Heading>
            {text ? <div className="text-lg text-on-inverse-muted">{text}</div> : null}
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>
        </div>
      </Container>
    </section>
  );
}
