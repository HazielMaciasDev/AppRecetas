// =============================================================
// PLAN — Render del plan semanal + lista de compras
// =============================================================

const state = {
  perfil: null,
  recetas: [],
  plan: null  // { id, perfil_id, perfil_nombre, dias, lista_compras, semana_inicio }
};

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function fmtKcal(n) { return Math.round(n); }

// -------------------------------------------------------------
// Render: info del perfil activo
// -------------------------------------------------------------
function renderPerfilActivo() {
  const el = document.getElementById("perfil-activo-detail");
  if (!state.perfil) {
    el.innerHTML = `<p style="font-family: var(--font-sans); color: var(--color-slate);">No hay perfil activo. <a href="perfiles.html" style="color: var(--color-deep-teal); text-decoration: underline;">Crea uno aquí</a>.</p>`;
    document.getElementById("btn-generar").disabled = true;
    return;
  }
  el.innerHTML = `
    <h3 style="font-family: var(--font-serif); font-size: var(--text-heading-sm); margin-bottom: var(--space-2);">${escapeHtml(state.perfil.nombre)}</h3>
    <p style="font-family: var(--font-sans); color: var(--color-slate); font-size: var(--text-body-sm);">
      <strong>${fmtKcal(state.perfil.kcal_objetivo)} kcal/día</strong> ·
      Proteína <strong>${state.perfil.proteina_g_objetivo}g</strong> ·
      Carbos <strong>${state.perfil.carbos_g_objetivo}g</strong> ·
      Grasas <strong>${state.perfil.grasas_g_objetivo}g</strong>
    </p>`;
  document.getElementById("btn-generar").disabled = false;
}

