import { NavLink, Link, Outlet } from "react-router-dom"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"

export default function AppLayout() {
  return (
    <div className="bg-primary-background">
      <Header />
      <main className="min-h-[50vh] px-5">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
