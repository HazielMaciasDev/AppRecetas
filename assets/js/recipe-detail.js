// =============================================================
// RECIPE DETAIL — receta.html
// Página de detalle con información nutricional, ingredientes
// y botón "Ver video" que abre el link en nueva pestaña.
// =============================================================

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

const PLAY_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/></svg>`;
const PLATE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>`;

function renderRecipe(video) {
  document.title = `${video.titulo} — AppRecetas`;
  const root = document.getElementById("recipe-detail");

  // Foto o placeholder (esta imagen es la que al hacer click abre el video)
  const photoHTML = video.foto_url
    ? `<img class="detail-photo__img" src="${escapeHtml(video.foto_url)}" alt="${escapeHtml(video.titulo)}">`
    : `<div class="detail-photo__placeholder">${PLATE_ICON}</div>`;

  // Meta info solo si hay datos
  const metaItems = [];
  if (video.tiempo_min != null) {
    metaItems.push({ label: "Tiempo", value: `${video.tiempo_min} min` });
  }
  if (video.dificultad) {
    metaItems.push({ label: "Dificultad", value: video.dificultad });
  }
  if (video.kcal != null) {
    metaItems.push({ label: "Calorías", value: `${video.kcal} kcal` });
  }

  // Ingredientes
  const ingredientes = video.ingredientes || [];
  const ingredientesHTML = ingredientes.length ? `
    <div class="ingredients-card">
      <h3>Ingredientes <span>${ingredientes.length} items</span></h3>
      <ul class="ingredients-list">
        ${ingredientes.map(i => `
          <li class="ingredient-item">
            <span class="ingredient-check">✓</span>
            <span><span class="ingredient-item__qty">${escapeHtml(i.cantidad || '')}</span>${escapeHtml(i.item || '')}</span>
          </li>
        `).join("")}
      </ul>
    </div>
  ` : "";

  // Tips
  const tipsHTML = video.tips ? `
    <div style="margin-top: var(--spacing-24); padding: var(--spacing-16); background: var(--color-surface-alt); border: 1px solid var(--color-hairline); border-radius: var(--radius-cards); display: flex; gap: var(--spacing-12); align-items: flex-start;">
      <span class="text-mono" style="flex-shrink:0;">Tip</span>
      <p style="font-size: var(--text-body); color: var(--color-mid-gray); line-height: var(--leading-body);">${escapeHtml(video.tips)}</p>
    </div>
  ` : "";

  root.innerHTML = `
    <section class="detail-hero">
      <div class="container">
        <a href="index.html" class="detail-back">← Volver al recetario</a>
        <div class="detail-hero__inner">
          <a href="${escapeHtml(video.video_url)}" target="_blank" rel="noopener noreferrer" class="detail-photo detail-photo--clickable" aria-label="Ver video: ${escapeHtml(video.titulo)}">
            ${photoHTML}
            <span class="video-play video-play--large" aria-label="Ver video">${PLAY_ICON}</span>
          </a>
          <div class="detail-meta">
            ${video.categoria ? `<span class="detail-category">${escapeHtml(video.categoria)}</span>` : ""}
            <h1 class="detail-title">${escapeHtml(video.titulo)}</h1>
            ${video.descripcion_corta ? `<p class="detail-desc">${escapeHtml(video.descripcion_corta)}</p>` : ""}
            ${metaItems.length ? `
              <div class="detail-meta-info">
                ${metaItems.map(m => `
                  <div class="detail-meta-info__item">
                    <span class="detail-meta-info__label">${m.label}</span>
                    <span class="detail-meta-info__value">${m.value}</span>
                  </div>
                `).join("")}
              </div>
            ` : ""}
            <div class="detail-actions">
              <a href="${escapeHtml(video.video_url)}" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--icon">Ver video</a>
              <button class="btn btn--outline" id="copy-btn">Compartir enlace</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container">
      <div class="recipe-content">
        <aside class="recipe-content__sticky">
          ${ingredientesHTML}
        </aside>
        <div class="recipe-content__main">
          <div style="margin-bottom: var(--spacing-24);">
            <span class="text-mono">Para tener en cuenta</span>
            <h2 class="heading" style="margin-top: var(--spacing-12);">Tips</h2>
          </div>
          ${tipsHTML || `<p style="color: var(--color-mid-gray);">Sin tips adicionales.</p>`}
          <div style="margin-top: var(--spacing-24); padding: var(--spacing-16); background: var(--color-surface-alt); border: 1px solid var(--color-hairline); border-radius: var(--radius-cards); display: flex; gap: var(--spacing-12); align-items: flex-start;">
            <span class="text-mono" style="flex-shrink:0;">Nota</span>
            <p style="font-size: var(--text-body); color: var(--color-mid-gray); line-height: var(--leading-body);">
              Los valores nutricionales son estimaciones. Los resultados pueden variar según marcas y método de cocción.
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
  try {
    const video = await window.SUPABASE.getVideo(id);
    if (!video) {
      renderNotFound();
      return;
    }
    renderRecipe(video);
  } catch (err) {
    console.error("[recipe-detail] error:", err);
    renderNotFound();
  }
});