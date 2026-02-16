// src/layout/PublicLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/layout.css";

export default function PublicLayout() {
  return (
    <div className="layout">
      <Navbar />
      
      <main className="main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}