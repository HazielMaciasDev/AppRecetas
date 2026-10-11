// =============================================================
// RECIPE RENDERING — index.html
// =============================================================

const CATEGORIES = ["Bebidas", "Desayuno", "Almuerzo", "Comida", "Cena"];
const CATEGORY_COLORS = {
  "Bebidas": "var(--color-sage)",
  "Desayuno": "var(--color-blush-sand)",
  "Almuerzo": "var(--color-card-mint)",
  "Comida": "var(--color-deep-teal)",
  "Cena": "var(--color-ink-navy)"
};

// -------------------------------------------------------------
// CATEGORY ICON SVG decorativo (hand-drawn style) — versión pequeña para cards
// -------------------------------------------------------------
function categoryBadge(categoria) {
  const map = {
    "Bebidas": `<svg viewBox="0 0 36 36" fill="none"><path d="M12 8h12l-2 22a2 2 0 01-2 2h-4a2 2 0 01-2-2L12 8z" stroke="#1c5d5f" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 6h12v2H12z" fill="#1c5d5f"/><path d="M16 14l4-4M20 14l-4-4" stroke="#65b8a2" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    "Desayuno": `<svg viewBox="0 0 36 36" fill="none"><ellipse cx="18" cy="16" rx="10" ry="3" stroke="#1c5d5f" stroke-width="1.6"/><path d="M8 16c0 6 4 11 10 11s10-5 10-11" stroke="#1c5d5f" stroke-width="1.6"/><path d="M14 14c0-3 2-5 4-5M22 14c0-3 2-5 4-5" stroke="#d6aec1" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    "Almuerzo": `<svg viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="9" stroke="#1c5d5f" stroke-width="1.6"/><path d="M18 9a8 8 0 010 16" fill="#a2cbcd" opacity=".5"/><circle cx="14" cy="16" r="1.2" fill="#d6aec1"/><circle cx="20" cy="20" r="1.5" fill="#65b8a2"/><path d="M22 8c2 1 3 3 3 5" stroke="#65b8a2" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    "Comida": `<svg viewBox="0 0 36 36" fill="none"><path d="M6 14c0-3 2-5 4-5s4 2 4 5-2 8-4 8-4-5-4-8z" stroke="#1c5d5f" stroke-width="1.6"/><path d="M22 9v17M18 13v13M26 9v17" stroke="#1c5d5f" stroke-width="1.6" stroke-linecap="round"/><circle cx="22" cy="8" r="2" fill="#65b8a2"/></svg>`,
    "Cena": `<svg viewBox="0 0 36 36" fill="none"><path d="M8 18h20l-2 12a1 1 0 01-1 1H11a1 1 0 01-1-1l-2-12z" stroke="#1c5d5f" stroke-width="1.6" stroke-linejoin="round"/><circle cx="18" cy="14" r="5" stroke="#1c5d5f" stroke-width="1.6"/><path d="M14 14h8" stroke="#d6aec1" stroke-width="1.4" stroke-linecap="round"/></svg>`
  };
  return map[categoria] || "";
}

// Exponer globalmente para que recipe-detail.js pueda usar la versión grande
window.categoryBadge = categoryBadge;

const state = {
  activeCategory: "Todas",
  searchTerm: "",
  removedFilters: new Set()
};

// -------------------------------------------------------------
// SVG ICONS inline
// -------------------------------------------------------------
const ICONS = {
  clock: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4"/><path d="M8 5v3.2L10 10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  chef: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6c0-2.2 1.8-4 4-4s4 1.8 4 4v1H4V6z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M2.5 7h11v6.5a1 1 0 01-1 1h-9a1 1 0 01-1-1V7z" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="10.5" r="1" fill="currentColor"/></svg>`,
  bowl: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="26" rx="22" ry="6" stroke="#231e21" stroke-width="2"/>
    <path d="M10 26c0 11 9 20 22 20s22-9 22-20" stroke="#231e21" stroke-width="2" stroke-linecap="round"/>
    <path d="M21 18c0-3 2-5 4-5M32 16c0-3 2-5 4-5M43 18c0-3 2-5 4-5" stroke="#65b8a2" stroke-width="2" stroke-linecap="round"/>
    <circle cx="42" cy="22" r="2" fill="#d6aec1"/>
  </svg>`,
  pitcher: `<svg viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 18l2 48a6 6 0 006 6h16a6 6 0 006-6l2-48" stroke="#231e21" stroke-width="2" stroke-linejoin="round"/>
    <path d="M16 8h32v12H16z" stroke="#231e21" stroke-width="2" stroke-linejoin="round"/>
    <path d="M48 22l8-6v8" stroke="#231e21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M22 30l4 4 4-4M38 30l-4 4-4-4" stroke="#65b8a2" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M30 40c0 6 6 8 6 14M28 50c2-2 4-3 6-5" stroke="#d6aec1" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  empty: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="32" stroke="currentColor" stroke-width="2" stroke-dasharray="4 6"/>
    <path d="M30 38c0-2 2-4 4-4s4 2 4 4-2 8-4 8-4-6-4-8z" stroke="currentColor" stroke-width="1.6"/>
    <path d="M42 38c0-2 2-4 4-4s4 2 4 4-2 8-4 8-4-6-4-8z" stroke="currentColor" stroke-width="1.6"/>
    <path d="M32 56c4-2 8-2 12 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
  </svg>`,
  search: `<svg viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.4"/><path d="M11 11l3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`
};

// -------------------------------------------------------------
// Helpers
// -------------------------------------------------------------
function formatMacros(num, unit = "g") {
  return `${num}${unit}`;
}

function getRecipes() {
  return window.RECIPES_DATA || [];
}

function filterRecipes() {
  let list = getRecipes();
  if (state.activeCategory !== "Todas") {
    list = list.filter(r => r.categoria === state.activeCategory);
  }
  if (state.removedFilters.has(state.activeCategory)) {
    list = [];
  }
  if (state.searchTerm) {
    const t = state.searchTerm.toLowerCase();
    list = list.filter(r =>
      r.titulo.toLowerCase().includes(t) ||
      r.descripcion.toLowerCase().includes(t) ||
      (r.tags || []).some(tag => tag.toLowerCase().includes(t))
    );
  }
  return list;
}

// -------------------------------------------------------------
// Render: Recipe card
// -------------------------------------------------------------
function renderPhotoCard(recipe) {
  const photoContent = recipe.foto
    ? `<img class="recipe-card__photo-img" src="${recipe.foto}" alt="${recipe.titulo}" loading="lazy">`
    : `<div class="recipe-card__photo-placeholder">${categoryBadge(recipe.categoria)}</div>`;

  return `
    <a href="receta.html?id=${recipe.id}" class="recipe-card fade-in">
      <div class="recipe-card__photo">
        ${photoContent}
        <span class="recipe-card__category">● ${recipe.categoria}</span>
        <div class="recipe-card__macros">
          <span class="recipe-card__macro">${recipe.macros.kcal} kcal</span>
        </div>
        <div class="recipe-card__sticker recipe-card__sticker--time sticker-bobbing">
          ${ICONS.clock}
        </div>
        <div class="recipe-card__sticker recipe-card__sticker--protein">
          ${ICONS.chef}
        </div>
      </div>
      <div class="recipe-card__body">
        <h3 class="recipe-card__title">${recipe.titulo}</h3>
        <p class="recipe-card__desc">${recipe.descripcion}</p>
        <div class="recipe-card__meta">
          <span class="recipe-card__meta-item">${ICONS.clock} ${recipe.tiempoMin} min</span>
          <span class="recipe-card__meta-item">${ICONS.chef} ${recipe.dificultad}</span>
          <span class="recipe-card__meta-item">${recipe.porciones} pers</span>
        </div>
        <span class="recipe-card__cta">Ver receta completa</span>
      </div>
    </a>
  `;
}

// -------------------------------------------------------------
// Render: Filter pills
// -------------------------------------------------------------
function renderFilters() {
  const recipes = getRecipes();
  const counts = { "Todas": recipes.length };
  CATEGORIES.forEach(c => counts[c] = recipes.filter(r => r.categoria === c).length);

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
      <div class="filters__row" style="justify-content: space-between; align-items: center;">
        <div class="search-input">
          ${ICONS.search}
          <input type="search" id="recipe-search" placeholder="Buscar por nombre, ingrediente, tag…" value="${state.searchTerm}" />
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
    : `<span style="font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.059em; color: rgba(40,51,56,0.5);">Filtros activos</span>
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
  const filtered = filterRecipes();
  const grid = document.getElementById("recipe-grid");

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        ${ICONS.empty}
        <h3>Nada por aquí todavía</h3>
        <p>No hemos encontrado recetas con esos filtros. Prueba a cambiar la categoría o limpia la búsqueda.</p>
        <button class="btn btn--ghost" onclick="resetFilters()">Quitar filtros</button>
      </div>
    `;
    return;
  }
  grid.innerHTML = filtered.map(renderPhotoCard).join("");
}

function resetFilters() {
  state.activeCategory = "Todas";
  state.searchTerm = "";
  state.removedFilters.clear();
  document.getElementById("recipe-search").value = "";
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
      state.removedFilters.clear();
      renderAll();
    });
  });

  const search = document.getElementById("recipe-search");
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
        const inp = document.getElementById("recipe-search");
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
  const recipes = getRecipes();
  const categories = new Set(recipes.map(r => r.categoria)).size;
  const avgKcal = Math.round(recipes.reduce((s, r) => s + r.macros.kcal, 0) / recipes.length);
  const avgProtein = Math.round(recipes.reduce((s, r) => s + r.macros.proteina, 0) / recipes.length);

  const els = {
    count: document.getElementById("stat-count"),
    categories: document.getElementById("stat-categories"),
    avg: document.getElementById("stat-avg")
  };
  if (els.count) els.count.textContent = `${recipes.length} recetas`;
  if (els.categories) els.categories.textContent = `${categories} categorías`;
  if (els.avg) els.avg.textContent = `${avgProtein}g proteína media`;
}

// Boot
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("recipe-grid")) {
    renderAll();
    updateStats();
  }
});
