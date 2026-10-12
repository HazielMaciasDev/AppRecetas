// =============================================================
// DESAYUNOS — Grid de miniaturas con link al video
// =============================================================

const PLAY_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/></svg>`;

const PLATE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>`;

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function renderCard(item) {
  const photoContent = item.foto_url
    ? `<img class="recipe-card__photo-img" src="${escapeHtml(item.foto_url)}" alt="${escapeHtml(item.nombre)}" loading="lazy">`
    : `<div class="recipe-card__photo-placeholder">${PLATE_ICON}</div>`;

  const meta = [
    item.kcal != null ? `${item.kcal} kcal` : null,
    item.proteina_g != null ? `${item.proteina_g}g proteína` : null
  ].filter(Boolean).join(" · ");

  return `
    <a href="${escapeHtml(item.video_url)}" target="_blank" rel="noopener noreferrer" class="recipe-card fade-in desayuno-card">
      <div class="recipe-card__photo">
        ${photoContent}
        <span class="desayuno-play" aria-label="Ver video">${PLAY_ICON}</span>
      </div>
      <div class="recipe-card__body">
        <h3 class="recipe-card__title">${escapeHtml(item.nombre)}</h3>
        ${item.descripcion ? `<p class="recipe-card__desc">${escapeHtml(item.descripcion)}</p>` : ""}
        <div class="recipe-card__meta">
          <span>${meta || "Ver video"}</span>
        </div>
      </div>
    </a>
  `;
}

function renderEmpty() {
  return `
    <div class="empty-state" style="grid-column: 1 / -1;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none" stroke="none"/>
        <circle cx="12" cy="12" r="9"/>
      </svg>
      <h3>Aún no hay desayunos</h3>
      <p>Pronto agregaremos videos cortos para empezar el día.</p>
    </div>
  `;
}

async function refresh() {
  const grid = document.getElementById("desayunos-grid");
  try {
    const items = await window.SUPABASE.listDesayunos();
    if (!items || !items.length) {
      grid.innerHTML = renderEmpty();
      return;
    }
    grid.innerHTML = items.map(renderCard).join("");
  } catch (err) {
    console.error("[desayunos] error:", err);
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <h3>No se pudieron cargar los desayunos</h3>
        <p>Revisa tu conexión e intenta de nuevo.</p>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", refresh);