// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import Dashboard from "../pages/private/Dashboard";
import AdminDashboard from "../pages/private/admin/AdminDashboard";
import CrearObra from "../pages/private/admin/CrearObra";
import PrivateRoute from "../components/PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/*" element={<PublicRoutes />} />
      
      {/* Dashboard Cliente */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
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
