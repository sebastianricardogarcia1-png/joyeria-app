// Archivo: src/api.js
// Este archivo contiene todas las funciones para comunicarse con la API de JSON Server (CRUD).
import { API_BASE_URL } from "./config";

const API = API_BASE_URL;

// 1. GET: Listar todos los productos del inventario
export async function listarProductos() {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Error al consultar los productos del inventario");
  return res.json();
}

// 2. GET: Obtener un solo producto por su ID
export async function obtenerProductoPorId(id) {
  const res = await fetch(`${API}/${id}`);
  if (!res.ok) throw new Error(`No se encontró el producto con ID ${id}`);
  return res.json();
}

// 3. POST: Crear una nueva manilla en la API
export async function crearProducto(datos) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error("Error al guardar la nueva manilla");
  return res.json();
}

// 4. PUT: Actualizar una manilla existente por su ID
export async function actualizarProducto(id, datos) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error("Error al actualizar los datos de la manilla");
  return res.json();
}

// 5. DELETE: Eliminar una manilla por su ID
export async function eliminarProductoPorId(id) {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar la manilla del inventario");
  return true;
}
