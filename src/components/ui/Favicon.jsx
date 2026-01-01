import { NavLink } from "react-router-dom";
import { ASSET_VERSION } from "../../routes";

export default function Favicon({ className }) {
  return (
    <NavLink
      to="/"
      className={`${className} text-lg flex items-center justify-center p-2 rounded-2xl`}>
      <img
        src={`/${ASSET_VERSION}/core/TSOH-Favicon.webp`}
        alt="Go Home"
        className="w-fit aspect-square"
        draggable={false}
      />
    </NavLink>
  );
}
