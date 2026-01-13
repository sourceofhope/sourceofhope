import { TrashIcon } from "@heroicons/react/24/outline";
import Title from "../../../components/ui/text/Title";
import Heading from "../../../components/ui/text/Heading";

export default function CartItemsSection({
  items,
  updateQuantity,
  removeItem,
  updateSize,
}) {
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <section className="">
      <div className="bg-white rounded-2xl shadow-md p-5 pt-0 md:pt-5 space-y-3">
        <div className="flex flex-col gap-1">
          <Title>Shopping Cart</Title>
        </div>
        <Heading>Your Selected Items</Heading>

        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row gap-5 p-5 border-2 border-neutral-200 rounded-xl hover:border-accent-500 transition-colors">
            <div className="w-full hidden md:flex md:w-32 h-32 bg-neutral-200 rounded-lg items-center justify-center overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML =
                    '<span class="text-neutral-500 text-sm">No image</span>';
                }}
              />
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="font-bold text-neutral-900 text-lg">
                {item.title}
              </h4>
              <p className="text-accent-600 font-semibold">
                ${item.price.toFixed(2)}
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                {item.size && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-neutral-700">
                      Size:
                    </label>
                    <select
                      value={item.size}
                      onChange={(e) => updateSize(item.id, e.target.value)}
                      className="border-2 border-neutral-300 rounded-lg px-3 py-1 focus:border-accent-500 focus:outline-none">
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-neutral-700">
                    Quantity:
                  </label>
                  <div className="flex items-center border-2 border-neutral-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 font-bold transition-colors"
                      aria-label="Decrease quantity">
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value) || 1)
                      }
                      className="w-16 text-center focus:outline-none"
                      min="1"
                    />
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 font-bold transition-colors"
                      aria-label="Increase quantity">
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="self-start md:hidden md:self-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Remove item">
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <p className="text-neutral-700 font-semibold">
                Item Total: ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="self-start hidden md:block md:self-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Remove item">
              <TrashIcon className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
