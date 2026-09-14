// Archivo: src/components/Navbar.jsx
// Barra de navegación superior con enlaces de ruta, información de usuario y botón de salida.

import { Link, NavLink } from "react-router-dom";
import { Gem, LayoutDashboard, Layers, PlusCircle, LogOut, User } from "lucide-react";

export default function Navbar({ usuario, onLogout }) {
  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm"
        : "text-stone-300 hover:text-amber-400 hover:bg-[#26211c]"
    }`;

  return (
    <header className="bg-[#181412]/95 backdrop-blur-md border-b border-[#2e2621] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-tr from-amber-600 to-yellow-400 rounded-xl text-stone-950 shadow-md group-hover:scale-105 transition-transform">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-stone-100 block leading-tight">
                AUREUM <span className="text-amber-400 font-medium text-xs tracking-widest uppercase">Oro 18k</span>
              </span>
              <span className="text-[11px] text-stone-400 font-medium block">
                Panel de Control Joyería
              </span>
            </div>
          </Link>

          {/* Enlaces de Navegación */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkStyle}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/inventario" className={navLinkStyle}>
              <Layers className="w-4 h-4" />
              <span>Inventario</span>
            </NavLink>

            <NavLink to="/nuevo" className={navLinkStyle}>
              <PlusCircle className="w-4 h-4" />
              <span>Nueva Manilla</span>
            </NavLink>
          </nav>

          {/* Usuario y Botón Cerrar Sesión */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#221c18] border border-[#332b25] rounded-full">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-medium text-stone-200">
                {usuario?.nombre || usuario?.email}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>

        {/* Barra Móvil */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-[#2e2621] gap-1">
          <NavLink to="/" end className={navLinkStyle}>
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-xs">Dashboard</span>
          </NavLink>
          <NavLink to="/inventario" className={navLinkStyle}>
            <Layers className="w-4 h-4" />
            <span className="text-xs">Inventario</span>
          </NavLink>
          <NavLink to="/nuevo" className={navLinkStyle}>
            <PlusCircle className="w-4 h-4" />
            <span className="text-xs">+ Nueva</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
