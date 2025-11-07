export default function Blockquote({ children, className = "" }) {
  return <p className={` pl-5 py-0 border-l-4 ${className}`}>{children}</p>;
}
