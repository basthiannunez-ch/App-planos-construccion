// Descarga de un plano en PDF (A4), armado en el mismo teléfono con jsPDF.
import { DIFICULTAD, CATEGORIAS } from './planos.js';
import { dibujarVista } from './dibujo.js';
import { svgPieza, juntasTexto } from './despiece.js';

const JSPDF = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

let cargando = null;
function cargarJsPdf() {
  if (window.jspdf) return Promise.resolve(window.jspdf.jsPDF);
  cargando ??= new Promise((listo, error) => {
    const s = document.createElement('script');
    s.src = JSPDF;
    s.onload = () => listo(window.jspdf.jsPDF);
    s.onerror = () => { cargando = null; error(new Error('No se pudo cargar jsPDF')); };
    document.head.append(s);
  });
  return cargando;
}

// Las fuentes estándar del PDF no traen todos los símbolos: se reemplazan por equivalentes.
const limpio = (t) => String(t ?? '')
  .replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/⅝/g, '5/8').replace(/⅜/g, '3/8').replace(/⅛/g, '1/8').replace(/⅞/g, '7/8')
  .replace(/≈/g, '~').replace(/→/g, '->').replace(/[✓✔]/g, '').replace(/[★☆●◌⏱]/g, '')
  .replace(/[^\x20-\x7E\xA0-\xFF–—‘’“”•…€]/g, '');

// Estilos del dibujo con colores fijos (en la app vienen de la hoja de estilos).
const ESTILO = `
rect, polygon, path, line { vector-effect: non-scaling-stroke; }
.p-madera, .p-techo { fill: #e9c99a; stroke: #8a5a2b; stroke-width: 1.2; }
.p-muro { fill: #3a4148; stroke: #3a4148; stroke-width: 1; }
.p-muro-claro { fill: #fff; stroke: #3a4148; stroke-width: 1.5; }
.p-existente { fill: #5d6873; fill-opacity: 0.35; stroke: #5d6873; stroke-width: 1; stroke-dasharray: 4 3; }
.p-ventana { fill: #bfe0f5; stroke: #3a4148; stroke-width: 1; }
.p-hueco { fill: #bfe0f5; fill-opacity: 0.5; stroke: #3a4148; stroke-width: 1.2; }
.p-oculto { fill: none; stroke: #8a5a2b; stroke-width: 1; stroke-dasharray: 5 4; }
.p-linea { stroke: #3a4148; stroke-width: 0.8; }
.p-veta { stroke: #8a5a2b; stroke-width: 0.6; stroke-opacity: 0.7; }
.p-puerta { stroke: #3a4148; stroke-width: 1.5; }
.p-puerta-arco { fill: none; stroke: #3a4148; stroke-width: 0.8; stroke-dasharray: 4 3; }
.p-texto { fill: #5d6873; text-anchor: middle; font-weight: 600; font-family: sans-serif; }
.cota line { stroke: #c0392b; stroke-width: 1; }
.cota .cota-ext { stroke-width: 0.6; stroke-opacity: 0.6; }
.cota text { fill: #c0392b; text-anchor: middle; font-weight: 600; font-family: sans-serif; }`;

