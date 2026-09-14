// ==============================================================================
// ARCHIVO PRINCIPAL: src/App.jsx
// ==============================================================================
// Maneja el estado global de productos, rutas con React Router,
// protección de rutas privadas (ProtectedRoute) y consumo de Context API (AuthContext).

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProductoPorId,
} from "./api";

// Importación de componentes
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Inventario from "./components/Inventario";
import FormularioProducto from "./components/FormularioProducto";
import ProtectedRoute from "./components/ProtectedRoute";

// Layout principal para las vistas privadas protegidas
function ProtectedLayout({ usuario, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#12100e] text-[#f5f0eb]">
      {/* Barra superior de navegación */}
      <Navbar usuario={usuario} onLogout={onLogout} />

      {/* Contenido dinámico de las rutas protegidas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Pie de página */}
      <footer className="bg-[#181412] border-t border-[#2e2621] py-6 text-center text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} AUREUM Joyería Fina — Sistema de Gestión de Inventario de Manillas de Oro.</p>
          <p className="mt-1 text-stone-500">Proyecto Full-Stack (Frontend React + Backend JSON Server)</p>
        </div>
      </footer>
    </div>
  );
}

function AppContent() {
  // Consumo del estado global de autenticación desde AuthContext
  const { usuario, cerrarSesion } = useAuth();

  // ---------------------------------------------------------------------------
  // ESTADOS DE DATOS & INTERFAZ
  // ---------------------------------------------------------------------------
  // Lista de manillas de oro obtenidas de la API
  const [productos, setProductos] = useState([]);

  // Estado de carga mientras se consulta la API
  const [cargando, setCargando] = useState(true);

  // Estado de error si la API no responde
  const [error, setError] = useState("");

  // Mensaje temporal de éxito (feedback visual tipo Toast)
  const [mensajeExito, setMensajeExito] = useState("");

  // ---------------------------------------------------------------------------
  // CONSULTA DE DATOS CON useEffect
  // ---------------------------------------------------------------------------
  const cargarProductos = async () => {
    try {
      setCargando(true);
      setError("");
      const datos = await listarProductos();
      setProductos(datos);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError(
        "No se pudieron cargar los productos. Verifica que el servidor JSON Server esté encendido en el puerto 5000."
      );
    } finally {
      setCargando(false);
    }
  };

  // Se ejecuta al montar o cambiar el usuario autenticado
  useEffect(() => {
    if (usuario) {
      cargarProductos();
    }
  }, [usuario]);

  // Función para mostrar feedback visual temporal
  const mostrarToast = (mensaje) => {
    setMensajeExito(mensaje);
    setTimeout(() => {
      setMensajeExito("");
    }, 4000);
  };

  // ---------------------------------------------------------------------------
  // OPERACIONES CRUD (Crear, Actualizar, Eliminar)
  // ---------------------------------------------------------------------------
  // Crear una nueva manilla
  const onAgregarProducto = async (nuevoProducto) => {
    try {
      setError("");
      const creado = await crearProducto(nuevoProducto);
      setProductos((prev) => [creado, ...prev]);
      mostrarToast(`Manilla "${creado.nombre}" registrada con éxito.`);
    } catch (err) {
      console.error("Error al registrar producto:", err);
      setError("No se pudo guardar la joya en la base de datos.");
      throw err;
    }
  };

  // Actualizar una manilla existente
  const onActualizarProducto = async (id, datosActualizados) => {
    try {
      setError("");
      const actualizado = await actualizarProducto(id, datosActualizados);
      setProductos((prev) =>
        prev.map((p) => (p.id === actualizado.id ? actualizado : p))
      );
      mostrarToast(`Manilla "${actualizado.nombre}" actualizada con éxito.`);
    } catch (err) {
      console.error("Error al actualizar producto:", err);
      setError("No se pudo actualizar la joya en la base de datos.");
      throw err;
    }
  };

  // Eliminar una manilla
  const onEliminarProducto = async (id, nombre) => {
    try {
      setError("");
      await eliminarProductoPorId(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
      mostrarToast(`Manilla "${nombre}" eliminada correctamente.`);
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setError("No se pudo eliminar el producto de la base de datos.");
      throw err;
    }
  };

  // ---------------------------------------------------------------------------
  // RUTAS: PÚBLICAS Y PRIVADAS PROTEGIDAS
  // ---------------------------------------------------------------------------
  return (
    <Routes>
      {/* 1. Ruta Pública */}
      <Route path="/login" element={<Login />} />

      {/* 2. Rutas Privadas Protegidas con ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout usuario={usuario} onLogout={cerrarSesion} />}>
          {/* Vista 1: Dashboard / Inicio */}
          <Route
            path="/"
            element={
              <Dashboard
                productos={productos}
                cargando={cargando}
                error={error}
                usuario={usuario}
                onReintentar={cargarProductos}
              />
            }
          />

          {/* Vista 2: Gestión de Inventario */}
          <Route
            path="/inventario"
            element={
              <Inventario
                productos={productos}
                cargando={cargando}
                error={error}
                mensajeExito={mensajeExito}
                setMensajeExito={setMensajeExito}
                onEliminar={onEliminarProducto}
                onReintentar={cargarProductos}
              />
            }
          />

          {/* Vista 3: Registrar Nueva Manilla */}
          <Route
            path="/nuevo"
            element={
              <FormularioProducto
                productos={productos}
                onAgregar={onAgregarProducto}
                onActualizar={onActualizarProducto}
              />
            }
          />

          {/* Vista 4: Editar Manilla Existente */}
          <Route
            path="/editar/:id"
            element={
              <FormularioProducto
                productos={productos}
                onAgregar={onAgregarProducto}
                onActualizar={onActualizarProducto}
              />
            }
          />
        </Route>
      </Route>

      {/* 3. Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Componente Principal envuelto en el Proveedor de Contexto y el Router
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
