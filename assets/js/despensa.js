// =============================================================
// DESPENSA — CRUD ingredientes + matching de recetas
// =============================================================

const state = {
  items: [],          // [{id, ingrediente, cantidad}]
  recipes: [],        // todas las recetas
  searchTerm: ""
};

// -------------------------------------------------------------
// Normalización para matching flexible
// -------------------------------------------------------------
function norm(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Quitar palabras irrelevantes que ensucian el match
const STOPWORDS = new Set([
  "de", "del", "la", "el", "los", "las", "y", "o", "u", "con", "sin",
  "a", "al", "en", "un", "una", "unos", "unas", "para", "por", "fresco",
  "fresca", "seco", "seca", "secos", "secas", "molido", "molida", "rallado",
  "rallada", "troceado", "troceada", "picado", "picada", "natural", "light",
  "extra", "virgen", "puro", "pura", "pequeno", "pequena", "grande", "chico"
]);

function tokens(s) {
  return norm(s).split(" ").filter(t => t.length >= 3 && !STOPWORDS.has(t));
}

// Devuelve true si TODOS los tokens principales del ingrediente están
// cubiertos por la despensa.
function matchIngredient(ingredienteTexto, despensaTokens) {
  const ingTokens = tokens(ingredienteTexto);
  if (ingTokens.length === 0) return true; // si no hay tokens, lo damos por OK
  // requiere al menos 1 token del ingrediente presente en la despensa
  // (matching flexible — un solo ingrediente del refri suele bastar)
  return ingTokens.some(t => despensaTokens.some(d => d.includes(t) || t.includes(d) || d === t));
}

function calcularCompatibilidad(receta, despensaTokens) {
  const total = receta.ingredientes.length;
  if (total === 0) return { score: 0, count: 0, total: 0 };
  let count = 0;
  for (const ing of receta.ingredientes) {
    if (matchIngredient(ing.item, despensaTokens)) count++;
  }
  return {
    score: count / total,
    count,
    total
  };
}

// -------------------------------------------------------------
// Render: lista de ingredientes en despensa
// -------------------------------------------------------------
function renderDespensaList() {
  const list = document.getElementById("despensa-list");
  if (!state.items.length) {
    list.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="14" y="22" width="52" height="46" rx="4" stroke="currentColor" stroke-width="2" stroke-dasharray="4 6"/>
          <path d="M22 22V14a18 18 0 0136 0v8" stroke="currentColor" stroke-width="2"/>
          <path d="M28 38h24M28 48h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
        <h3>Despensa vacía</h3>
        <p>Añade arriba los ingredientes que tienes en casa y te diremos qué cocinar.</p>
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

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// -------------------------------------------------------------
// Render: grid de recetas compatibles
// -------------------------------------------------------------
function renderCompatibles() {
  const grid = document.getElementById("compatibles-grid");
  const despensaTokens = state.items.flatMap(it => tokens(it.ingrediente + " " + (it.cantidad || "")));

  if (!state.items.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <p style="font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.059em; color: var(--color-pine-shadow); font-size: 13px;">
          Añade ingredientes para ver qué puedes cocinar
        </p>
      </div>`;
    document.getElementById("stat-compatibles").textContent = "0";
    return;
  }

  const compatibles = state.recipes
    .map(r => ({ recipe: r, comp: calcularCompatibilidad(r, despensaTokens) }))
    .filter(x => x.comp.count > 0)
    .sort((a, b) => b.comp.score - a.comp.score || b.comp.count - a.comp.count);

  document.getElementById("stat-compatibles").textContent = compatibles.length;

  if (!compatibles.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <h3>Sin coincidencias claras</h3>
        <p>Añade más ingredientes o busca la receta manualmente en el recetario.</p>
        <a href="index.html" class="btn btn--ghost">Ir al recetario</a>
      </div>`;
    return;
  }

  grid.innerHTML = compatibles.map(({ recipe, comp }) => {
    const pct = Math.round(comp.score * 100);
    const compatibleLabel = pct >= 80
      ? `<span class="badge badge--ok">Tienes todo · ${pct}%</span>`
      : pct >= 50
        ? `<span class="badge badge--mid">Casi · ${pct}%</span>`
        : `<span class="badge badge--low">Te falta · ${pct}%</span>`;
    return `
      <a href="receta.html?id=${recipe.id}" class="recipe-card">
        <div class="recipe-card__photo">
          ${recipe.foto_url
            ? `<img class="recipe-card__photo-img" src="${recipe.foto_url}" alt="${escapeHtml(recipe.titulo)}" loading="lazy">`
            : `<div class="recipe-card__photo-placeholder">${window.categoryBadge ? window.categoryBadge(recipe.categoria) : ""}</div>`}
          <span class="recipe-card__category">● ${recipe.categoria}</span>
          ${compatibleLabel}
        </div>
        <div class="recipe-card__body">
          <h3 class="recipe-card__title">${escapeHtml(recipe.titulo)}</h3>
          <p class="recipe-card__desc">${escapeHtml(recipe.descripcion || "")}</p>
          <div class="recipe-card__meta">
            <span>${recipe.macros.kcal} kcal</span>
            <span>·</span>
            <span>${recipe.tiempo_min} min</span>
            <span>·</span>
            <span>Tienes ${comp.count}/${comp.total}</span>
          </div>
        </div>
      </a>`;
  }).join("");
}

// -------------------------------------------------------------
// Autocomplete: sugerir ingredientes desde BD
// -------------------------------------------------------------
function setupAutocomplete() {
  const input = document.getElementById("input-ingrediente");
  const suggestions = document.getElementById("autocomplete-suggestions");
  if (!input) return;

  // Construir set único de ingredientes desde las recetas
  const allIngredientes = new Set();
  state.recipes.forEach(r => r.ingredientes.forEach(i => allIngredientes.add(i.item)));
  const sorted = Array.from(allIngredientes).sort();

  input.addEventListener("input", () => {
    const val = norm(input.value);
    if (val.length < 2) { suggestions.hidden = true; suggestions.innerHTML = ""; return; }
    const matches = sorted.filter(i => norm(i).includes(val)).slice(0, 8);
    if (!matches.length) { suggestions.hidden = true; suggestions.innerHTML = ""; return; }
    suggestions.innerHTML = matches.map(m =>
      `<button type="button" class="autocomplete-item">${escapeHtml(m)}</button>`
    ).join("");
    suggestions.hidden = false;
    suggestions.querySelectorAll(".autocomplete-item").forEach(btn => {
      btn.addEventListener("click", () => {
        input.value = btn.textContent;
        suggestions.hidden = true;
        input.focus();
      });
    });
  });

  input.addEventListener("blur", () => {
    setTimeout(() => { suggestions.hidden = true; }, 150);
  });
}

// -------------------------------------------------------------
// Refresh
// -------------------------------------------------------------
async function refreshAll() {
  state.items = await window.SUPABASE.listDespensa();
  document.getElementById("stat-total").textContent = state.items.length;
  renderDespensaList();
  renderCompatibles();
}

// -------------------------------------------------------------
// Boot
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  await window.loadRecipes();
  state.recipes = window.RECIPES_DATA;

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

  setupAutocomplete();
});