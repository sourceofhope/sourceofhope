export default function Icon({ children, className = "" }) {
  return (
    <div
      className={`
        flex items-center justify-center select-none
        ${className}
      `}>
      {children}
    </div>
  );
}
