import { HeaderProvider } from "@/context/HeaderContext";
import { StoreCartProvider } from "@/context/StoreCartContext";
import Header from "@/components/legacy/layout/Header";
import Footer from "@/components/legacy/layout/Footer";

/*
 * Shell for pages that haven't been rebuilt yet. Phase 3 moves each rebuilt
 * page out of this (legacy) route group; slice 3.9 deletes the group.
 * Route groups don't appear in URLs.
 */
export default function LegacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <HeaderProvider>
      <StoreCartProvider>
        <Header />
        <main className="w-full min-h-screen text-sm md:text-md lg:text-lg">{children}</main>
        <Footer />
      </StoreCartProvider>
    </HeaderProvider>
  );
}