// -------------------------------------------------------------
// Render: grid de plan
// -------------------------------------------------------------
function renderPlan() {
  const grid = document.getElementById("plan-grid");
  const resumen = document.getElementById("plan-resumen");

  if (!state.plan) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="14" width="60" height="52" rx="4" stroke="currentColor" stroke-width="2" stroke-dasharray="4 6"/>
          <path d="M10 24h60" stroke="currentColor" stroke-width="2"/>
          <path d="M22 14v-6M40 14v-6M58 14v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M22 38h12M22 48h12M40 38h12M40 48h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
        <h3>Aún no hay plan</h3>
        <p>Pulsa "Generar plan nuevo" para armar tu semana. La app elegirá recetas que respeten tus kcal y macros objetivo.</p>
      </div>`;
    resumen.hidden = true;
    document.getElementById("btn-clear").hidden = true;
    return;
  }

  document.getElementById("btn-clear").hidden = false;
  resumen.hidden = false;

  grid.innerHTML = state.plan.dias.map(dia => `
    <article class="plan-day">
      <h3 class="plan-day__title">${escapeHtml(dia.nombre)}</h3>
      <div class="plan-day__slots">
        ${dia.slots.map(slot => {
          if (!slot.receta) {
            return `<div class="plan-slot plan-slot--empty">
              <span class="plan-slot__label">${escapeHtml(slot.label)}</span>
              <span class="plan-slot__hint">— sin sugerencia —</span>
            </div>`;
          }
          return `<a class="plan-slot" href="receta.html?id=${escapeHtml(slot.receta.id)}">
            <span class="plan-slot__label">${escapeHtml(slot.label)}</span>
            <span class="plan-slot__title">${escapeHtml(slot.receta.titulo)}</span>
            <span class="plan-slot__meta">${slot.receta.macros.kcal} kcal · ${slot.receta.macros.proteina}P · ${slot.receta.macros.carbohidratos}C · ${slot.receta.macros.grasas}G</span>
          </a>`;
        }).join("")}
      </div>
    </article>
  `).join("");

  renderResumen();
}

// -------------------------------------------------------------
// Render: resumen + lista de compras
// -------------------------------------------------------------
function renderResumen() {
  const promedio = window.MEAL_PLANNER.agregarMacros(state.plan);
  const objetivo = state.perfil;

  const cell = (label, value, target, unit, isKcal = false) => {
    const diff = value - target;
    const pct = target ? Math.round((diff / target) * 100) : 0;
    const status = Math.abs(pct) <= 10 ? "ok"
                  : pct > 10 ? "over"
                  : "under";
    const statusLabel = status === "ok" ? "En objetivo"
                       : status === "over" ? `+${pct}% sobre`
                       : `${pct}% bajo`;
    return `
      <div class="macro-pill macro-pill--big ${status === 'ok' ? 'is-ok' : status === 'over' ? 'is-over' : 'is-under'}">
        <span class="macro-pill__label">${label}</span>
        <strong>${value}${unit}</strong>
        <span class="macro-pill__diff">${statusLabel} (objetivo ${target}${unit})</span>
      </div>`;
  };

  document.getElementById("macros-promedio").innerHTML = `
    ${cell("Kcal/día", promedio.kcal, objetivo.kcal_objetivo, "", true)}
    ${cell("Proteína", promedio.proteina, objetivo.proteina_g_objetivo, "g")}
    ${cell("Carbohidratos", promedio.carbohidratos, objetivo.carbos_g_objetivo, "g")}
    ${cell("Grasas", promedio.grasas, objetivo.grasas_g_objetivo, "g")}
  `;

  // Lista de compras
  const consolidada = window.MEAL_PLANNER.consolidarIngredientes(state.recetas, state.plan);
  const grupos = window.MEAL_PLANNER.agruparPorCategoria(consolidada);
  const labels = {
    produced: "Producción",
    proteina: "Proteínas",
    lacteo: "Lácteos",
    carbs: "Carbohidratos",
    otros: "Otros"
  };

  const html = Object.entries(grupos)
    .filter(([_, items]) => items.length)
    .map(([cat, items]) => `
      <div class="lista-grupo">
        <h3 class="lista-grupo__title">${labels[cat]}</h3>
        <ul class="lista-grupo__items">
          ${items.map(it => `
            <li>
              <label class="lista-item">
                <input type="checkbox" class="lista-item__check">
                <span class="lista-item__name">${escapeHtml(it.nombre)}</span>
              </label>
            </li>
          `).join("")}
        </ul>
      </div>
    `).join("");

  document.getElementById("lista-compras").innerHTML = html;

  // Botones de print/copy
  document.getElementById("btn-print").onclick = () => window.print();
  document.getElementById("btn-copy").onclick = async () => {
    const txt = Object.entries(grupos)
      .filter(([_, items]) => items.length)
      .map(([cat, items]) => `${labels[cat]}\n${items.map(it => `  - ${it.nombre}`).join("\n")}`)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(txt);
      const btn = document.getElementById("btn-copy");
      btn.textContent = "¡Copiado!";
      setTimeout(() => btn.textContent = "Copiar texto", 1800);
    } catch (e) {
      alert("No se pudo copiar");
    }
  };
}

// -------------------------------------------------------------
// Acciones
// -------------------------------------------------------------
async function generarNuevo() {
  if (!state.perfil) return;
  const plan = window.MEAL_PLANNER.generarPlan(state.recetas, state.perfil);

  // Calcular lista de compras consolidada
  const consolidada = window.MEAL_PLANNER.consolidarIngredientes(state.recetas, plan);
  const grupos = window.MEAL_PLANNER.agruparPorCategoria(consolidada);

  // Calcular macros promedio para guardar
  const promedio = window.MEAL_PLANNER.agregarMacros(plan);

  // Calcular lunes de esta semana
  const today = new Date();
  const day = today.getDay() || 7; // 1=lunes...7=domingo
  const monday = new Date(today);
  monday.setDate(today.getDate() - day + 1);

  const payload = {
    perfil_id: state.perfil.id,
    perfil_nombre: state.perfil.nombre,
    semana_inicio: monday.toISOString().slice(0, 10),
    dias: plan.dias,
    lista_compras: grupos
  };

  // Borrar planes anteriores y guardar el nuevo
  const anteriores = await window.SUPABASE.listPlanes();
  for (const p of anteriores) {
    await window.SUPABASE.deletePlan(p.id);
  }
  const saved = await window.SUPABASE.savePlan(payload);
  state.plan = saved[0];
  renderPlan();
}

async function borrarPlan() {
  if (!state.plan) return;
  if (!confirm("¿Borrar el plan actual?")) return;
  await window.SUPABASE.deletePlan(state.plan.id);
  state.plan = null;
  renderPlan();
}

async function refresh() {
  try {
    state.perfil = await window.SUPABASE.getPerfilActivo();
  } catch (err) {
    console.error("[plan] getPerfilActivo failed:", err);
    state.perfil = null;
  }
  state.recetas = window.RECIPES_DATA || [];
  try {
    state.plan = await window.SUPABASE.getPlanSemanaActivo();
  } catch (err) {
    console.error("[plan] getPlanSemanaActivo failed:", err);
    state.plan = null;
  }
  renderPerfilActivo();
  renderPlan();
}

// -------------------------------------------------------------
// Boot
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  await window.loadRecipes();
  await refresh();

  document.getElementById("btn-generar").addEventListener("click", generarNuevo);
  document.getElementById("btn-clear").addEventListener("click", borrarPlan);
});