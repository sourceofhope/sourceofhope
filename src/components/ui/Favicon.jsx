import { NavLink } from "react-router-dom";

export default function Favicon({ className }) {
  return (
    <NavLink
      to="/"
      className={`${className} text-lg flex items-center justify-center border-2`}
    >
      <p className="w-fit">ICON</p>
    </NavLink>
  );
}
