// =============================================================
// VIDEOS RENDERING — index.html
// Cada card es una miniatura que abre el video en nueva pestaña.
// =============================================================

const CATEGORIES = ["Desayunos", "Comidas", "Cenas", "Bebidas", "Colación", "Postre"];

// -------------------------------------------------------------
// Iconos Lucide-style
// -------------------------------------------------------------
const ICONS = {
  play: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`,
  plate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>`
};

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// -------------------------------------------------------------
// State
// -------------------------------------------------------------
const state = {
  activeCategory: "Todas",
  searchTerm: ""
};

// -------------------------------------------------------------
// Helpers
// -------------------------------------------------------------
function getVideos() {
  return window.VIDEOS_DATA || [];
}

function filterVideos() {
  let list = getVideos();
  if (state.activeCategory !== "Todas") {
    list = list.filter(v => v.categoria === state.activeCategory);
  }
  if (state.searchTerm) {
    const t = state.searchTerm.toLowerCase();
    list = list.filter(v =>
      (v.titulo || "").toLowerCase().includes(t) ||
      (v.descripcion_corta || "").toLowerCase().includes(t)
    );
  }
  return list;
}

// -------------------------------------------------------------
// Render: Video card
// -------------------------------------------------------------
function renderVideoCard(video) {
  const photoContent = video.foto_url
    ? `<img class="recipe-card__photo-img" src="${escapeHtml(video.foto_url)}" alt="${escapeHtml(video.titulo)}" loading="lazy">`
    : `<div class="recipe-card__photo-placeholder">${ICONS.plate}</div>`;

  const meta = [
    video.kcal != null ? `${video.kcal} kcal` : null,
    video.proteina_g != null ? `${video.proteina_g}g proteína` : null
  ].filter(Boolean).join(" · ");

  return `
    <a href="${escapeHtml(video.video_url)}" target="_blank" rel="noopener noreferrer" class="recipe-card fade-in video-card">
      <div class="recipe-card__photo">
        ${photoContent}
        <span class="video-play" aria-label="Ver video">${ICONS.play}</span>
      </div>
      <div class="recipe-card__body">
        <h3 class="recipe-card__title">${escapeHtml(video.titulo)}</h3>
        ${video.descripcion_corta ? `<p class="recipe-card__desc">${escapeHtml(video.descripcion_corta)}</p>` : ""}
        <div class="recipe-card__meta">
          <span>${meta || "Ver video"}</span>
        </div>
      </div>
    </a>
  `;
}

// -------------------------------------------------------------
// Render: Filter pills
// -------------------------------------------------------------
function renderFilters() {
  const videos = getVideos();
  const counts = { "Todas": videos.length };
  CATEGORIES.forEach(c => counts[c] = videos.filter(v => v.categoria === c).length);

  const pillsHtml = ["Todas", ...CATEGORIES].map(cat => `
    <button
      type="button"
      class="filter-pill ${state.activeCategory === cat ? "is-active" : ""}"
      data-category="${cat}">
      ${cat}
      <span class="filter-pill__count">${counts[cat] || 0}</span>
    </button>
  `).join("");

  return `
    <div class="filters">
      <div class="filters__row" id="category-filters">
        ${pillsHtml}
      </div>
      <div class="filters__row filters__row--end">
        <div class="search-input">
          ${ICONS.search}
          <input type="search" id="video-search" placeholder="Buscar por nombre…" value="${state.searchTerm}" />
        </div>
        <div class="active-filters" id="active-filters-display"></div>
      </div>
    </div>
  `;
}

function renderActiveFilters() {
  const display = document.getElementById("active-filters-display");
  if (!display) return;
  const filters = [];
  if (state.activeCategory !== "Todas") filters.push({ label: state.activeCategory, type: "category" });
  if (state.searchTerm) filters.push({ label: `“${state.searchTerm}”`, type: "search" });

  display.innerHTML = filters.length === 0
    ? ""
    : `<span class="text-mono">Filtros activos</span>
       <div class="active-filters__list">${filters.map(f => `
         <span class="chip">${f.label}
           <span class="chip__close" data-filter-type="${f.type}">✕</span>
         </span>
       `).join("")}</div>`;
}

// -------------------------------------------------------------
// Render: Grid + empty state
// -------------------------------------------------------------
function renderGrid() {
  const filtered = filterVideos();
  const grid = document.getElementById("video-grid");

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        ${ICONS.search}
        <h3>Nada por aquí todavía</h3>
        <p>No hemos encontrado videos con esos filtros. Prueba a cambiar la categoría o limpia la búsqueda.</p>
        <button class="btn btn--ghost" onclick="resetFilters()">Quitar filtros</button>
      </div>
    `;
    return;
  }
  grid.innerHTML = filtered.map(renderVideoCard).join("");
}

function resetFilters() {
  state.activeCategory = "Todas";
  state.searchTerm = "";
  state.removedFilters?.clear?.();
  const inp = document.getElementById("video-search");
  if (inp) inp.value = "";
  renderAll();
}

// -------------------------------------------------------------
// Init
// -------------------------------------------------------------
function renderAll() {
  const filtersContainer = document.getElementById("filters-container");
  if (filtersContainer) filtersContainer.innerHTML = renderFilters();
  renderActiveFilters();
  renderGrid();
  attachFilterHandlers();
}

function attachFilterHandlers() {
  document.querySelectorAll("[data-category]").forEach(btn => {
    btn.addEventListener("click", e => {
      state.activeCategory = e.currentTarget.dataset.category;
      renderAll();
    });
  });

  const search = document.getElementById("video-search");
  if (search) {
    search.addEventListener("input", e => {
      state.searchTerm = e.target.value;
      renderActiveFilters();
      renderGrid();
    });
  }

  document.querySelectorAll(".chip__close").forEach(chip => {
    chip.addEventListener("click", e => {
      const type = e.currentTarget.dataset.filterType;
      if (type === "category") state.activeCategory = "Todas";
      if (type === "search") {
        state.searchTerm = "";
        const inp = document.getElementById("video-search");
        if (inp) inp.value = "";
      }
      renderAll();
    });
  });
}

// -------------------------------------------------------------
// Stat strip update
// -------------------------------------------------------------
function updateStats() {
  const videos = getVideos();
  const categories = new Set(videos.map(v => v.categoria).filter(Boolean)).size;
  const avgKcal = videos.length
    ? Math.round(videos.reduce((s, v) => s + (v.kcal || 0), 0) / videos.length)
    : 0;
  const avgProtein = videos.length
    ? Math.round(videos.reduce((s, v) => s + Number(v.proteina_g || 0), 0) / videos.length)
    : 0;

  const els = {
    count: document.getElementById("stat-count"),
    categories: document.getElementById("stat-categories"),
    avg: document.getElementById("stat-avg")
  };
  if (els.count) els.count.textContent = `${videos.length} recetas`;
  if (els.categories) els.categories.textContent = `${categories} categorías`;
  if (els.avg) els.avg.textContent = `${avgKcal} kcal media · ${avgProtein}g proteína`;
}

// Boot
document.addEventListener("DOMContentLoaded", async () => {
  if (document.getElementById("video-grid")) {
    if (window.loadVideos) {
      await window.loadVideos();
    }
    renderAll();
    updateStats();
  }
});