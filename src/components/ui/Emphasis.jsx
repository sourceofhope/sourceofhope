export default function Emphasis({ children }) {
  return (
    <span
      className="
        inline-block text-accent-500 font-semibold text-[1em] hover:text-[1.05em] leading-tight hover:leading-tight whitespace-nowrap transition-[font-size,line-height] duration-500 ease-in-out 
      "
    >
      {children}
    </span>
  );
}
