import { NavLink } from "react-router-dom";

export default function Favicon({ className }) {
  return (
    <NavLink
      to="/"
      className={`${className} text-lg flex items-center justify-center`}>
      <img src="Favicon.png" className="w-fit aspect-square" />
    </NavLink>
  );
}
