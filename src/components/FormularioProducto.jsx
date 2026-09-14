// Archivo: src/components/FormularioProducto.jsx
// Formulario controlado para crear y editar manillas de oro, con validaciones y vista previa en tiempo real.

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, X, Image, DollarSign, Package, Tag, FileText, Sparkles, Loader2, ArrowLeft } from "lucide-react";

const IMAGEN_DEFAULT =
  "https://images.unsplash.com/photo-1611591475155-4284ec28d351?auto=format&fit=crop&w=600&q=80";

export default function FormularioProducto({
  productos = [],
  onAgregar,
  onActualizar,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Si viene un ID en la URL, buscamos el producto para editar
  const productoAEditar = id ? productos.find((p) => String(p.id) === String(id)) : null;

  // Estado del formulario
  const [form, setForm] = useState({
    nombre: "",
    material: "Oro 18k",
    peso: "",
    precio: "",
    stock: "",
    imagen: "",
    descripcion: "",
  });

  // Estado para mensajes de error de validación
  const [errores, setErrores] = useState({});

  // Estado de carga mientras se envía a la API
  const [enviando, setEnviando] = useState(false);

  // Cargamos los datos del producto si estamos en modo edición
  useEffect(() => {
    if (productoAEditar) {
      setForm({
        nombre: productoAEditar.nombre || "",
        material: productoAEditar.material || "Oro 18k",
        peso: productoAEditar.peso || "",
        precio: productoAEditar.precio !== undefined ? productoAEditar.precio : "",
        stock: productoAEditar.stock !== undefined ? productoAEditar.stock : "",
        imagen: productoAEditar.imagen || "",
        descripcion: productoAEditar.descripcion || "",
      });
    } else {
      setForm({
        nombre: "",
        material: "Oro 18k",
        peso: "",
        precio: "",
        stock: "",
        imagen: "",
        descripcion: "",
      });
    }

    setErrores({});
  }, [productoAEditar]);

  // Manejador de cambio en los inputs
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validación de campos
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre de la manilla es obligatorio.";
    }

    if (!form.material.trim()) {
      nuevosErrores.material = "El material/pureza es obligatorio (ej: Oro 18k).";
    }

    if (!form.peso.trim()) {
      nuevosErrores.peso = "El peso estimado es obligatorio (ej: 8.5g).";
    }

    if (!form.precio || Number(form.precio) <= 0) {
      nuevosErrores.precio = "El precio debe ser un número mayor a 0.";
    }

    if (form.stock === "" || Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) {
      nuevosErrores.stock = "El stock debe ser un número entero mayor o igual a 0.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Envío del formulario
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      setEnviando(true);

      const payload = {
        ...form,
        nombre: form.nombre.trim(),
        material: form.material.trim(),
        peso: form.peso.trim(),
        precio: Number(form.precio),
        stock: Number(form.stock),
        imagen: form.imagen.trim() || IMAGEN_DEFAULT,
        descripcion: form.descripcion.trim(),
      };

      if (productoAEditar) {
        await onActualizar(productoAEditar.id, payload);
      } else {
        await onAgregar(payload);
      }

      // Volvemos al inventario
      navigate("/inventario");
    } finally {
      setEnviando(false);
    }
  };

  const handleCancelar = () => {
    navigate("/inventario");
  };

  const esModoEdicion = Boolean(productoAEditar);

  return (
    <div className="space-y-6">
      {/* BOTÓN VOLVER */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleCancelar}
          className="p-2 bg-[#1c1815] border border-[#2e2621] rounded-xl text-stone-300 hover:text-amber-400 hover:bg-[#26211c] transition-colors cursor-pointer"
          title="Volver al inventario"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-stone-100">
            {esModoEdicion ? `Editar Manilla #${productoAEditar.id}` : "Registrar Nueva Manilla"}
          </h1>
          <p className="text-xs text-stone-400">
            {esModoEdicion
              ? "Actualiza la información técnica y comercial de la joya."
              : "Ingresa los detalles de la nueva manilla de oro 18k."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORMULARIO PRINCIPAL */}
        <form
          onSubmit={onSubmit}
          className="lg:col-span-2 bg-[#1c1815] p-6 sm:p-8 rounded-2xl border border-[#2e2621] shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between border-b border-[#2e2621] pb-4">
            <div>
              <h2 className="text-xl font-bold text-stone-100">
                {esModoEdicion ? "Formulario de Edición" : "Formulario de Registro"}
              </h2>
              <p className="text-sm text-stone-400">
                Completa los campos obligatorios (*) para guardar en la base de datos.
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-950/40 text-amber-300 text-xs font-semibold rounded-full border border-amber-900/40">
              {esModoEdicion ? "Modo Edición" : "Nuevo Registro"}
            </span>
          </div>

          {/* NOMBRE */}
          <div>
            <label className="block text-sm font-semibold text-stone-300 mb-1">
              Nombre de la Manilla *
            </label>
            <div className="relative">
              <Tag className="w-5 h-5 absolute left-3 top-3 text-stone-500" />
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={onChange}
                placeholder="Ej: Manilla Eslabón Cubano Clásica"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                  errores.nombre ? "border-red-500 bg-red-950/20" : "border-[#3d332c] bg-[#26211c]"
                } text-stone-100 placeholder-stone-500 focus:bg-[#2d2621] focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all`}
              />
            </div>
            {errores.nombre && (
              <p className="text-xs text-red-400 mt-1 font-medium">{errores.nombre}</p>
            )}
          </div>

          {/* MATERIAL Y PESO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-300 mb-1">
                Material / Pureza *
              </label>
              <div className="relative">
                <Sparkles className="w-5 h-5 absolute left-3 top-3 text-stone-500" />
                <input
                  type="text"
                  name="material"
                  value={form.material}
                  onChange={onChange}
                  placeholder="Ej: Oro 18k Italiano"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                    errores.material ? "border-red-500 bg-red-950/20" : "border-[#3d332c] bg-[#26211c]"
                  } text-stone-100 placeholder-stone-500 focus:bg-[#2d2621] focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all`}
                />
              </div>
              {errores.material && (
                <p className="text-xs text-red-400 mt-1 font-medium">{errores.material}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-300 mb-1">
                Peso Estimado *
              </label>
              <input
                type="text"
                name="peso"
                value={form.peso}
                onChange={onChange}
                placeholder="Ej: 12.5g"
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errores.peso ? "border-red-500 bg-red-950/20" : "border-[#3d332c] bg-[#26211c]"
                } text-stone-100 placeholder-stone-500 focus:bg-[#2d2621] focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all`}
              />
              {errores.peso && (
                <p className="text-xs text-red-400 mt-1 font-medium">{errores.peso}</p>
              )}
            </div>
          </div>

          {/* PRECIO Y STOCK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-300 mb-1">
                Precio (COP / $) *
              </label>
              <div className="relative">
                <DollarSign className="w-5 h-5 absolute left-3 top-3 text-stone-500" />
                <input
                  type="number"
                  name="precio"
                  value={form.precio}
                  onChange={onChange}
                  placeholder="Ej: 3200000"
                  min="1"
                  step="any"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                    errores.precio ? "border-red-500 bg-red-950/20" : "border-[#3d332c] bg-[#26211c]"
                  } text-stone-100 placeholder-stone-500 focus:bg-[#2d2621] focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all`}
                />
              </div>
              {errores.precio && (
                <p className="text-xs text-red-400 mt-1 font-medium">{errores.precio}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-300 mb-1">
                Cantidad en Stock *
              </label>
              <div className="relative">
                <Package className="w-5 h-5 absolute left-3 top-3 text-stone-500" />
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={onChange}
                  placeholder="Ej: 5"
                  min="0"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                    errores.stock ? "border-red-500 bg-red-950/20" : "border-[#3d332c] bg-[#26211c]"
                  } text-stone-100 placeholder-stone-500 focus:bg-[#2d2621] focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all`}
                />
              </div>
              {errores.stock && (
                <p className="text-xs text-red-400 mt-1 font-medium">{errores.stock}</p>
              )}
            </div>
          </div>

          {/* URL DE IMAGEN */}
          <div>
            <label className="block text-sm font-semibold text-stone-300 mb-1">
              URL de la Imagen (Opcional)
            </label>
            <div className="relative">
              <Image className="w-5 h-5 absolute left-3 top-3 text-stone-500" />
              <input
                type="url"
                name="imagen"
                value={form.imagen}
                onChange={onChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#3d332c] bg-[#26211c] text-stone-100 placeholder-stone-500 focus:bg-[#2d2621] focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all text-sm"
              />
            </div>
            <p className="text-xs text-stone-500 mt-1">Si se deja vacío, se utilizará una imagen por defecto.</p>
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className="block text-sm font-semibold text-stone-300 mb-1">
              Descripción Detallada
            </label>
            <div className="relative">
              <FileText className="w-5 h-5 absolute left-3 top-3 text-stone-500" />
              <textarea
                name="descripcion"
                rows={3}
                value={form.descripcion}
                onChange={onChange}
                placeholder="Describe detalles del tejido, acabado, broche de seguridad..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#3d332c] bg-[#26211c] text-stone-100 placeholder-stone-500 focus:bg-[#2d2621] focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2e2621]">
            <button
              type="button"
              onClick={handleCancelar}
              disabled={enviando}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-stone-300 hover:text-stone-100 bg-[#26211c] hover:bg-[#2d2621] border border-[#3d332c] rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>

            <button
              type="submit"
              disabled={enviando}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-stone-950 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {enviando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{esModoEdicion ? "Guardar Cambios" : "Registrar Manilla"}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* VISTA PREVIA EN TIEMPO REAL */}
        <div className="bg-[#1c1815] p-6 rounded-2xl border border-[#2e2621] shadow-sm h-fit">
          <h3 className="text-sm font-bold text-stone-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Vista Previa de la Tarjeta
          </h3>

          <div className="border border-[#332b25] rounded-2xl overflow-hidden shadow-sm bg-[#221c18]">
            <div className="h-48 bg-[#181412] relative overflow-hidden">
              <img
                src={form.imagen.trim() || IMAGEN_DEFAULT}
                alt="Vista previa"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = IMAGEN_DEFAULT;
                }}
              />
              <span className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-xs text-stone-200 text-xs px-2.5 py-1 rounded-full font-medium">
                {form.peso || "0.0g"}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
                  {form.material || "Oro 18k"}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    Number(form.stock) > 0
                      ? "bg-emerald-950/40 text-emerald-300 border border-emerald-900/40"
                      : "bg-red-950/40 text-red-300 border border-red-900/40"
                  }`}
                >
                  {Number(form.stock) > 0 ? `Stock: ${form.stock}` : "Agotado"}
                </span>
              </div>

              <h4 className="font-bold text-stone-100 line-clamp-1">
                {form.nombre || "Nombre de la Manilla"}
              </h4>

              <p className="text-xs text-stone-400 line-clamp-2">
                {form.descripcion || "Sin descripción todavía..."}
              </p>

              <div className="pt-3 border-t border-[#2e2621] flex items-center justify-between">
                <span className="text-xs text-stone-400">Precio unitario:</span>
                <span className="text-lg font-bold text-amber-400">
                  ${Number(form.precio || 0).toLocaleString()} COP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
