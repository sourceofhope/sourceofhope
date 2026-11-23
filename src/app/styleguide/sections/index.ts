import type { ComponentType } from "react";
import { TokensSection } from "./tokens";

/**
 * The styleguide registry. Every primitive adds one entry here as part of its
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
];
