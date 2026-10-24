// Generadores de modelos 3D por familia de objeto. Devuelven listas de partes (ver modelos.js).

import { caja, perfil, girar } from './modelos.js';

// Mesa, banco o escritorio: patas, faldones, cubierta y opcionalmente travesaños, repisa y cajón.
export function mesa({
  L, W, H, pata = 7, cub = 4, fald = 9, vuelo = 5, tablas = 0, sep = 0.6,
  trav = 0, repisa = 0, cajon = false, m = 'pino', mp = m,
}) {
  const p = [];
  if (tablas) {
    const n = Math.max(1, Math.round(W / tablas));
    const a = (W - sep * (n - 1)) / n;
    for (let i = 0; i < n; i++) p.push(caja(0, H - cub, i * (a + sep), L, cub, a, m, 'Cubierta'));
  } else {
    p.push(caja(0, H - cub, 0, L, cub, W, m, 'Cubierta'));
  }
  const hp = H - cub;
  const xs = [vuelo, L - vuelo - pata];
  const zs = [vuelo, W - vuelo - pata];
  for (const x of xs) for (const z of zs) p.push(caja(x, 0, z, pata, hp, pata, mp, 'Pata'));
  const lx = L - 2 * (vuelo + pata);
  const lz = W - 2 * (vuelo + pata);
  if (fald) {
    p.push(caja(vuelo + pata, hp - fald, vuelo + 0.5, lx, fald, 2, m, 'Faldón largo'));
    if (cajon) {
      const cw = Math.min(lx - 4, 50);
      p.push(caja(vuelo + pata, hp - fald, W - vuelo - 2.5, (lx - cw) / 2, fald, 2, m, 'Faldón largo'));
      p.push(caja(vuelo + pata + (lx + cw) / 2, hp - fald, W - vuelo - 2.5, (lx - cw) / 2, fald, 2, m, 'Faldón largo'));
      p.push(caja(vuelo + pata + (lx - cw) / 2, hp - fald + 0.5, W - vuelo - 2, cw, fald - 1, 2, m, 'Frente de cajón'));
      p.push(caja(L / 2 - 5, hp - fald / 2 - 0.7, W - vuelo, 10, 1.4, 1.6, 'metal'));
    } else {
      p.push(caja(vuelo + pata, hp - fald, W - vuelo - 2.5, lx, fald, 2, m, 'Faldón largo'));
    }
    for (const x of [vuelo + 0.5, L - vuelo - 2.5]) p.push(caja(x, hp - fald, vuelo + pata, 2, fald, lz, m, 'Faldón corto'));
  }
  if (trav) {
    for (const x of xs) p.push(caja(x + pata / 2 - 2, trav, vuelo + pata, 4, 4, lz, mp, 'Travesaño'));
    p.push(caja(vuelo + pata, trav, W / 2 - 2, lx, 4, 4, mp, 'Travesaño largo'));
  }
  if (repisa) p.push(caja(vuelo + pata, repisa, vuelo, lx, 2, W - 2 * vuelo, m, 'Repisa'));
  return p;
}

// Mueble de tablero: costados, techo, base, repisas, divisiones y frentes (cajones y puertas).
export function mueble({
  L, W, H, t = 1.8, base = 'zocalo', hb = 10, repisas = [], divisiones = [], frentes = [],
  sobre = 0, m = 'tablero', mf = m, fondo = true,
}) {
  const p = [];
  const top = H - sobre;
  p.push(caja(0, base === 'patas' ? hb : 0, 0, t, top - (base === 'patas' ? hb : 0), W, m, 'Costado'));
  p.push(caja(L - t, base === 'patas' ? hb : 0, 0, t, top - (base === 'patas' ? hb : 0), W, m, 'Costado'));
  if (!sobre) p.push(caja(t, top - t, 0, L - 2 * t, t, W, m, 'Techo'));
  else p.push(caja(-1, top, -0.5, L + 2, sobre, W + 2.5, m === 'tablero' ? 'pino' : m, 'Cubierta'));
  p.push(caja(t, hb, 0, L - 2 * t, t, W, m, 'Base'));
  for (const y of repisas) p.push(caja(t, y, 1, L - 2 * t, t, W - 2, m, 'Repisa'));
  for (const x of divisiones) p.push(caja(x, hb + t, 0, t, top - hb - 2 * t, W, m, 'División'));
  if (fondo) p.push(caja(0, base === 'patas' ? hb : 0, -0.3, L, top - (base === 'patas' ? hb : 0), 0.3, 'tablero'));
  if (base === 'zocalo') p.push(caja(t, 0, W - 5 - t, L - 2 * t, hb, t, m, 'Zócalo'));
  if (base === 'patas') {
    for (const x of [1, L - 5]) for (const z of [1, W - 5]) p.push(caja(x, 0, z, 4, hb, 4, 'pino', 'Pata'));
  }
  for (const f of frentes) {
    p.push(caja(f.x, f.y, W, f.w, f.h, t, mf, f.tipo === 'cajon' ? 'Frente de cajón' : 'Puerta'));
    if (f.tirador !== false) {
      const vertical = f.tipo === 'puerta';
      const lado = f.lado === 'izq' ? f.x + 4 : f.x + f.w - 5.5;
      if (vertical) p.push(caja(lado, f.y + f.h / 2 - 7, W + t, 1.5, 14, 1.8, 'metal'));
      else p.push(caja(f.x + f.w / 2 - 7, f.y + f.h - 5, W + t, 14, 1.5, 1.8, 'metal'));
    }
  }
  return p;
}

