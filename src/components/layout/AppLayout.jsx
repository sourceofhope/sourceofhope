import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import Header from "../structure/Header";
import Footer, { FooterParallax } from "../structure/Footer";

export default function AppLayout() {
  const location = useLocation(); 

  return (
    <>
      <Header />
      <main className="w-full min-h-screen">
        <Outlet />
        <ScrollRestoration getKey={(loc) => loc.pathname} />
      </main>
      {!(location.pathname === "/sourceofhope/") ? (
        <Footer>
          <FooterParallax />
        </Footer>
      ) : (
        <Footer />
      )}
    </>
  );
}