function svgAImagen(svg, anchoPx) {
  const vb = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const altoPx = Math.round((anchoPx * vb[3]) / vb[2]);
  const conTam = svg
    .replace(/<svg([^>]*?)\s(width|height)="[^"]*"/g, '<svg$1')
    .replace(/<svg([^>]*?)\s(width|height)="[^"]*"/g, '<svg$1')
    .replace('<svg', `<svg width="${anchoPx}" height="${altoPx}"`)
    .replace(/(<svg[^>]*>)/, `$1<style>${ESTILO}</style><rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="#fff" style="stroke:none"/>`)
    .replace(/var\(--[\w-]+,\s*([^)]+)\)/g, '$1');
  return new Promise((listo, error) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = anchoPx;
      c.height = altoPx;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, anchoPx, altoPx);
      ctx.drawImage(img, 0, 0, anchoPx, altoPx);
      listo({ url: c.toDataURL('image/jpeg', 0.9), w: anchoPx, h: altoPx });
    };
    img.onerror = error;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(conTam)}`;
  });
}

const AZUL = [31, 78, 121];
const GRIS = [93, 104, 115];
const TEXTO = [29, 35, 41];
const ROJO = [192, 57, 43];

export async function descargarPdf(p, { det, materiales, foto, fotoTornillos }) {
  const JsPDF = await cargarJsPdf();
  const doc = new JsPDF({ unit: 'mm', format: 'a4', compress: true });
  const M = 14;
  const AN = 210 - M * 2;
  const FIN = 297 - 16;
  let y = M;

  const color = (c) => doc.setTextColor(...c);
  const fuente = (tam, estilo = 'normal') => { doc.setFont('helvetica', estilo); doc.setFontSize(tam); };
  const nuevaPagina = () => { doc.addPage(); y = M; };
  const espacio = (h) => { if (y + h > FIN) nuevaPagina(); };
  const parrafo = (t, { tam = 10, estilo = 'normal', col = TEXTO, ancho = AN, x = M, salto = 0.42 } = {}) => {
    fuente(tam, estilo);
    color(col);
    const lineas = doc.splitTextToSize(limpio(t), ancho);
    for (const l of lineas) {
      espacio(tam * salto + 1);
      doc.text(l, x, y + tam * 0.35);
      y += tam * salto + 0.6;
    }
  };
  const titulo = (t) => {
    espacio(16);
    y += 3;
    fuente(14, 'bold');
    color(AZUL);
    doc.text(limpio(t), M, y + 5);
    doc.setDrawColor(...AZUL);
    doc.setLineWidth(0.4);
    doc.line(M, y + 7.5, M + AN, y + 7.5);
    y += 11;
  };
  const imagen = (url, w, h, formato) => {
    const max = Math.min(AN, w);
    const alto = (h / w) * max;
    espacio(alto + 2);
    doc.addImage(url, formato, M + (AN - max) / 2, y, max, alto);
    y += alto + 3;
  };

  // --- Portada ---
  const cat = CATEGORIAS.find((c) => c.id === p.categoria);
  doc.setFillColor(...AZUL);
  doc.rect(0, 0, 210, 9, 'F');
  fuente(8, 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(limpio(`PLANOS DE MADERA · ${cat?.nombre || ''}`.toUpperCase()), M, 6);
  y = 16;
  parrafo(p.nombre, { tam: 22, estilo: 'bold', col: TEXTO, salto: 0.45 });
  y += 1;
  parrafo(p.resumen, { tam: 11, col: GRIS });
  y += 2;
  if (foto) imagen(foto, 1200, 900, 'JPEG');
  const med = p.unidad === 'm'
    ? `${(p.medidas.largo / 100).toLocaleString('es-CL')} × ${(p.medidas.ancho / 100).toLocaleString('es-CL')} × ${(p.medidas.alto / 100).toLocaleString('es-CL')} m`
    : `${p.medidas.largo} × ${p.medidas.ancho} × ${p.medidas.alto} cm`;
  const totalFij = det.fijaciones.reduce((s, f) => s + f.cantidad, 0);
  const datos = [
    ['Medidas (largo × ancho × alto)', med],
    ['Dificultad', DIFICULTAD[p.dificultad]],
    ['Tiempo estimado', p.tiempo],
    ['Personas', String(p.personas)],
    ...(det.grupos.length && !det.edificio ? [['Piezas de madera', `${det.grupos.reduce((s, g) => s + g.idx.length, 0)} (${det.grupos.length} medidas distintas)`]] : []),
    ...(totalFij ? [['Tornillos y clavos', `${totalFij} aprox.`]] : []),
  ];
  const col = AN / 2;
  datos.forEach(([k, v], i) => {
    const x = M + (i % 2) * col;
    if (i % 2 === 0) espacio(13);
    fuente(8);
    color(GRIS);
    doc.text(limpio(k).toUpperCase(), x, y + 3);
    fuente(11, 'bold');
    color(TEXTO);
    doc.text(limpio(v), x, y + 8.5);
    if (i % 2 === 1 || i === datos.length - 1) y += 13;
  });

  // --- Vistas con medidas ---
  nuevaPagina();
  titulo('Vistas con medidas');
  for (const v of p.vistas) {
    const img = await svgAImagen(dibujarVista(v, p.unidad), 1400);
    const w = AN;
    let h = (img.h / img.w) * w;
    const maxH = 115;
    const ancho = h > maxH ? (w * maxH) / h : w;
    h = Math.min(h, maxH);
    espacio(h + 10);
    fuente(11, 'bold');
    color(TEXTO);
    doc.text(limpio(v.nombre), M, y + 4);
    y += 6;
    doc.addImage(img.url, 'JPEG', M + (AN - ancho) / 2, y, ancho, h);
    y += h + 6;
  }

  // --- Materiales ---
  titulo('Materiales y lista de cortes');
  const filas = materiales.map((m) => [m.pieza || '', m.item, m.cantidad, m.uso || '']);
  const anchos = [10, 82, 42, AN - 134];
  const encabezado = () => {
    doc.setFillColor(232, 240, 248);
    doc.rect(M, y, AN, 7, 'F');
    fuente(8.5, 'bold');
    color(AZUL);
    ['Pieza', 'Material', 'Cantidad', 'Uso'].forEach((t, i) => doc.text(t, M + 1.5 + anchos.slice(0, i).reduce((a, b) => a + b, 0), y + 4.8));
    y += 8;
  };
  encabezado();
  for (const f of filas) {
    fuente(9);
    const celdas = f.map((t, i) => doc.splitTextToSize(limpio(t), anchos[i] - 3));
    const h = Math.max(...celdas.map((c) => c.length)) * 4 + 2.5;
    if (y + h > FIN) { nuevaPagina(); encabezado(); }
    celdas.forEach((c, i) => {
      fuente(9, i === 0 ? 'bold' : 'normal');
      color(i === 0 ? ROJO : i === 3 ? GRIS : TEXTO);
      doc.text(c, M + 1.5 + anchos.slice(0, i).reduce((a, b) => a + b, 0), y + 3.5);
    });
    y += h;
    doc.setDrawColor(221, 225, 228);
    doc.setLineWidth(0.2);
    doc.line(M, y - 1, M + AN, y - 1);
  }
  y += 2;
  parrafo(`Herramientas: ${p.herramientas.join(', ')}.`, { tam: 9.5, col: GRIS });

  // --- Tornillos ---
  if (det.fijaciones.length) {
    titulo(det.edificio ? 'Cómo fijar' : 'Dónde van los tornillos');
    if (fotoTornillos) {
      imagen(fotoTornillos, 1200, 900, 'JPEG');
      parrafo('Rojo: tornillos · Azul: clavos · Morado: tirafondos o pernos. La madera se muestra transparente para ver cada fijación.', { tam: 8.5, col: GRIS });
      y += 2;
    }
    for (const f of det.fijaciones) {
      parrafo(`${f.cantidad} × ${f.nombre}`, { tam: 10, estilo: 'bold' });
      if (f.uso) parrafo(f.uso, { tam: 9, col: GRIS });
      y += 1;
    }
  }

  // --- Despiece ---
  if (det.grupos.length && !det.edificio) {
    titulo('Despiece: cada pieza con sus perforaciones');
    parrafo('Medidas en cm. Las perforaciones se miden desde el extremo izquierdo de la pieza. Haz una guía de 3 mm antes de atornillar.', { tam: 9, col: GRIS });
    y += 2;
    for (const g of det.grupos) {
      const img = await svgAImagen(svgPieza(g, { ancho: 340 }), 1020);
      const w = 120;
      const h = (img.h / img.w) * w;
      const juntas = juntasTexto(g).map(limpio);
      fuente(9);
      const lineas = juntas.flatMap((t) => doc.splitTextToSize(`• ${t}`, AN - 4));
      espacio(h + 14 + lineas.length * 4.2);
      doc.setFillColor(...AZUL);
      doc.roundedRect(M, y, 8, 7, 1.5, 1.5, 'F');
      fuente(10, 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(g.letra, M + 4, y + 5, { align: 'center' });
      color(TEXTO);
      fuente(11, 'bold');
      doc.text(limpio(`${g.n || `Pieza ${g.letra}`}  × ${g.idx.length}`), M + 11, y + 5);
      fuente(9);
      color(GRIS);
      const { largo, ancho, espesor } = g.ejes;
      const n = (v) => (Math.round(v * 2) / 2).toLocaleString('es-CL');
      doc.text(limpio(`${n(largo)} × ${n(ancho)} × ${n(espesor)} cm · ${g.item}`), M + 11, y + 10);
      y += 12;
      doc.addImage(img.url, 'JPEG', M, y, w, h);
      y += h + 1;
      fuente(9);
      color(TEXTO);
      for (const l of lineas) { doc.text(l, M + 2, y + 3); y += 4.2; }
      y += 4;
    }
  }

  // --- Pasos ---
  titulo('Paso a paso');
  p.pasos.forEach((s, i) => {
    espacio(14);
    parrafo(`${i + 1}. ${s.titulo}`, { tam: 10.5, estilo: 'bold' });
    parrafo(s.detalle, { tam: 9.5, col: GRIS, x: M + 5, ancho: AN - 5 });
    y += 1.5;
  });
  if (p.notas?.length) {
    titulo('Ten en cuenta');
    p.notas.forEach((n) => parrafo(`• ${n}`, { tam: 9.5 }));
  }

  // Pie de página.
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    fuente(8);
    color(GRIS);
    doc.text(limpio(`${p.nombre} · app-planos-construccion.vercel.app`), M, 297 - 8);
    doc.text(`${i} / ${total}`, 210 - M, 297 - 8, { align: 'right' });
  }
  doc.save(`plano-${p.id}.pdf`);
}
