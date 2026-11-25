import type { ComponentType } from "react";
import { ButtonsSection } from "./buttons";
import { ContentSection } from "./content";
import { FormsSection } from "./forms";
import { MediaSection } from "./media";
import { OverlaysSection } from "./overlays";
import { TemplatesSection } from "./templates";
import { TextSection } from "./text";
import { TokensSection } from "./tokens";

/**
 * The styleguide registry. Every primitive adds itself here as part of its
 * definition of done (ADR-0009 §7), in the order components are introduced.
 */
export type StyleguideSection = { id: string; title: string; summary: string; Component: ComponentType };

export const SECTIONS: StyleguideSection[] = [
  {
    id: "tokens",
    title: "Tokens",
    summary: "Colors, contrast, type, radius, elevation and motion from globals.css.",
    Component: TokensSection,
  },
  {
    id: "text",
    title: "Text and links",
    summary: "Heading, Eyebrow, TextLink, ExternalLink, SkipLink.",
    Component: TextSection,
  },
  {
    id: "buttons",
    title: "Buttons",
    summary: "Button, LinkButton, IconButton: variant × size × state, on default and inverse surfaces.",
    Component: ButtonsSection,
  },
  {
    id: "content",
    title: "Content",
    summary: "Badge, Alert, Card + CardLink, Image, Stat, Skeleton, Spinner, EmptyState.",
    Component: ContentSection,
  },
  {
    id: "overlays",
    title: "Overlays and disclosure",
    summary: "Dialog (dialog, takeover, Sheet), Menu, Tabs (underline, pill), Accordion, Disclosure, Toast.",
    Component: OverlaysSection,
  },
  {
    id: "forms",
    title: "Forms",
    summary: "useZodForm with Field, Input, Textarea, Select, RadioCards, Checkbox, ErrorSummary; Steps.",
    Component: FormsSection,
  },
  {
    id: "media",
    title: "Media",
    summary: "VideoHero, Marquee (sponsor strip), Carousel, YouTubeEmbed.",
    Component: MediaSection,
  },
  {
    id: "templates",
    title: "Templates",
    summary: "Landing, Content, Program, Listing, Detail, Utility; SectionHeading and CtaBand.",
    Component: TemplatesSection,
  },
];
