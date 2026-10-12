// ============================================
// INTERFACE SENDER - Envío a A1111/ComfyUI (MEJORA #2)
// ============================================
import { useState } from 'react';
import { Send, Monitor, CheckCircle, Loader2, Settings } from 'lucide-react';

export default function InterfaceSender({ prompt, negative, params }) {
  const [interfacesDisponibles] = useState([
    { id: '1', nombre: 'AUTOMATIC1111', url: 'http://127.0.0.1:7860', tipo: 'a1111', estado: 'desconocido' },
    { id: '2', nombre: 'ComfyUI', url: 'http://127.0.0.1:8188', tipo: 'comfyui', estado: 'desconocido' }
  ]);
  const [enviando, setEnviando] = useState(null);
  const [enviado, setEnviado] = useState(null);
  const [error, setError] = useState(null);

  const enviarAInterfaz = async (interfaz) => {
    setEnviando(interfaz.id);
    setError(null);

    try {
      // SIMULACIÓN - En producción se haría la llamada real
      // if (interfaz.tipo === 'a1111') {
      //   const response = await fetch(`${interfaz.url}/sdapi/v1/txt2img`, {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //       prompt: prompt,
      //       negative_prompt: negative,
      //       steps: params?.steps || 30,
      //       cfg_scale: params?.cfg || 7,
      //       sampler_name: params?.sampler || 'DPM++ 2M Karras',
      //       width: params?.width || 1024,
      //       height: params?.height || 1024
      //     })
      //   });
      //   if (!response.ok) throw new Error('Error en la respuesta');
      // }

      // Simulación de envío
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEnviado(interfaz.id);
      setTimeout(() => setEnviado(null), 3000);
    } catch (err) {
      setError(`Error al conectar con ${interfaz.nombre}: ${err.message}`);
    } finally {
      setEnviando(null);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Send size={16} className="text-cyan-400" />
          <span className="text-sm font-semibold text-slate-200">Enviar a Interfaz</span>
        </div>
        <Settings size={14} className="text-slate-500" />
      </div>

      <div className="p-4 space-y-3">
        {/* Interfaces */}
        {interfacesDisponibles.map(interfaz => (
          <button
            key={interfaz.id}
            onClick={() => enviarAInterfaz(interfaz)}
            disabled={enviando !== null || !prompt}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition border ${
              enviado === interfaz.id
                ? 'bg-green-900/30 text-green-300 border-green-700'
                : enviando === interfaz.id
                ? 'bg-cyan-900/30 text-cyan-300 border-cyan-700'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-cyan-800'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex items-center gap-3">
              <Monitor size={16} />
              <div className="text-left">
                <p className="font-medium">{interfaz.nombre}</p>
                <p className="text-xs text-slate-500">{interfaz.url}</p>
              </div>
            </div>

            {enviando === interfaz.id && <Loader2 size={16} className="animate-spin text-cyan-400" />}
            {enviado === interfaz.id && <CheckCircle size={16} className="text-green-400" />}
          </button>
        ))}

        {/* Error */}
        {error && (
          <p className="text-xs text-red-400 bg-red-900/20 rounded-lg p-2">{error}</p>
        )}

        {/* Info */}
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-500">
            💡 <span className="text-slate-400">Placeholder:</span> En producción, esto enviará el prompt directamente a tus interfaces locales corriendo. Asegúrate de que estén accesibles y con CORS habilitado.
          </p>
        </div>
      </div>
    </div>
  );
}
