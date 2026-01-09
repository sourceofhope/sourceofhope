import { NavLink } from "react-router-dom";
import { ASSET_VERSION, CANONICAL } from "../../routes";
import Icon from "./Icon";

export default function Favicon({ className }) {
  return (
    <NavLink to={CANONICAL.home} aria-label="Go Home">
      <Icon className={`w-8 h-8 ${className}`}>
        <img
          src={`/${ASSET_VERSION}/core/TSOH-Favicon.webp`}
          alt=""
          className="w-full h-full object-contain rounded-lg"
          draggable={false}
        />
      </Icon>
    </NavLink>
  );
}
