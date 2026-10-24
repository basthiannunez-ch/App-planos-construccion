// Uniones entre piezas: dónde se tocan dos piezas de madera, qué fijación lleva cada unión
// (tornillo, clavo o tirafondo), cuántas, de qué largo y en qué punto exacto va cada una.
// Se calcula a partir del modelo 3D, así que sirve para cualquier plano sin escribirlo a mano.
import { MADERAS, rotar, esEntorno, esBloque } from './modelos.js';

// Revestimientos (tinglado, machihembrado) se clavan tabla por tabla: no se calculan pieza a pieza.
const ESTRUCTURA = MADERAS.filter((m) => m !== 'tinglado' && m !== 'machi');

// Piezas que se mueven (cajones, puertas, tapas, patas plegables): van con correderas o bisagras,
// nunca atornilladas al mueble.
const MOVIL = /^(frente de cajón|puerta|tabla tapa|pata plegable)/i;
const movil = (p) => MOVIL.test(p.n || '');

const resta = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const suma = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const por = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const punto = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const r1 = (n) => Math.round(n * 10) / 10;

// Caja orientada: centro, ejes unitarios y medias medidas.
function orientada(p) {
  const c = [p.x + p.w / 2, p.y + p.h / 2, p.z + p.d / 2];
  const ejes = [[1, 0, 0], [0, 1, 0], [0, 0, 1]].map((e) => (p.r ? rotar(e, p.r) : e));
  const m = [p.w / 2, p.h / 2, p.d / 2];
  let min = [Infinity, Infinity, Infinity];
  let max = [-Infinity, -Infinity, -Infinity];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
    const v = suma(c, suma(por(ejes[0], sx * m[0]), suma(por(ejes[1], sy * m[1]), por(ejes[2], sz * m[2]))));
    min = min.map((n, i) => Math.min(n, v[i]));
    max = max.map((n, i) => Math.max(n, v[i]));
  }
  return { c, ejes, m, min, max };
}

const dentro = (b, q, tol = 0.05) => {
  const v = resta(q, b.c);
  return b.ejes.every((e, i) => Math.abs(punto(v, e)) <= b.m[i] + tol);
};

// Distancia que recorre un tornillo dentro de la caja b, entrando por q en dirección n.
function profundidad(b, q, n) {
  let t0 = 0;
  let t1 = Infinity;
  const v = resta(q, b.c);
  for (let i = 0; i < 3; i++) {
    const o = punto(v, b.ejes[i]);
    const d = punto(n, b.ejes[i]);
    if (Math.abs(d) < 1e-6) {
      if (Math.abs(o) > b.m[i] + 0.1) return 0;
      continue;
    }
    let a = (-b.m[i] - o) / d;
    let z = (b.m[i] - o) / d;
    if (a > z) [a, z] = [z, a];
    t0 = Math.max(t0, a);
    t1 = Math.min(t1, z);
  }
  return t1 > t0 ? t1 - t0 : 0;
}

