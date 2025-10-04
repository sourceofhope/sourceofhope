import PageSection from "./PageSection";

export default function PageHeader({ children, className }) {
  return (
    <PageSection className="relative flex h-75 bg-accent-900 z-0">
      <div
        className={`relative z-10 w-fit self-end grid p-5 md:pb-15 lg:px-35 ${className}`}>
        {children}
      </div>
    </PageSection>
  );
}
