# AppRecetas

Recetas bajas en calorías con macros claros. Para llegar a tu meta sin pasar hambre.

**Stack:** HTML + CSS vanilla + JavaScript
**Backend:** Supabase (Postgres + REST API)
**Design system:** Basado en `STYLE.md` (clinical blueprint monocromático, estilo shadcn)

---

## Pantallas

- **Recetas** (`index.html`) — Catálogo filtrable. 30 recetas, 6 categorías.
- **Detalle receta** (`receta.html`) — Foto, ingredientes, macros por porción, tips.
- **Despensa** (`despensa.html`) — Marca lo que tienes. Te decimos qué cocinar.
- **Perfiles** (`perfiles.html`) — Tus datos + cálculo Mifflin-St Jeor.
- **Plan semanal** (`plan.html`) — 7 días × 5 tiempos respetando tus kcal. Incluye lista de compras.

---

## Categorías

- Desayunos
- Comidas
- Cenas
- Bebidas
- Colación
- Postre

---

## Cálculo nutricional

Fórmula **Mifflin-St Jeor** para TMB, ajustada por actividad (TDEE) y delta calórico:

- **Déficit** (−500 kcal) — perder grasa
- **Balance** (±0 kcal) — mantener
- **Superávit** (+300 kcal) — ganar masa

Macros:
- Déficit/Superávit: 1.8 g proteína × peso, 25% grasas
- Balance: 1.4 g proteína × peso, 30% grasas

---

## Cómo ejecutarlo

```bash
npx --yes http-server . -p 5173 -s
```

Abrir [http://localhost:5173](http://localhost:5173).

> Siempre servir por HTTP. `file://` rompe el `fetch()` a Supabase.

---

## Estructura

```
AppRecetas/
├── STYLE.md                       # Design system (referencia visual)
├── README.md                      # Este archivo
├── index.html                     # Home (catálogo)
├── receta.html                    # Detalle de receta
├── despensa.html                  # Gestión de despensa
├── perfiles.html                  # Configuración de perfil
├── plan.html                      # Plan semanal + lista compras
├── assets/
│   ├── css/
│   │   ├── tokens.css             # Custom properties
│   │   ├── styles.css             # Componentes + layout
│   │   └── pages.css              # Estilos de despensa/perfiles/plan
│   ├── js/
│   │   ├── supabase.js            # Cliente REST
│   │   ├── data.js                # Loader de recetas
│   │   ├── recipes.js             # Render del home + filtros
│   │   ├── recipe-detail.js       # Render del detalle
│   │   ├── despensa.js            # CRUD despensa + matching
│   │   ├── perfiles.js            # CRUD perfil + Mifflin-St Jeor
│   │   ├── meal-planner.js        # Generador del plan
│   │   └── plan.js                # Render del plan + lista compras
│   └── img/fotos/                 # (Tú subes) JPGs de recetas
└── recetas/                       # Schema JSON legacy (referencia)
    ├── README.md
    └── PLANTILLA.json
```

---

## Supabase

Conexión REST en `assets/js/supabase.js`. Las tablas:

- **`recetas`** — 30 recetas curadas
- **`perfiles`** — tu perfil nutricional (uno activo)
- **`despensa`** — ingredientes en casa
- **`plan_semanal`** — plan generado

RLS abierto, sin auth.

---

## Diseño

- Monocromático (negro/blanco/grises)
- Geist (Inter fallback), tipografía tight en headlines
- Radius 18px (botones, badges, inputs) / 24px (cards)
- Sombras sutiles oklab (1px hairline + 1px + 2px offset)
- Rojo `#e7000b` exclusivo para destructivo

Ver `STYLE.md` para todos los tokens.

---

## Cómo añadir recetas

Las recetas viven en Supabase (tabla `recetas`).

1. Editor SQL de tu proyecto Supabase.
2. Inserta un row con el schema de `recetas/PLANTILLA.json`.
3. (Opcional) Sube foto a Storage y pega la URL en `foto_url`.

Campos mínimos:
- `id` (slug), `titulo`, `categoria`, `macros` (jsonb), `ingredientes` (jsonb array)
- `perfil_recomendado` (array: `deficit` | `balance` | `ambos`)