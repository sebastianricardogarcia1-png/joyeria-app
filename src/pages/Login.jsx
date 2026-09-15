// Archivo: src/components/Login.jsx
// Formulario de inicio de sesión pedagógico (Frontend-Only con Context API y localStorage).

import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Gem, Lock, Mail, AlertCircle, Info, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login({ onLogin }) {
  const { usuario, iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@joyeria.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  // Si ya está autenticado, redirigir al dashboard
  if (usuario) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Por favor completa el correo y la contraseña.");
      return;
    }

    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    // Credenciales pedagógicas autorizadas
    const CREDENCIALES_VALIDAS = {
      email: "admin@joyeria.com",
      password: "123456",
    };

    if (
      email.trim().toLowerCase() !== CREDENCIALES_VALIDAS.email.toLowerCase() ||
      password !== CREDENCIALES_VALIDAS.password
    ) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    const datosUsuario = {
      email,
      nombre: email.split("@")[0],
      rol: "Administrador de Joyería",
    };

    // Actualizamos el estado global en AuthContext
    iniciarSesion(datosUsuario);

    // Compatibilidad si se pasa la prop
    if (typeof onLogin === "function") {
      onLogin(datosUsuario);
    }

    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12100e] via-[#1a1512] to-[#261d15] flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        {/* LOGO Y ENCABEZADO */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-2xl text-stone-950 shadow-xl mb-3">
            <Gem className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-stone-100 tracking-tight">
            AUREUM <span className="text-amber-400 font-light text-xl block sm:inline">| Joyería Fina</span>
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Sistema de Inventario & Control de Manillas de Oro 18k
          </p>
        </div>

        {/* TARJETA DEL FORMULARIO */}
        <div className="bg-[#1c1815]/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-[#3d332c]">
          <h2 className="text-xl font-bold text-stone-100 mb-2 text-center">
            Iniciar Sesión
          </h2>
          <p className="text-xs text-stone-400 text-center mb-6">
            Ingresa tus credenciales para acceder al panel administrativo
          </p>

          {/* ALERTA DE ERROR */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-950/40 border border-red-900/50 rounded-xl flex items-center gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* CORREO */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@joyeria.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#26211c] rounded-xl border border-[#3d332c] text-sm text-stone-100 placeholder-stone-500 focus:bg-[#2d2621] focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* CONTRASEÑA */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#26211c] rounded-xl border border-[#3d332c] text-sm text-stone-100 placeholder-stone-500 focus:bg-[#2d2621] focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* BOTÓN INGRESAR */}
            <button
              type="submit"
              className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Ingresar al Panel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* AVISO PEDAGÓGICO */}
          <div className="mt-6 pt-5 border-t border-[#2e2621] bg-[#241c16] -mx-8 -mb-8 p-6 rounded-b-3xl text-stone-300 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-amber-400">Nota Pedagógica:</strong> Esta autenticación es <em>Frontend-Only</em> con fines educativos y persiste en <code className="text-amber-300 font-mono bg-amber-950/60 border border-amber-800/40 px-1 py-0.5 rounded">localStorage</code>. En producción real, la seguridad requiere tokens JWT, hash de contraseñas y base de datos en el backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
