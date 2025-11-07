export default function Title({ children, className = "" }) {
  return (
    <h2
      className={`font-semibold font-urbanist text-xlg md:text-xxlg ${className}`}>
      {children}
    </h2>
  );
}
