import NextImage, { type ImageProps as NextImageProps } from "next/image";
import { tv, type VariantProps } from "../lib/tv";

const imageStyles = tv({
  base: "object-cover",
  variants: { radius: { none: "", md: "rounded-md", lg: "rounded-lg" } },
  defaultVariants: { radius: "none" },
});

/**
 * Image: every image goes through here (spec §5.6). Either describe it with
 * `alt` or mark it `decorative`; leaving both out is a type error.
 */
export type ImageProps = Omit<NextImageProps, "alt"> &
  VariantProps<typeof imageStyles> &
  ({ alt: string; decorative?: never } | { decorative: true; alt?: never });

export function Image({ alt, decorative, radius, className, ...props }: ImageProps) {
  return <NextImage {...props} alt={decorative ? "" : (alt ?? "")} className={imageStyles({ radius, class: className })} />;
}