// Superficie de la cara de A que apoya en B: rectángulo en coordenadas de la cara.
function contacto(A, B, k, s) {
  const [i, j] = [0, 1, 2].filter((x) => x !== k);
  const n = por(A.ejes[k], s);
  const centro = suma(A.c, por(n, A.m[k] + 0.2));
  // Solo se muestrea la zona de la cara que queda frente a B (B proyectada sobre la cara).
  let [a0, a1, b0, b1] = [Infinity, -Infinity, Infinity, -Infinity];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
    const q = suma(B.c, suma(por(B.ejes[0], sx * B.m[0]), suma(por(B.ejes[1], sy * B.m[1]), por(B.ejes[2], sz * B.m[2]))));
    const u = punto(resta(q, A.c), A.ejes[i]);
    const v = punto(resta(q, A.c), A.ejes[j]);
    a0 = Math.min(a0, u); a1 = Math.max(a1, u); b0 = Math.min(b0, v); b1 = Math.max(b1, v);
  }
  a0 = Math.max(a0, -A.m[i]); a1 = Math.min(a1, A.m[i]);
  b0 = Math.max(b0, -A.m[j]); b1 = Math.min(b1, A.m[j]);
  if (a1 - a0 < 0.5 || b1 - b0 < 0.5) return null;
  const nu = Math.min(30, Math.max(2, Math.ceil((a1 - a0) / 1)));
  const nv = Math.min(30, Math.max(2, Math.ceil((b1 - b0) / 1)));
  const du = (a1 - a0) / nu;
  const dv = (b1 - b0) / nv;
  let u0 = Infinity; let u1 = -Infinity; let v0 = Infinity; let v1 = -Infinity; let hits = 0;
  for (let a = 0; a < nu; a++) {
    const u = a0 + du * (a + 0.5);
    for (let b = 0; b < nv; b++) {
      const v = b0 + dv * (b + 0.5);
      const q = suma(centro, suma(por(A.ejes[i], u), por(A.ejes[j], v)));
      if (!dentro(B, q)) continue;
      hits++;
      u0 = Math.min(u0, u - du / 2); u1 = Math.max(u1, u + du / 2);
      v0 = Math.min(v0, v - dv / 2); v1 = Math.max(v1, v + dv / 2);
    }
  }
  if (!hits) return null;
  return { k, s, i, j, n, u0, u1, v0, v1, area: hits * du * dv };
}

// ---------- Fijaciones ----------

const PULGADAS = { 25: '1"', 32: '1¼"', 40: '1⅝"', 50: '2"', 65: '2½"', 75: '3"', 100: '4"', 125: '5"', 150: '6"', 200: '8"', 250: '10"', 300: '12"' };
const LARGOS = [25, 32, 40, 50, 65, 75, 100, 125, 150];

function fijacion(t, prof, exterior) {
  const mmT = t * 10;
  const mmP = prof * 10;
  if (t < 1) return { tipo: 'clavo', nombre: exterior ? 'Clavo galvanizado 1"' : 'Clavo de terminación 1"', largo: 25, paso: 15 };
  if (t > 7.5) {
    // Dos piezas gruesas que se cruzan: perno pasado. Si la segunda es muy profunda: tirafondo.
    if (mmP <= 120) {
      const pulg = Math.ceil((mmT + mmP) / 25.4 + 1);
      return { tipo: 'perno', nombre: `Perno coche 3/8" × ${pulg}" con golilla y tuerca`, largo: Math.round(pulg * 25.4), paso: 40 };
    }
    const largo = [100, 125, 150, 200, 250, 300].find((l) => l >= mmT + 60) || 300;
    return { tipo: 'tirafondo', nombre: `Tirafondo 3/8" × ${PULGADAS[largo]} con golilla`, largo, paso: 40 };
  }
  const calibre = t <= 2.5 ? '8' : t <= 5 ? '10' : '14';
  const ideal = mmT + Math.min(mmP - 3, Math.max(20, mmT * 1.5));
  const tope = mmT + mmP - 3;
  let largo = LARGOS.find((l) => l >= ideal) || 150;
  if (largo > tope) largo = [...LARGOS].reverse().find((l) => l <= tope && l >= mmT + 12) || largo;
  return { tipo: 'tornillo', nombre: `Tornillo ${exterior ? 'exterior zincado' : 'para madera'} n.º ${calibre} × ${PULGADAS[largo]}`, largo, paso: 28 };
}

// Posiciones a lo largo de un tramo: con margen en los extremos y separación máxima "paso".
function repartir(a, b, paso) {
  const largo = b - a;
  if (largo < 5) return [(a + b) / 2];
  const margen = Math.min(3.5, largo / 4);
  const n = Math.max(2, Math.ceil((largo - 2 * margen) / paso) + 1);
  return Array.from({ length: n }, (_, x) => a + margen + ((largo - 2 * margen) * x) / (n - 1));
}

// ---------- Cálculo de todas las uniones de un modelo ----------

