import { Outlet, ScrollRestoration } from "react-router-dom";
import Header, { HeaderFlagContext } from "../structure/Header";
import Footer from "../structure/Footer";
import { Suspense, useState } from "react";
import Loader from "../structure/Loader";
import { StoreCartContext } from "../../pages/storefront/StorefrontPage";

export default function AppLayout() {
  const [isBlocking, setIsBlocking] = useState(false);
  const [cart, setCart] = useState([]);

  return (
    <HeaderFlagContext.Provider value={{ isBlocking, setIsBlocking }}>
      <StoreCartContext.Provider value={{ cart, setCart }}>
        <Header />
        <main className="w-full min-h-screen text-sm md:text-md lg:text-lg">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
          <ScrollRestoration getKey={(location) => location.pathname} />
        </main>
        <Footer />
      </StoreCartContext.Provider>
    </HeaderFlagContext.Provider>
  );
}
