import { Link } from "react-router-dom";
import { CANONICAL } from "../../routes";
import { ShoppingBagIcon } from "@heroicons/react/20/solid";

export default function CartHolder() {
  return (
    <div className="fixed bottom-5 right-5 z-9990">
      <Link
        to={CANONICAL.storefront.cart.absolute}
        className="
          w-14 h-14
          flex items-center justify-center
          rounded-full
          bg-primary-800 text-white
          shadow-xl
          hover:scale-105 transition-transform
        ">
        <ShoppingBagIcon className="w-7 h-7" />
      </Link>
    </div>
  );
}
