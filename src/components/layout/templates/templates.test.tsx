import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { CtaBand } from "../cta-band";
import { Section } from "../section";
import { ContentTemplate, DetailTemplate, LandingTemplate, ListingTemplate, ProgramTemplate, UtilityTemplate } from "./index";

const image = { src: "/v2/core/TSOH-Group.webp", alt: "Volunteers at an event", width: 800, height: 600 };

const TEMPLATES: Record<string, ReactElement> = {
  landing: (
    <LandingTemplate hero={<h1>Empowering and providing hope</h1>}>
      <Section title="Upcoming events">
        <p>Events</p>
      </Section>
    </LandingTemplate>
  ),
  content: (
    <ContentTemplate header={{ title: "Our Story", lead: "How we started.", image }} cta={<CtaBand title="Get involved" actions={<span />} />}>
      <Section title="Mission">
        <p>Text</p>
      </Section>
    </ContentTemplate>
  ),
  program: (
    <ProgramTemplate
      header={{ title: "Serving Hope", summary: "Hot meals every month.", image }}
      about={<p>About</p>}
      schedule={<p>Second Saturday</p>}
      events={<p>Events</p>}
      faq={<p>FAQ</p>}
    />
  ),
  listing: (
    <ListingTemplate header={{ title: "Events" }} filters={<p>Filters</p>} footer={<p>More</p>}>
      <ul>
        <li>One</li>
      </ul>
    </ListingTemplate>
  ),
  detail: (
    <DetailTemplate back={{ href: "/team", label: "All team members" }} title="Ada Lovelace" meta="Board chair" media={<p>Photo</p>} related={{ title: "More from the team", content: <p>Cards</p> }}>
      <p>Bio</p>
    </DetailTemplate>
  ),
  utility: <UtilityTemplate title="Page not found" lead="We couldn't find that page." />,
};

describe("page templates", () => {
  for (const [name, ui] of Object.entries(TEMPLATES)) {
    it(`${name}: exactly one main (the skip-link target) and one h1`, () => {
      renderWithIntl(ui);
      expect(screen.getAllByRole("main")).toHaveLength(1);
      expect(screen.getByRole("main")).toHaveAttribute("id", "main");
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    });
  }

  it("titled sections are landmarks named by their h2", () => {
    renderWithIntl(TEMPLATES.content);
    expect(screen.getByRole("region", { name: "Mission" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Get involved" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Mission" })).toBeInTheDocument();
  });

  it("program: sections come in the fixed order and empty slots are left out", () => {
    renderWithIntl(TEMPLATES.program);
    const h2s = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(h2s).toEqual(["What it is", "When and where", "Upcoming events", "Questions and answers"]);
  });

  it("detail: the back link comes before the h1", () => {
    renderWithIntl(TEMPLATES.detail);
    const back = screen.getByRole("link", { name: "All team members" });
    const h1 = screen.getByRole("heading", { level: 1, name: "Ada Lovelace" });
    expect(back.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
