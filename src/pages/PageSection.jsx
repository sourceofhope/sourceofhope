export default function PageSection({ className, children }) {
  return (
    <section
      className={`w-full md:justify-items-left items-center grid gap-5 my-5 px-5 lg:px-35 ${className}`}>
      {children}
    </section>
  );
}
