// =============================================================
// RECIPE DETAIL — receta.html
// Diseño shadcn-style: monocromático, sin stickers decorativos.
// =============================================================

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function formatMacrosBar(macros) {
  const total = (macros.proteina || 0) * 4 + (macros.carbohidratos || 0) * 4 + (macros.grasas || 0) * 9;
  if (total === 0) return { proteina: 0, carbohidratos: 0, grasas: 0 };
  return {
    proteina: Math.round(((macros.proteina || 0) * 4 / total) * 100),
    carbohidratos: Math.round(((macros.carbohidratos || 0) * 4 / total) * 100),
    grasas: Math.round(((macros.grasas || 0) * 9 / total) * 100)
  };
}

// Iconos Lucide-style (mismo set que recipes.js)
const ICONS_DETAIL = {
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  chef: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13a4 4 0 0 1 4-4V6a4 4 0 0 1 8 0v3a4 4 0 0 1 4 4v3H6z"/><path d="M6 17v3"/><path d="M18 17v3"/><path d="M9 11h.01"/><path d="M15 11h.01"/></svg>`
};

function renderRecipe(recipe) {
  document.title = `${recipe.titulo} — AppRecetas`;

  const bars = formatMacrosBar(recipe.macros);
  const root = document.getElementById("recipe-detail");

  // Foto o placeholder
  const photoHTML = recipe.foto
    ? `<img class="detail-photo__img" src="${recipe.foto}" alt="${recipe.titulo}">`
    : `<div class="detail-photo__placeholder">${window.categoryIcon ? window.categoryIcon(recipe.categoria) : ""}</div>`;

  root.innerHTML = `
    <section class="detail-hero">
      <div class="container">
        <a href="index.html" class="detail-back">← Volver al recetario</a>
        <div class="detail-hero__inner">
          <div class="detail-photo">
            ${photoHTML}
          </div>
          <div class="detail-meta">
            <span class="detail-category">${recipe.categoria}</span>
            <h1 class="detail-title">${recipe.titulo}</h1>
            <p class="detail-desc">${recipe.descripcion || ""}</p>
            <div class="detail-meta-info">
              <div class="detail-meta-info__item">
                <span class="detail-meta-info__label">Porciones</span>
                <span class="detail-meta-info__value">${recipe.porciones}</span>
              </div>
              <div class="detail-meta-info__item">
                <span class="detail-meta-info__label">Tiempo</span>
                <span class="detail-meta-info__value">${recipe.tiempoMin} min${recipe.tiempoReposo ? " + " + recipe.tiempoReposo : ""}</span>
              </div>
              <div class="detail-meta-info__item">
                <span class="detail-meta-info__label">Dificultad</span>
                <span class="detail-meta-info__value">${recipe.dificultad}</span>
              </div>
            </div>
            <div class="detail-actions">
              <button class="btn btn--primary" onclick="window.print()">Imprimir receta</button>
              <button class="btn btn--outline" id="copy-btn">Compartir enlace</button>
            </div>
            ${(recipe.tags && recipe.tags.length) ? `
              <div class="tags">
                ${(recipe.tags || []).map(t => `<span class="tag">${t}</span>`).join("")}
              </div>` : ""}
          </div>
        </div>
      </div>
    </section>

    <section class="container">
      <div class="macros-block">
        <div class="macros-block__head">
          <span class="text-mono">Información nutricional</span>
          <h2 class="heading">Macros por porción</h2>
          <p>Calculados sobre ${recipe.porciones} ${recipe.porciones === 1 ? "porción" : "porciones"} totales. Los porcentajes indican la distribución calórica de cada macronutriente.</p>
        </div>
        <div class="macros-grid">
          <div class="macro-card">
            <span class="macro-card__label">Calorías</span>
            <span class="macro-card__value">${recipe.macros.kcal} <span class="macro-card__unit">kcal</span></span>
            <div class="macro-card__bar"><span class="macro-card__bar-fill" style="width: 100%;"></span></div>
          </div>
          <div class="macro-card">
            <span class="macro-card__label">Proteína</span>
            <span class="macro-card__value">${recipe.macros.proteina} <span class="macro-card__unit">g</span></span>
            <div class="macro-card__bar"><span class="macro-card__bar-fill" style="width: ${bars.proteina * 4}%;"></span></div>
            <span class="macro-card__label">${bars.proteina}% kcal</span>
          </div>
          <div class="macro-card">
            <span class="macro-card__label">Carbohidratos</span>
            <span class="macro-card__value">${recipe.macros.carbohidratos} <span class="macro-card__unit">g</span></span>
            <div class="macro-card__bar"><span class="macro-card__bar-fill" style="width: ${bars.carbohidratos * 2}%;"></span></div>
            <span class="macro-card__label">${bars.carbohidratos}% kcal</span>
          </div>
          <div class="macro-card">
            <span class="macro-card__label">Grasas</span>
            <span class="macro-card__value">${recipe.macros.grasas} <span class="macro-card__unit">g</span></span>
            <div class="macro-card__bar"><span class="macro-card__bar-fill" style="width: ${bars.grasas * 2}%;"></span></div>
            <span class="macro-card__label">${bars.grasas}% kcal</span>
          </div>
        </div>
        ${recipe.macros.fibra ? `
          <div style="margin-top: var(--spacing-16); padding-top: var(--spacing-16); border-top: 1px solid var(--color-hairline); display: flex; flex-wrap: wrap; gap: var(--spacing-24); font-size: var(--text-caption); text-transform: uppercase; letter-spacing: var(--tracking-caption); color: var(--color-mid-gray); font-weight: var(--font-weight-medium);">
            <span>Fibra: <strong style="color: var(--color-ink);">${recipe.macros.fibra}g</strong></span>
          </div>
        ` : ""}
      </div>

      <div class="recipe-content">
        <aside class="recipe-content__sticky">
          <div class="ingredients-card">
            <h3>Ingredientes <span>${recipe.ingredientes.length} items</span></h3>
            <ul class="ingredients-list">
              ${recipe.ingredientes.map(i => `
                <li class="ingredient-item">
                  <span class="ingredient-check">✓</span>
                  <span><span class="ingredient-item__qty">${i.cantidad}</span>${i.item}</span>
                </li>
              `).join("")}
            </ul>
          </div>
        </aside>
        <div class="recipe-content__main">
          <div style="margin-bottom: var(--spacing-24);">
            <span class="text-mono">Consejos generales</span>
            <h2 class="heading" style="margin-top: var(--spacing-12);">Manos a la cocina</h2>
          </div>
          <ol class="steps-list">
            ${recipe.pasos.map((p, i) => `
              <li class="step-item">
                <span class="step-item__num">${String(i + 1).padStart(2, "0")}</span>
                <div class="step-item__body">
                  <h4 class="step-item__title">${p.titulo}</h4>
                  <p class="step-item__text">${p.texto}</p>
                </div>
              </li>
            `).join("")}
            ${recipe.tips ? `
              <li class="step-item">
                <span class="step-item__num">Tip</span>
                <div class="step-item__body">
                  <h4 class="step-item__title">Consejo del chef</h4>
                  <p class="step-item__text">${recipe.tips}</p>
                </div>
              </li>
            ` : ""}
          </ol>
          <div style="margin-top: var(--spacing-24); padding: var(--spacing-16); background: var(--color-surface-alt); border: 1px solid var(--color-hairline); border-radius: var(--radius-cards); display: flex; gap: var(--spacing-12); align-items: flex-start;">
            <span class="text-mono" style="flex-shrink:0;">Nota</span>
            <p style="font-size: var(--text-body); color: var(--color-mid-gray); line-height: var(--leading-body);">
              Los valores nutricionales son estimaciones calculadas por porción. Los resultados pueden variar según marcas, madurez de los ingredientes y método de cocción.
            </p>
          </div>
        </div>
      </div>
    </section>
  `;

  const copyBtn = document.getElementById("copy-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        copyBtn.textContent = "¡Enlace copiado!";
        setTimeout(() => copyBtn.textContent = "Compartir enlace", 2000);
      } catch (e) {
        copyBtn.textContent = "No se pudo copiar";
      }
    });
  }
}

function renderNotFound() {
  document.getElementById("recipe-detail").innerHTML = `
    <section class="container" style="padding: var(--spacing-48) 0;">
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/>
        </svg>
        <h3>Receta no encontrada</h3>
        <p>No pudimos cargar esta receta. Puede que haya sido eliminada o que el enlace esté roto.</p>
        <a href="index.html" class="btn btn--primary">Volver al recetario</a>
      </div>
    </section>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  const id = getQueryParam("id");
  if (!id) {
    renderNotFound();
    return;
  }
  if (window.loadRecipes) await window.loadRecipes();
  const recipes = (window.RECIPES_DATA || []).map(r => window.normalizeRecipe ? window.normalizeRecipe(r) : r);
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) {
    renderNotFound();
    return;
  }
  renderRecipe(recipe);
});