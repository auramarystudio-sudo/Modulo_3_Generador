// ============================================
// PROMPTS PAGE - Página principal del generador de prompts
// 7 pestañas + Modo Focus + Atajos de teclado
// ============================================
import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, Shuffle, Save, Eye, EyeOff, Keyboard, 
  Palette, Code2, FileText, Zap, History, BarChart3,
  Send, Cpu, Layers
} from 'lucide-react';

// Componentes
import PromptEditor from '../components/prompts/PromptEditor.jsx';
import NegativeEditor from '../components/prompts/NegativeEditor.jsx';
import StyleMixer from '../components/prompts/StyleMixer.jsx';
import QualityBoosters from '../components/prompts/QualityBoosters.jsx';
import MacrosPanel from '../components/prompts/MacrosPanel.jsx';
import TemplatesPanel from '../components/prompts/TemplatesPanel.jsx';
import FinalOutput from '../components/prompts/FinalOutput.jsx';
import HistoryPanel from '../components/prompts/HistoryPanel.jsx';
import PromptAnalyzer from '../components/prompts/PromptAnalyzer.jsx';
import InterfaceSender from '../components/prompts/InterfaceSender.jsx';
import ModelIntegrator from '../components/prompts/ModelIntegrator.jsx';
import VariantGenerator from '../components/prompts/VariantGenerator.jsx';

// Utils
import { combinarEstilos, combinarNegativos, resolverMacros, generarPromptAleatorio, insertarMacro } from '../utils/prompt-engine.js';

