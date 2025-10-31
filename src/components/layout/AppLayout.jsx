import { Outlet, ScrollRestoration } from "react-router-dom";
import Header, { HeaderFlagContext, useHeaderFlag } from "../structure/Header";
import Footer from "../structure/Footer";
import { Suspense, useState } from "react";
import Loader from "../structure/Loader";

export default function AppLayout() {
  const [isBlocking, setIsBlocking] = useState(false);

  return (
    <HeaderFlagContext.Provider value={{ isBlocking, setIsBlocking }}>
      <HeaderImpl />
      <main className="w-full min-h-screen">
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
        <ScrollRestoration getKey={(location) => location.pathname} />
      </main>
      <Footer />
    </HeaderFlagContext.Provider>
  );
}

function HeaderImpl() {
  const { isBlocking } = useHeaderFlag();
  return <Header isBlocking={isBlocking} />;
}
