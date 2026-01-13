import { Link } from "react-router-dom";
import { CANONICAL } from "../../routes";
import { ShoppingBagIcon } from "@heroicons/react/20/solid";
import { useCartActions } from "../../context/StoreCartContext";

export default function Cart() {
  const { getCartItemCount } = useCartActions();

  return (
    <div className="fixed bottom-5 md:top-5 right-5 z-9990">
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
        } absolute inset-0 -left-2 -top-2 rounded-full select-none bg-primary-400 w-7 aspect-square text-center text-neutral-50 text-sm p-1`}>
        <p className="size-full text-sm">{getCartItemCount()}</p>
      </div>
    </div>
  );
}
