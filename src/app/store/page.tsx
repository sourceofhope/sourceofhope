import StorefrontProductSection from "@/components/store/StorefrontProductSection";
import StorefrontFooterSection from "@/components/store/StorefrontFooterSection";
import Cart from "@/components/store/Cart";
import HeaderBlocker from "@/components/layout/HeaderBlocker";

export default function Store() {
  return (
    <>
      <HeaderBlocker />
      <Cart />
      <StorefrontProductSection />
      <StorefrontFooterSection />
    </>
  );
}
