// =============================================================
// PERFILES — Cálculo Mifflin-St Jeor + CRUD
// =============================================================

// Mifflin-St Jeor:
//   Hombres: TMB = 10·peso + 6.25·altura − 5·edad + 5
//   Mujeres: TMB = 10·peso + 6.25·altura − 5·edad − 161
//   Otro:    TMB = 10·peso + 6.25·altura − 5·edad − 78 (promedio)
function calcTMB({ peso_kg, altura_cm, edad, genero }) {
  const p = Number(peso_kg), a = Number(altura_cm), e = Number(edad);
  let base = 10 * p + 6.25 * a - 5 * e;
  if (genero === "M") base += 5;
  else if (genero === "F") base -= 161;
  else base -= 78;
  return Math.round(base);
}

const ACTIVIDAD_FACTOR = {
  sedentario: 1.2,
  ligero: 1.375,
  moderado: 1.55,
  activo: 1.725,
  muy_activo: 1.9
};

const OBJETIVO_DELTA = {
  deficit: -500,        // -500 kcal
  balance: 0,
  mantenimiento: 0,
  superavit: 300
};

// Para déficit y superávit, ajustar proteína/macros:
function calcMacros(peso, objetivo, kcal) {
  let protG, grasaPct, carbosPct;
  if (objetivo === "deficit") {
    protG = Math.round(peso * 1.8);
    grasaPct = 0.25;
  } else if (objetivo === "superavit") {
    protG = Math.round(peso * 1.8);
    grasaPct = 0.25;
  } else {
    protG = Math.round(peso * 1.4);
    grasaPct = 0.30;
  }
  const kcalProt = protG * 4;
  const kcalGrasa = kcal * grasaPct;
  const grasaG = Math.round(kcalGrasa / 9);
  const kcalCarbos = Math.max(0, kcal - kcalProt - kcalGrasa);
  const carbosG = Math.round(kcalCarbos / 4);
  return {
    proteina: protG,
    grasas: grasaG,
    carbos: carbosG
  };
}

function calcularPerfil(data) {
  const tmb = calcTMB(data);
  const tdee = Math.round(tmb * (ACTIVIDAD_FACTOR[data.nivel_actividad] || 1.375));
  const kcal = Math.max(1200, tdee + (OBJETIVO_DELTA[data.objetivo] || 0));
  const macros = calcMacros(Number(data.peso_kg), data.objetivo, kcal);
  return {
    tmb, tdee, kcal_objetivo: kcal,
    proteina_g_objetivo: macros.proteina,
    carbos_g_objetivo: macros.carbos,
    grasas_g_objetivo: macros.grasas
  };
}

// -------------------------------------------------------------
// Render
// -------------------------------------------------------------
const OBJETIVO_LABEL = {
  deficit: "Déficit (perder grasa)",
  balance: "Balance (hábitos)",
  mantenimiento: "Mantenimiento",
  superavit: "Superávit (ganar masa)"
};

