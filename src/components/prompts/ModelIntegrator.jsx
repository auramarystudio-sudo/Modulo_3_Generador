// ============================================
// MODEL INTEGRATOR - Integración con modelos (MEJORA #1, placeholder)
// ============================================
import { useState } from 'react';
import { Cpu, Info } from 'lucide-react';

export default function ModelIntegrator({ onModelSelect }) {
  const [modeloSeleccionado, setModeloSeleccionado] = useState('');

  // Modelos simulados - En producción vendrán de PocketBase
  const modelosSimulados = [
    { 
      id: '1', nombre: 'UnNamedIXL V7', tipo: 'checkpoint', 
      sampler: 'DPM++ 2M Karras', steps: 30, cfg: 7, vae: 'Automatic',
      descripcion: 'Modelo XL versátil para fotorrealismo'
    },
    { 
      id: '2', nombre: 'DreamShaper XL', tipo: 'checkpoint', 
      sampler: 'DPM++ 2M Karras', steps: 25, cfg: 6.5, vae: 'Automatic',
      descripcion: 'Excelente para arte digital y fantasía'
    },
    { 
      id: '3', nombre: 'AnimagineXL 3.1', tipo: 'checkpoint', 
      sampler: 'Euler a', steps: 28, cfg: 7, vae: 'Automatic',
      descripcion: 'Especializado en anime de alta calidad'
    },
    { 
      id: '4', nombre: 'juggernautXL v9', tipo: 'checkpoint', 
      sampler: 'DPM++ 2M Karras', steps: 30, cfg: 7, vae: 'sdxl_vae',
      descripcion: 'Fotorrealismo extremo'
    },
    { 
      id: '5', nombre: 'RealVisXL V4', tipo: 'checkpoint', 
      sampler: 'DPM++ 2M SDE', steps: 25, cfg: 5, vae: 'Automatic',
      descripcion: 'El mejor para fotografía realista'
    }
  ];

  const handleSelect = (modeloId) => {
    setModeloSeleccionado(modeloId);
    const modelo = modelosSimulados.find(m => m.id === modeloId);
    if (modelo && onModelSelect) {
      onModelSelect(modelo);
    }
  };

  const modeloActual = modelosSimulados.find(m => m.id === modeloSeleccionado);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Cpu size={16} className="text-cyan-400" />
          <span className="text-sm font-semibold text-slate-200">Integrar con Modelo</span>
          <span className="text-xs bg-yellow-900/50 text-yellow-300 px-2 py-0.5 rounded">Próximamente</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <select
          value={modeloSeleccionado}
          onChange={(e) => handleSelect(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        >
          <option value="">-- Seleccionar modelo del catálogo --</option>
          {modelosSimulados.map(m => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </select>

        {/* Info del modelo seleccionado */}
        {modeloActual && (
          <div className="bg-slate-800 rounded-lg p-3 space-y-2">
            <p className="text-sm font-medium text-slate-200">{modeloActual.nombre}</p>
            <p className="text-xs text-slate-500">{modeloActual.descripcion}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900 rounded p-2">
                <span className="text-slate-500">Sampler:</span>
                <span className="text-cyan-300 ml-1">{modeloActual.sampler}</span>
              </div>
              <div className="bg-slate-900 rounded p-2">
                <span className="text-slate-500">Steps:</span>
                <span className="text-cyan-300 ml-1">{modeloActual.steps}</span>
              </div>
              <div className="bg-slate-900 rounded p-2">
                <span className="text-slate-500">CFG:</span>
                <span className="text-cyan-300 ml-1">{modeloActual.cfg}</span>
              </div>
              <div className="bg-slate-900 rounded p-2">
                <span className="text-slate-500">VAE:</span>
                <span className="text-cyan-300 ml-1">{modeloActual.vae}</span>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="flex items-start gap-2 bg-slate-800/50 rounded-lg p-3">
          <Info size={14} className="text-cyan-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500">
            En el futuro, esto cargará tus modelos guardados del Módulo 1 y autocompletará sampler, steps, CFG, VAE y sugerirá prompts optimizados para cada modelo.
          </p>
        </div>
      </div>
    </div>
  );
}
