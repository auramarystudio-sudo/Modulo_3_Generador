// ============================================
// MOTOR DE COMBINACIÓN DE PROMPTS
// ============================================

import { estilosIniciales } from '../data/estilos-iniciales.js';
import { macrosSistema } from '../data/prompt-data.js';

/**
 * Combina múltiples estilos con pesos para generar un prompt
 * @param {Array} estilosSeleccionados - Array de {estilo, peso}
 * @param {string} textoBase - Texto base del usuario
 * @returns {string} Prompt combinado
 */
export function combinarEstilos(estilosSeleccionados, textoBase = '') {
  if (estilosSeleccionados.length === 0 && !textoBase) return '';
  
  const partes = [];
  
  // Añadir prefijos de estilos ordenados por peso (mayor primero)
  const ordenados = [...estilosSeleccionados].sort((a, b) => b.peso - a.peso);
  
  ordenados.forEach(({ estilo, peso }) => {
    if (estilo.prompt_prefijo) {
      if (peso >= 1.2) {
        partes.push(`(${estilo.prompt_prefijo}:${peso})`);
      } else {
        partes.push(estilo.prompt_prefijo);
      }
    }
  });
  
  // Añadir texto base
  if (textoBase) {
    partes.push(textoBase);
  }
  
  // Añadir sufijos de estilos
  ordenados.forEach(({ estilo }) => {
    if (estilo.prompt_sufijo) {
      partes.push(estilo.prompt_sufijo);
    }
  });
  
  return partes.join(', ');
}

/**
 * Combina negativos de estilos seleccionados
 * @param {Array} estilosSeleccionados - Array de {estilo, peso}
 * @param {string} negativoBase - Negativo base del usuario
 * @returns {string} Negativo combinado
 */
export function combinarNegativos(estilosSeleccionados, negativoBase = '') {
  const partes = [];
  
  estilosSeleccionados.forEach(({ estilo }) => {
    if (estilo.negative_boost) {
      partes.push(estilo.negative_boost);
    }
  });
  
  if (negativoBase) {
    partes.push(negativoBase);
  }
  
  return partes.join(', ');
}

/**
 * Resuelve macros en un texto
 * @param {string} texto - Texto con macros {{macro_id}}
 * @returns {string} Texto con macros resueltos
 */
export function resolverMacros(texto) {
  let resultado = texto;
  
  macrosSistema.forEach(macro => {
    const regex = new RegExp(`\\{\\{${macro.id}\\}\\}`, 'g');
    resultado = resultado.replace(regex, macro.valor);
  });
  
  return resultado;
}

/**
 * Inserta un macro en la posición del cursor
 * @param {string} texto - Texto actual
 * @param {number} cursorPos - Posición del cursor
 * @param {string} macroId - ID del macro a insertar
 * @returns {{texto: string, nuevaPos: number}}
 */
export function insertarMacro(texto, cursorPos, macroId) {
  const macro = macrosSistema.find(m => m.id === macroId);
  if (!macro) return { texto, nuevaPos: cursorPos };
  
  const insercion = `{{${macro.id}}}`;
  const antes = texto.substring(0, cursorPos);
  const despues = texto.substring(cursorPos);
  const separador = antes.endsWith(', ') || antes.endsWith(' ') || antes === '' ? '' : ', ';
  
  const nuevoTexto = antes + separador + insercion + despues;
  const nuevaPos = cursorPos + separador.length + insercion.length;
  
  return { texto: nuevoTexto, nuevaPos };
}

/**
 * Genera un prompt aleatorio combinando estilos y elementos
 * @returns {string} Prompt aleatorio
 */
