// ============================================
// MACROS PANEL - Panel de macros del sistema
// ============================================
import { useState } from 'react';
import { Code2, Search, Copy, Check } from 'lucide-react';
import { macrosSistema } from '../../data/prompt-data.js';

export default function MacrosPanel({ onInsertMacro, promptValue, onPromptChange }) {
  const [busqueda, setBusqueda] = useState('');
  const [copiado, setCopiado] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('todos');

  const categorias = [...new Set(macrosSistema.map(m => m.categoria))];

  // Filtrar macros
  const macrosFiltrados = macrosSistema.filter(m => {
    const matchBusqueda = !busqueda || 
      m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.id.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = filtroCategoria === 'todos' || m.categoria === filtroCategoria;
    return matchBusqueda && matchCategoria;
  });

  // Insertar macro en el prompt
  const handleInsertar = (macroId) => {
    if (onInsertMacro) {
      onInsertMacro(macroId);
    } else {
      // Fallback: añadir al final
      const macro = macrosSistema.find(m => m.id === macroId);
      if (macro) {
        const actual = promptValue.trim();
        const nuevo = actual ? `${actual}, {{${macroId}}}` : `{{${macroId}}}`;
        onPromptChange(nuevo);
      }
    }
  };

  // Copiar valor del macro
  const copiarValor = (macro) => {
    navigator.clipboard.writeText(macro.valor);
    setCopiado(macro.id);
    setTimeout(() => setCopiado(null), 2000);
  };

  // Color por categoría
  const colorCategoria = (cat) => {
    const colores = {
      calidad: 'text-yellow-400 bg-yellow-900/20 border-yellow-800/50',
      estilo: 'text-purple-400 bg-purple-900/20 border-purple-800/50',
      negativo: 'text-red-400 bg-red-900/20 border-red-800/50',
      iluminacion: 'text-orange-400 bg-orange-900/20 border-orange-800/50',
      composicion: 'text-green-400 bg-green-900/20 border-green-800/50',
      compuesto: 'text-cyan-400 bg-cyan-900/20 border-cyan-800/50'
    };
    return colores[cat] || 'text-slate-400 bg-slate-800 border-slate-700';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Code2 size={16} className="text-purple-400" />
          <span className="text-sm font-semibold text-slate-200">Macros del Sistema</span>
          <span className="text-xs text-slate-500">({macrosSistema.length})</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="p-3 space-y-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar macro..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setFiltroCategoria('todos')}
            className={`text-xs px-2 py-1 rounded transition ${
              filtroCategoria === 'todos' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Todos
          </button>
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`text-xs px-2 py-1 rounded transition capitalize ${
                filtroCategoria === cat ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de macros */}
      <div className="px-3 pb-3 max-h-[400px] overflow-y-auto space-y-2">
        {macrosFiltrados.map(macro => (
          <div key={macro.id} className={`border rounded-lg p-3 ${colorCategoria(macro.categoria)}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-semibold">
                  {'{{'}{macro.id}{'}}'}
                </span>
                <span className="text-xs opacity-70">{macro.nombre}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => copiarValor(macro)}
                  className="p-1 rounded hover:bg-white/10 transition"
                  title="Copiar valor"
                >
                  {copiado === macro.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                </button>
                <button
                  onClick={() => handleInsertar(macro.id)}
                  className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition"
                  title="Insertar en prompt"
                >
                  + Insertar
                </button>
              </div>
            </div>
            <p className="text-xs opacity-60 font-mono truncate">{macro.valor}</p>
            <p className="text-xs opacity-50 mt-1">{macro.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
