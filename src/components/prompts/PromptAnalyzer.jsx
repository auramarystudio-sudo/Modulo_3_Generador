// ============================================
// PROMPT ANALYZER - Analizador de prompts existentes (MEJORA #3)
// ============================================
import { useState } from 'react';
import { Search, Star, AlertCircle, BarChart3 } from 'lucide-react';
import { analizarPrompt } from '../../utils/prompt-engine.js';

export default function PromptAnalyzer({ onUseResult }) {
  const [promptAnalizar, setPromptAnalizar] = useState('');
  const [resultado, setResultado] = useState(null);

  const handleAnalizar = () => {
    const result = analizarPrompt(promptAnalizar);
    setResultado(result);
    if (onUseResult) onUseResult(result);
  };

  // Color del score
  const scoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  // Barra de progreso del score
  const scoreBarColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-cyan-400" />
          <span className="text-sm font-semibold text-slate-200">Analizador de Prompts</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <textarea
          value={promptAnalizar}
          onChange={(e) => setPromptAnalizar(e.target.value)}
          placeholder="Pega aquí un prompt para analizar su calidad, detectar estilos y recibir sugerencias..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono h-24 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-slate-600"
        />

        <button
          onClick={handleAnalizar}
          disabled={!promptAnalizar.trim()}
          className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm py-2 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Search size={14} />
          Analizar Prompt
        </button>

        {/* Resultados */}
        {resultado && (
          <div className="space-y-3 pt-2">
            {/* Score */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">Score de calidad</span>
                  <span className={`text-sm font-bold ${scoreColor(resultado.score)}`}>
                    {resultado.score}/100
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${scoreBarColor(resultado.score)}`}
                    style={{ width: `${resultado.score}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-slate-200">{resultado.wordCount}</p>
                <p className="text-xs text-slate-500">Elementos</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-slate-200">~{resultado.tokens}</p>
                <p className="text-xs text-slate-500">Tokens est.</p>
              </div>
            </div>

            {/* Estilos detectados */}
            {resultado.estilosDetectados.length > 0 && (
              <div>
                <p className="text-xs text-slate-400 mb-1.5 flex items-center gap-1">
                  <Star size={12} className="text-yellow-400" />
                  Estilos detectados:
                </p>
                <div className="flex flex-wrap gap-1">
                  {resultado.estilosDetectados.map((estilo, i) => (
                    <span key={i} className="bg-cyan-900/30 text-cyan-300 text-xs px-2 py-1 rounded border border-cyan-800/50">
                      {estilo}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sugerencias */}
            {resultado.sugerencias.length > 0 && (
              <div>
                <p className="text-xs text-slate-400 mb-1.5 flex items-center gap-1">
                  <AlertCircle size={12} className="text-orange-400" />
                  Sugerencias:
                </p>
                <ul className="space-y-1">
                  {resultado.sugerencias.map((sug, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <span className="text-orange-400 mt-0.5">•</span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
