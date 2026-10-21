# Planos de construcción

Prototipo web, pensado para el teléfono, de una app para ver planos de muebles y de construcciones mayores (habitaciones, ampliaciones, cabañas prefabricadas y terrazas). Cada plano trae dibujos con cotas, lista de materiales, herramientas y pasos.

## Cómo funciona

- HTML, CSS y JavaScript sin compilación: se sirve tal cual en cualquier hosting estático (Vercel, GitHub Pages, etc.).
- Los planos están en `js/planos.js` como datos (piezas y cotas en centímetros). `js/dibujo.js` los convierte en SVG.
- Favoritos y avance (materiales comprados, pasos hechos) se guardan en el teléfono con `localStorage`.
- Se puede agregar a la pantalla de inicio del teléfono (incluye `manifest.webmanifest`).

## Probar en local

```sh
python3 -m http.server 8000
```

y abre http://localhost:8000.

## Agregar un plano

Agrega un objeto a `PLANOS` en `js/planos.js` con `vistas` (piezas de tipo `madera`, `muro`, `ventana`, `puerta`, `hueco`, `oculto`, `poligono`, `texto`, `existente`) y `cotas`. Los límites del dibujo se calculan solos.

> Los planos de construcciones son ejemplos orientativos y no reemplazan un proyecto firmado por un profesional ni los permisos municipales.
