# Ui — Style Reference
> clinical blueprint on frosted paper

**Theme:** light

shadcn/ui es un sistema de diseño monocromático: canvas blanco puro, superficies gris cálido suave y tarjetas de radio grande flotando sobre bordes hairline. La interfaz es casi enteramente acromática — texto negro, superficies blancas, grises secundarios — con un único rojo destructivo reservado para estados de error y nada más. La tipografía se apoya en la neutralidad geométrica de Geist con tracking apretado en display, creando una sensación tranquila, adyacente al código, que se lee como infraestructura de desarrollador más que como producto de consumo.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas | `#f5f5f5` | `--color-canvas` | Page background, muted surface fills, secondary buttons |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, popover backgrounds, primary button fills |
| Surface Alt | `#fafafa` | `--color-surface-alt` | Sidebar background, subtle card variant, input resting state |
| Ink | `#0a0a0a` | `--color-ink` | Primary text, headings, button labels, icon strokes |
| Ink Soft | `#171717` | `--color-ink-soft` | Filled button backgrounds, secondary text on light surfaces |
| Mid Gray | `#737373` | `--color-mid-gray` | Muted body text, placeholder text, helper labels |
| Hairline | `#e5e5e5` | `--color-hairline` | Borders, input outlines, card edges, badge outlines |
| Ember | `#e7000b` | `--color-ember` | Destructive accent. Solo para estados de error / eliminación. Nunca decoración. |

## Tokens — Typography

### Geist — Toda la interfaz

Sustituto: Inter. Pesos: 400, 500, 600. Tamaños: 12, 13, 14, 16, 18, 24, 30, 36, 48.
Tracking tightens agresivamente en display y se afloja ligeramente en labels uppercase.

| Role | Size | LH | Tracking | Uso |
|------|------|----|----------|-----|
| caption | 12px | 1.33 | 0.6px | Labels uppercase, eyebrows |
| body | 14px | 1.43 | — | Body principal |
| body-lg | 16px | 1.5 | — | Body destacado |
| subheading | 18px | 1.56 | — | Subtítulos |
| heading-sm | 24px | 1.33 | -0.6px | Headings pequeños |
| heading | 30px | 1.2 | -0.75px | Headings de sección |
| heading-lg | 36px | 1.11 | -0.9px | Headings principales |
| display | 48px | 1.1 | -2.4px | Display hero |

## Tokens — Spacing & Shapes

**Base unit:** 4px

### Spacing

| Name | Value |
|------|-------|
| `--spacing-4` | 4px |
| `--spacing-8` | 8px |
| `--spacing-12` | 12px |
| `--spacing-16` | 16px |
| `--spacing-20` | 20px |
| `--spacing-24` | 24px |
| `--spacing-48` | 48px |

### Border Radius

- Cards: **24px** (`--radius-cards`)
- Interactive (botones, inputs, badges): **18px** (`--radius-buttons`, `--radius-inputs`, `--radius-badges`)
- Nested: **10px** (`--radius-nested`)
- Small: **6px** (`--radius-small`)

### Layout

- Page max-width: 1280px
- Section gap: 48–80px
- Card padding: 20px
- Element gap: 8px

## Surfaces

| Level | Name | Value | Uso |
|-------|------|-------|-----|
| 0 | Canvas | `#f5f5f5` | Page background, secondary buttons, input fills |
| 1 | Sidebar / Alt | `#fafafa` | Sidebar, input resting, subtle card variant |
| 2 | Card | `#ffffff` | Card surfaces, primary buttons fill |

Card shadow:
```css
box-shadow:
  0 0 0 1px rgba(23,23,23,0.05),
  0 1px 3px rgba(0,0,0,0.1),
  0 1px 2px -1px rgba(0,0,0,0.1);
```

## Components

### Primary Filled Button
`#0a0a0a` bg · `#fafafa` text · sin border · 18px radius · 14px Geist weight 500 · height ~36–40px. Sin shadow (contraste tonal).

### Secondary Ghost Button
`#f5f5f5` bg · `#0a0a0a` text · sin border · 18px radius · 14px weight 500.

### Outline Button
transparent bg · `#0a0a0a` text · 1px solid `#e5e5e5` border · 18px radius.

### Card
`#ffffff` bg · 24px radius · 1px solid `#e5e5e5` border · shadow sutil · padding 20px.

### Input
`#f5f5f5` bg (resting) · `#0a0a0a` text · sin border en rest · 18px radius · focus ring 1px `#e5e5e5`.

### Badge — Solid
`#171717` bg · `#fafafa` text · 18px radius · 2px 8px padding · 12px weight 500.

### Badge — Soft
`#f5f5f5` bg · `#171717` text · 18px radius · 2px 8px padding · 12px weight 500.

### Badge — Outline
transparent bg · `#0a0a0a` text · 18px radius · 2px 8px padding · 12px weight 500.

### Destructive
`#e7000b` text/icon. Solo eliminar, borrar, revocar, errores. Nunca decoración.

## Do's

- Inversion dark-on-light para botones primarios (`#0a0a0a` sobre `#ffffff`).
- 18px radius en todos los elementos interactivos; 24px solo en containers.
- Display headlines 48px/600 con tracking -0.05em.
- `#e7000b` exclusivo para destructivo.
- Cards con hairline 1px + shadow sutil.
- Stack de 3 tonos (canvas → surface-alt → paper) para layering sin bordes.

## Don'ts

- No introducir colores cromáticos fuera de `#e7000b`.
- No usar radius distintos a 18px (interactive) o 24px (containers).
- No skipear el hairline border en cards.
- Body text no menor a 14px ni más claro que `#737373`.
- No gradientes, sombras coloreadas, ni accent fills decorativos.

## Similar Brands

Vercel, Linear, Radix UI, Tailwind UI, Cal.com.

## CSS Quick Start

```css
:root {
  /* Colors */
  --color-canvas: #f5f5f5;
  --color-paper: #ffffff;
  --color-surface-alt: #fafafa;
  --color-ink: #0a0a0a;
  --color-ink-soft: #171717;
  --color-mid-gray: #737373;
  --color-hairline: #e5e5e5;
  --color-ember: #e7000b;

  /* Typography */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Type scale */
  --text-caption: 12px;
  --text-body: 14px;
  --text-body-lg: 16px;
  --text-subheading: 18px;
  --text-heading-sm: 24px;
  --text-heading: 30px;
  --text-heading-lg: 36px;
  --text-display: 48px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-48: 48px;

  /* Radius */
  --radius-cards: 24px;
  --radius-buttons: 18px;
  --radius-inputs: 18px;
  --radius-badges: 18px;
  --radius-nested: 10px;
  --radius-small: 6px;

  /* Shadow */
  --shadow-card: 0 0 0 1px rgba(23,23,23,0.05), 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);
}
```