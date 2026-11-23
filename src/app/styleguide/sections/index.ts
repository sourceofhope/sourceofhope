import type { ComponentType } from "react";
import { ButtonsSection } from "./buttons";
import { ContentSection } from "./content";
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
];
