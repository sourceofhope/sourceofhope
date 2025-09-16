import { NavLink, Link, Outlet } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function AppLayout() {
  return (
    <div className="bg-primary-background">
      <Header />
      <main className="min-h-[50vh] px-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
