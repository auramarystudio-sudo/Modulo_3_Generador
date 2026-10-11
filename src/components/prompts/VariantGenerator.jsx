// ============================================
// VARIANT GENERATOR - Generador de variantes A/B (MEJORA #7)
// ============================================
import { useState } from 'react';
import { Shuffle, Copy, Check, ArrowRight } from 'lucide-react';
import { generarVariantes } from '../../utils/prompt-engine.js';

export default function VariantGenerator({ promptBase, estilosSeleccionados, onUseVariant }) {
  const [variantes, setVariantes] = useState([]);
  const [copiadoId, setCopiadoId] = useState(null);

  const handleGenerar = () => {
    const nuevasVariantes = generarVariantes(promptBase, estilosSeleccionados);
    setVariantes(nuevasVariantes);
  };

  const copiarVariante = (variante) => {
    navigator.clipboard.writeText(variante.prompt);
    setCopiadoId(variante.id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Shuffle size={16} className="text-purple-400" />
          <span className="text-sm font-semibold text-slate-200">Generar Variantes</span>
        </div>
        <span className="text-xs text-slate-500">A/B Testing</span>
      </div>

      <div className="p-4 space-y-3">
        <button
          onClick={handleGenerar}
          disabled={!promptBase}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500 text-white py-2.5 rounded-lg text-sm font-medium transition"
        >
          <Shuffle size={16} />
          Generar 4 Variantes
        </button>

        {/* Variantes generadas */}
        {variantes.length > 0 && (
          <div className="space-y-2">
            {variantes.map(v => (
              <div key={v.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 group hover:border-purple-800 transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded">
                      {v.id}
                    </span>
                    <span className="text-xs text-slate-300">{v.nombre}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copiarVariante(v)}
                      className="p-1 text-slate-500 hover:text-cyan-400 transition rounded"
                    >
                      {copiadoId === v.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                    </button>
                    <button
                      onClick={() => onUseVariant && onUseVariant(v.prompt)}
                      className="p-1 text-slate-500 hover:text-purple-400 transition rounded"
                      title="Usar esta variante"
                    >
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-mono line-clamp-2">{v.prompt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