// Cama: respaldo con tablas, largueros, tablillas, colchón y almohadas.
export function cama({ W = 150, Lc = 190, respaldo = 100, alto = 35, poste = 7, m = 'pino', colchon = true, piecera = 0 }) {
  const p = [];
  const L = W + 2 * poste;
  const Z = Lc + 2 * poste;
  for (const x of [0, L - poste]) {
    p.push(caja(x, 0, 0, poste, respaldo, poste, m, 'Poste respaldo'));
    p.push(caja(x, 0, Z - poste, poste, piecera || alto + 5, poste, m, 'Pata pie'));
  }
  const nt = Math.max(2, Math.floor((respaldo - alto - 10) / 16));
  for (let i = 0; i < nt; i++) p.push(caja(poste, alto + 8 + i * 16, 1.5, W, 13.8, 2, m, 'Tabla respaldo'));
  for (const x of [poste - 4.1, L - poste]) p.push(caja(x, alto - 14, poste, 4.1, 14, Lc, m, 'Larguero'));
  p.push(caja(poste, alto - 14, 1.5, W, 14, 4.1, m, 'Travesaño cabecera'));
  p.push(caja(poste, alto - 14, Z - 5.6, W, 14, 4.1, m, 'Travesaño pie'));
  if (W > 100) p.push(caja(L / 2 - 2, alto - 14, poste, 4.1, 9, Lc, m, 'Viga central'));
  const n = Math.round(Lc / 15);
  for (let i = 0; i < n; i++) p.push(caja(poste, alto - 2, poste + 2 + i * (Lc - 4) / n, W, 1.9, 9, m, 'Tablilla'));
  if (colchon) {
    p.push(caja(poste + 1, alto, poste + 1, W - 2, 22, Lc - 2, 'tela'));
    const na = W > 100 ? 2 : 1;
    const aw = (W - 10 - (na - 1) * 4) / na;
    for (let i = 0; i < na; i++) p.push(caja(poste + 5 + i * (aw + 4), alto + 22, poste + 4, aw, 10, 38, 'blanco'));
    p.push(caja(poste - 1, alto + 22, poste + 50, W + 2, 4, Lc - 48, 'manta'));
  }
  return p;
}

// Caja de tablas horizontales con postes en las esquinas (jardineras, baúles, areneros, composteras).
export function cajon({ L, W, H, tabla = 14, esp = 2, poste = 7, patas = 0, ranura = 0.5, tapa = false, fondo = false, m = 'imp' }) {
  const p = [];
  const hc = H - patas;
  const n = Math.max(1, Math.round(hc / (tabla + ranura)));
  const a = (hc - ranura * (n - 1)) / n;
  for (let i = 0; i < n; i++) {
    const y = patas + i * (a + ranura);
    p.push(caja(0, y, W - esp, L, a, esp, m, 'Tabla lateral larga'));
    p.push(caja(0, y, 0, L, a, esp, m, 'Tabla lateral larga'));
    p.push(caja(0, y, esp, esp, a, W - 2 * esp, m, 'Tabla lateral corta'));
    p.push(caja(L - esp, y, esp, esp, a, W - 2 * esp, m, 'Tabla lateral corta'));
  }
  for (const x of [esp, L - esp - poste]) for (const z of [esp, W - esp - poste]) p.push(caja(x, 0, z, poste, H, poste, m, 'Poste'));
  if (fondo) p.push(caja(esp, patas, esp, L - 2 * esp, 2, W - 2 * esp, m, 'Fondo'));
  if (tapa) {
    const nt = Math.max(2, Math.round(W / 14));
    const at = (W + 2 - 0.4 * (nt - 1)) / nt;
    for (let i = 0; i < nt; i++) p.push(caja(-1, H, -1 + i * (at + 0.4), L + 2, 2, at, m, 'Tabla tapa'));
  }
  return p;
}

