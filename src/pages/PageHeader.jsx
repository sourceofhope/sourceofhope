import PageSection from "./PageSection";

export default function PageHeader({ src, alt, children, className }) {
  return (
    <PageSection className="relative flex mb-10 min-h-[80vh] md:min-h-screen">
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 z-0 h-[80vh] md:h-full w-full object-cover brightness-[.8] contrast-[1.1]"
      />
      <div
        className={`relative z-10 w-full max-w-[75ch] md:max-w-[100ch] self-end grid gap-3 p-5 md:pb-15 lg:px-35 ${className}`}>
        {children}
      </div>
    </PageSection>
  );
}
