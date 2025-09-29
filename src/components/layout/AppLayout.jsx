import { Outlet } from "react-router-dom";
import Header from "../structure/Header";
import Footer from "../structure/Footer";

export default function AppLayout() {
  return (
    <div className="w-screen bg-neutral-50">
      <Header />
      <main className="w-full min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