// Repisa / estante abierto de tablas sobre dos o más costados.
export function estante({ L, W, H, niveles = 4, t = 1.8, m = 'tablero', zocalo = 6, fondo = true }) {
  const p = [caja(0, 0, 0, t, H, W, m, 'Costado'), caja(L - t, 0, 0, t, H, W, m, 'Costado')];
  const paso = (H - zocalo - t) / (niveles - 1);
  for (let i = 0; i < niveles; i++) p.push(caja(t, zocalo + i * paso, 0, L - 2 * t, t, W, m, 'Repisa'));
  if (zocalo) p.push(caja(t, 0, W - 3, L - 2 * t, zocalo, t, m, 'Zócalo'));
  if (fondo) p.push(caja(0, 0, -0.3, L, H, 0.3, 'tablero'));
  return p;
}

// Silla o piso: patas, asiento de tablas y respaldo opcional.
export function silla({ A = 42, P = 42, hs = 45, hr = 0, pata = 4, m = 'pino', apoyapies = 0 }) {
  const p = [];
  for (const x of [0, A - pata]) {
    p.push(caja(x, 0, P - pata, pata, hs - 2, pata, m, 'Pata delantera'));
    p.push(caja(x, 0, 0, pata, hr || hs - 2, pata, m, hr ? 'Pata trasera' : 'Pata'));
  }
  const nt = 3;
  for (let i = 0; i < nt; i++) p.push(caja(-0.5, hs - 2, i * (P + 1) / nt, A + 1, 2, (P + 1) / nt - 0.5, m, 'Tabla asiento'));
  p.push(caja(pata, hs - 9, 0.5, A - 2 * pata, 7, 2, m, 'Faldón'));
  p.push(caja(pata, hs - 9, P - 2.5, A - 2 * pata, 7, 2, m, 'Faldón'));
  for (const x of [0.5, A - 2.5]) p.push(caja(x, hs - 9, pata, 2, 7, P - 2 * pata, m, 'Faldón'));
  if (hr) {
    p.push(caja(pata, hr - 10, 0.5, A - 2 * pata, 9, 2, m, 'Respaldo'));
    p.push(caja(pata, hr - 22, 0.5, A - 2 * pata, 6, 2, m, 'Respaldo'));
  }
  const ap = apoyapies || 15;
  for (const x of [pata / 2 - 1]) p.push(caja(x, ap, pata, 2, 4, P - 2 * pata, m, 'Travesaño'));
  p.push(caja(A - pata / 2 - 1, ap, pata, 2, 4, P - 2 * pata, m, 'Travesaño'));
  p.push(caja(pata, apoyapies || ap, P - pata / 2 - 1, A - 2 * pata, 4, 2, m, 'Travesaño'));
  return p;
}

// ---------- Construcciones ----------

const GRUESO = 12;

