// =============================================================
// RECIPE RENDERING — index.html
// Diseño shadcn-style: monocromático, sin stickers decorativos.
// Iconos Lucide-style thin-stroke (1.5px).
// =============================================================

const CATEGORIES = ["Desayunos", "Comidas", "Cenas", "Bebidas", "Colación", "Postre"];

// -------------------------------------------------------------
// Iconos Lucide-style minimalistas (thin stroke 1.5px)
// -------------------------------------------------------------
const ICONS = {
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`,
  // Iconos por categoría (Lucide-style)
  desayuno: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8a4 4 0 0 0-8 0v2h8z"/><path d="M3 10h18v3a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6z"/><path d="M6 19v2"/><path d="M18 19v2"/></svg>`,
  comida:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11h18"/><path d="M12 11v9"/><path d="M5 11a7 7 0 0 1 14 0"/></svg>`,
  cena:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M5 12V8a3 3 0 0 1 6 0v4"/><circle cx="17" cy="10" r="3"/><path d="M19 13v8"/><path d="M9 13v6"/></svg>`,
  bebida:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2h8l-2 19a2 2 0 0 1-2 2h-0a2 2 0 0 1-2-2z"/><path d="M8 6h8"/><path d="M16 3h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2"/></svg>`,
  colacion: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l3 3"/></svg>`,
  postre:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21h16"/><path d="M5 21V11a7 7 0 0 1 14 0v10"/><path d="M12 4v7"/><path d="M9 7l3-3 3 3"/></svg>`
};

function categoryIcon(categoria) {
  const map = {
    "Desayunos": ICONS.desayuno,
    "Comidas":   ICONS.comida,
    "Cenas":     ICONS.cena,
    "Bebidas":   ICONS.bebida,
    "Colación":  ICONS.colacion,
    "Postre":    ICONS.postre
  };
  return map[categoria] || ICONS.comida;
}

window.categoryIcon = categoryIcon;

// -------------------------------------------------------------
// State
// -------------------------------------------------------------
const state = {
  activeCategory: "Todas",
  searchTerm: "",
  removedFilters: new Set()
};

// -------------------------------------------------------------
// Helpers
// -------------------------------------------------------------
function getRecipes() {
  return (window.RECIPES_DATA || []).map(r => window.normalizeRecipe ? window.normalizeRecipe(r) : r);
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
      (r.descripcion || "").toLowerCase().includes(t) ||
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
    : `<div class="recipe-card__photo-placeholder">${categoryIcon(recipe.categoria)}</div>`;

  return `
    <a href="receta.html?id=${recipe.id}" class="recipe-card fade-in">
      <div class="recipe-card__photo">
        ${photoContent}
        <span class="recipe-card__category">${recipe.categoria}</span>
      </div>
      <div class="recipe-card__body">
        <h3 class="recipe-card__title">${recipe.titulo}</h3>
        <p class="recipe-card__desc">${recipe.descripcion || ""}</p>
        <div class="recipe-card__meta">
          <span class="recipe-card__meta-item">${ICONS.clock} ${recipe.tiempoMin} min</span>
          <span class="recipe-card__meta-item">${ICONS.users} ${recipe.porciones} pers</span>
          <span style="margin-left: auto;">${recipe.macros.kcal} kcal</span>
        </div>
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
      <div class="filters__row filters__row--end">
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
  const filtered = filterRecipes();
  const grid = document.getElementById("recipe-grid");

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
        </svg>
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
  const avgKcal = Math.round(recipes.reduce((s, r) => s + (r.macros.kcal || 0), 0) / recipes.length);
  const avgProtein = Math.round(recipes.reduce((s, r) => s + (r.macros.proteina || 0), 0) / recipes.length);

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
document.addEventListener("DOMContentLoaded", async () => {
  if (document.getElementById("recipe-grid")) {
    if (window.loadRecipes) {
      await window.loadRecipes();
    }
    renderAll();
    updateStats();
  }
});