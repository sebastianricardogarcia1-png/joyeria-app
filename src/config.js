// Archivo: src/config.js
// Este archivo centraliza las configuraciones reutilizables de la aplicación.
// Si cambia la URL del backend (en Render o local), solo se modifica aquí.

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// URL base para el endpoint de productos
export const API_BASE_URL = BASE.endsWith("/productos") ? BASE : `${BASE}/productos`;

// Información general del proyecto
export const APP_INFO = {
  ficha: "ADSO",
  titulo: "AUREUM Joyería Fina",
  subtitulo: "Sistema de gestión y control de inventario de manillas de oro 18k.",
};
