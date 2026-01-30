import Title from "../../../components/ui/text/Title";

export default function CartShippingSection({
  shippingMethod,
  setShippingMethod,
  shippingOptions,
}) {
  
  return (
    <section className="mt-5">
      <div className="bg-white rounded-2xl shadow-md p-5 sticky top-5">
        <Title className="flex flex-col gap-1 mb-5">Shipping Method</Title>
        <div className="space-y-3">
          {shippingOptions.map((method) => (
            <label
              key={method.id}
              className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all ${
                shippingMethod === method.id
                  ? "border-accent-500 bg-accent-50"
                  : "border-neutral-200 hover:border-neutral-300"
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
                ${method.cost.toFixed(2)}
              </span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
