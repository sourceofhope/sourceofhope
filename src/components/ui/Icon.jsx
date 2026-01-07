export default function Icon({ children, className = "" }) {
  return (
    <div
      className={`
        flex items-center justify-center
        rounded-2xl
        ${className}
      `}>
      {children}
    </div>
  );
}
