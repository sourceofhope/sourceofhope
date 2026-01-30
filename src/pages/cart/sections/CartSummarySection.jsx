import Title from "../../../components/ui/text/Title";

export default function CartSummarySection({
  subtotal,
  shipping,
  tax,
  total,
}) {
  return (
    <section className="">
      <div className="bg-white rounded-2xl shadow-md p-5 sticky top-5">
        <Title className="flex flex-col gap-1 mb-5">Order Summary</Title>
        <div className="space-y-3 pt-4">
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
