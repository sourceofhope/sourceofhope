import { Outlet, ScrollRestoration } from "react-router-dom";
import { HeaderProvider } from "../../context/HeaderContext";
import { Suspense } from "react";
import { StoreCartProvider } from "../../context/StoreCartContext";
import Loader from "../structure/Loader";
import Footer from "../structure/Footer";
import Header from "../structure/Header";

export default function AppLayout() {
  return (
    <HeaderProvider>
      <StoreCartProvider>
        <Header />
        <main className="w-full min-h-screen text-sm md:text-md lg:text-lg">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
          <ScrollRestoration getKey={(location) => location.pathname} />
        </main>
        <Footer />
      </StoreCartProvider>
    </HeaderProvider>
  );
}