// Recorre una línea de muro y deja huecos para puertas y ventanas.
function muro(p, { eje, fijo, desde, hasta, y0, H, vanos, m }) {
  const pon = (a, b, ya, yb) => {
    if (b - a < 0.5 || yb - ya < 0.5) return;
    if (eje === 'x') p.push(caja(a, ya, fijo, b - a, yb - ya, GRUESO, m));
    else p.push(caja(fijo, ya, a, GRUESO, yb - ya, b - a, m));
  };
  let cursor = desde;
  const orden = [...vanos].sort((a, b) => a.pos - b.pos);
  for (const v of orden) {
    pon(cursor, v.pos, y0, y0 + H);
    const piso = v.tipo === 'puerta' ? 0 : v.alt;
    pon(v.pos, v.pos + v.w, y0, y0 + piso);
    pon(v.pos, v.pos + v.w, y0 + piso + v.h, y0 + H);
    // Marco y relleno del vano
    const a = v.pos;
    const b = v.pos + v.w;
    const c = fijo + GRUESO / 2;
    const tablero = (u, y, w, h, prof, mat) => (eje === 'x'
      ? caja(u, y, c - prof / 2, w, h, prof, mat) : caja(c - prof / 2, y, u, prof, h, w, mat));
    const ya = y0 + piso;
    p.push(tablero(a, ya + v.h - 5, v.w, 5, GRUESO + 2, 'pino'));
    p.push(tablero(a, ya, 5, v.h, GRUESO + 2, 'pino'));
    p.push(tablero(b - 5, ya, 5, v.h, GRUESO + 2, 'pino'));
    if (v.tipo === 'puerta') {
      p.push(tablero(a + 5, ya, v.w - 10, v.h - 5, 4, 'oscuro'));
      const lado = eje === 'x' ? 1 : -1;
      const pom = eje === 'x'
        ? caja(b - 14, ya + 100, c + lado * 2, 3, 3, 4, 'metal')
        : caja(c + 2, ya + 100, b - 14, 4, 3, 3, 'metal');
      p.push(pom);
    } else {
      p.push(tablero(a, ya, v.w, 5, GRUESO + 4, 'pino'));
      p.push(tablero(a + 5, ya + 5, v.w - 10, v.h - 10, 1, 'vidrio'));
      p.push(tablero(a + v.w / 2 - 2, ya + 5, 4, v.h - 10, 4, 'pino'));
    }
    cursor = v.pos + v.w;
  }
  pon(cursor, hasta, y0, y0 + H);
}

