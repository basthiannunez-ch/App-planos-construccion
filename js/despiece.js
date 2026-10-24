// Despiece: dibujo de cada pieza con su largo, ancho y dónde van las perforaciones para los tornillos.
// Dibujado en píxeles (no a escala real en el ancho, para que se lea incluso en piezas largas y delgadas).

const num = (n) => (Math.round(n * 2) / 2).toLocaleString('es-CL');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Colores con respaldo: en pantalla siguen el tema; al convertir a imagen (PDF) usan el respaldo.
const C = {
  madera: 'var(--madera, #e9c99a)',
  borde: 'var(--madera-borde, #8a5a2b)',
  cota: 'var(--cota, #c0392b)',
  agujero: 'var(--texto, #1d2329)',
  texto: 'var(--suave, #5d6873)',
};

export function svgPieza(g, { ancho: W = 340 } = {}) {
  const L = g.ejes.largo;
  const A = g.ejes.ancho;
  const s = Math.min((W - 80) / L, 150 / A);
  const sy = Math.max(A * s, 26) / A;
  const w = L * s;
  const h = A * sy;
  const x0 = 22;
  const y0 = 30;
  const alto = y0 + h + 40;
  const f = 11;
  let out = `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${C.madera}" stroke="${C.borde}" stroke-width="1.2"/>`;
  // Veta a lo largo de la pieza.
  for (let k = 1; k < 4; k++) {
    const y = y0 + (h * k) / 4;
    out += `<path d="M${x0 + 4},${y} q${w / 3},${k % 2 ? 3 : -3} ${w - 8},0" fill="none" stroke="${C.borde}" stroke-opacity="0.25" stroke-width="0.8"/>`;
  }
  // Cota de largo (arriba) y de ancho (derecha).
  const yl = y0 - 12;
  out += `<g stroke="${C.cota}" stroke-width="1"><line x1="${x0}" y1="${yl}" x2="${x0 + w}" y2="${yl}"/>`
    + `<line x1="${x0}" y1="${yl - 4}" x2="${x0}" y2="${y0}"/><line x1="${x0 + w}" y1="${yl - 4}" x2="${x0 + w}" y2="${y0}"/></g>`
    + `<text x="${x0 + w / 2}" y="${yl - 4}" font-size="${f}" fill="${C.cota}" text-anchor="middle" font-weight="600">${num(L)} cm</text>`;
  const xa = x0 + w + 12;
  out += `<g stroke="${C.cota}" stroke-width="1"><line x1="${xa}" y1="${y0}" x2="${xa}" y2="${y0 + h}"/>`
    + `<line x1="${x0 + w}" y1="${y0}" x2="${xa + 4}" y2="${y0}"/><line x1="${x0 + w}" y1="${y0 + h}" x2="${xa + 4}" y2="${y0 + h}"/></g>`
    + `<text x="${xa + 5}" y="${y0 + h / 2 + 4}" font-size="${f}" fill="${C.cota}" font-weight="600">${num(A)}</text>`;
  // Perforaciones.
  const vistos = new Set();
  const agujeros = g.agujeros.filter((a) => {
    const k = `${Math.round(a.x * 2)}|${Math.round(a.y * 2)}|${a.cara}`;
    if (vistos.has(k)) return false;
    vistos.add(k);
    return true;
  });
  for (const a of agujeros) {
    const cx = x0 + a.x * s;
    const cy = y0 + a.y * sy;
    const r = a.tipo === 'clavo' ? 2 : a.tipo === 'tornillo' ? 3.2 : 4.5;
    out += a.cara === 'frente'
      ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.agujero}"/><circle cx="${cx}" cy="${cy}" r="${r + 2.5}" fill="none" stroke="${C.agujero}" stroke-width="0.8"/>`
      : `<circle cx="${cx}" cy="${cy}" r="${r + 1}" fill="none" stroke="${C.agujero}" stroke-width="1.2" stroke-dasharray="2 1.5"/>`;
  }
  // Cotas encadenadas: distancia de cada perforación desde el extremo izquierdo.
  const xs = [...new Set(agujeros.map((a) => Math.round(a.x * 2) / 2))].sort((a, b) => a - b);
  if (xs.length && xs.length <= 8) {
    const yb = y0 + h + 14;
    out += `<line x1="${x0}" y1="${yb}" x2="${x0 + xs[xs.length - 1] * s}" y2="${yb}" stroke="${C.cota}" stroke-width="0.8"/>`
      + `<line x1="${x0}" y1="${y0 + h}" x2="${x0}" y2="${yb + 4}" stroke="${C.cota}" stroke-width="0.8"/>`;
    let ultimo = -Infinity;
    for (const x of xs) {
      const px = x0 + x * s;
      out += `<line x1="${px}" y1="${yb - 4}" x2="${px}" y2="${yb + 4}" stroke="${C.cota}" stroke-width="0.8"/>`;
      if (px - ultimo >= 26) {
        out += `<text x="${px}" y="${yb + 15}" font-size="${f - 1}" fill="${C.cota}" text-anchor="middle">${num(x)}</text>`;
        ultimo = px;
      }
    }
  }
  // Distancia de la primera fila al borde superior.
  const ys = [...new Set(agujeros.filter((a) => a.cara === 'frente').map((a) => Math.round(a.y * 2) / 2))].sort((a, b) => a - b);
  if (ys.length && ys.length <= 3 && h >= 40) {
    out += `<text x="${x0 - 4}" y="${y0 + ys[0] * sy + 4}" font-size="${f - 1}" fill="${C.cota}" text-anchor="end">${num(ys[0])}</text>`;
  }
  return `<svg class="pieza-svg" viewBox="0 0 ${W} ${alto}" width="${W}" height="${alto}" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif">${out}</svg>`;
}

