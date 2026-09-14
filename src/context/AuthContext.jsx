// Archivo: src/context/AuthContext.jsx
// Context API para la gestión del estado global de autenticación en la aplicación.

import { createContext, useContext, useState, useEffect } from "react";

// 1. Creación del Contexto
const AuthContext = createContext(null);

// 2. Proveedor del Contexto (AuthProvider)
export function AuthProvider({ children }) {
  // Inicializamos el estado recuperando la sesión guardada en localStorage si existe
  const [usuario, setUsuario] = useState(() => {
    try {
      const sesionGuardada = localStorage.getItem("joyeria_usuario");
      return sesionGuardada ? JSON.parse(sesionGuardada) : null;
    } catch (error) {
      console.error("Error al leer sesión de localStorage:", error);
      return null;
    }
  });

  // Guardar o limpiar sesión en localStorage cuando cambie el estado
  useEffect(() => {
    if (usuario) {
      localStorage.setItem("joyeria_usuario", JSON.stringify(usuario));
    } else {
      localStorage.removeItem("joyeria_usuario");
    }
  }, [usuario]);

  // Función para iniciar sesión
  const iniciarSesion = (datosUsuario) => {
    setUsuario(datosUsuario);
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion, estaAutenticado: !!usuario }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Hook personalizado para consumir el contexto de forma sencilla
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un <AuthProvider>");
  }
  return context;
}

export default AuthContext;
