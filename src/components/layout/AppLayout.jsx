import { Outlet } from "react-router-dom";
import Header from "../structure/Header";
import Footer from "../structure/Footer";

export default function AppLayout() {
  return (
    <div className="bg-neutral-50">
      <Header />
      <main className="w-screen min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
