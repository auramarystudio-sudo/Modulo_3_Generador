// ============================================
// HISTORY PANEL - Historial con ratings y filtros
// ============================================
import { useState } from 'react';
import { History, Star, Trash2, Copy, Check, Filter, Heart } from 'lucide-react';

export default function HistoryPanel({ historial, onEliminar, onCargar, onToggleFavorito, onRate }) {
  const [filtro, setFiltro] = useState('todos'); // todos, favoritos, rating
  const [ratingFiltro, setRatingFiltro] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const [copiadoId, setCopiadoId] = useState(null);

  // Filtrar historial
  const historialFiltrado = historial.filter(entry => {
    if (filtro === 'favoritos' && !entry.favorito) return false;
    if (filtro === 'rating' && entry.rating < ratingFiltro) return false;
    if (busqueda && !entry.prompt.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  // Copiar prompt del historial
  const copiarPrompt = (entry) => {
    navigator.clipboard.writeText(entry.prompt);
    setCopiadoId(entry.id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <History size={16} className="text-cyan-400" />
          <span className="text-sm font-semibold text-slate-200">Historial</span>
          <span className="text-xs text-slate-500">({historial.length})</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="p-3 space-y-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter size={12} className="text-slate-500" />
          <div className="flex gap-1">
            {['todos', 'favoritos', 'rating'].map(f => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`text-xs px-2 py-1 rounded capitalize transition ${
                  filtro === f ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {f === 'favoritos' ? '❤️ Favoritos' : f === 'rating' ? '⭐ Rating' : 'Todos'}
              </button>
            ))}
          </div>
        </div>
        
        {filtro === 'rating' && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500">Mín:</span>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRatingFiltro(ratingFiltro === star ? 0 : star)}
                className={`text-lg ${star <= ratingFiltro ? 'text-yellow-400' : 'text-slate-600'} hover:text-yellow-400 transition`}
              >
                ★
              </button>
            ))}
          </div>
        )}

        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar en historial..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
      </div>

      {/* Lista de historial */}
      <div className="max-h-[400px] overflow-y-auto">
        {historialFiltrado.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">
            {historial.length === 0 ? 'No hay prompts guardados aún' : 'No hay resultados para este filtro'}
          </p>
        ) : (
          <div className="divide-y divide-slate-800">
            {historialFiltrado.map(entry => (
              <div key={entry.id} className="p-3 hover:bg-slate-800/50 transition">
                {/* Prompt */}
                <p className="text-xs text-slate-300 font-mono line-clamp-2 mb-2">
                  {entry.prompt}
                </p>

                {/* Meta info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Rating */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => onRate && onRate(entry.id, star)}
                          className={`text-sm ${star <= (entry.rating || 0) ? 'text-yellow-400' : 'text-slate-600'} hover:text-yellow-400 transition`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    
                    {/* Fecha */}
                    <span className="text-xs text-slate-600">
                      {new Date(entry.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleFavorito && onToggleFavorito(entry.id)}
                      className={`p-1 rounded transition ${entry.favorito ? 'text-red-400' : 'text-slate-600 hover:text-red-400'}`}
                    >
                      <Heart size={12} fill={entry.favorito ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => copiarPrompt(entry)}
                      className="p-1 text-slate-500 hover:text-cyan-400 transition rounded"
                    >
                      {copiadoId === entry.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                    </button>
                    <button
                      onClick={() => onCargar && onCargar(entry)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 px-2 py-0.5 rounded hover:bg-cyan-900/30 transition"
                    >
                      Cargar
                    </button>
                    <button
                      onClick={() => onEliminar && onEliminar(entry.id)}
                      className="p-1 text-slate-600 hover:text-red-400 transition rounded"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
