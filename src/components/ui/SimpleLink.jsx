import { NavLink } from "react-router-dom";

export default function SimpleLink({ to, className, children }) {
  return (
    <NavLink
      to={to}
      className={`${className} hover:underline font-semibold text-accent-900`}>
      {children}
    </NavLink>
  );
}
