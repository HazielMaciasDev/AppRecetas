# 🍳 Recetario Editorial

Aplicación web responsive para un recetario de cocina con información nutricional detallada, organizada por categorías.

**Stack:** HTML + CSS vanilla + JavaScript
**Design system:** Basado en `DESIGN.MD` (User Interviews — warm paper editorial con teal primario #1c5d5f)
**Plan:** Migración futura a Supabase (ver `recetas/README.md`)

---

## ▶️ Cómo ejecutarlo localmente

Opción más rápida — Python (ya viene en Windows / macOS / Linux):

```bash
# desde la raíz del proyecto
python -m http.server 5173
```

Luego abre [http://localhost:5173](http://localhost:5173) en tu navegador.

Alternativas:
- **Node**: `npx serve .` o `npx http-server -p 5173`
- **VS Code**: instalar extensión "Live Server" y click derecho → "Open with Live Server"

> ⚠️ No abrir el `index.html` con doble-clic (file://) porque las rutas relativas y `fetch()` pueden fallar. Siempre servir por HTTP.

---

## 📂 Estructura del proyecto

```
Recetas/
├── DESIGN.MD                    # Design system (NO TOCAR — referencia visual)
├── index.html                   # Home (grid filtrable por categorías)
├── receta.html                  # Detalle individual (?id=…)
├── README.md                    # Este archivo
├── assets/
│   ├── css/
│   │   ├── tokens.css           # Custom properties (colores, tipografía, spacing)
│   │   └── styles.css           # Componentes + layout + responsive
│   ├── js/
│   │   ├── data.js              # 12 recetas de muestra
│   │   ├── recipes.js           # Render del home + filtros + búsqueda
│   │   └── recipe-detail.js     # Render de la página de detalle
│   └── img/
│       └── fotos/               # (Tú subes) JPGs de las recetas
├── recetas/                     # (Tú subes) archivos JSON individuales
│   ├── README.md                # Schema + instrucciones de migración
│   └── PLANTILLA.json           # Plantilla vacía para copiar y rellenar
└── data/                        # (futuro) index.json como manifiesto
```

---

## ✏️ Cómo añadir recetas (estado actual — usar `data.js`)

**Por ahora edita `assets/js/data.js`** y añade un objeto más al array `window.RECIPES_DATA`. Sigue el schema de `recetas/PLANTILLA.json`.

**Cuando migres a Supabase**, los archivos JSON individuales vivirán en `recetas/` y un `data/index.json` hará de manifiesto (lista de IDs disponibles).

---

## 🎨 Categorías

5 categorías válidas (exactas):
- **Bebidas**
- **Desayuno**
- **Almuerzo**
- **Comida**
- **Cena**

---

## 🧩 Decisiones de diseño relevantes

- **Sin sombras** — el sistema usa solo capas de color (mint / blush / paper) y bordes hairline
- **Sin fotos por defecto** — si `foto: null`, la card muestra una ilustración SVG hand-drawn de la categoría
- **Stickers hand-drawn** — las cards incluyen dos stickers rotativos (reloj + chef) que sobresalen del marco de la foto, integrando las fotos reales dentro del lenguaje editorial
- **Tipografía** — Source Serif 4 (sustituto de P22 Mackinac Pro) para titulares, Inter (sustituto de Sofia Pro) para UI, IBM Plex Mono para eyebrows
- **Responsive** — 1 columna móvil, 2 tablet, 3 desktop

Ver `DESIGN.MD` para todos los tokens y reglas del sistema visual.
