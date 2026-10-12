// ============================================
// TEMPLATES PANEL - Panel de plantillas dinámicas
// ============================================
import { useState } from 'react';
import { FileText, Play, X } from 'lucide-react';
import { plantillasPredefinidas } from '../../data/prompt-data.js';

export default function TemplatesPanel({ onApplyTemplate }) {
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState(null);
  const [variables, setVariables] = useState({});

  // Seleccionar plantilla
  const seleccionarPlantilla = (plantilla) => {
    setPlantillaSeleccionada(plantilla);
    // Inicializar variables vacías
    const vars = {};
    plantilla.variables.forEach(v => { vars[v] = ''; });
    setVariables(vars);
  };

  // Aplicar plantilla con variables
  const aplicarPlantilla = () => {
    if (!plantillaSeleccionada) return;
    
    let resultado = plantillaSeleccionada.plantilla;
    
    // Reemplazar variables
    Object.entries(variables).forEach(([key, value]) => {
      resultado = resultado.replace(`{${key}}`, value || `[${key}]`);
    });
    
    // Resolver macros
    resultado = resultado.replace(/\{\{(\w+)\}\}/g, (match, macroId) => {
      // Los macros se resolverán en el motor de prompts
      return match;
    });
    
    if (onApplyTemplate) {
      onApplyTemplate(resultado, plantillaSeleccionada.negative);
    }
    
    setPlantillaSeleccionada(null);
    setVariables({});
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-green-400" />
          <span className="text-sm font-semibold text-slate-200">Plantillas</span>
        </div>
      </div>

      {/* Lista de plantillas */}
      {!plantillaSeleccionada ? (
        <div className="p-3 space-y-2">
          {plantillasPredefinidas.map(plantilla => (
            <button
              key={plantilla.id}
              onClick={() => seleccionarPlantilla(plantilla)}
              className="w-full text-left bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-green-800 rounded-lg p-3 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-200">{plantilla.nombre}</span>
                <span className="text-xs bg-green-900/50 text-green-300 px-2 py-0.5 rounded">{plantilla.categoria}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{plantilla.descripcion}</p>
              <p className="text-xs text-slate-600 mt-1 font-mono truncate">
                {plantilla.plantilla.substring(0, 80)}...
              </p>
            </button>
          ))}
        </div>
      ) : (
        /* Editor de variables */
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-green-300">{plantillaSeleccionada.nombre}</h4>
            <button
              onClick={() => { setPlantillaSeleccionada(null); setVariables({}); }}
              className="text-slate-500 hover:text-red-400 transition"
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-xs text-slate-500">{plantillaSeleccionada.descripcion}</p>

          {/* Variables */}
          <div className="space-y-2">
            {plantillaSeleccionada.variables.map(variable => (
              <div key={variable}>
                <label className="text-xs text-slate-400 mb-1 block capitalize">
                  {variable.replace(/_/g, ' ')}:
                </label>
                <input
                  type="text"
                  value={variables[variable] || ''}
                  onChange={(e) => setVariables({ ...variables, [variable]: e.target.value })}
                  placeholder={`Ingresa ${variable.replace(/_/g, ' ')}...`}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
            <p className="text-xs text-slate-500 mb-1">Preview:</p>
            <p className="text-xs text-slate-300 font-mono">
              {plantillaSeleccionada.plantilla
                .replace(/\{(\w+)\}/g, (match, key) => variables[key] || `[${key}]`)
                .substring(0, 150)}...
            </p>
          </div>

          {/* Botón aplicar */}
          <button
            onClick={aplicarPlantilla}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition"
          >
            <Play size={14} />
            Aplicar Plantilla
          </button>
        </div>
      )}
    </div>
  );
}
