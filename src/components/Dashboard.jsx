// Archivo: src/components/Dashboard.jsx
// Vista principal del Dashboard con métricas clave y catálogo rápido.

import { Link } from "react-router-dom";
import {
  Gem,
  DollarSign,
  Package,
  AlertTriangle,
  Plus,
  Layers,
  ArrowRight,
  RefreshCw,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function Dashboard({
  productos = [],
  cargando = false,
  error = "",
  usuario = null,
  onReintentar,
}) {
  // Cálculos de métricas estadísticas
  const totalModelos = productos.length;
  const totalStock = productos.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const valorTotalInventario = productos.reduce(
    (acc, p) => acc + (Number(p.precio) || 0) * (Number(p.stock) || 0),
    0
  );
  const productosBajoStock = productos.filter((p) => Number(p.stock) <= 3);

  return (
    <div className="space-y-8">
      {/* BANNER DE BIENVENIDA Y ACCIONES RÁPIDAS */}
      <div className="bg-gradient-to-r from-[#181412] via-[#221c18] to-[#2d221a] text-stone-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-[#332b25] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Panel Administrativo AUREUM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-100">
              ¡Bienvenido, {usuario?.nombre || "Administrador"}!
            </h1>
            <p className="text-stone-300 text-sm mt-1 max-w-xl">
              Aquí puedes supervisar las existencias de manillas de oro 18k, su valuación en inventario y registrar nuevos modelos en el catálogo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/nuevo"
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Manilla</span>
            </Link>

            <Link
              to="/inventario"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#26211c] hover:bg-[#332b25] text-stone-200 font-semibold text-sm rounded-xl border border-[#3d332c] backdrop-blur-xs transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>Ver Inventario</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ESTADO DE CARGA */}
      {cargando && (
        <div className="flex flex-col items-center justify-center py-16 bg-[#1c1815] rounded-3xl border border-[#2e2621]">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
          <p className="text-sm font-medium text-stone-400">Consultando datos del catálogo...</p>
        </div>
      )}

      {/* ESTADO DE ERROR */}
      {error && !cargando && (
        <div className="bg-red-950/40 border border-red-900/50 rounded-2xl p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-red-300">Error al conectar con la API</h3>
          <p className="text-xs text-red-400 mt-1 mb-4">{error}</p>
          <button
            onClick={onReintentar}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reintentar Conexión
          </button>
        </div>
      )}

      {/* TARJETAS DE MÉTRICAS */}
      {!cargando && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* CARD 1: TOTAL MODELOS */}
            <div className="bg-[#1c1815] p-5 rounded-2xl border border-[#2e2621] shadow-xs flex items-center gap-4">
              <div className="p-3 bg-amber-950/40 rounded-2xl text-amber-400 border border-amber-900/40">
                <Gem className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-stone-400">Modelos de Manillas</p>
                <h3 className="text-2xl font-bold text-stone-100">{totalModelos}</h3>
              </div>
            </div>

            {/* CARD 2: UNIDADES EN STOCK */}
            <div className="bg-[#1c1815] p-5 rounded-2xl border border-[#2e2621] shadow-xs flex items-center gap-4">
              <div className="p-3 bg-blue-950/40 rounded-2xl text-blue-400 border border-blue-900/40">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-stone-400">Unidades Disponibles</p>
                <h3 className="text-2xl font-bold text-stone-100">{totalStock} <span className="text-xs font-normal text-stone-500">uds</span></h3>
              </div>
            </div>

            {/* CARD 3: VALOR TOTAL */}
            <div className="bg-[#1c1815] p-5 rounded-2xl border border-[#2e2621] shadow-xs flex items-center gap-4">
              <div className="p-3 bg-emerald-950/40 rounded-2xl text-emerald-400 border border-emerald-900/40">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-stone-400">Valor Total Inventario</p>
                <h3 className="text-2xl font-bold text-stone-100">
                  ${valorTotalInventario.toLocaleString()}
                </h3>
              </div>
            </div>

            {/* CARD 4: BAJO STOCK */}
            <div className="bg-[#1c1815] p-5 rounded-2xl border border-[#2e2621] shadow-xs flex items-center gap-4">
              <div className="p-3 bg-rose-950/40 rounded-2xl text-rose-400 border border-rose-900/40">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-stone-400">Stock Crítico (≤ 3)</p>
                <h3 className="text-2xl font-bold text-stone-100">
                  {productosBajoStock.length}{' '}
                  <span className="text-xs font-normal text-rose-400 font-semibold">
                    {productosBajoStock.length > 0 ? '¡Atención!' : 'Todo OK'}
                  </span>
                </h3>
              </div>
            </div>
          </div>

          {/* VISTA RÁPIDA DE MANILLAS */}
          <div className="bg-[#1c1815] rounded-3xl p-6 sm:p-8 border border-[#2e2621] shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#2e2621] pb-4">
              <div>
                <h2 className="text-lg font-bold text-stone-100">Catálogo Destacado</h2>
                <p className="text-xs text-stone-400">Últimos modelos de manillas de oro disponibles</p>
              </div>
              <Link
                to="/inventario"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Administrar todas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...productos].reverse().slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="border border-[#332b25] rounded-2xl overflow-hidden hover:shadow-md hover:border-amber-500/40 transition-all flex flex-col group bg-[#221c18]"
                >
                  <div className="h-40 bg-[#181412] relative overflow-hidden">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 bg-stone-950/80 backdrop-blur-xs text-stone-200 text-[11px] px-2 py-0.5 rounded-full font-medium">
                      {item.peso}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                        {item.material}
                      </span>
                      <h3 className="font-bold text-stone-100 text-sm line-clamp-1 mt-0.5">
                        {item.nombre}
                      </h3>
                      <p className="text-xs text-stone-400 line-clamp-2 mt-1">
                        {item.descripcion}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#2e2621] flex items-center justify-between">
                      <span className="text-sm font-bold text-stone-100">
                        ${Number(item.precio).toLocaleString()}
                      </span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                          item.stock > 0
                            ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/40'
                            : 'bg-red-950/40 text-red-300 border border-red-900/40'
                        }`}
                      >
                        Stock: {item.stock}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
