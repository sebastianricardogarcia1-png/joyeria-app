// Archivo: src/components/ProtectedRoute.jsx
// Componente de protección de rutas privadas usando React Router y Context API.

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { usuario } = useAuth();

  // Si no hay usuario autenticado, redirigir a /login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizar las rutas anidadas protegidas
  return <Outlet />;
}
