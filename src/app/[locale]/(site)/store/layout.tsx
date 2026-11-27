import { StoreCartProvider } from "@/context/StoreCartContext";

/* The store keeps its cart in one provider for every store page (slice 3.7). */
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <StoreCartProvider>{children}</StoreCartProvider>;
}
