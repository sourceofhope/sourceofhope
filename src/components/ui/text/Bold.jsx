export default function Bold({ className, children }) {
  return <strong className={`${className} font-semibold`}>{children}</strong>;
}