export function generarPromptAleatorio() {
  const sujetos = [
    'a mysterious warrior', 'an ancient dragon', 'a cyberpunk hacker',
    'a beautiful elven princess', 'a steampunk inventor', 'a space explorer',
    'a samurai in armor', 'a witch casting spells', 'a robot with emotions',
    'a mermaid in coral reef', 'a phoenix rising from ashes', 'a time traveler',
    'a forest guardian spirit', 'a noir detective', 'a celestial being'
  ];
  
  const ambientes = [
    'in a mystical forest', 'on a floating island', 'in a neon-lit city',
    'at the edge of a volcano', 'in an underwater temple', 'on a distant planet',
    'in a gothic cathedral', 'at a bustling market', 'in a frozen wasteland',
    'inside a crystal cave', 'on a cloud kingdom', 'in a desert oasis'
  ];
  
  const acciones = [
    'standing heroically', 'in dramatic pose', 'casting powerful magic',
    'looking into the distance', 'in mid-action', 'contemplating',
    'emerging from shadows', 'surrounded by light', 'in battle stance'
  ];
  
  // Seleccionar 1-3 estilos aleatorios
  const numEstilos = Math.floor(Math.random() * 3) + 1;
  const estilosAleatorios = [];
  const disponibles = [...estilosIniciales];
  
  for (let i = 0; i < numEstilos && disponibles.length > 0; i++) {
    const idx = Math.floor(Math.random() * disponibles.length);
    estilosAleatorios.push({
      estilo: disponibles[idx],
      peso: 0.8 + Math.random() * 0.6
    });
    disponibles.splice(idx, 1);
  }
  
  const sujeto = sujetos[Math.floor(Math.random() * sujetos.length)];
  const ambiente = ambientes[Math.floor(Math.random() * ambientes.length)];
  const accion = acciones[Math.floor(Math.random() * acciones.length)];
  
  const textoBase = `${sujeto}, ${accion}, ${ambiente}`;
  
  return combinarEstilos(estilosAleatorios, textoBase);
}

/**
 * Obtiene sugerencias contextuales basadas en el texto actual
 * @param {string} texto - Texto actual del prompt
 * @param {Array} estilosDisponibles - Lista de estilos disponibles
 * @returns {Object} Sugerencias y estilos compatibles
 */
export function obtenerSugerenciasContextuales(texto, estilosDisponibles = estilosIniciales) {
  const textoLower = texto.toLowerCase();
  const sugerencias = [];
  
  // Detectar contexto y sugerir macros relevantes
  if (textoLower.includes('retrato') || textoLower.includes('persona') || textoLower.includes('face')) {
    sugerencias.push({ macro: 'composicion_retrato', razon: 'Detectado: retrato' });
    sugerencias.push({ macro: 'iluminacion_estudio', razon: 'Detectado: retrato' });
  }
  if (textoLower.includes('paisaje') || textoLower.includes('naturaleza') || textoLower.includes('landscape')) {
    sugerencias.push({ macro: 'composicion_paisaje', razon: 'Detectado: paisaje' });
    sugerencias.push({ macro: 'iluminacion_natural', razon: 'Detectado: paisaje' });
  }
  if (textoLower.includes('anime') || textoLower.includes('manga')) {
    sugerencias.push({ macro: 'anime', razon: 'Detectado: anime' });
    sugerencias.push({ macro: 'calidad_alta', razon: 'Recomendado para anime' });
  }
  if (textoLower.includes('cinema') || textoLower.includes('movie') || textoLower.includes('film')) {
    sugerencias.push({ macro: 'cinematico', razon: 'Detectado: cinematográfico' });
  }
  if (textoLower.includes('producto') || textoLower.includes('product')) {
    sugerencias.push({ macro: 'composicion_producto', razon: 'Detectado: producto' });
  }
  
  // Filtrar estilos compatibles por tags
  const estilosCompatibles = estilosDisponibles.filter(e =>
    e.tags.some(tag => textoLower.includes(tag))
  ).slice(0, 5);
  
  return { sugerencias, estilosCompatibles };
}

/**
 * Analiza un prompt existente y devuelve métricas
 * @param {string} prompt - Prompt a analizar
 * @returns {Object} Análisis del prompt
 */