export default function Prompts() {
  // ─── ESTADO PRINCIPAL ───
  const [promptBase, setPromptBase] = useState('');
  const [negativeBase, setNegativeBase] = useState('');
  const [estilosSeleccionados, setEstilosSeleccionados] = useState([]);
  const [cursorPos, setCursorPos] = useState(0);
  const [modoFocus, setModoFocus] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [params, setParams] = useState({
    steps: 30,
    sampler: 'DPM++ 2M Karras',
    cfg: 7,
    width: 1024,
    height: 1024
  });

  // Historial local (simula PocketBase)
  const [historial, setHistorial] = useState([]);

  // Pestaña activa
  const [tabActiva, setTabActiva] = useState('estilos');

  // ─── PROMPT FINAL GENERADO ───
  const promptFinal = useMemo(() => {
    let resultado = combinarEstilos(estilosSeleccionados, promptBase);
    resultado = resolverMacros(resultado);
    return resultado;
  }, [estilosSeleccionados, promptBase]);

  const negativeFinal = useMemo(() => {
    let resultado = combinarNegativos(estilosSeleccionados, negativeBase);
    resultado = resolverMacros(resultado);
    return resultado;
  }, [estilosSeleccionados, negativeBase]);

  // ─── HANDLERS ───
  
  // Insertar macro en la posición del cursor
  const handleInsertMacro = (macroId) => {
    const { texto, nuevaPos } = insertarMacro(promptBase, cursorPos, macroId);
    setPromptBase(texto);
    setCursorPos(nuevaPos);
  };

  // Aplicar plantilla
  const handleApplyTemplate = (prompt, negative) => {
    setPromptBase(prev => prev ? `${prev}, ${prompt}` : prompt);
    if (negative) {
      setNegativeBase(prev => prev ? `${prev}, ${resolverMacros(negative)}` : resolverMacros(negative));
    }
  };

  // Generar prompt aleatorio
  const handleRandom = () => {
    const randomPrompt = generarPromptAleatorio();
    setPromptBase(randomPrompt);
  };

  // Guardar en historial
  const handleGuardar = () => {
    const nuevo = {
      id: Date.now().toString(),
      prompt: promptFinal,
      negative: negativeFinal,
      estilos_usados: estilosSeleccionados.map(s => s.estilo.nombre),
      tags: estilosSeleccionados.map(s => s.estilo.categoria),
      favorito: false,
      rating: 0,
      fecha: new Date().toISOString()
    };
    setHistorial(prev => [nuevo, ...prev]);
  };

  // Cargar desde historial
  const handleCargar = (entry) => {
    setPromptBase(entry.prompt);
    setNegativeBase(entry.negative || '');
  };

  // Eliminar del historial
  const handleEliminar = (id) => {
    setHistorial(prev => prev.filter(e => e.id !== id));
  };

  // Toggle favorito
  const handleToggleFavorito = (id) => {
    setHistorial(prev => prev.map(e => e.id === id ? { ...e, favorito: !e.favorito } : e));
  };

  // Rating
  const handleRate = (id, rating) => {
    setHistorial(prev => prev.map(e => e.id === id ? { ...e, rating } : e));
  };

  // Usar variante
  const handleUseVariant = (prompt) => {
    setPromptBase(prompt);
  };

  // Modelo seleccionado
  const handleModelSelect = (modelo) => {
    setParams(prev => ({
      ...prev,
      steps: modelo.steps,
      sampler: modelo.sampler,
      cfg: modelo.cfg
    }));
  };

  // ─── ATAJOS DE TECLADO (MEJORA #11) ───
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            handleGuardar();
            break;
          case 's':
            e.preventDefault();
            handleGuardar();
            break;
          case 'r':
            e.preventDefault();
            handleRandom();
            break;
          case 'f':
            e.preventDefault();
            setModoFocus(prev => !prev);
            break;
          case '/':
            e.preventDefault();
            setShowShortcuts(prev => !prev);
            break;
        }
      }
      if (e.key === 'Escape') {
        setShowShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [promptBase, estilosSeleccionados]);

  // ─── TABS CONFIGURACIÓN ───
  const tabs = [
    { id: 'estilos', nombre: 'Estilos', icono: Palette, color: 'text-cyan-400' },
    { id: 'boosters', nombre: 'Boosters', icono: Zap, color: 'text-yellow-400' },
    { id: 'macros', nombre: 'Macros', icono: Code2, color: 'text-purple-400' },
    { id: 'plantillas', nombre: 'Plantillas', icono: FileText, color: 'text-green-400' },
    { id: 'analizar', nombre: 'Analizar', icono: BarChart3, color: 'text-orange-400' },
    { id: 'integrar', nombre: 'Integrar', icono: Send, color: 'text-blue-400' },
    { id: 'historial', nombre: 'Historial', icono: History, color: 'text-pink-400' }
  ];

  // ─── RENDER ───
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles size={24} className="text-cyan-400" />
            <div>
              <h1 className="text-lg font-bold text-slate-100">Generador de Prompts</h1>
              <p className="text-xs text-slate-500">Módulo 3 - Generador Avanzado</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Modo Focus */}
            <button
              onClick={() => setModoFocus(!modoFocus)}
              className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                modoFocus ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {modoFocus ? <EyeOff size={12} /> : <Eye size={12} />}
              {modoFocus ? 'Salir Focus' : 'Focus'}
            </button>

            {/* Aleatorio */}
            <button
              onClick={handleRandom}
              className="text-xs px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 transition"
            >
              <Shuffle size={12} />
              Aleatorio
            </button>

            {/* Atajos */}
            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 flex items-center gap-1.5 transition"
            >
              <Keyboard size={12} />
              <span className="hidden sm:inline">Atajos</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modal de atajos */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowShortcuts(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Keyboard size={20} className="text-cyan-400" />
              Atajos de Teclado
            </h3>
            <div className="space-y-2">
              {[
                ['Ctrl + Enter', 'Guardar en historial'],
                ['Ctrl + S', 'Guardar en historial'],
                ['Ctrl + R', 'Generar prompt aleatorio'],
                ['Ctrl + F', 'Activar/desactivar Modo Focus'],
                ['Ctrl + /', 'Mostrar/ocultar atajos'],
                ['Escape', 'Cerrar modales']
              ].map(([keys, desc], i) => (
                <div key={i} className="flex items-center justify-between py-1.5">
                  <kbd className="bg-slate-800 text-cyan-300 text-xs px-2 py-1 rounded font-mono">{keys}</kbd>
                  <span className="text-sm text-slate-400">{desc}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowShortcuts(false)}
              className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-sm transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className={`grid gap-6 ${modoFocus ? 'grid-cols-1 max-w-3xl mx-auto' : 'lg:grid-cols-[1fr_380px]'}`}>
          
          {/* ─── COLUMNA IZQUIERDA (70%) ─── */}
          <div className="space-y-4">
            {/* Editor de Prompt */}
            <PromptEditor
              value={promptBase}
              onChange={setPromptBase}
              onCursorChange={setCursorPos}
            />

            {/* Editor de Negativos */}
            <NegativeEditor
              value={negativeBase}
              onChange={setNegativeBase}
            />

            {/* Tabs de herramientas */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              {/* Tab headers */}
              <div className="flex overflow-x-auto border-b border-slate-800">
                {tabs.map(tab => {
                  const Icon = tab.icono;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setTabActiva(tab.id)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap transition border-b-2 ${
                        tabActiva === tab.id
                          ? `${tab.color} border-current bg-slate-800/30`
                          : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-800/20'
                      }`}
                    >
                      <Icon size={14} />
                      {tab.nombre}
                    </button>
                  );
                })}
              </div>

              {/* Tab content */}
              <div className="p-4">
                {tabActiva === 'estilos' && (
                  <StyleMixer
                    estilosSeleccionados={estilosSeleccionados}
                    onEstilosChange={setEstilosSeleccionados}
                  />
                )}
                {tabActiva === 'boosters' && (
                  <QualityBoosters
                    promptValue={promptBase}
                    onPromptChange={setPromptBase}
                  />
                )}
                {tabActiva === 'macros' && (
                  <MacrosPanel
                    onInsertMacro={handleInsertMacro}
                    promptValue={promptBase}
                    onPromptChange={setPromptBase}
                  />
                )}
                {tabActiva === 'plantillas' && (
                  <TemplatesPanel
                    onApplyTemplate={handleApplyTemplate}
                  />
                )}
                {tabActiva === 'analizar' && (
                  <PromptAnalyzer />
                )}
                {tabActiva === 'integrar' && (
                  <div className="space-y-4">
                    <ModelIntegrator onModelSelect={handleModelSelect} />
                    <InterfaceSender 
                      prompt={promptFinal} 
                      negative={negativeFinal} 
                      params={params}
                    />
                  </div>
                )}
                {tabActiva === 'historial' && (
                  <HistoryPanel
                    historial={historial}
                    onEliminar={handleEliminar}
                    onCargar={handleCargar}
                    onToggleFavorito={handleToggleFavorito}
                    onRate={handleRate}
                  />
                )}
              </div>
            </div>

            {/* Variantes (no se oculta en focus) */}
            {!modoFocus && (
              <VariantGenerator
                promptBase={promptFinal}
                estilosSeleccionados={estilosSeleccionados}
                onUseVariant={handleUseVariant}
              />
            )}
          </div>

          {/* ─── COLUMNA DERECHA (30%) ─── */}
          {!modoFocus && (
            <div className="space-y-4">
              {/* Prompt Final */}
              <FinalOutput
                prompt={promptFinal}
                negative={negativeFinal}
                params={params}
                onGuardar={handleGuardar}
              />

              {/* Parámetros rápidos */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <Layers size={14} className="text-cyan-400" />
                  Parámetros
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Steps</label>
                    <input
                      type="number"
                      value={params.steps}
                      onChange={(e) => setParams(p => ({ ...p, steps: parseInt(e.target.value) || 30 }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">CFG Scale</label>
                    <input
                      type="number"
                      step="0.5"
                      value={params.cfg}
                      onChange={(e) => setParams(p => ({ ...p, cfg: parseFloat(e.target.value) || 7 }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Width</label>
                    <input
                      type="number"
                      value={params.width}
                      onChange={(e) => setParams(p => ({ ...p, width: parseInt(e.target.value) || 1024 }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Height</label>
                    <input
                      type="number"
                      value={params.height}
                      onChange={(e) => setParams(p => ({ ...p, height: parseInt(e.target.value) || 1024 }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="text-xs text-slate-500 mb-1 block">Sampler</label>
                  <select
                    value={params.sampler}
                    onChange={(e) => setParams(p => ({ ...p, sampler: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option>DPM++ 2M Karras</option>
                    <option>Euler a</option>
                    <option>DPM++ SDE Karras</option>
                    <option>DDIM</option>
                    <option>UniPC</option>
                    <option>Euler</option>
                    <option>DPM++ 2M SDE</option>
                  </select>
                </div>
              </div>

              {/* Stats rápidas */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <BarChart3 size={14} className="text-cyan-400" />
                  Estadísticas Rápidas
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-800 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-cyan-300">{historial.length}</p>
                    <p className="text-xs text-slate-500">Guardados</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-purple-300">{estilosSeleccionados.length}</p>
                    <p className="text-xs text-slate-500">Estilos</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-yellow-300">{historial.filter(h => h.favorito).length}</p>
                    <p className="text-xs text-slate-500">Favoritos</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-green-300">
                      {historial.length > 0 ? Math.round(historial.reduce((acc, h) => acc + (h.rating || 0), 0) / historial.length * 10) / 10 : '0'}
                    </p>
                    <p className="text-xs text-slate-500">Rating prom.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs text-slate-600">
          <span>SD Studio - Módulo 3: Generador de Prompts</span>
          <span>50+ estilos • 15 macros • 11 categorías de negativos</span>
        </div>
      </footer>
    </div>
  );
}
