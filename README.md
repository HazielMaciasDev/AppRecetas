# 🍳 AppRecetas — Recetario Nutricional Multi-perfil

Aplicación web responsive para un recetario de cocina con información nutricional detallada, organizado por categorías. Incluye **despensa inteligente**, **plan semanal automático** y **perfiles nutricionales personalizados** (perfecto para metas de déficit calórico o mejora de hábitos).

**Stack:** HTML + CSS vanilla + JavaScript
**Backend:** Supabase (Postgres + REST API)
**Design system:** Basado en `DESIGN.MD` (warm paper editorial con teal primario #1c5d5f)

---

## ✨ Funcionalidades

| Pantalla | Descripción |
|----------|-------------|
| **Recetas** (`index.html`) | Catálogo filtrable de **30 recetas** con 6 categorías: Desayunos, Comidas, Cenas, Bebidas, Colación, Postre. Cada receta con foto (placeholder SVG si no hay), macros por porción, tiempo, dificultad. |
| **Detalle receta** (`receta.html`) | Foto del producto final, ingredientes, información nutricional completa (kcal, proteína, carbos, grasas, fibra), tips generales. |
| **Despensa** (`despensa.html`) | Marca los ingredientes que tienes en casa. La app te sugiere automáticamente qué recetas puedes cocinar con ellos (matching flexible). |
| **Perfiles** (`perfiles.html`) | Configura tus datos físicos y objetivo. Cálculo automático de kcal y macros según **Mifflin-St Jeor**. Soporta múltiples perfiles (tú y tu pareja, p. ej.). |
| **Plan semanal** (`plan.html`) | Genera menú de **7 días × 5 tiempos** (desayuno/colación/comida/snack/cena) que respeta las kcal/macros del perfil activo. Incluye **lista de compras consolidada** agrupada por categoría. |

## 🎯 Categorías válidas (6)

- **Desayunos**
- **Comidas**
- **Cenas**
- **Bebidas**
- **Colación**
- **Postre**

## 🧮 Cálculo nutricional

La app usa la fórmula **Mifflin-St Jeor** para calcular la Tasa Metabólica Basal (TMB), ajustada por nivel de actividad (TDEE) y modificada por delta calórico del objetivo:

- **Déficit (-500 kcal)**: para perder grasa (ej. tú, de 84 kg → 70 kg)
- **Balance (±0 kcal)**: para mantener peso y mejorar hábitos
- **Mantenimiento**: igual a balance
- **Superávit (+300 kcal)**: para ganar masa

La distribución de macros se ajusta:
- Déficit/Superávit: 1.8 g proteína × peso, 25% grasas
- Balance: 1.4 g proteína × peso, 30% grasas

## ▶️ Cómo ejecutarlo localmente

Opción rápida — Node (ya viene con `npx`):

```bash
npx --yes http-server . -p 5173 -s
```

Luego abre [http://localhost:5173](http://localhost:5173) en tu navegador.

> ⚠️ No abrir los `.html` con doble-clic (file://). Siempre servir por HTTP porque la app hace `fetch()` al REST de Supabase.

---

## 📂 Estructura del proyecto

```
AppRecetas/
├── DESIGN.MD                    # Design system (NO TOCAR — referencia visual)
├── README.md                    # Este archivo
├── index.html                   # Home (catálogo filtrable)
├── receta.html                  # Detalle individual
├── despensa.html                # Gestión de despensa
├── perfiles.html                # Configuración de perfiles nutricionales
├── plan.html                    # Generador de plan semanal + lista compras
├── assets/
│   ├── css/
│   │   ├── tokens.css           # Custom properties (colores, tipografía, spacing)
│   │   ├── styles.css           # Componentes + layout + responsive (orig)
│   │   └── pages.css            # Estilos específicos de despensa/perfiles/plan
│   ├── js/
│   │   ├── supabase.js          # Cliente REST a Supabase
│   │   ├── data.js              # Loader de recetas (fetch + fallback)
│   │   ├── recipes.js           # Render del home + filtros
│   │   ├── recipe-detail.js     # Render del detalle
│   │   ├── despensa.js          # CRUD ingredientes + matching
│   │   ├── perfiles.js          # CRUD perfiles + cálculo Mifflin-St Jeor
│   │   ├── meal-planner.js      # Algoritmo de generación del plan semanal
│   │   └── plan.js              # Render del plan + lista de compras
│   └── img/
│       └── fotos/               # (Tú subes) JPGs de las recetas
└── recetas/                     # Schema JSON legacy (ya no se usa, mantenido por referencia)
    ├── README.md
    └── PLANTILLA.json
```

---

## 🔌 Configuración Supabase

La app se conecta a Supabase por REST. Las credenciales están en `assets/js/supabase.js`:

```js
const SUPABASE_URL = "https://wqbetqxdtbqjpzyheiru.supabase.co";
const SUPABASE_KEY = "<anon key>";
```

Las tablas son:

- **`recetas`** — base de datos curada de las 30 recetas
- **`perfiles`** — perfiles nutricionales del usuario (uno activo a la vez)
- **`despensa`** — ingredientes que tienes en casa
- **`plan_semanal`** — plan generado (1 por semana)

Todas con RLS abierto (uso familiar, sin auth).

---

## 🎨 Decisiones de diseño relevantes

- **Sin sombras** — el sistema usa solo capas de color (mint / blush / paper) y bordes hairline
- **Sin fotos por defecto** — si `foto_url: null`, la card muestra una ilustración SVG hand-drawn de la categoría
- **Tipografía** — Source Serif 4 (sustituto de P22 Mackinac Pro) para titulares, Inter (sustituto de Sofia Pro) para UI, IBM Plex Mono para eyebrows
- **Responsive** — 1 columna móvil, 2 tablet, 3 desktop

Ver `DESIGN.MD` para todos los tokens y reglas del sistema visual.

---

## 📝 Cómo añadir recetas

Las recetas viven en Supabase (tabla `recetas`). Para añadir más:

1. Entra al editor SQL de tu proyecto Supabase.
2. Inserta un nuevo row en `recetas` con el schema de `recetas/PLANTILLA.json` (versión legacy).
3. (Opcional) Sube una foto a Storage bucket y pega la URL en `foto_url`.

Campos mínimos requeridos:
- `id` (string slug), `titulo`, `categoria`, `macros` (jsonb), `ingredientes` (jsonb array)
- `perfil_recomendado` (array: `deficit` | `balance` | `ambos`) — para que el meal planner filtre correctamente.