export function analizarPrompt(prompt) {
  if (!prompt || prompt.trim() === '') {
    return { score: 0, estilosDetectados: [], sugerencias: [], wordCount: 0, tokens: 0 };
  }
  
  const palabras = prompt.split(',').map(p => p.trim()).filter(p => p);
  const wordCount = palabras.length;
  
  // Estimar tokens (aproximación)
  const tokens = Math.ceil(prompt.split(/\s+/).length * 1.3);
  
  // Detectar estilos
  const estilosDetectados = [];
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('cinematic') || promptLower.includes('film')) estilosDetectados.push('Cinematográfico');
  if (promptLower.includes('anime') || promptLower.includes('manga')) estilosDetectados.push('Anime');
  if (promptLower.includes('photorealistic') || promptLower.includes('dslr') || promptLower.includes('photo')) estilosDetectados.push('Fotorrealismo');
  if (promptLower.includes('fantasy') || promptLower.includes('magical')) estilosDetectados.push('Fantasía');
  if (promptLower.includes('cyberpunk') || promptLower.includes('neon')) estilosDetectados.push('Cyberpunk');
  if (promptLower.includes('ghibli') || promptLower.includes('miyazaki')) estilosDetectados.push('Ghibli');
  if (promptLower.includes('dark') || promptLower.includes('horror')) estilosDetectados.push('Dark/Horror');
  if (promptLower.includes('3d') || promptLower.includes('render') || promptLower.includes('octane')) estilosDetectados.push('3D Render');
  if (promptLower.includes('pixel')) estilosDetectados.push('Pixel Art');
  if (promptLower.includes('watercolor') || promptLower.includes('oil painting')) estilosDetectados.push('Arte Clásico');
  
  // Generar sugerencias
  const sugerencias = [];
  
  if (wordCount < 5) sugerencias.push('Añade más detalles descriptivos (mínimo 5 elementos)');
  if (wordCount > 30) sugerencias.push('Demasiados elementos - considera simplificar para mejor coherencia');
  if (!promptLower.includes('quality') && !promptLower.includes('masterpiece') && !promptLower.includes('detailed')) {
    sugerencias.push('Considera añadir quality boosters (masterpiece, best quality)');
  }
  if (!promptLower.includes('lighting') && !promptLower.includes('light')) {
    sugerencias.push('Añade descripción de iluminación para más impacto');
  }
  if (tokens > 75) {
    sugerencias.push(`⚠️ ~${tokens} tokens estimados - el límite recomendado es 75 para SD 1.5`);
  }
  if (estilosDetectados.length === 0) {
    sugerencias.push('No se detectó un estilo claro - añade palabras clave de estilo');
  }
  
  // Calcular score
  let score = 0;
  score += Math.min(30, wordCount * 3); // Hasta 30 pts por cantidad
  score += Math.min(20, estilosDetectados.length * 10); // Hasta 20 pts por estilo detectado
  if (promptLower.includes('quality') || promptLower.includes('masterpiece')) score += 15;
  if (promptLower.includes('lighting') || promptLower.includes('light')) score += 15;
  if (promptLower.includes('detailed') || promptLower.includes('detail')) score += 10;
  if (wordCount >= 5 && wordCount <= 25) score += 10; // Bonus por longitud óptima
  score = Math.min(100, score);
  
  return { score, estilosDetectados, sugerencias, wordCount, tokens };
}

/**
 * Genera variantes de un prompt base
 * @param {string} promptBase - Prompt base
 * @param {Array} estilos - Estilos seleccionados
 * @returns {Array} Array de variantes
 */
export function generarVariantes(promptBase, estilos = []) {
  const variantes = [];
  
  // Variante A: Énfasis en primer estilo
  if (estilos.length > 0) {
    variantes.push({
      id: 'A',
      nombre: `Variante A - Énfasis: ${estilos[0].estilo.nombre}`,
      prompt: `(${estilos[0].estilo.prompt_prefijo}:1.3), ${promptBase}`
    });
  }
  
  // Variante B: Énfasis en segundo estilo
  if (estilos.length > 1) {
    variantes.push({
      id: 'B',
      nombre: `Variante B - Énfasis: ${estilos[1].estilo.nombre}`,
      prompt: `(${estilos[1].estilo.prompt_prefijo}:1.3), ${promptBase}`
    });
  }
  
  // Variante C: Balanceada
  variantes.push({
    id: 'C',
    nombre: 'Variante C - Balanceada',
    prompt: promptBase
  });
  
  // Variante D: Con énfasis en calidad
  variantes.push({
    id: 'D',
    nombre: 'Variante D - Máxima Calidad',
    prompt: `masterpiece, best quality, highly detailed, ${promptBase}`
  });
  
  return variantes;
}

/**
 * Formatea el prompt para diferentes interfaces
 * @param {string} prompt - Prompt positivo
 * @param {string} negative - Prompt negativo
 * @param {Object} params - Parámetros de generación
 * @param {string} formato - Formato de exportación
 * @returns {string} Prompt formateado
 */
export function formatearParaExportar(prompt, negative, params = {}, formato = 'texto') {
  switch (formato) {
    case 'a1111':
      return `${prompt}\n\nNegative prompt: ${negative}\n\nSteps: ${params.steps || 30}, Sampler: ${params.sampler || 'DPM++ 2M Karras'}, CFG scale: ${params.cfg || 7}, Size: ${params.width || 1024}x${params.height || 1024}`;
    case 'comfyui':
      return JSON.stringify({
        prompt: prompt,
        negative_prompt: negative,
        steps: params.steps || 30,
        cfg: params.cfg || 7,
        sampler: params.sampler || 'DPM++ 2M Karras',
        width: params.width || 1024,
        height: params.height || 1024
      }, null, 2);
    case 'midjourney':
      return `${prompt} --ar ${params.ar || '16:9'} --v ${params.version || '6'} --q ${params.quality || 1}`;
    case 'texto':
    default:
      return prompt;
  }
}
