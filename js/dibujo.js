// Dibuja una vista de plano como SVG a partir de piezas y cotas en centímetros.

function formatearMedida(cm, unidad) {
  if (unidad === 'm') {
    return `${(cm / 100).toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m`;
  }
  return `${Math.round(cm * 10) / 10} cm`;
}

function puntoArco(p, angulo) {
  const rad = (angulo * Math.PI) / 180;
  return [p.x + p.r * Math.cos(rad), p.y + p.r * Math.sin(rad)];
}

function limites(vista) {
  const xs = [];
  const ys = [];
  for (const p of vista.piezas) {
    if (p.tipo === 'poligono') {
      p.puntos.forEach(([x, y]) => { xs.push(x); ys.push(y); });
    } else if (p.tipo === 'puerta') {
      xs.push(p.x - p.r, p.x + p.r);
      ys.push(p.y - p.r, p.y + p.r);
    } else if (p.tipo === 'texto') {
      xs.push(p.x);
      ys.push(p.y);
    } else {
      xs.push(p.x, p.x + p.w);
      ys.push(p.y, p.y + p.h);
    }
  }
  for (const c of vista.cotas || []) {
    const horizontal = c.y1 === c.y2;
    xs.push(c.x1 + (horizontal ? 0 : c.off), c.x2 + (horizontal ? 0 : c.off));
    ys.push(c.y1 + (horizontal ? c.off : 0), c.y2 + (horizontal ? c.off : 0));
  }
  return {
    minX: Math.min(...xs), maxX: Math.max(...xs),
    minY: Math.min(...ys), maxY: Math.max(...ys),
  };
}

function pieza(p, fuente) {
  switch (p.tipo) {
    case 'poligono':
      return `<polygon class="p-techo" points="${p.puntos.map((pt) => pt.join(',')).join(' ')}"/>`;
    case 'puerta': {
      const [x1, y1] = puntoArco(p, p.a1);
      const [x2, y2] = puntoArco(p, p.a2);
      const barrido = p.a2 > p.a1 ? 1 : 0;
      return `<path class="p-puerta-arco" d="M${x1},${y1} A${p.r},${p.r} 0 0 ${barrido} ${x2},${y2}"/>`
        + `<line class="p-puerta" x1="${p.x}" y1="${p.y}" x2="${x2}" y2="${y2}"/>`;
    }
    case 'texto':
      return `<text class="p-texto${p.chico ? ' chico' : ''}" x="${p.x}" y="${p.y}" font-size="${fuente * (p.chico ? 0.8 : 1)}">${p.texto}</text>`;
    case 'ventana':
      return `<rect class="p-ventana" x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}"/>`
        + (p.w > p.h
          ? `<line class="p-linea" x1="${p.x}" y1="${p.y + p.h / 2}" x2="${p.x + p.w}" y2="${p.y + p.h / 2}"/>`
          : `<line class="p-linea" x1="${p.x + p.w / 2}" y1="${p.y}" x2="${p.x + p.w / 2}" y2="${p.y + p.h}"/>`);
    default: {
      const clase = p.tipo === 'muro' && p.claro ? 'p-muro-claro' : `p-${p.tipo}`;
      return `<rect class="${clase}" x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}"/>`;
    }
  }
}

function cota(c, unidad, fuente) {
  const horizontal = c.y1 === c.y2;
  const largo = horizontal ? Math.abs(c.x2 - c.x1) : Math.abs(c.y2 - c.y1);
  const texto = c.texto || formatearMedida(largo, unidad);
  const tic = fuente * 0.35;
  if (horizontal) {
    const y = c.y1 + c.off;
    const ty = c.off < 0 ? y - tic * 0.8 : y + fuente + tic * 0.2;
    return `<g class="cota">
      <line x1="${c.x1}" y1="${c.y1}" x2="${c.x1}" y2="${y}" class="cota-ext"/>
      <line x1="${c.x2}" y1="${c.y2}" x2="${c.x2}" y2="${y}" class="cota-ext"/>
      <line x1="${c.x1}" y1="${y}" x2="${c.x2}" y2="${y}"/>
      <line x1="${c.x1 - tic}" y1="${y + tic}" x2="${c.x1 + tic}" y2="${y - tic}"/>
      <line x1="${c.x2 - tic}" y1="${y + tic}" x2="${c.x2 + tic}" y2="${y - tic}"/>
      <text x="${(c.x1 + c.x2) / 2}" y="${ty}" font-size="${fuente}">${texto}</text>
    </g>`;
  }
  const x = c.x1 + c.off;
  const tx = c.off < 0 ? x - tic * 1.2 : x + tic * 1.2 + fuente * 0.8;
  const ym = (c.y1 + c.y2) / 2;
  return `<g class="cota">
    <line x1="${c.x1}" y1="${c.y1}" x2="${x}" y2="${c.y1}" class="cota-ext"/>
    <line x1="${c.x2}" y1="${c.y2}" x2="${x}" y2="${c.y2}" class="cota-ext"/>
    <line x1="${x}" y1="${c.y1}" x2="${x}" y2="${c.y2}"/>
    <line x1="${x - tic}" y1="${c.y1 + tic}" x2="${x + tic}" y2="${c.y1 - tic}"/>
    <line x1="${x - tic}" y1="${c.y2 + tic}" x2="${x + tic}" y2="${c.y2 - tic}"/>
    <text x="${tx}" y="${ym}" font-size="${fuente}" transform="rotate(-90 ${tx} ${ym})">${texto}</text>
  </g>`;
}

export function dibujarVista(vista, unidad, { conCotas = true } = {}) {
  const lim = limites(conCotas ? vista : { piezas: vista.piezas });
  const ancho = lim.maxX - lim.minX;
  const alto = lim.maxY - lim.minY;
  const fuente = Math.max(ancho, alto) * 0.045;
  const margen = conCotas ? fuente * 1.6 : Math.max(ancho, alto) * 0.06;
  const vb = [lim.minX - margen, lim.minY - margen, ancho + margen * 2, alto + margen * 2]
    .map((n) => Math.round(n * 100) / 100)
    .join(' ');
  const piezas = vista.piezas.map((p) => pieza(p, fuente)).join('');
  const cotas = conCotas ? (vista.cotas || []).map((c) => cota(c, unidad, fuente)).join('') : '';
  return `<svg class="plano-svg" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vista ${vista.nombre}">${piezas}${cotas}</svg>`;
}