const ACTIVIDAD_LABEL = {
  sedentario: "Sedentario",
  ligero: "Ligero",
  moderado: "Moderado",
  activo: "Activo",
  muy_activo: "Muy activo"
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function renderPerfiles(perfiles) {
  const root = document.getElementById("perfiles-list");
  if (!perfiles.length) {
    root.innerHTML = `
      <div class="empty-state">
        <h3>Aún no hay perfiles</h3>
        <p>Crea el primero abajo. Calcularemos automáticamente las kcal y macros según Mifflin-St Jeor.</p>
      </div>`;
    return;
  }

  root.innerHTML = perfiles.map(p => `
    <article class="perfil-card ${p.activo ? 'is-active' : ''}" data-id="${p.id}">
      <header class="perfil-card__head">
        <div>
          <h3>${escapeHtml(p.nombre)} ${p.activo ? '<span class="badge badge--ok">Activo</span>' : ''}</h3>
          <span class="perfil-card__objetivo">${OBJETIVO_LABEL[p.objetivo] || p.objetivo}</span>
        </div>
        <div class="perfil-card__actions">
          ${!p.activo ? `<button class="btn btn--sm btn--ghost" data-action="activar">Activar</button>` : ''}
          <button class="btn btn--sm btn--ghost" data-action="editar">Editar</button>
          <button class="btn btn--sm btn--ghost" data-action="eliminar">Eliminar</button>
        </div>
      </header>

      <div class="perfil-card__body">
        <dl class="perfil-card__datos">
          <div><dt>Peso</dt><dd>${p.peso_kg} kg</dd></div>
          <div><dt>Altura</dt><dd>${p.altura_cm} cm</dd></div>
          <div><dt>Edad</dt><dd>${p.edad} años</dd></div>
          <div><dt>Actividad</dt><dd>${ACTIVIDAD_LABEL[p.nivel_actividad] || p.nivel_actividad}</dd></div>
        </dl>

        <div class="perfil-card__macros">
          <div class="macro-pill macro-pill--big">
            <span class="macro-pill__label">Kcal/día</span>
            <strong>${p.kcal_objetivo}</strong>
          </div>
          <div class="macro-pill">
            <span class="macro-pill__label">Proteína</span>
            <strong>${p.proteina_g_objetivo}g</strong>
          </div>
          <div class="macro-pill">
            <span class="macro-pill__label">Carbos</span>
            <strong>${p.carbos_g_objetivo}g</strong>
          </div>
          <div class="macro-pill">
            <span class="macro-pill__label">Grasas</span>
            <strong>${p.grasas_g_objetivo}g</strong>
          </div>
        </div>
      </div>

      <details class="perfil-card__edit" hidden>
        <form class="perfil-edit-form" data-id="${p.id}">
          <div class="form-grid form-grid--compact">
            <label class="form-field"><span>Nombre</span>
              <input type="text" name="nombre" value="${escapeHtml(p.nombre)}" required>
            </label>
            <label class="form-field"><span>Género</span>
              <select name="genero">
                <option value="M" ${p.genero === 'M' ? 'selected' : ''}>Masculino</option>
                <option value="F" ${p.genero === 'F' ? 'selected' : ''}>Femenino</option>
                <option value="Otro" ${p.genero === 'Otro' ? 'selected' : ''}>Otro</option>
              </select>
            </label>
            <label class="form-field"><span>Edad</span>
              <input type="number" name="edad" value="${p.edad}" min="14" max="100" required>
            </label>
            <label class="form-field"><span>Peso (kg)</span>
              <input type="number" name="peso_kg" value="${p.peso_kg}" step="0.1" required>
            </label>
            <label class="form-field"><span>Altura (cm)</span>
              <input type="number" name="altura_cm" value="${p.altura_cm}" required>
            </label>
            <label class="form-field"><span>Actividad</span>
              <select name="nivel_actividad">
                ${Object.entries(ACTIVIDAD_LABEL).map(([k, v]) =>
                  `<option value="${k}" ${p.nivel_actividad === k ? 'selected' : ''}>${v}</option>`).join("")}
              </select>
            </label>
            <label class="form-field"><span>Objetivo</span>
              <select name="objetivo">
                ${Object.entries(OBJETIVO_LABEL).map(([k, v]) =>
                  `<option value="${k}" ${p.objetivo === k ? 'selected' : ''}>${v}</option>`).join("")}
              </select>
            </label>
          </div>
          <button type="submit" class="btn btn--primary btn--sm">Guardar cambios</button>
        </form>
      </details>
    </article>
  `).join("");

  root.querySelectorAll(".perfil-card").forEach(card => {
    const id = card.dataset.id;
    card.querySelectorAll("[data-action]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const action = btn.dataset.action;
        if (action === "activar") {
          await window.SUPABASE.setPerfilActivo(id);
          await refresh();
        } else if (action === "eliminar") {
          if (!confirm("¿Eliminar este perfil?")) return;
          await window.SUPABASE.deletePerfil(id);
          await refresh();
        } else if (action === "editar") {
          const edit = card.querySelector(".perfil-card__edit");
          edit.hidden = !edit.hidden;
        }
      });
    });

    const editForm = card.querySelector(".perfil-edit-form");
    if (editForm) {
      editForm.addEventListener("submit", async e => {
        e.preventDefault();
        const fd = new FormData(editForm);
        const data = Object.fromEntries(fd.entries());
        const calc = calcularPerfil(data);
        const payload = {
          id,
          nombre: data.nombre,
          genero: data.genero,
          edad: Number(data.edad),
          peso_kg: Number(data.peso_kg),
          altura_cm: Number(data.altura_cm),
          nivel_actividad: data.nivel_actividad,
          objetivo: data.objetivo,
          kcal_objetivo: calc.kcal_objetivo,
          proteina_g_objetivo: calc.proteina_g_objetivo,
          carbos_g_objetivo: calc.carbos_g_objetivo,
          grasas_g_objetivo: calc.grasas_g_objetivo,
          updated_at: new Date().toISOString()
        };
        await window.SUPABASE.upsertPerfil(payload);
        await refresh();
      });
    }
  });
}

async function refresh() {
  try {
    const perfiles = await window.SUPABASE.listPerfiles();
    renderPerfiles(perfiles);
  } catch (err) {
    console.error("[perfiles] refresh error:", err);
  }
}

// -------------------------------------------------------------
// Boot
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  await refresh();

  const form = document.getElementById("perfil-form");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    const calc = calcularPerfil(data);

    // Si es el primer perfil, marcarlo activo
    const existentes = await window.SUPABASE.listPerfiles();
    const activo = !existentes.length;

    // Solo persistimos los campos del schema de la BD
    const payload = {
      nombre: data.nombre,
      genero: data.genero,
      edad: Number(data.edad),
      peso_kg: Number(data.peso_kg),
      altura_cm: Number(data.altura_cm),
      nivel_actividad: data.nivel_actividad,
      objetivo: data.objetivo,
      kcal_objetivo: calc.kcal_objetivo,
      proteina_g_objetivo: calc.proteina_g_objetivo,
      carbos_g_objetivo: calc.carbos_g_objetivo,
      grasas_g_objetivo: calc.grasas_g_objetivo,
      activo,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    await window.SUPABASE.upsertPerfil(payload);
    form.reset();
    await refresh();
  });
});