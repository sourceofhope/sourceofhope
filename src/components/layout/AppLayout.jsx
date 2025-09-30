import { Outlet } from "react-router-dom";
import Header from "../structure/Header";
import Footer from "../structure/Footer";

export default function AppLayout() {
  return (
    <>
      <Header />
      <main className="w-full min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
