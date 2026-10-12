// =============================================================
// PLAN — Render del plan semanal (links a videos)
// =============================================================

const state = {
  perfil: null,
  videos: [],
  plan: null
};

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function fmtKcal(n) { return Math.round(n); }

function renderPerfilActivo() {
  const el = document.getElementById("perfil-activo-detail");
  if (!state.perfil) {
    el.innerHTML = `<p style="font-size: var(--text-body); color: var(--color-mid-gray);">No hay perfil activo. <a href="perfiles.html" style="color: var(--color-ink); text-decoration: underline;">Crea uno aquí</a>.</p>`;
    document.getElementById("btn-generar").disabled = true;
    return;
  }
  el.innerHTML = `
    <h3 style="font-family: var(--font-sans); font-size: var(--text-subheading); font-weight: var(--font-weight-semibold); margin-bottom: var(--spacing-8);">${escapeHtml(state.perfil.nombre)}</h3>
    <p style="font-size: var(--text-body); color: var(--color-mid-gray);">
      <strong style="color: var(--color-ink);">${fmtKcal(state.perfil.kcal_objetivo)} kcal/día</strong> ·
      Proteína <strong style="color: var(--color-ink);">${state.perfil.proteina_g_objetivo}g</strong>
    </p>`;
  document.getElementById("btn-generar").disabled = false;
}

function renderPlan() {
  const grid = document.getElementById("plan-grid");
  const resumen = document.getElementById("plan-resumen");

  if (!state.plan) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="5" width="18" height="16" rx="2"/>
          <path d="M3 9h18M8 3v4M16 3v4"/>
        </svg>
        <h3>Aún no hay plan</h3>
        <p>Pulsa "Generar plan nuevo" para armar tu semana con los videos disponibles.</p>
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
          if (!slot.video) {
            return `<div class="plan-slot plan-slot--empty">
              <span class="plan-slot__label">${escapeHtml(slot.label)}</span>
              <span class="plan-slot__hint">— sin sugerencia —</span>
            </div>`;
          }
          return `<a class="plan-slot" href="${escapeHtml(slot.video.video_url)}" target="_blank" rel="noopener noreferrer">
            <span class="plan-slot__label">${escapeHtml(slot.label)}</span>
            <span class="plan-slot__title">${escapeHtml(slot.video.titulo)}</span>
            <span class="plan-slot__meta">${slot.video.kcal || 0} kcal · ${slot.video.proteina_g || 0}g proteína</span>
          </a>`;
        }).join("")}
      </div>
    </article>
  `).join("");

  renderResumen();
}

function renderResumen() {
  const promedio = window.MEAL_PLANNER.agregarMacros(state.plan);
  const objetivo = state.perfil;

  const cell = (label, value, target, unit) => {
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
    ${cell("Kcal/día", promedio.kcal, objetivo.kcal_objetivo, "")}
    ${cell("Proteína", promedio.proteina, objetivo.proteina_g_objetivo, "g")}
  `;

  // Lista simplificada: solo los titulos del plan
  const titulos = window.MEAL_PLANNER.consolidarVideos(state.videos, state.plan);
  document.getElementById("lista-compras").innerHTML = `
    <div class="lista-grupo">
      <h3 class="lista-grupo__title">Recetas del plan</h3>
      <ul class="lista-grupo__items">
        ${titulos.map(t => `<li><span class="lista-item__name">${escapeHtml(t)}</span></li>`).join("")}
      </ul>
    </div>
  `;

  document.getElementById("btn-print").onclick = () => window.print();
  document.getElementById("btn-copy").onclick = async () => {
    const txt = `Plan semanal — ${state.perfil.nombre}\n\n` + titulos.join("\n");
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

async function generarNuevo() {
  if (!state.perfil) return;
  const plan = window.MEAL_PLANNER.generarPlan(state.videos, state.perfil);

  const today = new Date();
  const day = today.getDay() || 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - day + 1);

  const payload = {
    perfil_id: state.perfil.id,
    perfil_nombre: state.perfil.nombre,
    semana_inicio: monday.toISOString().slice(0, 10),
    dias: plan.dias
  };

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
  state.videos = window.VIDEOS_DATA || [];
  try {
    state.plan = await window.SUPABASE.getPlanSemanaActivo();
  } catch (err) {
    console.error("[plan] getPlanSemanaActivo failed:", err);
    state.plan = null;
  }
  renderPerfilActivo();
  renderPlan();
}

document.addEventListener("DOMContentLoaded", async () => {
  if (window.loadVideos) await window.loadVideos();
  await refresh();

  document.getElementById("btn-generar").addEventListener("click", generarNuevo);
  document.getElementById("btn-clear").addEventListener("click", borrarPlan);
});