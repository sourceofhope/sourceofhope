export default function Heading({ children, className = "" }) {
  return (
    <h3
      className={`text-sm md:text-md font-montserrat text-accent-700 font-bold uppercase ${className}`}>
      {children}
    </h3>
  );
}
