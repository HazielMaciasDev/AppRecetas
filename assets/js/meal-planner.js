// =============================================================
// MEAL PLANNER — Genera plan semanal 7 días × 5 tiempos
// respetando kcal y macros del perfil activo.
//
// Estrategia:
//   1. Asignar distribución calórica por tiempo (%).
//   2. Para cada slot, elegir receta cuya kcal esté dentro del rango.
//   3. Variar: evitar repetir la misma receta el mismo día.
//   4. Maximizar diversidad de títulos en la semana.
//   5. Si un slot no encaja, dejar "receta ligera" predefinida.
// =============================================================

const SLOT_DEFINITION = [
  { key: "Desayunos", label: "Desayuno",  pct: 0.25 },
  { key: "Colación",  label: "Colación",  pct: 0.10 },
  { key: "Comidas",   label: "Comida",    pct: 0.35 },
  { key: "Colación",  label: "Snack",     pct: 0.10 },
  { key: "Cenas",     label: "Cena",      pct: 0.20 }
];

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const CATEGORIA_POR_SLOT = {
  Desayunos: "Desayunos",
  Comidas:   "Comidas",
  Cenas:     "Cenas",
  Bebidas:   "Bebidas",
  Colación:  "Colación",
  Postre:    "Postre"
};

// Dedup: recetas que el usuario ya marcó en su despensa tienen bonificación
function getRecetasPorCategoria(recetas) {
  const map = {};
  for (const r of recetas) {
    if (!map[r.categoria]) map[r.categoria] = [];
    map[r.categoria].push(r);
  }
  return map;
}

function pickRandom(arr, avoid = new Set()) {
  const filtered = arr.filter(r => !avoid.has(r.id));
  if (!filtered.length) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// Encuentra receta en [categoria] cuya kcal esté dentro de [target, ±tolerancia]
function findReceta(candidates, targetKcal, toleranciaPct, avoid, perfilRecomendado) {
  const tol = targetKcal * toleranciaPct;
  const matching = candidates.filter(r => {
    if (avoid.has(r.id)) return false;
    const kcal = r.macros?.kcal || 0;
    return Math.abs(kcal - targetKcal) <= tol;
  });
  // Filtrar por perfil recomendado si aplica
  const filtered = perfilRecomendado && perfilRecomendado !== "ambos"
    ? matching.filter(r => !r.perfil_recomendado || r.perfil_recomendado.includes(perfilRecomendado) || r.perfil_recomendado.includes("ambos"))
    : matching;
  const pool = filtered.length ? filtered : matching;
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}

function generarPlan(recetas, perfil) {
  const porCategoria = getRecetasPorCategoria(recetas);
  const usadas = new Set(); // global en la semana
  const targetKcal = perfil.kcal_objetivo || 2000;
  const perfilRecomendado = perfil.objetivo === "deficit" ? "deficit"
                            : perfil.objetivo === "balance" ? "balance"
                            : "ambos";

  const dias = [];

  for (let d = 0; d < 7; d++) {
    const slots = [];
    for (const slotDef of SLOT_DEFINITION) {
      const slotKcal = targetKcal * slotDef.pct;
      const candidates = porCategoria[slotDef.key] || [];
      let receta = null;

      if (candidates.length) {
        // Tolerancia más amplia para desayuno/snack/cena; más estricta para comida
        const tol = slotDef.key === "Comidas" ? 0.30
                  : slotDef.key === "Cenas" ? 0.40
                  : 0.50;
        receta = findReceta(candidates, slotKcal, tol, usadas, perfilRecomendado);
        // Si no hay match exacto, ampliar tolerancia
        if (!receta) receta = findReceta(candidates, slotKcal, 1.0, usadas, perfilRecomendado);
        // Si aún nada, tomar cualquiera no usada
        if (!receta) receta = pickRandom(candidates, usadas);
      }

      if (receta) usadas.add(receta.id);

      slots.push({
        key: slotDef.key,
        label: slotDef.label,
        receta: receta ? {
          id: receta.id,
          titulo: receta.titulo,
          macros: receta.macros,
          tiempo_min: receta.tiempo_min,
          foto: receta.foto_url
        } : null
      });
    }
    dias.push({ nombre: DIAS[d], slots });
  }

  return { perfil_id: perfil.id, perfil_nombre: perfil.nombre, dias };
}

// -------------------------------------------------------------
// Macros agregados del plan
// -------------------------------------------------------------
function agregarMacros(plan) {
  let kcal = 0, prot = 0, carb = 0, gras = 0;
  for (const dia of plan.dias) {
    for (const slot of dia.slots) {
      if (!slot.receta) continue;
      const m = slot.receta.macros || {};
      kcal += m.kcal || 0;
      prot += m.proteina || 0;
      carb += m.carbohidratos || 0;
      gras += m.grasas || 0;
    }
  }
  const n = plan.dias.length || 1;
  return {
    kcal: Math.round(kcal / n),
    proteina: Math.round(prot / n),
    carbohidratos: Math.round(carb / n),
    grasas: Math.round(gras / n)
  };
}

// -------------------------------------------------------------
// Lista de compras consolidada
// -------------------------------------------------------------
function consolidarIngredientes(recetasAll, plan) {
  const mapa = new Map(); // key = nombre normalizado, value = { nombre, items: [] }
  for (const dia of plan.dias) {
    for (const slot of dia.slots) {
      if (!slot.receta) continue;
      const r = recetasAll.find(x => x.id === slot.receta.id);
      if (!r) continue;
      for (const ing of (r.ingredientes || [])) {
        const key = normKey(ing.item);
        if (!mapa.has(key)) mapa.set(key, { nombre: ing.item, items: [] });
        mapa.get(key).items.push({ receta: r.titulo, cantidad: ing.cantidad });
      }
    }
  }
  return Array.from(mapa.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
}

function normKey(s) {
  return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

// -------------------------------------------------------------
// Categorizar ingredientes (producción / proteína / lácteo / otros)
// -------------------------------------------------------------
const KEYWORDS = {
  produced: ["tomate", "cebolla", "ajo", "pimiento", "zanahoria", "calabaza", "pepino",
            "lechuga", "espinaca", "rúcula", "rúcula", "brócoli", "apio", "perejil",
            "cilantro", "albahaca", "menta", "jengibre", "lima", "limón", "aguacate",
            "champi", "berenjena", "repollo", "remolacha", "rábano", "apio", "puerro"],
  proteina: ["pollo", "pavo", "res", "cerdo", "salmón", "atún", "merluza", "tilapia",
             "pescado", "huevo", "whey", "proteína", "tempeh", "tofu", "garbanzo",
             "lenteja", "alubia", "frijol", "anacardo", "nuez", "semilla"],
  lacteo: ["yogur", "queso", "leche", "requesón", "feta", "parmesano"],
  carbs:   ["arroz", "quinoa", "avena", "pasta", "pan", "tortilla", "patata", "camote",
            "búlgar", "cuscús", "bulgur"]
};

function clasificar(nombre) {
  const n = normKey(nombre);
  for (const [cat, words] of Object.entries(KEYWORDS)) {
    if (words.some(w => n.includes(w))) return cat;
  }
  return "otros";
}

function agruparPorCategoria(consolidada) {
  const grupos = { produced: [], proteina: [], lacteo: [], carbs: [], otros: [] };
  for (const item of consolidada) {
    grupos[clasificar(item.nombre)].push(item);
  }
  return grupos;
}

window.MEAL_PLANNER = {
  generarPlan,
  agregarMacros,
  consolidarIngredientes,
  agruparPorCategoria,
  DIAS
};