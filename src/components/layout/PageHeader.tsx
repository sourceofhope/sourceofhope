import Image from "next/image";
import { ASSET_VERSION } from "@/lib/environment";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  src?: string;
  // CSS object-position for the background, e.g. "50% 30%".
  position?: string;
}

// Every page banner shares one height, gutter, and title treatment so the
// fixed site header always sits over the same frame.
export default function PageHeader({
  title,
  subtitle,
  src = `/${ASSET_VERSION}/core/TSOH-Family.webp`,
  position = "center",
}: PageHeaderProps) {
  return (
    <section className="relative w-full h-100 md:h-85 mb-10">
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectPosition: position }}
        className="object-cover brightness-[.65] contrast-[1.1]
          mask-[linear-gradient(to_bottom,white_80%,transparent_100%)]
          md:mask-[linear-gradient(to_bottom,white_70%,transparent_100%)]"
      />
      {/* Content is centered between the fixed header and the start of the fade. */}
      <div className="absolute inset-x-0 top-15 bottom-[20%] md:top-20 md:bottom-[30%] z-10 flex flex-col justify-center gap-1 px-5 lg:px-35">
        <h1 className="font-urbanist font-bold text-neutral-50 text-xxlg md:text-xxxlg leading-tight text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="font-semibold text-neutral-200 text-sm md:text-md uppercase">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
