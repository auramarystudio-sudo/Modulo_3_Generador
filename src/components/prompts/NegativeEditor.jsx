// ============================================
// NEGATIVE EDITOR - Textarea de negativos + categorías
// Dropdown sin overflow-hidden para evitar recortes
// ============================================
import { useState, useRef, useEffect } from 'react';
import { Ban, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { negativesPorCategoria } from '../../data/prompt-data.js';

export default function NegativeEditor({ value, onChange }) {
  const [categoriaExpandida, setCategoriaExpandida] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: true });
  const wrapperRef = useRef(null);
  const buttonRefs = useRef({});

  // Detectar si el dropdown debe abrir hacia arriba o abajo
  useEffect(() => {
    if (categoriaExpandida && buttonRefs.current[categoriaExpandida]) {
      const btn = buttonRefs.current[categoriaExpandida];
      const rect = btn.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setDropdownPos({ top: spaceBelow < 280 });
    }
  }, [categoriaExpandida]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setCategoriaExpandida(null);
      }
    };
    if (categoriaExpandida) {
      // Usar timeout para evitar que el click que abrió el dropdown lo cierre inmediatamente
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [categoriaExpandida]);

  // Añadir un negativo específico
  const añadirNegativo = (item) => {
    const actual = value.trim();
    const nuevo = actual ? `${actual}, ${item}` : item;
    onChange(nuevo);
  };

  // Añadir todos los negativos de una categoría
  const añadirCategoria = (catKey) => {
    const cat = negativesPorCategoria[catKey];
    if (!cat) return;
    const actual = value.trim();
    const nuevos = cat.items.join(', ');
    const resultado = actual ? `${actual}, ${nuevos}` : nuevos;
    onChange(resultado);
    setCategoriaExpandida(null);
  };

  return (
    <div ref={wrapperRef} className="relative bg-slate-900 border border-red-900/30 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-red-900/30">
        <div className="flex items-center gap-2">
          <Ban size={16} className="text-red-400" />
          <span className="text-sm font-semibold text-red-300">Prompt Negativo</span>
        </div>
        <span className="text-xs text-slate-500">{value.length} chars</span>
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Negativos: worst quality, low quality, blurry, deformed..."
        className="w-full bg-slate-950 text-red-300 font-mono text-sm p-4 min-h-[80px] resize-y focus:outline-none focus:ring-2 focus:ring-red-500/50 placeholder:text-slate-600"
      />

      {/* Categorías de negativos - SIN overflow-hidden */}
      <div className="border-t border-red-900/30 p-3">
        <p className="text-xs text-slate-500 mb-2 font-medium">Añadir por categoría:</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(negativesPorCategoria).map(([key, cat]) => (
            <div key={key} className="relative">
              <button
                ref={(el) => (buttonRefs.current[key] = el)}
                onClick={() => setCategoriaExpandida(categoriaExpandida === key ? null : key)}
                className={`border text-xs px-2.5 py-1 rounded flex items-center gap-1 transition ${
                  categoriaExpandida === key
                    ? 'bg-red-900/60 border-red-600 text-red-200 ring-1 ring-red-500/30'
                    : 'bg-red-950/50 border-red-900/50 text-red-300 hover:bg-red-900/50'
                }`}
              >
                <span>{cat.icono}</span>
                <span>{cat.nombre}</span>
                {categoriaExpandida === key ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </button>

              {/* Dropdown - posicionado fuera del flujo con z-index alto */}
              {categoriaExpandida === key && (
                <div
                  className={`absolute left-0 z-[100] bg-slate-800 border border-slate-600 rounded-xl p-2 min-w-[230px] shadow-2xl shadow-black/60 ${
                    dropdownPos.top
                      ? 'bottom-full mb-1.5'
                      : 'top-full mt-1.5'
                  }`}
                >
                  {/* Header del dropdown */}
                  <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-slate-700">
                    <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <span>{cat.icono}</span>
                      {cat.nombre}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => añadirCategoria(key)}
                        className="text-[11px] text-cyan-300 hover:text-cyan-200 px-2 py-0.5 rounded hover:bg-cyan-900/30 flex items-center gap-1 transition font-medium"
                      >
                        <Plus size={10} />
                        Todos
                      </button>
                      <button
                        onClick={() => setCategoriaExpandida(null)}
                        className="text-slate-500 hover:text-slate-300 p-0.5 rounded hover:bg-slate-700 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Lista scrollable de items */}
                  <div className="max-h-[200px] overflow-y-auto space-y-0.5 pr-1">
                    {cat.items.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => añadirNegativo(item)}
                        className="w-full text-left text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-slate-700/80 transition flex items-center gap-2 group"
                      >
                        <span className="text-red-400/70 group-hover:text-red-400 text-[10px] font-bold">+</span>
                        <span className="truncate">{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
