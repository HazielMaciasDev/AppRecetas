// =============================================================
// DESPENSA — Input de palabras clave + matching con titulos de videos
// Adaptado al nuevo modelo: matching por palabras del titulo/descripcion.
// =============================================================

const state = {
  items: [],          // [{id, ingrediente, cantidad}]
  videos: []          // todos los videos
};

function norm(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOPWORDS = new Set([
  "de", "del", "la", "el", "los", "las", "y", "o", "u", "con", "sin",
  "a", "al", "en", "un", "una", "unos", "unas", "para", "por"
]);

function tokens(s) {
  return norm(s).split(" ").filter(t => t.length >= 3 && !STOPWORDS.has(t));
}

function calcularCompatibilidad(video, despensaTokens) {
  const tituloTokens = tokens(video.titulo + " " + (video.descripcion_corta || ""));
  if (tituloTokens.length === 0) return { score: 0, hits: 0 };
  const hits = tituloTokens.filter(t => despensaTokens.some(d => d.includes(t) || t.includes(d) || d === t)).length;
  return { score: hits / tituloTokens.length, hits };
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function renderDespensaList() {
  const list = document.getElementById("despensa-list");
  if (!state.items.length) {
    list.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="6" width="18" height="14" rx="2"/>
          <path d="M8 6V4a4 4 0 0 1 8 0v2"/>
        </svg>
        <h3>Despensa vacía</h3>
        <p>Añade palabras clave de lo que tienes en casa (ej: "pollo", "avena", "huevos"). Te mostraremos qué videos coinciden.</p>
      </div>`;
    return;
  }

  list.innerHTML = state.items.map(item => `
    <div class="despensa-chip" data-id="${item.id}">
      <div class="despensa-chip__main">
        <span class="despensa-chip__name">${escapeHtml(item.ingrediente)}</span>
        ${item.cantidad ? `<span class="despensa-chip__qty">${escapeHtml(item.cantidad)}</span>` : ""}
      </div>
      <button class="despensa-chip__remove" type="button" aria-label="Eliminar">✕</button>
    </div>
  `).join("");

  list.querySelectorAll(".despensa-chip__remove").forEach(btn => {
    btn.addEventListener("click", async e => {
      const id = e.currentTarget.closest(".despensa-chip").dataset.id;
      await window.SUPABASE.deleteDespensa(id);
      await refreshAll();
    });
  });
}

function renderCompatibles() {
  const grid = document.getElementById("compatibles-grid");
  const despensaTokens = state.items.flatMap(it => tokens(it.ingrediente + " " + (it.cantidad || "")));

  if (!state.items.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <p class="text-mono">Añade palabras clave para ver qué videos coinciden</p>
      </div>`;
    document.getElementById("stat-compatibles").textContent = "0";
    return;
  }

  const compatibles = state.videos
    .map(v => ({ video: v, comp: calcularCompatibilidad(v, despensaTokens) }))
    .filter(x => x.comp.hits > 0)
    .sort((a, b) => b.comp.score - a.comp.score || b.comp.hits - a.comp.hits);

  document.getElementById("stat-compatibles").textContent = compatibles.length;

  if (!compatibles.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <h3>Sin coincidencias</h3>
        <p>Añade más palabras clave o explora todas las recetas en el recetario.</p>
        <a href="index.html" class="btn btn--ghost">Ir al recetario</a>
      </div>`;
    return;
  }

  grid.innerHTML = compatibles.map(({ video, comp }) => {
    const pct = Math.round(comp.score * 100);
    const compatibleLabel = pct >= 50
      ? `<span class="badge badge--ok">Match · ${pct}%</span>`
      : `<span class="badge badge--mid">Sugerencia · ${pct}%</span>`;
    return `
      <a href="${escapeHtml(video.video_url)}" target="_blank" rel="noopener noreferrer" class="recipe-card">
        <div class="recipe-card__photo">
          ${video.foto_url
            ? `<img class="recipe-card__photo-img" src="${escapeHtml(video.foto_url)}" alt="${escapeHtml(video.titulo)}" loading="lazy">`
            : `<div class="recipe-card__photo-placeholder">${window.categoryIcon ? window.categoryIcon(video.categoria) : ""}</div>`}
          <span class="recipe-card__category">${video.categoria}</span>
          ${compatibleLabel}
        </div>
        <div class="recipe-card__body">
          <h3 class="recipe-card__title">${escapeHtml(video.titulo)}</h3>
          <p class="recipe-card__desc">${escapeHtml(video.descripcion_corta || "")}</p>
          <div class="recipe-card__meta">
            ${video.kcal != null ? `<span>${video.kcal} kcal</span><span>·</span>` : ""}
            ${video.proteina_g != null ? `<span>${video.proteina_g}g proteína</span>` : ""}
          </div>
        </div>
      </a>`;
  }).join("");
}

async function refreshAll() {
  state.items = await window.SUPABASE.listDespensa();
  document.getElementById("stat-total").textContent = state.items.length;
  renderDespensaList();
  renderCompatibles();
}

document.addEventListener("DOMContentLoaded", async () => {
  if (window.loadVideos) await window.loadVideos();
  state.videos = window.VIDEOS_DATA;
  await refreshAll();

  const form = document.getElementById("despensa-form");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const ing = document.getElementById("input-ingrediente").value.trim();
    const qty = document.getElementById("input-cantidad").value.trim();
    if (!ing) return;
    await window.SUPABASE.addDespensa({ ingrediente: ing, cantidad: qty || null });
    form.reset();
    await refreshAll();
  });

  document.getElementById("btn-clear").addEventListener("click", async () => {
    if (!confirm("¿Vaciar toda la despensa?")) return;
    await window.SUPABASE.clearDespensa();
    await refreshAll();
  });
});