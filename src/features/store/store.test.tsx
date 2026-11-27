import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithIntl, screen, waitFor, within } from "../../../test/render";
import { StoreCartProvider } from "@/context/StoreCartContext";
import type { Product } from "@/lib/content/loaders";
import { AddToCart } from "./add-to-cart";
import { CartView } from "./cart-view";

const product: Product = { id: "42", slug: "hope-tee", title: "Hope tee", price: 25, shortDescription: null, description: [], impact: null, sizes: ["S", "M"], images: [] };

describe("store", () => {
  beforeEach(() => localStorage.clear());

  it("asks for a size, then adds to the cart and the cart shows it with labelled inputs", async () => {
    const user = userEvent.setup();
    renderWithIntl(
      <StoreCartProvider>
        <AddToCart product={product} />
        <CartView />
      </StoreCartProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Add to cart" }));
    expect(await screen.findByText("Choose a size.")).toBeInTheDocument();

    await user.click(screen.getByRole("combobox", { name: "Size" }));
    await user.click(await screen.findByRole("option", { name: "M" }));
    await user.click(screen.getByRole("button", { name: "Add to cart" }));

    await waitFor(() => expect(screen.getByText("Hope tee")).toBeInTheDocument());
    const quantities = screen.getAllByRole("spinbutton", { name: "Quantity" });
    expect(quantities.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole("checkbox", { name: "Add 3% to cover card processing" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove Hope tee" })).toBeInTheDocument();
    const summary = screen.getByRole("complementary", { name: "Order summary" });
    expect(within(summary).getByText("$25.00")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("sourceofhope_cart")!)).toEqual([expect.objectContaining({ id: "42", size: "M", quantity: 1 })]);
  });
});
