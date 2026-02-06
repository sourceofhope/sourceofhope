import Heading from "../../../components/ui/text/Heading";

export default function CheckoutDetailsSection({ cart, getCartItemCount, subtotal, shippingMethod, shippingCost, taxAmount }) {
  // Calculate total from prop values
  const total = subtotal + (shippingCost || 0) + (taxAmount || 0);
  
  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <div className="flex flex-col gap-1 mb-4">
        <Heading className="text-sm">Checkout Items</Heading>
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
      </div>
      
      {/* Order Summary */}
      <div className="mt-6 pt-4 border-t-2 border-neutral-200 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Subtotal ({getCartItemCount()} item{getCartItemCount() !== 1 ? "s" : ""})</span>
          <span className="font-semibold text-neutral-900">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <div className="flex flex-col">
            <span className="text-neutral-600">Shipping</span>
            {shippingMethod && (
              <span className="text-xs text-neutral-500 mt-0.5">
                {shippingMethod}
              </span>
            )}
          </div>
          <span className="font-semibold text-neutral-900">
            {shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : "FREE"}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Tax (8.25%)</span>
          <span className="font-semibold text-neutral-900">${taxAmount.toFixed(2)}</span>
        </div>
        
        <div className="pt-3 border-t-2 border-neutral-300">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-neutral-900">Total</span>
            <span className="text-2xl font-bold text-accent-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
