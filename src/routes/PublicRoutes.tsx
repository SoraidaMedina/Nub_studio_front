// src/routes/PublicRoutes.tsx
import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layout/PublicLayout";
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import Login from "../pages/public/Login";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sobre-nosotros" element={<About />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/artistas" element={<div>Artistas - Próximamente</div>} />
        <Route path="/blog" element={<div>Blog - Próximamente</div>} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}