// Edificio de entramado de madera sobre polines: muros con tinglado, puertas, ventanas y techo.
// lados: 'f' frente (z = W), 'b' fondo (z = 0), 'i' izquierda (x = 0), 'd' derecha (x = L).
export function edificio({
  L, W, H = 240, techo = 'dos', cumbrera = 'z', alzada, alero = 30, piso = 50,
  puertas = [], ventanas = [], tabiques = [], terraza = 0, porche = false, mt = 'tinglado', mtecho = 'techo',
  pilotes = true, sinPiso = false, alto = 'f',
}) {
  const p = [];
  const y0 = sinPiso ? 0 : piso;
  if (!sinPiso) {
    p.push(caja(0, piso - 20, 0, L, 20, W + terraza, 'imp'));
    if (pilotes) {
      const nx = Math.max(2, Math.ceil(L / 150) + 1);
      const nz = Math.max(2, Math.ceil((W + terraza) / 150) + 1);
      for (let i = 0; i < nx; i++) {
        for (let j = 0; j < nz; j++) {
          p.push(caja(4 + i * (L - 20) / (nx - 1), 0, 4 + j * (W + terraza - 20) / (nz - 1), 12, piso - 20, 12, 'imp'));
        }
      }
    }
  }
  const vanos = { f: [], b: [], i: [], d: [] };
  for (const v of puertas) vanos[v.lado].push({ tipo: 'puerta', w: 90, h: 205, ...v });
  for (const v of ventanas) vanos[v.lado].push({ tipo: 'ventana', w: 120, h: 100, alt: 95, ...v });
  muro(p, { eje: 'x', fijo: W - GRUESO, desde: 0, hasta: L, y0, H, vanos: vanos.f, m: mt });
  muro(p, { eje: 'x', fijo: 0, desde: 0, hasta: L, y0, H, vanos: vanos.b, m: mt });
  muro(p, { eje: 'z', fijo: 0, desde: GRUESO, hasta: W - GRUESO, y0, H, vanos: vanos.i, m: mt });
  muro(p, { eje: 'z', fijo: L - GRUESO, desde: GRUESO, hasta: W - GRUESO, y0, H, vanos: vanos.d, m: mt });
  for (const t of tabiques) {
    const horizontal = t.z1 === t.z2;
    if (horizontal) p.push(caja(Math.min(t.x1, t.x2), y0, t.z1, Math.abs(t.x2 - t.x1), H, 8, 'machi'));
    else p.push(caja(t.x1, y0, Math.min(t.z1, t.z2), 8, H, Math.abs(t.z2 - t.z1), 'machi'));
  }
  p.push(caja(0, y0 + H - 2, 0, L, 2, W, 'machi'));
  const Ht = y0 + H;
  const e = 8;
  if (techo === 'dos' && cumbrera === 'z') {
    const R = alzada ?? L * 0.3;
    const s = R / (L / 2);
    const yA = Ht - alero * s;
    const largoT = W + 2 * alero + (porche ? terraza : 0);
    p.push(perfil([[-alero, yA], [L / 2, Ht + R], [L / 2, Ht + R + e], [-alero, yA + e]], -alero, largoT, mtecho));
    p.push(perfil([[L + alero, yA], [L / 2, Ht + R], [L / 2, Ht + R + e], [L + alero, yA + e]], -alero, largoT, mtecho));
    p.push(perfil([[0, Ht], [L / 2, Ht + R], [L, Ht]], W - GRUESO, GRUESO, mt));
    p.push(perfil([[0, Ht], [L / 2, Ht + R], [L, Ht]], 0, GRUESO, mt));
    p.push(caja(L / 2 - 6, Ht + R - 4, -alero, 12, 10, largoT, 'pino', 'Cumbrera'));
  } else if (techo === 'dos') {
    const R = alzada ?? W * 0.3;
    const s = R / (W / 2);
    const yA = Ht - alero * s;
    p.push(perfil([[-alero, yA], [W / 2, Ht + R], [W / 2, Ht + R + e], [-alero, yA + e]], -alero, L + 2 * alero, mtecho, 'x'));
    p.push(perfil([[W + alero, yA], [W / 2, Ht + R], [W / 2, Ht + R + e], [W + alero, yA + e]], -alero, L + 2 * alero, mtecho, 'x'));
    p.push(perfil([[0, Ht], [W / 2, Ht + R], [W, Ht]], 0, GRUESO, mt, 'x'));
    p.push(perfil([[0, Ht], [W / 2, Ht + R], [W, Ht]], L - GRUESO, GRUESO, mt, 'x'));
  } else {
    // Un agua: alto adelante ('f') o atrás ('b').
    const R = alzada ?? W * 0.12;
    const s = R / W;
    const atras = alto === 'b';
    const yz = (z) => Ht + (atras ? W - z : z) * s;
    const z0 = -alero;
    const z1 = W + alero + (porche ? terraza : 0);
    p.push(perfil([[z1, yz(z1)], [z0, yz(z0)], [z0, yz(z0) + e], [z1, yz(z1) + e]], -alero, L + 2 * alero, mtecho, 'x'));
    const tri = [[0, Ht], [W, Ht], [atras ? 0 : W, Ht + R]];
    p.push(perfil(tri, 0, GRUESO, mt, 'x'));
    p.push(perfil(tri, L - GRUESO, GRUESO, mt, 'x'));
    p.push(caja(0, Ht, atras ? 0 : W - GRUESO, L, R, GRUESO, mt));
  }
  if (terraza) {
    const n = Math.round(L / 15);
    for (let i = 0; i < n; i++) p.push(caja(i * L / n, piso, W, L / n - 0.6, 2.5, terraza, 'deck'));
    if (porche && techo === 'dos' && cumbrera === 'x') {
      // Techo propio del corredor, a un agua, apoyado en el muro del frente.
      const z0 = W - GRUESO;
      const z1 = W + terraza + 25;
      p.push(perfil([[z0, Ht + 40], [z1, Ht + 12], [z1, Ht + 18], [z0, Ht + 46]], -10, L + 20, mtecho, 'x'));
    }
    if (porche) {
      for (const x of [0, L / 2 - 6, L - 12]) p.push(caja(x, piso + 2.5, W + terraza - 14, 12, H, 12, 'pino', 'Pilar porche'));
      p.push(caja(0, piso + H, W + terraza - 16, L, 16, 7, 'pino', 'Viga porche'));
    }
  }
  return p;
}

