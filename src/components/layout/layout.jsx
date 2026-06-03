import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
      }}
    >
      <Navbar />
      <main
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
          width: "100%",
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
