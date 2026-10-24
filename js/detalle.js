// Detalle de armado de un plano: despiece con letras, perforaciones de cada pieza, uniones
// entre piezas y fijaciones totales. Se calcula al abrir el plano (no al cargar la app).
import { agruparPiezas } from './modelos.js';
import { calcularUniones } from './uniones.js';

const cache = new Map();

// Construcciones con muros: el modelo es esquemático (muros de un cuerpo), así que en vez de
// calcular tornillo por tornillo se da la guía de fijación de tabiquería.
export const esEdificio = (p) => p.categoria === 'construcciones' && p.modelo.some((q) => q.m === 'tinglado' || q.m === 'machi');

const FIJACION = /^(tornillo|clavo|perno coche|clavos 3)/i;
const CONSERVAR = /tarugo|techo|policarbonato|autoperforante|expansi|anclaje/i;

function cantidadDe(materiales, patron) {
  const m = materiales.find((x) => patron.test(x.item));
  const n = m && String(m.cantidad).match(/[\d.]+/);
  return n ? Number(n[0].replace('.', '')) : 0;
}

function guiaEdificio(p) {
  const mat = p.materiales;
  const pies = cantidadDe(mat, /2×4/);
  const osb = cantidadDe(mat, /OSB 11/);
  const piso = cantidadDe(mat, /OSB 15/);
  const tinglado = cantidadDe(mat, /^Tinglado/);
  const machi = cantidadDe(mat, /^Machihembrado/);
  const polines = cantidadDe(mat, /^Polín/);
  const redondo = (n) => Math.ceil((n * 1.1) / 10) * 10;
  const filas = [
    polines && { nombre: 'Tirafondo 3/8" × 5" con golilla', cantidad: redondo(polines * 2), uso: 'Vigas de piso a polines: 2 por polín, uno por cada lado de la viga.' },
    pies && { nombre: 'Clavo corriente 4"', cantidad: redondo(pies * 6), uso: 'Pies derechos a soleras: 2 clavos por extremo, de punta por la solera. Solera inferior a la plataforma: 1 clavo cada 40 cm.' },
    piso && { nombre: 'Tornillo para madera n.º 8 × 2"', cantidad: redondo(piso * 45), uso: 'Placa de piso a vigas: cada 15 cm en los bordes y cada 30 cm al centro de la placa.' },
    osb && { nombre: 'Clavo corriente 2"', cantidad: redondo(osb * 60), uso: 'Placa OSB de muro a pies derechos: cada 15 cm en los bordes y cada 30 cm al centro.' },
    tinglado && { nombre: 'Clavo galvanizado 2½"', cantidad: redondo(tinglado * 18), uso: 'Tinglado: 1 clavo por tabla en cada pie derecho, a 2 cm sobre el traslape para que la tabla de abajo pueda moverse.' },
    machi && { nombre: 'Clavo cabeza perdida 1½"', cantidad: redondo(machi * 20), uso: 'Machihembrado interior: 1 clavo inclinado en la lengüeta de cada tabla, en cada pie derecho, para que no se vea.' },
    { nombre: 'Clavo corriente 3"', cantidad: redondo(Math.max(40, pies * 1.5)), uso: 'Cabios o cerchas a la solera superior: 3 clavos por apoyo (o un conector metálico tipo "hurricane").' },
  ];
  return filas.filter(Boolean);
}

const nombrePieza = (g, p) => g?.n || (g ? `Pieza ${g.letra}` : (p.n || 'pieza'));

export function detallar(p) {
  if (cache.has(p.id)) return cache.get(p.id);
  const grupos = agruparPiezas(p.modelo);
  const grupoDe = new Map();
  grupos.forEach((g) => g.idx.forEach((i) => grupoDe.set(i, g)));
  const edificio = esEdificio(p);
  const uniones = edificio ? [] : calcularUniones(p.modelo);

  // Totales por tipo de fijación, con un 10 % de reserva.
  const totales = new Map();
  for (const u of uniones) totales.set(u.nombre, (totales.get(u.nombre) || 0) + u.puntos.length);
  const fijaciones = edificio
    ? guiaEdificio(p)
    : [...totales].map(([nombre, n]) => ({ nombre, cantidad: Math.ceil(n * 1.1), exactas: n }))
      .sort((a, b) => b.cantidad - a.cantidad);

  // Por pieza: perforaciones (de la pieza modelo de su grupo) y con qué se une.
  for (const g of grupos) {
    const [w, h, d] = (({ w: a, h: b, d: c }) => [a, b, c])(p.modelo[g.idx[0]]);
    const D = [w, h, d];
    const orden = [0, 1, 2].sort((a, b) => D[a] - D[b]);
    const [kt, kw, kl] = orden;
    g.ejes = { kt, kw, kl, largo: D[kl], ancho: D[kw], espesor: D[kt] };
    g.agujeros = [];
    const juntas = new Map();
    for (const u of uniones) {
      if (!g.idx.includes(u.pasa)) continue;
      const destino = grupoDe.get(u.entra);
      const clave = `${destino?.letra || p.modelo[u.entra].n}|${u.nombre}|${u.puntos.length}`;
      const j = juntas.get(clave) || { destino: nombrePieza(destino, p.modelo[u.entra]), letra: destino?.letra, nombre: u.nombre, por: u.puntos.length, veces: 0 };
      j.veces++;
      juntas.set(clave, j);
      if (u.pasa !== g.idx[0]) continue;
      for (const l of u.locales) {
        if (l.k === kl) continue;
        const [i, jx] = [0, 1, 2].filter((x) => x !== l.k);
        const c = [0, 0, 0];
        c[l.k] = (l.s * D[l.k]) / 2;
        c[i] = l.u;
        c[jx] = l.v;
        g.agujeros.push({ x: c[kl] + D[kl] / 2, y: c[kw] + D[kw] / 2, cara: l.k === kt ? 'frente' : 'canto', tipo: u.tipo });
      }
    }
    g.juntas = [...juntas.values()];
    // Con cuántas piezas de otros grupos se atornilla (recibe tornillos).
    g.recibe = uniones.filter((u) => g.idx.includes(u.entra)).length;
  }

  const r = { grupos, uniones, fijaciones, edificio };
  cache.set(p.id, r);
  return r;
}

// Materiales completos: las fijaciones calculadas reemplazan a las escritas a mano.
export function materialesConFijaciones(p) {
  const { fijaciones, edificio } = detallar(p);
  if (!fijaciones.length) return p.materiales;
  const base = p.materiales.filter((m) => !FIJACION.test(m.item) || CONSERVAR.test(m.item) || (edificio && !/clavos 3/i.test(m.item)));
  return [...base, ...fijaciones.map((f) => ({ item: f.nombre, cantidad: `${f.cantidad} un.`, uso: f.uso || 'Incluye 10 % de reserva', fijacion: true }))];
}
