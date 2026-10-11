// ============================================
// PROMPT EDITOR - Textarea del prompt principal
// ============================================
import { useRef, useEffect } from 'react';
import { Type, Sparkles, Trash2 } from 'lucide-react';

export default function PromptEditor({ value, onChange, onCursorChange, placeholder }) {
  const textareaRef = useRef(null);

  // Reportar posición del cursor al padre
  const handleCursorChange = () => {
    if (textareaRef.current && onCursorChange) {
      onCursorChange(textareaRef.current.selectionStart);
    }
  };

  // Contar tokens estimados
  const tokensEstimados = value ? Math.ceil(value.split(/\s+/).filter(w => w).length * 1.3) : 0;
  const alertaNaranja = tokensEstimados > 75;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Type size={16} className="text-cyan-400" />
          <span className="text-sm font-semibold text-slate-200">Prompt Positivo</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs ${alertaNaranja ? 'text-orange-400' : 'text-slate-500'}`}>
            ~{tokensEstimados} tokens {alertaNaranja && '⚠️'}
          </span>
          <button
            onClick={() => onChange('')}
            className="text-slate-500 hover:text-red-400 transition"
            title="Limpiar"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={handleCursorChange}
        onKeyUp={handleCursorChange}
        placeholder={placeholder || "Describe lo que quieres generar... (ej: una guerrera elfa en un bosque mágico)"}
        className="w-full bg-slate-950 text-slate-100 font-mono text-sm p-4 min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-slate-600"
      />

      {/* Footer con info */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800 bg-slate-900/50">
        <span className="text-xs text-slate-500">
          {value.length} caracteres
        </span>
        <div className="flex items-center gap-2">
          <Sparkles size={12} className="text-cyan-500" />
          <span className="text-xs text-slate-500">
            {'Usa {{macros}} para insertar bloques predefinidos'}
          </span>
        </div>
      </div>
    </div>
  );
}