// Planta de un edificio (dibujo 2D) a partir de los mismos datos.
export function plantaEdificio({ L, W, puertas = [], ventanas = [], tabiques = [], ambientes = [], terraza = 0 }) {
  const piezas = [];
  const cotas = [];
  const vanosDe = (lado) => [
    ...puertas.filter((v) => v.lado === lado).map((v) => ({ tipo: 'puerta', w: 90, ...v })),
    ...ventanas.filter((v) => v.lado === lado).map((v) => ({ tipo: 'ventana', w: 120, ...v })),
  ].sort((a, b) => a.pos - b.pos);
  const linea = (lado) => {
    const horizontal = lado === 'f' || lado === 'b';
    const fijo = { f: W - GRUESO, b: 0, i: 0, d: L - GRUESO }[lado];
    const [desde, hasta] = horizontal ? [0, L] : [GRUESO, W - GRUESO];
    const rect = (a, b, tipo) => (horizontal
      ? { tipo, x: a, y: fijo, w: b - a, h: GRUESO } : { tipo, x: fijo, y: a, w: GRUESO, h: b - a });
    let c = desde;
    for (const v of vanosDe(lado)) {
      if (v.pos > c) piezas.push(rect(c, v.pos, 'muro'));
      if (v.tipo === 'ventana') piezas.push(rect(v.pos, v.pos + v.w, 'ventana'));
      else {
        const r = v.w;
        if (lado === 'f') piezas.push({ tipo: 'puerta', x: v.pos, y: W - GRUESO, r, a1: 0, a2: -90 });
        if (lado === 'b') piezas.push({ tipo: 'puerta', x: v.pos, y: GRUESO, r, a1: 0, a2: 90 });
        if (lado === 'i') piezas.push({ tipo: 'puerta', x: GRUESO, y: v.pos, r, a1: 90, a2: 0 });
        if (lado === 'd') piezas.push({ tipo: 'puerta', x: L - GRUESO, y: v.pos, r, a1: 90, a2: 180 });
      }
      c = v.pos + v.w;
    }
    if (hasta > c) piezas.push(rect(c, hasta, 'muro'));
  };
  ['b', 'f', 'i', 'd'].forEach(linea);
  for (const t of tabiques) {
    if (t.z1 === t.z2) piezas.push({ tipo: 'muro', x: Math.min(t.x1, t.x2), y: t.z1, w: Math.abs(t.x2 - t.x1), h: 8 });
    else piezas.push({ tipo: 'muro', x: t.x1, y: Math.min(t.z1, t.z2), w: 8, h: Math.abs(t.z2 - t.z1) });
  }
  if (terraza) {
    piezas.push({ tipo: 'madera', x: 0, y: W, w: L, h: terraza });
    piezas.push({ tipo: 'texto', x: L / 2, y: W + terraza / 2 + 8, texto: 'Terraza', chico: true });
  }
  for (const a of ambientes) {
    piezas.push({ tipo: 'texto', x: a.x, y: a.z, texto: a.texto, chico: a.chico });
    if (a.m2) piezas.push({ tipo: 'texto', x: a.x, y: a.z + Math.max(L, W) * 0.05, texto: a.m2, chico: true });
  }
  const off = Math.max(L, W) * 0.08;
  cotas.push({ x1: 0, y1: 0, x2: L, y2: 0, off: -off });
  cotas.push({ x1: L, y1: 0, x2: L, y2: W, off });
  return { nombre: 'Planta', piezas, cotas };
}

