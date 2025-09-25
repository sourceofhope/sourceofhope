import { NavLink } from "react-router-dom";

export default function Favicon({ className }) {
  return (
    <NavLink
      to="/"
      className={`${className} text-lg flex items-center border-2`}
    >
      <p className="text-center w-full">ICON</p>
    </NavLink>
  );
}