const cuantos = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

function textoFijacion(nombre, n) {
  const corto = nombre.replace(/ con golilla.*$/, '');
  return n === 1 ? `1 ${corto.toLowerCase()}` : `${n} ${corto.toLowerCase().replace(/^(tornillo|clavo|tirafondo|perno)/, '$1s')}`;
}

export function juntasTexto(g) {
  return g.juntas.map((j) => `Une con <b>${esc(j.destino)}${j.letra ? ` (${j.letra})` : ''}</b>: ${textoFijacion(j.nombre, j.por)} en cada unión${j.veces > 1 ? ` · ${j.veces} uniones` : ''}`);
}

export function tarjetaPieza(g) {
  const { largo, ancho, espesor } = g.ejes;
  const frente = g.agujeros.filter((a) => a.cara === 'frente').length;
  const canto = g.agujeros.length - frente;
  const juntas = juntasTexto(g);
  return `<div class="pieza">
    <div class="pieza-cab"><span class="letra">${g.letra}</span><strong>${esc(g.n || `Pieza ${g.letra}`)}</strong><span class="pieza-cuenta">× ${g.idx.length}</span></div>
    <p class="pieza-medidas">${num(largo)} × ${num(ancho)} × ${num(espesor)} cm · ${esc(g.item)}</p>
    <div class="pieza-dibujo">${svgPieza(g)}</div>
    ${g.agujeros.length ? `<p class="pieza-nota">● ${cuantos(frente, 'perforación', 'perforaciones')} en la cara${canto ? ` · ◌ ${canto} en el canto` : ''}. Haz una guía de 3 mm antes de atornillar para que no se parta. Medidas en cm desde el extremo izquierdo.</p>` : ''}
    ${juntas.length ? `<ul class="juntas">${juntas.map((t) => `<li>${t}</li>`).join('')}</ul>` : g.recibe ? '<p class="pieza-nota">No lleva perforaciones: las otras piezas se atornillan a esta.</p>' : ''}
  </div>`;
}