// Estructura abierta de pilares y vigas (quinchos, cobertizos, pérgolas, carports).
export function abierto({
  L, W, H = 240, pilar = 12, nx = 2, nz = 2, techo = 'dos', alzada, alero = 30, cabios = 0,
  piso = 0, mtecho = 'techo', pies = true, viga = 18,
}) {
  const p = [];
  if (piso) {
    p.push(caja(0, piso - 15, 0, L, 15, W, 'imp'));
    const n = Math.round(W / 15);
    for (let i = 0; i < n; i++) p.push(caja(0, piso, i * W / n, L, 2.5, W / n - 0.6, 'deck'));
  }
  const y0 = piso ? piso + 2.5 : 0;
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < nz; j++) {
      p.push(caja(i * (L - pilar) / (nx - 1), 0, j * (W - pilar) / (nz - 1), pilar, y0 + H, pilar, 'imp', 'Pilar'));
    }
  }
  const Ht = y0 + H;
  for (const z of [0, W - pilar]) {
    p.push(caja(-alero / 2, Ht, z - 4.1, L + alero, viga, 4.1, 'pino', 'Viga'));
    p.push(caja(-alero / 2, Ht, z + pilar, L + alero, viga, 4.1, 'pino', 'Viga'));
  }
  if (pies) {
    for (let i = 0; i < nx; i++) {
      const x = i * (L - pilar) / (nx - 1) + pilar / 2;
      for (const z of [pilar / 2, W - pilar / 2]) {
        for (const s of (i === 0 ? [1] : i === nx - 1 ? [-1] : [-1, 1])) {
          p.push(girar(caja(x + s * 25 - 3, Ht - 32, z - 2, 6, 60, 4, 'pino', 'Pie de amigo'), 0, 0, s * 45));
        }
      }
    }
  }
  const yb = Ht + viga;
  if (cabios) {
    const n = Math.floor((L + alero) / cabios) + 1;
    for (let i = 0; i < n; i++) p.push(caja(-alero / 2 + i * (L + alero - 5) / (n - 1), yb, -alero, 5, 14, W + 2 * alero, 'pino', 'Cabio'));
    return p;
  }
  const e = 8;
  if (techo === 'dos') {
    const R = alzada ?? W * 0.3;
    const s = R / (W / 2);
    p.push(perfil([[-alero, yb - alero * s], [W / 2, yb + R], [W / 2, yb + R + e], [-alero, yb - alero * s + e]], -alero, L + 2 * alero, mtecho, 'x'));
    p.push(perfil([[W + alero, yb - alero * s], [W / 2, yb + R], [W / 2, yb + R + e], [W + alero, yb - alero * s + e]], -alero, L + 2 * alero, mtecho, 'x'));
    for (const x of [0, L - 4]) p.push(perfil([[0, yb], [W / 2, yb + R], [W, yb], [W / 2, yb + 10]], x, 4, 'pino', 'x'));
  } else {
    const R = alzada ?? W * 0.1;
    const s = R / W;
    p.push(perfil([[W + alero, yb + R + alero * s], [-alero, yb - alero * s], [-alero, yb - alero * s + e], [W + alero, yb + R + alero * s + e]], -alero, L + 2 * alero, mtecho, 'x'));
    const n = Math.max(2, Math.round(L / 60) + 1);
    for (let i = 0; i < n; i++) p.push(perfil([[0, yb], [W, yb + R], [W, yb + R + 3], [0, yb + 3]], i * (L - 5) / (n - 1), 5, 'pino', 'x'));
  }
  return p;
}

// Terraza o plataforma de tablas sobre polines, con baranda opcional.
export function deck({ L, W, h = 50, baranda = false, escalera = 0 }) {
  const p = [];
  const nx = Math.ceil(L / 130) + 1;
  const nz = Math.ceil(W / 130) + 1;
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) p.push(caja(i * (L - 10) / (nx - 1), 0, j * (W - 10) / (nz - 1), 10, h - 17, 10, 'imp', 'Polín'));
  const nv = Math.round(L / 40) + 1;
  for (let i = 0; i < nv; i++) p.push(caja(i * (L - 4.1) / (nv - 1), h - 17, 0, 4.1, 14, W, 'imp', 'Viga'));
  const n = Math.round(W / 14.5);
  for (let i = 0; i < n; i++) p.push(caja(0, h - 3, i * W / n, L, 2.5, W / n - 0.5, 'deck', 'Tabla deck'));
  if (baranda) {
    const np = Math.ceil(L / 150) + 1;
    for (let i = 0; i < np; i++) {
      p.push(caja(i * (L - 9) / (np - 1), h, 0, 9, 95, 9, 'imp', 'Pilar baranda'));
      for (const lado of [0, 1]) if (i < np - 1 || lado === 0) p.push(caja(lado ? L - 9 : 0, h, i * (W - 9) / (np - 1), 9, 95, 9, 'imp', 'Pilar baranda'));
    }
    p.push(caja(-2, h + 95, -2, L + 4, 4, 13, 'imp', 'Pasamanos'));
    for (const x of [-2, L - 11]) p.push(caja(x, h + 95, -2, 13, 4, W + 2, 'imp', 'Pasamanos'));
    const nb = Math.round(L / 12);
    for (let i = 0; i < nb; i++) p.push(caja(i * L / nb + 3, h + 10, 9, 4, 80, 2, 'imp', 'Balaustre'));
  }
  if (escalera) {
    const ne = Math.ceil(h / 18);
    for (let i = 0; i < ne - 1; i++) p.push(caja(L / 2 - escalera / 2, h - 3 - (i + 1) * (h / ne), W + i * 28, escalera, 3, 28, 'deck', 'Peldaño'));
  }
  return p;
}
