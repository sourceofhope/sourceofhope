export default function PageSection({ className, children }) {
  return (
    <section
      className={`w-full md:justify-items-left items-center grid ${className}`}>
      {children}
    </section>
  );
}
