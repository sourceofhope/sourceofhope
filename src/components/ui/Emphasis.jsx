export default function Emphasis({ className, children }) {
  return (
    <span
      className={`${className}
        inline text-accent-500 font-semibold text-[1em] hover:text-[1.05em] leading-tight hover:leading-tight transition-[font-size,line-height] duration-500 ease-in-out 
      `}>
      {children}
    </span>
  );
}
