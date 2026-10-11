// =============================================================
// RECIPE DETAIL — receta.html
// =============================================================

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function formatMacrosBar(macros) {
  // Calculamos distribución porcentual aproximada
  const total = macros.proteina * 4 + macros.carbohidratos * 4 + macros.grasas * 9;
  return {
    proteina: Math.round((macros.proteina * 4 / total) * 100),
    carbohidratos: Math.round((macros.carbohidratos * 4 / total) * 100),
    grasas: Math.round((macros.grasas * 9 / total) * 100)
  };
}

function renderRecipe(recipe) {
  document.title = `${recipe.titulo} — Recetas Editoriales`;

  const bars = formatMacrosBar(recipe.macros);
  const root = document.getElementById("recipe-detail");

  // Foto o placeholder
  const photoHTML = recipe.foto
    ? `<img class="detail-photo__img" src="${recipe.foto}" alt="${recipe.titulo}">`
    : `<div class="detail-photo__placeholder">${categoryBadgeLarge(recipe.categoria)}</div>`;

  root.innerHTML = `
    <section class="detail-hero">
      <div class="container">
        <a href="index.html" class="detail-back">Volver al recetario</a>
        <div class="detail-hero__inner">
          <div class="detail-photo">
            <div class="detail-photo__frame">${photoHTML}</div>
            <div class="detail-photo__sticker detail-photo__sticker--time sticker-bobbing">
              <div>
                <strong>${recipe.tiempoMin}</strong>
                <span>Minutos</span>
              </div>
            </div>
            <div class="detail-photo__sticker detail-photo__sticker--kcal">
              <div>
                <strong>${recipe.macros.kcal}</strong>
                <span>kcal</span>
              </div>
            </div>
          </div>
          <div class="detail-meta">
            <span class="detail-category">● ${recipe.categoria}</span>
            <h1 class="detail-title">${recipe.titulo}</h1>
            <p class="detail-desc">${recipe.descripcion}</p>
            <div class="detail-meta-info">
              <div class="detail-meta-info__item">
                <span class="detail-meta-info__label">Porciones</span>
                <span class="detail-meta-info__value">${recipe.porciones}</span>
              </div>
              <div class="detail-meta-info__item">
                <span class="detail-meta-info__label">Tiempo</span>
                <span class="detail-meta-info__value">${recipe.tiempoMin} min ${recipe.tiempoReposo ? "+ " + recipe.tiempoReposo : ""}</span>
              </div>
              <div class="detail-meta-info__item">
                <span class="detail-meta-info__label">Dificultad</span>
                <span class="detail-meta-info__value">${recipe.dificultad}</span>
              </div>
            </div>
            <div class="detail-actions">
              <button class="btn btn--primary" onclick="window.print()">Imprimir receta</button>
              <button class="btn btn--ghost" id="copy-btn">Compartir enlace</button>
            </div>
            <div class="tags">
              ${(recipe.tags || []).map(t => `<span class="tag">${t}</span>`).join("")}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container">
      <div class="macros-block">
        <div class="macros-block__head">
          <span class="eyebrow">● Información nutricional</span>
          <h2 class="headline-serif">Macros <em>por porción</em></h2>
          <p>Calculados sobre ${recipe.porciones} ${recipe.porciones === 1 ? "porción" : "porciones"} totales. Los porcentajes indican la distribución calórica de cada macronutriente.</p>
        </div>
        <div class="macros-grid">
          <div class="macro-card macro-card--paper">
            <span class="macro-card__label">Calorías</span>
            <span class="macro-card__value">${recipe.macros.kcal} <span class="macro-card__unit">kcal</span></span>
            <div class="macro-card__bar"><span class="macro-card__bar-fill" style="width: 100%; background: var(--color-deep-teal);"></span></div>
          </div>
          <div class="macro-card macro-card--mint">
            <span class="macro-card__label">Proteína</span>
            <span class="macro-card__value">${recipe.macros.proteina} <span class="macro-card__unit">g</span></span>
            <div class="macro-card__bar"><span class="macro-card__bar-fill" style="width: ${bars.proteina * 4}%;"></span></div>
            <span class="macro-card__label" style="opacity:0.5">${bars.proteina}% kcal</span>
          </div>
          <div class="macro-card macro-card--blush">
            <span class="macro-card__label">Carbohidratos</span>
            <span class="macro-card__value">${recipe.macros.carbohidratos} <span class="macro-card__unit">g</span></span>
            <div class="macro-card__bar"><span class="macro-card__bar-fill" style="width: ${bars.carbohidratos * 2}%; background: var(--color-dusty-rose);"></span></div>
            <span class="macro-card__label" style="opacity:0.5">${bars.carbohidratos}% kcal</span>
          </div>
          <div class="macro-card macro-card--rose">
            <span class="macro-card__label">Grasas</span>
            <span class="macro-card__value">${recipe.macros.grasas} <span class="macro-card__unit">g</span></span>
            <div class="macro-card__bar"><span class="macro-card__bar-fill" style="width: ${bars.grasas * 2}%;"></span></div>
            <span class="macro-card__label" style="opacity:0.5">${bars.grasas}% kcal</span>
          </div>
        </div>
        ${recipe.macros.fibra ? `
          <div style="margin-top: var(--space-6); padding-top: var(--space-5); border-top: 1px dashed rgba(35,30,33,0.12); display: flex; flex-wrap: wrap; gap: var(--space-6); font-family: var(--font-mono); font-size: 12px; text-transform: uppercase; letter-spacing: var(--tracking-wide); color: var(--color-pine-shadow);">
            <span>● Fibra: <strong>${recipe.macros.fibra}g</strong></span>
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
          <div style="margin-bottom: var(--space-10);">
            <span class="eyebrow eyebrow--sage">● Preparación paso a paso</span>
            <h2 class="headline-serif" style="margin-top: var(--space-3);">Manos a la <em>cocina</em></h2>
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
          </ol>
          <div style="margin-top: var(--space-12); padding: var(--space-6); background: var(--color-blush-sand); border-radius: var(--radius-card); display: flex; gap: var(--space-4); align-items: flex-start;">
            <span class="eyebrow eyebrow--rose" style="flex-shrink:0;">● Nota</span>
            <p style="font-size: 14px; color: var(--color-slate); line-height: 1.55;">
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

function categoryBadgeLarge(categoria) {
  const map = {
    "Desayunos": `<svg viewBox="0 0 200 200" fill="none"><ellipse cx="100" cy="100" rx="60" ry="14" stroke="#1c5d5f" stroke-width="3"/><path d="M40 100c0 35 27 60 60 60s60-25 60-60" stroke="#1c5d5f" stroke-width="3" stroke-linecap="round"/><path d="M75 90c0-15 10-25 25-25M125 90c0-15 10-25 25-25" stroke="#d6aec1" stroke-width="2.5" stroke-linecap="round"/><path d="M52 38l8 16M148 38l-8 16M30 100h140" stroke="#65b8a2" stroke-width="2" stroke-linecap="round" stroke-dasharray="3 5"/></svg>`,
    "Comidas": `<svg viewBox="0 0 200 200" fill="none"><circle cx="100" cy="100" r="55" stroke="#1c5d5f" stroke-width="3"/><circle cx="100" cy="100" r="55" fill="#a2cbcd" opacity=".25"/><circle cx="80" cy="90" r="6" fill="#d6aec1"/><circle cx="115" cy="110" r="9" fill="#65b8a2"/><circle cx="90" cy="120" r="5" fill="#65b8a2"/><path d="M140 50c10 6 18 16 22 28" stroke="#65b8a2" stroke-width="3" stroke-linecap="round"/></svg>`,
    "Cenas": `<svg viewBox="0 0 200 200" fill="none"><path d="M40 110h120l-10 65a4 4 0 01-4 4H54a4 4 0 01-4-4L40 110z" stroke="#1c5d5f" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="80" r="30" stroke="#1c5d5f" stroke-width="3"/><path d="M85 80h30" stroke="#d6aec1" stroke-width="3" stroke-linecap="round"/><circle cx="55" cy="40" r="3" fill="#65b8a2"/><circle cx="160" cy="170" r="3" fill="#d6aec1"/></svg>`,
    "Bebidas": `<svg viewBox="0 0 200 200" fill="none"><path d="M70 30h60l-10 130a10 10 0 01-10 10H90a10 10 0 01-10-10L70 30z" stroke="#1c5d5f" stroke-width="3" stroke-linejoin="round"/><path d="M70 22h60v10H70z" fill="#1c5d5f"/><path d="M130 38l24-18v24" stroke="#1c5d5f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M85 80c2 6 6 10 12 12M115 80c-2 6-6 10-12 12" stroke="#65b8a2" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    "Colación": `<svg viewBox="0 0 200 200" fill="none"><circle cx="100" cy="100" r="60" stroke="#1c5d5f" stroke-width="3"/><circle cx="80" cy="95" r="10" fill="#65b8a2"/><circle cx="120" cy="105" r="14" fill="#d6aec1"/><path d="M60 145h80" stroke="#1c5d5f" stroke-width="3" stroke-linecap="round"/><path d="M85 75l5-8M115 80l6-6" stroke="#1c5d5f" stroke-width="3" stroke-linecap="round"/></svg>`,
    "Postre": `<svg viewBox="0 0 200 200" fill="none"><path d="M50 130h100l-15-40H65l-15 40z" stroke="#1c5d5f" stroke-width="3" stroke-linejoin="round"/><path d="M70 90a30 30 0 0160 0" stroke="#65b8a2" stroke-width="3" stroke-linecap="round"/><circle cx="85" cy="80" r="6" fill="#d6aec1"/><circle cx="115" cy="80" r="6" fill="#d6aec1"/><path d="M70 130l-10 40M130 130l10 40" stroke="#1c5d5f" stroke-width="3" stroke-linecap="round"/><circle cx="150" cy="60" r="4" fill="#65b8a2"/></svg>`
  };
  return map[categoria] || "";
}

function renderNotFound() {
  document.getElementById("recipe-detail").innerHTML = `
    <section class="container" style="padding: var(--space-22) 0;">
      <div class="empty-state">
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="32" stroke="currentColor" stroke-width="2" stroke-dasharray="4 6"/>
          <path d="M30 40h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
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
