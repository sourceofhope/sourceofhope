import { Link } from "react-router-dom";
import { CANONICAL } from "../../routes";
import { ShoppingBagIcon } from "@heroicons/react/20/solid";
import { useCartActions } from "../../context/StoreCartContext";
import { useHeaderContext } from "../../context/HeaderContext";

export default function Cart() {
  const { getCartItemCount } = useCartActions();
  const { bannerActive } = useHeaderContext();

  return (
    <div
      className={`
          fixed right-5 md:right-10 z-[9999]
          transition-[top,bottom] duration-500 bottom-5
          ${bannerActive ? "md:top-12.5" : "md:top-2.5"}
        `}>
      <Link
        to={CANONICAL.storefront.cart.absolute}
        className="
          w-14 h-14
          flex items-center justify-center
          rounded-full
          bg-primary-800 text-white
          hover:scale-105 transition-transform
        ">
        <ShoppingBagIcon className="w-7 h-7" />
      </Link>
      <div
        className={`${
          getCartItemCount() > 0 ? "" : "hidden"
        } absolute inset-0 -left-2 -top-2 rounded-full select-none bg-primary-400 size-7 overflow-hidden aspect-square text-center text-neutral-50 text-sm p-1`}>
        <p className="size-full text-sm">{getCartItemCount()}</p>
      </div>
    </div>
  );
}
