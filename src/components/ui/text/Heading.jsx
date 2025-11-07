export default function Heading({ children, className = "" }) {
  return (
    <h3
      className={`text-sm md:text-md text-accent-700 font-semibold uppercase ${className}`}>
      {children}
    </h3>
  );
}
