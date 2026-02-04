import Title from "../../components/ui/text/Title";
import Heading from "../../components/ui/text/Heading";

export default function OrderDetailsSection({ cart, getCartItemCount, subtotal }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <div className="flex flex-col gap-1 mb-4">
        <Title className="text-xl">Order Details</Title>
        <Heading className="text-sm">Your Selected Items</Heading>
      </div>
      <div className="space-y-3">
        {cart.map((item, index) => (
          <div
            key={`${item.id}-${item.size}-${index}`}
            className="flex gap-3 p-3 border-2 border-neutral-200 rounded-xl hover:border-accent-500 transition-colors"
          >
            <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML =
                    '<span class="text-neutral-500 text-xs">No image</span>';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-neutral-900 text-sm truncate">
                {item.title}
              </p>
              <p className="text-accent-600 font-semibold text-sm">
                ${item.price.toFixed(2)}
              </p>
              <div className="flex gap-2 text-xs text-neutral-600 mt-1">
                {item.size && <span>Size: {item.size}</span>}
                <span>•</span>
                <span>Qty: {item.quantity}</span>
              </div>
              <p className="text-neutral-700 font-semibold text-sm mt-1">
                Total: ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
        <div className="pt-3 border-t-2 border-neutral-200">
          <p className="text-sm text-neutral-600 text-right">
            {getCartItemCount()} item
            {getCartItemCount() !== 1 ? "s" : ""} • Subtotal: $
            {subtotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
