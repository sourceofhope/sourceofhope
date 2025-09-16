import { NavLink, Link, Outlet } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function AppLayout() {
  return (
    <>
      <Header />
      <main className="bg-primary-background min-h-[50vh] px-10">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
