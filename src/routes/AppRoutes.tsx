// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import NuBDashboard from "../pages/private/NuBDashboard";   // ← nombre completo
import AdminDashboard from "../pages/private/admin/AdminDashboard";
import CrearObra from "../pages/private/admin/CrearObra";
import PrivateRoute from "../components/PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<PublicRoutes />} />

      {/* Dashboard Cliente */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <NuBDashboard />   {/* ← reemplaza Dashboard_Modern */}
          </PrivateRoute>
        }
      />

      {/* Dashboard Admin */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* Crear Obra */}
      <Route
        path="/admin/obras/crear"
        element={
          <PrivateRoute>
            <CrearObra />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}