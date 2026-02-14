import { ASSET_VERSION } from "../../routes";
import Icon from "./Icon";

export default function Favicon({ className }) {
  return (
    <Icon className={`w-10 h-10 ${className}`}>
      <img
        src={`/${ASSET_VERSION}/core/TSOH-Favicon.webp`}
        alt=""
        className="w-full h-full object-contain rounded-lg"
        draggable={false}
      />
    </Icon>
  );
}
