export default function HomeSection({ className, children }) {
  return (
    <section
      className={`my-5 px-5 lg:px-35 w-full h-full md:justify-items-left items-center grid gap-5 ${className}`}>
      {children}
    </section>
  );
}
