// ============================================
// STYLE MIXER - Mezclador de estilos con sliders de peso
// ============================================
import { useState } from 'react';
import { Palette, Search, X, Plus, SlidersHorizontal } from 'lucide-react';
import { estilosIniciales, obtenerCategorias } from '../../data/estilos-iniciales.js';

export default function StyleMixer({ estilosSeleccionados, onEstilosChange }) {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todos');
  const [showLibrary, setShowLibrary] = useState(false);

  const categorias = obtenerCategorias();
  const MAX_ESTILOS = 5;

  // Filtrar estilos
  const estilosFiltrados = estilosIniciales.filter(e => {
    const matchBusqueda = !busqueda || 
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.tags.some(t => t.includes(busqueda.toLowerCase()));
    const matchCategoria = categoriaFiltro === 'todos' || e.categoria === categoriaFiltro;
    return matchBusqueda && matchCategoria;
  });

  // Añadir estilo
  const añadirEstilo = (estilo) => {
    if (estilosSeleccionados.length >= MAX_ESTILOS) return;
    if (estilosSeleccionados.find(s => s.estilo.id === estilo.id)) return;
    onEstilosChange([...estilosSeleccionados, { estilo, peso: 1.0 }]);
  };

  // Quitar estilo
  const quitarEstilo = (id) => {
    onEstilosChange(estilosSeleccionados.filter(s => s.estilo.id !== id));
  };

  // Cambiar peso
  const cambiarPeso = (id, peso) => {
    onEstilosChange(estilosSeleccionados.map(s => 
      s.estilo.id === id ? { ...s, peso: parseFloat(peso) } : s
    ));
  };

  // Nombre de categoría legible
  const nombreCategoria = (cat) => {
    const nombres = {
      fotorrealismo: '📷 Fotorrealismo',
      anime: '🌸 Anime',
      fantasia: '🐉 Fantasía',
      scifi: '🚀 Sci-Fi',
      arte_clasico: '🎨 Arte Clásico',
      '3d_render': '🖥️ 3D Render',
      pixel_art: '👾 Pixel Art',
      otros: '✨ Otros'
    };
    return nombres[cat] || cat;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Palette size={16} className="text-cyan-400" />
          <span className="text-sm font-semibold text-slate-200">Mezclador de Estilos</span>
          <span className="text-xs text-slate-500">({estilosSeleccionados.length}/{MAX_ESTILOS})</span>
        </div>
        <button
          onClick={() => setShowLibrary(!showLibrary)}
          className={`text-xs px-3 py-1 rounded flex items-center gap-1 transition ${
            showLibrary ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <SlidersHorizontal size={12} />
          {showLibrary ? 'Ocultar' : 'Biblioteca'}
        </button>
      </div>

      {/* Estilos seleccionados con sliders */}
      <div className="p-4 space-y-3">
        {estilosSeleccionados.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">
            Selecciona estilos de la biblioteca para mezclar
          </p>
        ) : (
          estilosSeleccionados.map(({ estilo, peso }) => (
            <div key={estilo.id} className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: estilo.color }}
                  />
                  <span className="text-sm text-slate-200 font-medium">{estilo.nombre}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-cyan-400 font-mono">{peso.toFixed(2)}</span>
                  <button
                    onClick={() => quitarEstilo(estilo.id)}
                    className="text-slate-500 hover:text-red-400 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                value={peso}
                onChange={(e) => cambiarPeso(estilo.id, e.target.value)}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <p className="text-xs text-slate-500 mt-1 truncate">{estilo.prompt_prefijo}</p>
            </div>
          ))
        )}
      </div>

      {/* Biblioteca de estilos */}
      {showLibrary && (
        <div className="border-t border-slate-800">
          {/* Filtros */}
          <div className="p-3 space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar estilos..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setCategoriaFiltro('todos')}
                className={`text-xs px-2 py-1 rounded transition ${
                  categoriaFiltro === 'todos' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                Todos
              </button>
              {categorias.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoriaFiltro(cat)}
                  className={`text-xs px-2 py-1 rounded transition ${
                    categoriaFiltro === cat ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {nombreCategoria(cat)}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de estilos */}
          <div className="max-h-[300px] overflow-y-auto px-3 pb-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {estilosFiltrados.map(estilo => {
                const yaSeleccionado = estilosSeleccionados.find(s => s.estilo.id === estilo.id);
                return (
                  <button
                    key={estilo.id}
                    onClick={() => !yaSeleccionado && añadirEstilo(estilo)}
                    disabled={!!yaSeleccionado || estilosSeleccionados.length >= MAX_ESTILOS}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition ${
                      yaSeleccionado
                        ? 'bg-cyan-900/30 border border-cyan-800/50 text-cyan-300 cursor-default'
                        : estilosSeleccionados.length >= MAX_ESTILOS
                        ? 'bg-slate-800/30 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-transparent hover:border-slate-600'
                    }`}
                  >
                    <div 
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: estilo.color }}
                    />
                    <span className="truncate flex-1">{estilo.nombre}</span>
                    {yaSeleccionado ? (
                      <span className="text-cyan-500 text-[10px]">✓</span>
                    ) : (
                      <Plus size={12} className="text-slate-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
