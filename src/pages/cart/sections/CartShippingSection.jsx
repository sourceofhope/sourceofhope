import Heading from "../../../components/ui/text/Heading";

export default function CartShippingSection({
  shippingMethod,
  setShippingMethod,
  shippingOptions,
  processingFee,
  applyFee,
  setApplyFee,
}) {
  return (
    <section>
      <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 pt-5">
        <h4 className="font-semibold text-neutral-900 mb-2 text-sm">
          Support the mission
        </h4>
        <p className="text-xs text-neutral-700 mb-3">
          Online payments include a <strong>3% processing cost</strong> charged
          by the credit card companies. You may choose to add this small amount
          so your full donation goes directly to serving the community.
        </p>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={applyFee}
            onChange={(e) => setApplyFee(e.target.checked)}
            className="mt-0.5 w-4 h-4 text-accent-600 border-neutral-300 rounded focus:ring-accent-500 cursor-pointer"
          />
          <span className="text-xs md:text-sm text-neutral-800 group-hover:text-accent-700 transition-colors">
            Yes, I would like to cover the processing fee
            {
              <span
                className={`${applyFee ? "opacity-100" : "opacity-0"} block text-xs text-accent-600 font-medium mt-1`}>
                +${processingFee.toFixed(2)} processing support
              </span>
            }
          </span>
        </label>
      </div>
      <div className="my-6">
        <div className="bg-white rounded-2xl shadow-md p-5 top-5">
          <Heading className="flex flex-col gap-1 mb-5">
            Shipping Method
          </Heading>
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
      </div>
    </section>
  );
}
