"use client";

const ASSET_VERSION = "v2";

interface PageHeaderProps {
  src?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  src = `/${ASSET_VERSION}/core/TSOH-Family.webp`,
  children,
  className = "",
}: PageHeaderProps) {
  return (
    <section
      className={`w-full md:justify-items-left items-center relative flex my-0 mb-10 h-100 md:h-85 ${className}`}
    >
      <img
        className="absolute inset-0 z-0 h-full w-full object-cover brightness-[.65] contrast-[1.1]
        [mask-image:linear-gradient(to_bottom,white_80%,transparent_100%)] [webkit-mask-image:linear-gradient(to_bottom,white_80%,transparent_100%)]
        md:[mask-image:linear-gradient(to_bottom,white_70%,transparent_100%)] md:[webkit-mask-image:linear-gradient(to_bottom,white_70%,transparent_100%)]"
        loading="eager"
        decoding="async"
        src={src}
        alt="Page header background"
      />
      <div
        className={`absolute z-10 w-fit self-end top-[58%] md:top-[52%] grid px-5 lg:px-35 items-start ${className}`}
      >
        {children}
      </div>
    </section>
  );
}
