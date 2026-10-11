// ============================================
// QUALITY BOOSTERS - Chips de boosters de calidad
// ============================================
import { useState } from 'react';
import { Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { qualityBoosters } from '../../data/prompt-data.js';

export default function QualityBoosters({ promptValue, onPromptChange }) {
  const [categoriaExpandida, setCategoriaExpandida] = useState('general');

  // Añadir booster al prompt
  const añadirBooster = (item) => {
    const actual = promptValue.trim();
    // No añadir duplicados
    if (actual.toLowerCase().includes(item.toLowerCase())) return;
    const nuevo = actual ? `${actual}, ${item}` : item;
    onPromptChange(nuevo);
  };

  // Verificar si un booster ya está en el prompt
  const estaActivo = (item) => {
    return promptValue.toLowerCase().includes(item.toLowerCase());
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-cyan-400" />
          <span className="text-sm font-semibold text-slate-200">Quality Boosters</span>
        </div>
        <span className="text-xs text-slate-500">1 click para añadir</span>
      </div>

      {/* Categorías */}
      <div className="p-3 space-y-2">
        {/* Tabs de categorías */}
        <div className="flex flex-wrap gap-1">
          {Object.entries(qualityBoosters).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setCategoriaExpandida(categoriaExpandida === key ? null : key)}
              className={`text-xs px-2 py-1 rounded transition flex items-center gap-1 ${
                categoriaExpandida === key
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span>{cat.icono}</span>
              <span>{cat.nombre}</span>
            </button>
          ))}
        </div>

        {/* Chips de la categoría seleccionada */}
        {categoriaExpandida && qualityBoosters[categoriaExpandida] && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {qualityBoosters[categoriaExpandida].items.map((item, i) => {
              const activo = estaActivo(item);
              return (
                <button
                  key={i}
                  onClick={() => añadirBooster(item)}
                  className={`text-xs px-2.5 py-1 rounded cursor-pointer transition ${
                    activo
                      ? 'bg-cyan-800 border border-cyan-600 text-cyan-200'
                      : 'bg-cyan-950/50 border border-cyan-800/50 text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-700'
                  }`}
                >
                  {activo && '✓ '}{item}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