export function calcularUniones(partes) {
  const idx = partes
    .map((p, i) => i)
    .filter((i) => partes[i].t === 'caja' && ESTRUCTURA.includes(partes[i].m) && !esEntorno(partes[i]) && !esBloque(partes[i]));
  const cajas = new Map(idx.map((i) => [i, orientada(partes[i])]));
  const uniones = [];
  for (let x = 0; x < idx.length; x++) {
    for (let y = x + 1; y < idx.length; y++) {
      const a = idx[x];
      const b = idx[y];
      const A = cajas.get(a);
      const B = cajas.get(b);
      if (A.min.some((v, k) => v > B.max[k] + 0.3 || B.min[k] > A.max[k] + 0.3)) continue;
      if (movil(partes[a]) !== movil(partes[b])) continue;
      let mejor = null;
      for (const [P, Q, ip, iq] of [[A, B, a, b], [B, A, b, a]]) {
        for (let k = 0; k < 3; k++) {
          for (const s of [-1, 1]) {
            const c = contacto(P, Q, k, s);
            if (!c) continue;
            const ancho = Math.min(c.u1 - c.u0, c.v1 - c.v0);
            if (c.area < 3 || ancho < 1.2) continue;
            const t = 2 * P.m[k];
            // Se atornilla a través del espesor de la pieza (o de su ancho, si su sección es casi cuadrada):
            // nunca canto contra canto entre tablas vecinas.
            const orden = [...P.m].sort((g, h) => g - h);
            if (P.m[k] > orden[0] + 0.01 && (P.m[k] > orden[1] + 0.01 || orden[1] > orden[0] * 1.6)) continue;
            const medio = suma(suma(P.c, por(c.n, P.m[k] - 0.01)), suma(por(P.ejes[c.i], (c.u0 + c.u1) / 2), por(P.ejes[c.j], (c.v0 + c.v1) / 2)));
            const prof = profundidad(Q, medio, c.n);
            if (prof < 1.2 || t > 20) continue;
            const cand = { ...c, t, prof, P, ip, iq };
            if (!mejor || t < mejor.t - 0.05 || (Math.abs(t - mejor.t) <= 0.05 && c.area > mejor.area)) mejor = cand;
          }
        }
      }
      if (!mejor) continue;
      const { P, n, i, j, k, t, prof } = mejor;
      const f = fijacion(t, prof, ['imp', 'deck'].includes(partes[mejor.ip].m) || ['imp', 'deck'].includes(partes[mejor.iq].m));
      const [lu, lv] = [mejor.u1 - mejor.u0, mejor.v1 - mejor.v0];
      const largoEnU = lu >= lv;
      const filas = (largoEnU ? lv : lu) >= 9 && f.tipo !== 'clavo' ? 2 : 1;
      const corto = largoEnU ? [mejor.v0, mejor.v1] : [mejor.u0, mejor.u1];
      const enCorto = filas === 1 ? [(corto[0] + corto[1]) / 2] : [corto[0] + Math.min(3.5, (corto[1] - corto[0]) / 4), corto[1] - Math.min(3.5, (corto[1] - corto[0]) / 4)];
      const enLargo = largoEnU ? repartir(mejor.u0, mejor.u1, f.paso) : repartir(mejor.v0, mejor.v1, f.paso);
      const base = suma(P.c, por(n, -P.m[k]));
      const puntos = [];
      const locales = [];
      for (const l of enLargo) {
        for (const c of enCorto) {
          const [u, v] = largoEnU ? [l, c] : [c, l];
          puntos.push(suma(base, suma(por(P.ejes[i], u), por(P.ejes[j], v))).map(r1));
          locales.push({ k, s: -mejor.s, u: r1(u), v: r1(v) });
        }
      }
      uniones.push({ pasa: mejor.ip, entra: mejor.iq, ...f, dir: n.map((v) => Math.round(v * 1000) / 1000), puntos, locales });
    }
  }
  return uniones;
}
