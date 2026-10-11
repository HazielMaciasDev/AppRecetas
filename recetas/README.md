# 📁 Carpeta `recetas/`

Aquí van tus archivos JSON, uno por receta. La estructura actual del proyecto usa `assets/js/data.js` como fuente principal (12 recetas de muestra).

## 🚀 Cómo migrar a archivos JSON individuales

Cuando migres a archivos individuales + Supabase, el esquema será:

```
recetas/
├── ensalada-de-quinoa.json
├── smoothie-verde.json
└── ... (los que tú subas)
```

### Schema de cada receta (`recetas/[slug].json`)

```json
{
  "id": "ensalada-de-quinoa",
  "titulo": "Ensalada de quinoa mediterránea",
  "categoria": "Almuerzo",
  "descripcion": "Quinoa, garbanzos tostados y vegetales con aderezo de tahini.",
  "foto": "fotos/ensalada-quinoa.jpg",
  "tiempoMin": 25,
  "porciones": 2,
  "dificultad": "Fácil",
  "macros": {
    "kcal": 420,
    "proteina": 18,
    "carbohidratos": 52,
    "grasas": 14,
    "fibra": 9
  },
  "macrosPorPorcion": true,
  "ingredientes": [
    { "item": "Quinoa cocida", "cantidad": "200g" },
    { "item": "Garbanzos", "cantidad": "1 lata" }
  ],
  "pasos": [
    { "titulo": "Cocinar quinoa", "texto": "Enjuagar y hervir..." }
  ],
  "tags": ["vegano", "mediterráneo"]
}
```

### Categorías válidas (exactas):
- `Bebidas`
- `Desayuno`
- `Almuerzo`
- `Comida`
- `Cena`

### Cómo añadir fotos
1. Crea `assets/img/fotos/`
2. Sube tus imágenes JPG/WebP (optimiza antes con [squoosh.app](https://squoosh.app))
3. Referencia con `"foto": "fotos/ensalada-quinoa.jpg"` (ruta relativa a la página)

> ⚠️ Si dejas `"foto": null`, se mostrará la ilustración SVG de la categoría (no se rompe nada).
