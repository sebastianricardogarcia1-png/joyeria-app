// Archivo: src/components/Inventario.jsx
// Vista completa de inventario: listado en tabla, búsqueda en tiempo real, ordenamiento y modal de eliminación.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ArrowUpDown,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Gem,
  AlertTriangle,
} from "lucide-react";

export default function Inventario({
  productos = [],
  cargando = false,
  error = "",
  mensajeExito = "",
  setMensajeExito,
  onEliminar,
  onReintentar,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("nombre-asc");
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const navigate = useNavigate();

  // Filtrado reactivo en tiempo real
  const productosFiltrados = productos.filter((p) => {
    const termino = busqueda.toLowerCase();
    const nombre = (p.nombre || "").toLowerCase();
    const material = (p.material || "").toLowerCase();
    return nombre.includes(termino) || material.includes(termino);
  });

  // Ordenamiento de la lista
  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    switch (orden) {
      case "precio-asc":
        return Number(a.precio) - Number(b.precio);
      case "precio-desc":
        return Number(b.precio) - Number(a.precio);
      case "nombre-asc":
        return a.nombre.localeCompare(b.nombre);
      case "nombre-desc":
        return b.nombre.localeCompare(a.nombre);
      case "stock-asc":
        return Number(a.stock) - Number(b.stock);
      case "stock-desc":
        return Number(b.stock) - Number(a.stock);
      default:
        return 0;
    }
  });

  // Confirmar eliminación desde el modal
  const handleConfirmarEliminar = async () => {
    if (!productoAEliminar) return;

    try {
      setEliminando(true);
      await onEliminar(productoAEliminar.id, productoAEliminar.nombre);
      setProductoAEliminar(null);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ENCABEZADO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-100">
            Inventario de Manillas de Oro
          </h1>
          <p className="text-sm text-stone-400">
            Administra, filtra y mantén al día las existencias de joyas.
          </p>
        </div>

        <Link
          to="/nuevo"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Manilla</span>
        </Link>
      </div>

      {/* MENSAJE DE ÉXITO (FEEDBACK VISUAL) */}
      {mensajeExito && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-900/50 rounded-2xl flex items-center justify-between text-emerald-300 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">{mensajeExito}</span>
          </div>
          <button
            onClick={() => setMensajeExito("")}
            className="text-emerald-400 hover:text-emerald-200 text-xs font-bold px-2 py-1 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* BARRA DE FILTROS: BÚSQUEDA Y ORDEN */}
      <div className="bg-[#1c1815] p-4 rounded-2xl border border-[#2e2621] shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* BUSCADOR EN TIEMPO REAL */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-500" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o material (ej: Cubano, 18k)..."
            className="w-full pl-10 pr-4 py-2 bg-[#26211c] border border-[#3d332c] rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:bg-[#2d2621] focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all"
          />
        </div>

        {/* SELECT DE ORDENAMIENTO */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <ArrowUpDown className="w-4 h-4 text-stone-400 shrink-0" />
          <span className="text-xs font-semibold text-stone-400 whitespace-nowrap">Ordenar por:</span>
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="w-full sm:w-auto bg-[#26211c] border border-[#3d332c] rounded-xl px-3 py-2 text-sm font-medium text-stone-200 focus:bg-[#2d2621] focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
          >
            <option value="nombre-asc">Nombre: A - Z</option>
            <option value="nombre-desc">Nombre: Z - A</option>
            <option value="precio-asc">Precio: Menor a Mayor</option>
            <option value="precio-desc">Precio: Mayor a Menor</option>
            <option value="stock-asc">Stock: Menor a Mayor</option>
            <option value="stock-desc">Stock: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {/* ESTADO DE CARGA */}
      {cargando && (
        <div className="py-20 flex flex-col items-center justify-center bg-[#1c1815] rounded-3xl border border-[#2e2621]">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
          <p className="text-sm font-medium text-stone-400">Cargando inventario desde la API...</p>
        </div>
      )}

      {/* ESTADO DE ERROR */}
      {error && !cargando && (
        <div className="bg-red-950/40 border border-red-900/50 rounded-3xl p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-red-300">No se pudo cargar el inventario</h3>
          <p className="text-xs text-red-400 mt-1 mb-4">{error}</p>
          <button
            onClick={onReintentar}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reintentar
          </button>
        </div>
      )}

      {/* TABLA DE PRODUCTOS */}
      {!cargando && !error && (
        <>
          {productosOrdenados.length === 0 ? (
            <div className="py-16 text-center bg-[#1c1815] rounded-3xl border border-[#2e2621] p-6">
              <Gem className="w-10 h-10 text-stone-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-200">No se encontraron manillas</h3>
              <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                {busqueda
                  ? `No hay resultados para la búsqueda "${busqueda}". Intenta con otro término.`
                  : "Aún no hay manillas registradas en el catálogo."}
              </p>
              {busqueda && (
                <button
                  onClick={() => setBusqueda("")}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-amber-400 hover:bg-[#26211c] rounded-lg transition-colors cursor-pointer"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          ) : (
            <div className="bg-[#1c1815] rounded-3xl border border-[#2e2621] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-stone-300">
                  <thead className="bg-[#181412] border-b border-[#2e2621] text-xs font-bold uppercase tracking-wider text-stone-400">
                    <tr>
                      <th className="py-4 px-4 sm:px-6">Manilla</th>
                      <th className="py-4 px-4">Material / Peso</th>
                      <th className="py-4 px-4">Precio</th>
                      <th className="py-4 px-4">Stock</th>
                      <th className="py-4 px-4 sm:px-6 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#26211c]">
                    {productosOrdenados.map((item) => (
                      <tr key={item.id} className="hover:bg-[#221c18] transition-colors">
                        {/* IMAGEN Y NOMBRE */}
                        <td className="py-4 px-4 sm:px-6 flex items-center gap-3">
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            className="w-12 h-12 object-cover rounded-xl border border-[#332b25] shrink-0"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1611591475155-4284ec28d351?auto=format&fit=crop&w=600&q=80";
                            }}
                          />
                          <div>
                            <span className="font-bold text-stone-100 block">{item.nombre}</span>
                            <span className="text-xs text-stone-400 line-clamp-1 max-w-xs">{item.descripcion}</span>
                          </div>
                        </td>

                        {/* MATERIAL Y PESO */}
                        <td className="py-4 px-4">
                          <span className="font-semibold text-amber-400 block text-xs">{item.material}</span>
                          <span className="text-xs text-stone-400">{item.peso}</span>
                        </td>

                        {/* PRECIO */}
                        <td className="py-4 px-4 font-bold text-stone-100">
                          ${Number(item.precio).toLocaleString()} COP
                        </td>

                        {/* STOCK */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              item.stock > 3
                                ? "bg-emerald-950/40 text-emerald-300 border border-emerald-900/40"
                                : item.stock > 0
                                ? "bg-amber-950/40 text-amber-300 border border-amber-900/40"
                                : "bg-red-950/40 text-red-300 border border-red-900/40"
                            }`}
                          >
                            {item.stock > 0 ? `${item.stock} unidades` : "Agotado"}
                          </span>
                        </td>

                        {/* ACCIONES (EDITAR / ELIMINAR) */}
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/editar/${item.id}`)}
                              className="p-2 text-stone-400 hover:text-amber-400 hover:bg-[#26211c] rounded-xl transition-colors cursor-pointer"
                              title="Editar manilla"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setProductoAEliminar(item)}
                              className="p-2 text-stone-400 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                              title="Eliminar manilla"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR */}
      {productoAEliminar && (
        <div className="fixed inset-0 z-50 bg-[#0d0b0a]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1c1815] rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-[#3d332c] animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-red-950/40 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-900/40">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-stone-100 text-center">
              ¿Eliminar Manilla?
            </h3>
            <p className="text-xs text-stone-400 text-center mt-1 mb-6">
              Esta acción eliminará <strong className="text-stone-200 font-semibold">"{productoAEliminar.nombre}"</strong> permanentemente del inventario.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setProductoAEliminar(null)}
                disabled={eliminando}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-stone-300 hover:bg-[#26211c] rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmarEliminar}
                disabled={eliminando}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {eliminando ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <span>Sí, Eliminar</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
