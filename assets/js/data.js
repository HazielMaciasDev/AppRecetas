// =============================================================
// RECIPES DATA — Loader desde Supabase con fallback local
// El array local RECIPES_DATA_FALLBACK contiene los datos de muestra
// en caso de que Supabase no esté disponible (modo offline / local).
// =============================================================

window.RECIPES_DATA_FALLBACK = [
  {
    id: "smoothie-verde-tropical",
    titulo: "Smoothie verde tropical",
    categoria: "Bebidas",
    descripcion: "Espinaca, piña y jengibre con leche de coco. Energía fría para arrancar el día sin culpa.",
    foto_url: null,
    tiempo_min: 5,
    porciones: 1,
    dificultad: "Muy fácil",
    macros: { kcal: 198, proteina: 6, carbohidratos: 32, grasas: 5, fibra: 7 },
    macros_por_porcion: true,
    ingredientes: [
      { item: "Espinaca baby", cantidad: "1 taza" },
      { item: "Piña troceada congelada", cantidad: "1 taza" },
      { item: "Leche de coco ligera", cantidad: "200 ml" },
      { item: "Jengibre fresco rallado", cantidad: "1 cdta" },
      { item: "Jugo de lima", cantidad: "½ unidad" },
      { item: "Miel cruda", cantidad: "1 cda (opcional)" }
    ],
    pasos: [
      { titulo: "Idea general", texto: "Licúa líquidos primero, después las hojas y al final la piña congelada. Licúa a máxima potencia 45 segundos hasta textura sedosa. Bebe inmediatamente." }
    ],
    tags: ["vegano", "sin-gluten", "express", "detox"],
    perfil_recomendado: ["ambos"],
    tips: "Endulzar con dátiles si prefieres evitar miel."
  }
];

// =============================================================
// API pública: window.RECIPES_DATA (lo que consume recipes.js / recipe-detail.js)
// =============================================================

window.RECIPES_DATA = [];
window.RECIPES_INDEX = [];

async function loadRecipes() {
  try {
    const recetas = await window.SUPABASE.listRecetas();
    window.RECIPES_DATA = recetas || [];
    window.RECIPES_INDEX = (recetas || []).map(r => ({
      id: r.id, titulo: r.titulo, categoria: r.categoria,
      tiempoMin: r.tiempo_min, foto: r.foto_url, dificultad: r.dificultad
    }));
    return window.RECIPES_DATA;
  } catch (err) {
    console.warn("[AppRecetas] No se pudo cargar desde Supabase, usando fallback local:", err.message);
    window.RECIPES_DATA = window.RECIPES_DATA_FALLBACK;
    window.RECIPES_INDEX = window.RECIPES_DATA.map(r => ({
      id: r.id, titulo: r.titulo, categoria: r.categoria,
      tiempoMin: r.tiempo_min, foto: r.foto_url, dificultad: r.dificultad
    }));
    return window.RECIPES_DATA;
  }
}

// Adaptador: las páginas existentes esperan campos "tiempoMin" y "foto" (snake→camel)
// Normalizamos al cargar.
function normalizeRecipe(r) {
  return {
    ...r,
    tiempoMin: r.tiempo_min ?? r.tiempoMin ?? 0,
    foto: r.foto_url ?? r.foto ?? null,
    tiempoReposo: r.tiempo_reposo ?? r.tiempoReposo,
    dificultadLabel: r.dificultad_label ?? r.dificultadLabel
  };
}
window.normalizeRecipe = normalizeRecipe;