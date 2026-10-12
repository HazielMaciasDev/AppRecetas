// =============================================================
// MEAL PLANNER — Genera plan semanal 7 días × 5 tiempos
// Adaptado al modelo de videos: cada slot es un link a video.
// =============================================================

const SLOT_DEFINITION = [
  { key: "Desayunos", label: "Desayuno",  pct: 0.25 },
  { key: "Colación",  label: "Colación",  pct: 0.10 },
  { key: "Comidas",   label: "Comida",    pct: 0.35 },
  { key: "Colación",  label: "Snack",     pct: 0.10 },
  { key: "Cenas",     label: "Cena",      pct: 0.20 }
];

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function getVideosPorCategoria(videos) {
  const map = {};
  for (const v of videos) {
    if (!map[v.categoria]) map[v.categoria] = [];
    map[v.categoria].push(v);
  }
  return map;
}

function pickRandom(arr, avoid = new Set()) {
  const filtered = arr.filter(v => !avoid.has(v.id));
  if (!filtered.length) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function findVideo(candidates, targetKcal, toleranciaPct, avoid) {
  const tol = targetKcal * toleranciaPct;
  const matching = candidates.filter(v => {
    if (avoid.has(v.id)) return false;
    const kcal = v.kcal || 0;
    return Math.abs(kcal - targetKcal) <= tol;
  });
  const pool = matching.length ? matching : candidates.filter(v => !avoid.has(v.id));
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}

function generarPlan(videos, perfil) {
  const porCategoria = getVideosPorCategoria(videos);
  const usadas = new Set();
  const targetKcal = perfil.kcal_objetivo || 2000;

  const dias = [];

  for (let d = 0; d < 7; d++) {
    const slots = [];
    for (const slotDef of SLOT_DEFINITION) {
      const slotKcal = targetKcal * slotDef.pct;
      const candidates = porCategoria[slotDef.key] || [];
      let video = null;

      if (candidates.length) {
        const tol = slotDef.key === "Comidas" ? 0.30
                  : slotDef.key === "Cenas" ? 0.40
                  : 0.50;
        video = findVideo(candidates, slotKcal, tol, usadas);
        if (!video) video = pickRandom(candidates, usadas);
      }

      if (video) usadas.add(video.id);

      slots.push({
        key: slotDef.key,
        label: slotDef.label,
        video: video ? {
          id: video.id,
          titulo: video.titulo,
          video_url: video.video_url,
          kcal: video.kcal,
          proteina_g: video.proteina_g
        } : null
      });
    }
    dias.push({ nombre: DIAS[d], slots });
  }

  return { perfil_id: perfil.id, perfil_nombre: perfil.nombre, dias };
}

function agregarMacros(plan) {
  let kcal = 0, prot = 0, carb = 0, gras = 0;
  for (const dia of plan.dias) {
    for (const slot of dia.slots) {
      if (!slot.video) continue;
      kcal += slot.video.kcal || 0;
      prot += Number(slot.video.proteina_g || 0);
    }
  }
  const n = plan.dias.length || 1;
  return {
    kcal: Math.round(kcal / n),
    proteina: Math.round(prot / n),
    carbohidratos: carb,
    grasas: gras
  };
}

function consolidarVideos(videosAll, plan) {
  // Como ahora no hay ingredientes, consolidamos solo los titulos
  const titulos = new Set();
  for (const dia of plan.dias) {
    for (const slot of dia.slots) {
      if (!slot.video) continue;
      titulos.add(slot.video.titulo);
    }
  }
  return Array.from(titulos).sort();
}

window.MEAL_PLANNER = {
  generarPlan,
  agregarMacros,
  consolidarVideos,
  DIAS
};