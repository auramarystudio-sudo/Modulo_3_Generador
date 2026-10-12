// ============================================
// DATOS DE PROMPT: MACROS, NEGATIVES, BOOSTERS, PLANTILLAS
// ============================================

// ─── MACROS DEL SISTEMA (15 macros) ───
export const macrosSistema = [
  {
    id: 'calidad_max',
    nombre: 'Calidad Máxima',
    valor: 'masterpiece, best quality, highly detailed, sharp focus, 8k uhd',
    categoria: 'calidad',
    descripcion: 'Boosters de calidad máxima'
  },
  {
    id: 'calidad_alta',
    nombre: 'Calidad Alta',
    valor: 'high quality, detailed, sharp, professional',
    categoria: 'calidad',
    descripcion: 'Boosters de calidad alta'
  },
  {
    id: 'fotografico',
    nombre: 'Fotográfico',
    valor: 'DSLR, 85mm lens, f/1.8, bokeh, natural skin texture',
    categoria: 'estilo',
    descripcion: 'Look fotográfico profesional'
  },
  {
    id: 'anime',
    nombre: 'Anime Base',
    valor: 'anime style, detailed anime art, vibrant colors, clean lines',
    categoria: 'estilo',
    descripcion: 'Base para estilo anime'
  },
  {
    id: 'cinematico',
    nombre: 'Cinemático',
    valor: 'cinematic lighting, film grain, anamorphic, color graded, dramatic',
    categoria: 'estilo',
    descripcion: 'Look cinematográfico'
  },
  {
    id: 'neg_universal',
    nombre: 'Negativo Universal',
    valor: 'worst quality, low quality, blurry, deformed, ugly, bad anatomy, watermark, text',
    categoria: 'negativo',
    descripcion: 'Negativo universal para cualquier generación'
  },
  {
    id: 'neg_anime',
    nombre: 'Negativo Anime',
    valor: 'realistic, photo, 3d, western cartoon, bad anatomy, extra limbs, mutated hands',
    categoria: 'negativo',
    descripcion: 'Negativo específico para anime'
  },
  {
    id: 'neg_realista',
    nombre: 'Negativo Realista',
    valor: 'cartoon, anime, illustration, painting, drawing, cgi, render, sketch',
    categoria: 'negativo',
    descripcion: 'Negativo para mantener realismo'
  },
  {
    id: 'iluminacion_estudio',
    nombre: 'Iluminación Estudio',
    valor: 'studio lighting, softbox, key light, fill light, rim light, professional lighting setup',
    categoria: 'iluminacion',
    descripcion: 'Iluminación de estudio profesional'
  },
  {
    id: 'iluminacion_dramatica',
    nombre: 'Iluminación Dramática',
    valor: 'dramatic lighting, chiaroscuro, strong shadows, volumetric light, god rays',
    categoria: 'iluminacion',
    descripcion: 'Iluminación dramática con alto contraste'
  },
  {
    id: 'iluminacion_natural',
    nombre: 'Iluminación Natural',
    valor: 'natural lighting, golden hour, soft sunlight, ambient light, warm tones',
    categoria: 'iluminacion',
    descripcion: 'Iluminación natural y cálida'
  },
  {
    id: 'composicion_retrato',
    nombre: 'Composición Retrato',
    valor: 'portrait composition, rule of thirds, eye level, medium close-up, centered subject',
    categoria: 'composicion',
    descripcion: 'Composición ideal para retratos'
  },
  {
    id: 'composicion_paisaje',
    nombre: 'Composición Paisaje',
    valor: 'landscape composition, leading lines, foreground interest, layered depth, panoramic',
    categoria: 'composicion',
    descripcion: 'Composición ideal para paisajes'
  },
  {
    id: 'composicion_producto',
    nombre: 'Composición Producto',
    valor: 'product photography, centered, clean background, even lighting, commercial shot',
    categoria: 'composicion',
    descripcion: 'Composición para fotografía de producto'
  },
  {
    id: 'retrato_pro',
    nombre: 'Retrato Pro (Compuesto)',
    valor: 'masterpiece, best quality, studio portrait, professional lighting, 85mm lens, shallow DOF, sharp focus on eyes, natural skin texture, beautiful detailed eyes',
    categoria: 'compuesto',
    descripcion: 'Macro compuesto para retratos profesionales completos'
  }
];

