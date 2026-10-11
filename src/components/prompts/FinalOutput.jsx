// ============================================
// FINAL OUTPUT - Bloque final + envío a interfaces + exportación
// ============================================
import { useState } from 'react';
import { Copy, Check, Download, Share2, FileJson, FileText } from 'lucide-react';
import { formatearParaExportar } from '../../utils/prompt-engine.js';

export default function FinalOutput({ prompt, negative, params, onGuardar }) {
  const [copiado, setCopiado] = useState(false);
  const [formatoExport, setFormatoExport] = useState('texto');
  const [copiadoExport, setCopiadoExport] = useState(false);

  // Estimar tokens
  const estimarTokens = (texto) => {
    if (!texto) return 0;
    return Math.ceil(texto.split(/\s+/).filter(w => w).length * 1.3);
  };

  const tokensPrompt = estimarTokens(prompt);
  const tokensNegative = estimarTokens(negative);
  const alertaNaranja = tokensPrompt > 75;

  // Copiar prompt
  const copiarPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // Exportar en formato
  const exportarPrompt = () => {
    const textoExport = formatearParaExportar(prompt, negative, params, formatoExport);
    navigator.clipboard.writeText(textoExport);
    setCopiadoExport(true);
    setTimeout(() => setCopiadoExport(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-cyan-800/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-gradient-to-r from-cyan-900/20 to-transparent">
        <div className="flex items-center gap-2">
          <Share2 size={16} className="text-cyan-400" />
          <span className="text-sm font-semibold text-cyan-300">Prompt Final</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${alertaNaranja ? 'text-orange-400' : 'text-slate-500'}`}>
            ~{tokensPrompt} tokens
          </span>
        </div>
      </div>

      {/* Prompt positivo final */}
      <div className="p-4 space-y-3">
        <div className="relative">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 min-h-[80px]">
            <p className="text-sm text-slate-100 font-mono whitespace-pre-wrap break-words">
              {prompt || <span className="text-slate-600 italic">El prompt final aparecerá aquí...</span>}
            </p>
          </div>
          <button
            onClick={copiarPrompt}
            disabled={!prompt}
            className="absolute top-2 right-2 text-cyan-400 hover:text-cyan-300 disabled:text-slate-600 transition p-1 rounded hover:bg-slate-800"
            title="Copiar prompt"
          >
            {copiado ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
        </div>

        {/* Prompt negativo final */}
        {negative && (
          <div className="relative">
            <p className="text-xs text-red-400 mb-1 font-medium">Negativo:</p>
            <div className="bg-slate-950 border border-red-900/30 rounded-lg p-3">
              <p className="text-xs text-red-300/80 font-mono whitespace-pre-wrap break-words">
                {negative}
              </p>
            </div>
            <span className="text-xs text-slate-500 mt-1">~{tokensNegative} tokens</span>
          </div>
        )}

        {/* Parámetros */}
        {params && (
          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            {params.steps && <span>Steps: {params.steps}</span>}
            {params.sampler && <span>• Sampler: {params.sampler}</span>}
            {params.cfg && <span>• CFG: {params.cfg}</span>}
            {params.width && <span>• {params.width}x{params.height}</span>}
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="border-t border-slate-800 p-3 space-y-3">
        {/* Exportación multi-formato */}
        <div className="flex items-center gap-2">
          <select
            value={formatoExport}
            onChange={(e) => setFormatoExport(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="texto">Texto Plano</option>
            <option value="a1111">A1111 Format</option>
            <option value="comfyui">ComfyUI JSON</option>
            <option value="midjourney">Midjourney</option>
          </select>
          <button
            onClick={exportarPrompt}
            disabled={!prompt}
            className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-200 py-1.5 rounded-lg text-sm flex items-center justify-center gap-2 transition"
          >
            {copiadoExport ? <Check size={14} className="text-green-400" /> : <Download size={14} />}
            {copiadoExport ? '¡Copiado!' : 'Copiar/Exportar'}
          </button>
        </div>

        {/* Botón guardar */}
        <button
          onClick={onGuardar}
          disabled={!prompt}
          className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:text-slate-500 text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
        >
          💾 Guardar en Historial
        </button>
      </div>
    </div>
  );
}
