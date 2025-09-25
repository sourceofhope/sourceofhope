import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

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