// ─── NEGATIVES POR CATEGORÍA (11 categorías) ───
export const negativesPorCategoria = {
  calidad: {
    nombre: 'Calidad',
    icono: '⚡',
    items: [
      'worst quality', 'low quality', 'normal quality', 'lowres', 'blurry',
      'jpeg artifacts', 'noisy', 'grainy', 'pixelated', 'compressed'
    ]
  },
  anatomia: {
    nombre: 'Anatomía',
    icono: '🦴',
    items: [
      'bad anatomy', 'deformed', 'disfigured', 'mutated', 'extra limbs',
      'extra fingers', 'missing fingers', 'fused fingers', 'too many fingers',
      'bad hands', 'bad feet', 'long neck', 'cross-eyed'
    ]
  },
  texto: {
    nombre: 'Texto/Marcas',
    icono: '📝',
    items: [
      'text', 'watermark', 'signature', 'logo', 'username',
      'artist name', 'copyright', 'brand', 'label', 'subtitle'
    ]
  },
  composicion: {
    nombre: 'Composición',
    icono: '📐',
    items: [
      'cropped', 'cut off', 'out of frame', 'zoomed out', 'bad framing',
      'cluttered', 'messy background', 'distracting elements'
    ]
  },
  iluminacion: {
    nombre: 'Iluminación',
    icono: '💡',
    items: [
      'overexposed', 'underexposed', 'flat lighting', 'harsh shadows',
      'blown highlights', 'crushed blacks', 'washed out', 'flat colors'
    ]
  },
  estilo_no_deseado: {
    nombre: 'Estilo No Deseado',
    icono: '🎨',
    items: [
      '3d', 'cgi', 'render', 'cartoon', 'anime', 'illustration',
      'painting', 'drawing', 'sketch', 'pixel art', 'vector'
    ]
  },
  rostro: {
    nombre: 'Rostro',
    icono: '👤',
    items: [
      'ugly face', 'asymmetric eyes', 'deformed iris', 'bad proportions',
      'malformed face', 'distorted features', 'uncanny', 'plastic skin'
    ]
  },
  fondo: {
    nombre: 'Fondo',
    icono: '🖼️',
    items: [
      'ugly background', 'simple background', 'plain background',
      'distracting background', 'cluttered background', 'bad background'
    ]
  },
  nsfw: {
    nombre: 'NSFW',
    icono: '🚫',
    items: [
      'nsfw', 'nudity', 'nude', 'explicit', 'sexual',
      'gore', 'violence', 'disturbing', 'offensive'
    ]
  },
  manos: {
    nombre: 'Manos/Dedos',
    icono: '✋',
    items: [
      'bad hands', 'missing fingers', 'extra fingers', 'fewer fingers',
      'fused fingers', 'too many fingers', 'mutated hands', 'poorly drawn hands',
      'extra arms', 'missing arms', 'bad arms'
    ]
  },
  colores: {
    nombre: 'Colores',
    icono: '🌈',
    items: [
      'oversaturated', 'monochrome', 'washed out colors', 'neon colors',
      'muddy colors', 'flat colors', 'color banding', 'incorrect color'
    ]
  }
};

// ─── QUALITY BOOSTERS (8 categorías) ───
export const qualityBoosters = {
  general: {
    nombre: 'General',
    icono: '✨',
    items: ['masterpiece', 'best quality', 'highly detailed', 'sharp focus', 'professional']
  },
  resolucion: {
    nombre: 'Resolución',
    icono: '📺',
    items: ['8k', '4k', 'uhd', 'high resolution', 'ultra detailed', 'HDR']
  },
  render: {
    nombre: 'Render',
    icono: '🖥️',
    items: ['octane render', 'unreal engine 5', 'ray tracing', 'global illumination', 'physically based']
  },
  foto: {
    nombre: 'Fotografía',
    icono: '📷',
    items: ['DSLR', '85mm lens', 'bokeh', 'film grain', 'natural skin texture', 'RAW photo']
  },
  arte: {
    nombre: 'Arte Digital',
    icono: '🎨',
    items: ['trending on artstation', 'concept art', 'digital painting', 'matte painting', 'illustration']
  },
  anime: {
    nombre: 'Anime',
    icono: '🌸',
    items: ['anime key visual', 'beautiful detailed eyes', 'vibrant anime colors', 'clean anime art', 'official art']
  },
  textura: {
    nombre: 'Texturas',
    icono: '🧱',
    items: ['intricate details', 'micro details', 'surface details', 'realistic textures', 'material quality']
  },
  atmosfera: {
    nombre: 'Atmósfera',
    icono: '🌫️',
    items: ['atmospheric', 'volumetric lighting', 'ambient occlusion', 'depth of field', 'cinematic']
  }
};

