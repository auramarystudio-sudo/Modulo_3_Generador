// ============================================
// NEGATIVE EDITOR - Textarea de negativos + categorías
// ============================================
import { useState } from 'react';
import { Ban, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { negativesPorCategoria } from '../../data/prompt-data.js';

export default function NegativeEditor({ value, onChange }) {
  const [categoriaExpandida, setCategoriaExpandida] = useState(null);

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
  };

  return (
    <div className="bg-slate-900 border border-red-900/30 rounded-xl overflow-hidden">
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

      {/* Categorías de negativos */}
      <div className="border-t border-red-900/30 p-3">
        <p className="text-xs text-slate-500 mb-2 font-medium">Añadir por categoría:</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(negativesPorCategoria).map(([key, cat]) => (
            <div key={key} className="relative group">
              <button
                onClick={() => setCategoriaExpandida(categoriaExpandida === key ? null : key)}
                className="bg-red-950/50 border border-red-900/50 text-red-300 hover:bg-red-900/50 text-xs px-2.5 py-1 rounded flex items-center gap-1 transition"
              >
                <span>{cat.icono}</span>
                <span>{cat.nombre}</span>
                {categoriaExpandida === key ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </button>

              {/* Dropdown con items individuales */}
              {categoriaExpandida === key && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-slate-800 border border-slate-700 rounded-lg p-2 min-w-[200px] shadow-xl">
                  <button
                    onClick={() => { añadirCategoria(key); setCategoriaExpandida(null); }}
                    className="w-full text-left text-xs text-cyan-300 hover:text-cyan-200 px-2 py-1 rounded hover:bg-slate-700 mb-1 flex items-center gap-1"
                  >
                    <Plus size={10} />
                    Añadir todos
                  </button>
                  <div className="border-t border-slate-700 my-1"></div>
                  <div className="max-h-[200px] overflow-y-auto">
                    {cat.items.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => añadirNegativo(item)}
                        className="w-full text-left text-xs text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-slate-700 transition"
                      >
                        + {item}
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
