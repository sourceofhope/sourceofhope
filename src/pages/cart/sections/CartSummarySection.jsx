export default function CartSummarySection({
  subtotal,
  shipping,
  tax,
  total,
  shippingMethod,
  setShippingMethod,
  shippingCosts
}) {
  return (
    <section className="pt-25 mt-4">
        <div className="bg-white rounded-2xl shadow-md p-6 sticky top-4">
        <h3 className="font-urbanist font-bold text-neutral-900 text-xl mb-4">
            Order Summary
        </h3>

        {/* Shipping Options */}
        <div className="space-y-3 mb-6">
            <label className="text-sm font-semibold text-neutral-700 block mb-2">
            Shipping Method:
            </label>

            {[
            { id: 'standard', name: 'Standard Shipping', time: '5-7 business days' },
            { id: 'express', name: 'Express Shipping', time: '2-3 business days' },
            { id: 'overnight', name: 'Overnight Shipping', time: 'Next business day' }
            ].map((method) => (
            <label
                key={method.id}
                className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all ${
                shippingMethod === method.id
                    ? 'border-accent-500 bg-accent-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}>
                <div className="flex items-center gap-3">
                <input
                    type="radio"
                    name="shipping"
                    value={method.id}
                    checked={shippingMethod === method.id}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="w-4 h-4 accent-accent-500"
                />
                <div>
                    <p className="font-semibold text-neutral-900 text-sm">
                    {method.name}
                    </p>
                    <p className="text-xs text-neutral-600">{method.time}</p>
                </div>
                </div>
                <span className="font-semibold text-neutral-900">
                ${shippingCosts[method.id].toFixed(2)}
                </span>
            </label>
            ))}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 border-t-2 border-neutral-200 pt-4">
            <div className="flex justify-between text-neutral-700">
            <span>Subtotal:</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-neutral-700">
            <span>Shipping:</span>
            <span className="font-semibold">${shipping.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-neutral-700">
            <span>Tax (8.25%):</span>
            <span className="font-semibold">${tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-lg font-bold text-neutral-900 pt-3 border-t-2 border-neutral-200">
            <span>Total:</span>
            <span className="text-accent-600">${total.toFixed(2)}</span>
            </div>
        </div>
        </div>
    </section>
  );
}