// ─── PLANTILLAS PREDEFINIDAS (5 plantillas) ───
export const plantillasPredefinidas = [
  {
    id: 'retrato-profesional',
    nombre: 'Retrato Profesional',
    descripcion: 'Plantilla para retratos de alta calidad',
    plantilla: '{{calidad_max}}, {{iluminacion_estudio}}, {{composicion_retrato}}, {sujeto}, {expresion}, {vestimenta}, professional portrait, sharp focus on eyes',
    variables: ['sujeto', 'expresion', 'vestimenta'],
    negative: '{{neg_universal}}, {{neg_realista}}',
    categoria: 'retrato'
  },
  {
    id: 'paisaje-epico',
    nombre: 'Paisaje Épico',
    descripcion: 'Plantilla para paisajes dramáticos y épicos',
    plantilla: '{{calidad_max}}, {{iluminacion_natural}}, {{composicion_paisaje}}, {tipo_paisaje}, {hora_dia}, {clima}, epic scale, breathtaking vista',
    variables: ['tipo_paisaje', 'hora_dia', 'clima'],
    negative: '{{neg_universal}}, urban, city, buildings',
    categoria: 'paisaje'
  },
  {
    id: 'anime-character',
    nombre: 'Personaje Anime',
    descripcion: 'Plantilla para crear personajes anime',
    plantilla: '{{calidad_alta}}, {{anime}}, {nombre_personaje}, {descripcion_fisica}, {outfit}, {pose}, {fondo}, anime key visual, beautiful detailed eyes',
    variables: ['nombre_personaje', 'descripcion_fisica', 'outfit', 'pose', 'fondo'],
    negative: '{{neg_anime}}, realistic, photo, 3d',
    categoria: 'anime'
  },
  {
    id: 'producto-comercial',
    nombre: 'Producto Comercial',
    descripcion: 'Plantilla para fotografía de producto',
    plantilla: '{{calidad_max}}, {{composicion_producto}}, {producto}, {material}, clean white background, studio lighting, commercial photography, advertising quality',
    variables: ['producto', 'material'],
    negative: '{{neg_universal}}, messy, cluttered, dark',
    categoria: 'producto'
  },
  {
    id: 'escena-cinematica',
    nombre: 'Escena Cinemática',
    descripcion: 'Plantilla para escenas tipo película',
    plantilla: '{{calidad_max}}, {{cinematico}}, {escena}, {personajes}, {accion}, {ambiente}, film still, movie scene, dramatic composition',
    variables: ['escena', 'personajes', 'accion', 'ambiente'],
    negative: '{{neg_universal}}, amateur, snapshot, boring',
    categoria: 'cine'
  }
];

// ─── PROMPTS MAESTROS CON VARIABLES ───
export const promptsMaestros = [
  {
    id: 'retrato-universal',
    nombre: 'Retrato Universal',
    plantilla: '{{sujeto}}, {{composicion_retrato}}, {{iluminacion_estudio}}, {{calidad_max}}',
    descripcion: 'Plantilla base para retratos profesionales'
  },
  {
    id: 'paisaje-epico',
    nombre: 'Paisaje Épico',
    plantilla: '{{tipo_paisaje}}, {{composicion_paisaje}}, {{iluminacion_natural}}, {{calidad_max}}',
    descripcion: 'Para paisajes dramáticos'
  },
  {
    id: 'anime-hero',
    nombre: 'Héroe Anime',
    plantilla: '{{anime}}, {{calidad_alta}}, {hero_name}, {power}, dynamic pose, action scene',
    descripcion: 'Para personajes de anime en acción'
  }
];

// ─── ARTISTAS DE REFERENCIA ───
export const artistasReferencia = [
  { nombre: 'Roger Deakins', categoria: 'fotografía', estilo: 'cinematográfico' },
  { nombre: 'Annie Leibovitz', categoria: 'fotografía', estilo: 'retrato' },
  { nombre: 'Hayao Miyazaki', categoria: 'anime', estilo: 'ghibli' },
  { nombre: 'Akira Toriyama', categoria: 'anime', estilo: 'shonen' },
  { nombre: 'Salvador Dalí', categoria: 'arte', estilo: 'surrealismo' },
  { nombre: 'Claude Monet', categoria: 'arte', estilo: 'impresionismo' },
  { nombre: 'Alphonse Mucha', categoria: 'arte', estilo: 'art nouveau' },
  { nombre: 'Andy Warhol', categoria: 'arte', estilo: 'pop art' },
  { nombre: 'H.R. Giger', categoria: 'arte', estilo: 'biomecánico' },
  { nombre: 'Syd Mead', categoria: 'concept art', estilo: 'sci-fi' },
  { nombre: 'Craig Mullins', categoria: 'concept art', estilo: 'digital painting' },
  { nombre: 'Zdzisław Beksiński', categoria: 'arte', estilo: 'dark fantasy' },
  { nombre: 'Katsushika Hokusai', categoria: 'arte', estilo: 'ukiyo-e' },
  { nombre: 'Gustav Klimt', categoria: 'arte', estilo: 'art nouveau' },
  { nombre: 'Junji Ito', categoria: 'manga', estilo: 'horror' },
  { nombre: 'Peter Lindbergh', categoria: 'fotografía', estilo: 'fashion' },
  { nombre: 'Ansel Adams', categoria: 'fotografía', estilo: 'paisaje' },
  { nombre: 'Masamune Shirow', categoria: 'anime', estilo: 'cyberpunk' },
  { nombre: 'Todd Lockwood', categoria: 'fantasy art', estilo: 'D&D' },
  { nombre: 'Makoto Shinkai', categoria: 'anime', estilo: 'background art' }
];

// ─── SAMPLERS POPULARES ───
export const samplersPopulares = [
  { nombre: 'DPM++ 2M Karras', recomendado: true },
  { nombre: 'Euler a', recomendado: true },
  { nombre: 'DPM++ SDE Karras', recomendado: false },
  { nombre: 'DDIM', recomendado: false },
  { nombre: 'UniPC', recomendado: true },
  { nombre: 'Euler', recomendado: false },
  { nombre: 'DPM++ 2M SDE', recomendado: false },
  { nombre: 'LMS Karras', recomendado: false }
];
