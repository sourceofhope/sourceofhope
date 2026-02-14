export default function Icon({ children, className = "" }) {
  return (
    <div
      aria-hidden="true"
      focusable="false"
      className={`
        flex items-center justify-center select-none
        ${className}
      `}>
      {children}
    </div>
  );
}
