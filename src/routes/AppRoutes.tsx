// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import NuBDashboard from "../pages/private/NuBDashboard";
import AdminDashboard from "../pages/private/admin/AdminDashboard";
import CrearObra from "../pages/private/admin/CrearObra";
import ListaObras from "../pages/private/admin/ListaObras";
import EditarObra from "../pages/private/admin/EditarObra";
import ListaArtistas from "../pages/private/admin/ListaArtistas";
import CrearArtista from "../pages/private/admin/CrearArtista";
import EditarArtista from "../pages/private/admin/EditarArtista";
import DetalleArtista from "../pages/private/admin/DetalleArtista";
import PrivateRoute from "../components/PrivateRoute";
import AdminRoute from "../components/AdminRoute";  // ← NUEVO
import RegistroArtista from "../pages/public/RegistroArtista";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<PublicRoutes />} />

      <Route path="/dashboard" element={
        <PrivateRoute><NuBDashboard /></PrivateRoute>
      } />
  <Route path="/registro-artista" element={<RegistroArtista />} />
      <Route path="/admin" element={
        <AdminRoute><AdminDashboard /></AdminRoute>
      } />

      {/* Obras */}
      <Route path="/admin/obras" element={
        <AdminRoute><ListaObras /></AdminRoute>
      } />
      <Route path="/admin/obras/crear" element={
        <AdminRoute><CrearObra /></AdminRoute>
      } />
      <Route path="/admin/obras/editar/:id" element={
        <AdminRoute><EditarObra /></AdminRoute>
      } />

      {/* Artistas */}
      <Route path="/admin/artistas" element={
        <AdminRoute><ListaArtistas /></AdminRoute>
      } />
      <Route path="/admin/artistas/crear" element={
        <AdminRoute><CrearArtista /></AdminRoute>
      } />
      <Route path="/admin/artistas/editar/:id" element={
        <AdminRoute><EditarArtista /></AdminRoute>
      } />
      <Route path="/admin/artistas/:id" element={
        <AdminRoute><DetalleArtista /></AdminRoute>
      } />
      
    </Routes>
  );
}