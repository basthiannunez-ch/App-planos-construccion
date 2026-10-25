# Planos de construcción

Prototipo web, pensado para el teléfono, de una app con más de 100 planos para trabajar en madera: muebles, jardín y exterior, y construcciones (cabañas, casas, ampliaciones, bodegas, quinchos y terrazas). Cada plano trae una imagen 3D de cómo se ve terminado, dibujos con cotas, lista de materiales y cortes, herramientas y pasos.

## Cómo funciona

- HTML, CSS y JavaScript sin compilación: se sirve tal cual en cualquier hosting estático (Vercel, GitHub Pages, etc.).
- Los planos están en `js/datos/` como datos y se juntan en `js/planos.js`. `js/dibujo.js` dibuja las vistas en SVG.
- Cada plano tiene un `modelo` 3D (cajas, perfiles y cilindros en cm, ver `js/modelos.js`). Los generadores por familia están en `js/familias.js` (mesas, muebles, camas, edificios, deck…) y las formas propias en `js/especiales.js`.
- `armar()` (en `js/modelos.js`) saca del modelo las medidas, las vistas Frente/Lateral/Planta y la lista de cortes.
- `js/render3d.js` usa three.js (desde jsDelivr) para dibujar la imagen del objeto terminado en el teléfono: madera con veta, luz de sol, sombras, pasto o piso de madera. Si no carga, la app muestra los dibujos.
- `js/uniones.js` busca en el modelo 3D dónde se tocan dos piezas de madera y decide la fijación de cada unión (tornillo, clavo, tirafondo o perno), su largo y la posición exacta de cada tornillo.
- `js/detalle.js` arma el despiece con letras (A, B, C…), las perforaciones de cada pieza y el total de fijaciones. En construcciones con muros entrega una guía de fijación de tabiquería.
- `js/despiece.js` dibuja cada pieza con sus medidas y perforaciones (pestaña Cortes).
- `js/pdf.js` genera el PDF de cada plano en el teléfono con jsPDF (desde cdnjs).
- `js/cuenta.js` guarda el nombre de la persona y sus trabajos (Favoritos, En progreso, Realizados y avance) en el teléfono y, si entró con su cuenta, los sincroniza.
- `js/nube.js` maneja las cuentas con correo y contraseña en Supabase. Se activa cuando `index.html` define `window.PLANOS_NUBE = { url, clave }` (URL del proyecto y clave pública *anon*). La tabla y sus permisos están en `sql/trabajos.sql`.
- Favoritos y avance (materiales comprados, pasos hechos) se guardan en el teléfono con `localStorage`.
- Se puede agregar a la pantalla de inicio del teléfono (incluye `manifest.webmanifest`).

## Probar en local

```sh
python3 -m http.server 8000
```

y abre http://localhost:8000.

## Agregar un plano

Lo más simple es usar `armar({ id, categoria, nombre, resumen, partes, materiales, pasos })` en uno de los archivos de `js/datos/`, con `partes` hechas con una familia (por ejemplo `mesa({ L: 120, W: 60, H: 75 })`). Las vistas, medidas y cortes salen solos. También se pueden escribir `vistas` a mano (piezas de tipo `madera`, `tinglado`, `muro`, `ventana`, `puerta`, `hueco`, `oculto`, `poligono`, `texto`, `existente`).

> Los planos de construcciones son ejemplos orientativos y no reemplazan un proyecto firmado por un profesional ni los permisos municipales.
