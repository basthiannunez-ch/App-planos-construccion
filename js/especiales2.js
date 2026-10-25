// Más modelos 3D con forma propia: juegos infantiles, casas y accesorios para animales,
// y algunos muebles y piezas de jardín que no caben en una familia genérica.

import { caja, perfil, girar, cil, entorno } from './modelos.js';
import { cajon, mesa, mueble, abierto, deck, edificio } from './familias.js';

const g = (r) => (r * 180) / Math.PI;

// Tabla recta entre dos puntos del plano XY (vista de frente), con grosor y fondo dados.
export function tablaXY([x0, y0], [x1, y1], grosor, z, fondo, m = 'pino', n = '') {
  const L = Math.hypot(x1 - x0, y1 - y0);
  return girar(caja((x0 + x1) / 2 - L / 2, (y0 + y1) / 2 - grosor / 2, z, L, grosor, fondo, m, n), 0, 0, g(Math.atan2(y1 - y0, x1 - x0)));
}

// Tabla recta entre dos puntos del plano ZY (vista lateral), a lo ancho desde x.
export function tablaZY([z0, y0], [z1, y1], grosor, x, ancho, m = 'pino', n = '') {
  const L = Math.hypot(z1 - z0, y1 - y0);
  return girar(caja(x, (y0 + y1) / 2 - grosor / 2, (z0 + z1) / 2 - L / 2, ancho, grosor, L, m, n), -g(Math.atan2(y1 - y0, z1 - z0)), 0, 0);
}

// Techo a dos aguas sobre una caja de L × W (cumbrera a lo largo de z), con frontones.
function techoDos(p, { x = 0, z = 0, L, W, y, R, alero = 5, e = 2, m = 'oscuro', mf = 'pino' }) {
  const s = R / (L / 2);
  p.push(perfil([[x - alero, y - alero * s], [x + L / 2, y + R], [x + L / 2, y + R + e], [x - alero, y - alero * s + e]], z - alero, W + 2 * alero, m));
  p.push(perfil([[x + L + alero, y - alero * s], [x + L / 2, y + R], [x + L / 2, y + R + e], [x + L + alero, y - alero * s + e]], z - alero, W + 2 * alero, m));
  for (const zz of [z, z + W - 2]) p.push(perfil([[x, y], [x + L / 2, y + R], [x + L, y]], zz, 2, mf));
}

// Caja cerrada de tablero (cuatro lados, base y techo opcional).
function caja5(p, { x = 0, y = 0, z = 0, L, H, W, t = 2, m = 'pino', techo = false, frente = true }) {
  p.push(caja(x, y, z, L, t, W, m, 'Base'));
  p.push(caja(x, y + t, z, t, H - t, W, m, 'Costado'), caja(x + L - t, y + t, z, t, H - t, W, m, 'Costado'));
  p.push(caja(x + t, y + t, z, L - 2 * t, H - t, t, m, 'Fondo'));
  if (frente) p.push(caja(x + t, y + t, z + W - t, L - 2 * t, H - t, t, m, 'Frente'));
  if (techo) p.push(caja(x, y + H, z, L, t, W, m, 'Techo'));
}

// ---------- Juegos infantiles ----------

// Torre con plataforma, baranda, escalera y resbalín.
export function torreResbalin({ H = 120, L = 120, W = 120, techo = true, muro = false, columpio = false } = {}) {
  const p = [];
  for (const x of [0, L - 9]) for (const z of [0, W - 9]) p.push(caja(x, 0, z, 9, H + (techo ? 140 : 95), 9, 'imp', 'Pilar'));
  for (const x of [9, L - 13.1]) p.push(caja(x, H - 14, 9, 4.1, 14, W - 18, 'imp', 'Viga'));
  for (const z of [9, W - 13.1]) p.push(caja(13.1, H - 14, z, L - 26.2, 14, 4.1, 'imp', 'Cadeneta'));
  const n = Math.round(W / 14.5);
  for (let i = 0; i < n; i++) p.push(caja(0, H, i * W / n, L, 2.5, W / n - 0.5, 'deck', 'Tabla piso'));
  for (const z of [0, W - 9]) p.push(caja(9, H + 85, z + 2, L - 18, 9, 4.1, 'imp', 'Pasamanos'));
  p.push(caja(L - 9, H + 85, 9, 4.1, 9, W - 18, 'imp', 'Pasamanos'));
  for (let i = 0; i < 6; i++) p.push(caja(14 + i * (L - 32) / 5, H + 2.5, W - 9, 4, 82.5, 2, 'imp', 'Balaustre'));
  if (techo) techoDos(p, { L, W, y: H + 140, R: 45, alero: 12, e: 3, m: 'techo', mf: 'imp' });
  // Escalera atrás a la izquierda.
  for (const x of [9, 50]) p.push(tablaZY([-70, 0], [0, H + 2], 9, x, 4.1, 'imp', 'Larguero escalera'));
  const pe = Math.round(H / 25);
  for (let i = 1; i < pe; i++) p.push(caja(13.1, (i * H) / pe - 2, -70 + (i * 70) / pe - 6, 36.9, 2.5, 12, 'imp', 'Peldaño'));
  // Resbalín al frente.
  p.push(tablaZY([W, H + 1], [W + 190, 15], 2, (L - 45) / 2, 45, 'rojo'));
  for (const x of [(L - 45) / 2 - 2, (L + 45) / 2]) p.push(tablaZY([W, H + 10], [W + 190, 24], 18, x, 2, 'rojo'));
  p.push(caja((L - 45) / 2, 0, W + 185, 45, 15, 10, 'imp', 'Taco'));
  if (muro) {
    p.push(girar(caja(L + 2, H / 2 - 10, 10, 2.5, H * 1.15, W - 20, 'tablero', 'Muro escalada'), 0, 0, -12));
    const colores = ['rojo', 'azul', 'verde', 'amarillo'];
    for (let i = 0; i < 12; i++) p.push(caja(L + 6 + (i % 4) * 4, 15 + Math.floor(i / 2) * 18, 18 + ((i * 37) % (W - 40)), 4, 5, 6, colores[i % 4]));
  }
  if (columpio) {
    p.push(caja(L - 9, H + 120, 9, 9, 14, W - 18, 'imp', 'Travesaño columpio'));
    p.push(caja(L, H + 120, W / 2 - 4.5, 250, 14, 9, 'imp', 'Viga columpio'));
    p.push(girar(caja(L + 220, -5, W / 2 - 50, 9, H + 140, 9, 'imp', 'Pata'), 14, 0, 0));
    p.push(girar(caja(L + 220, -5, W / 2 + 41, 9, H + 140, 9, 'imp', 'Pata'), -14, 0, 0));
    for (const x0 of [L + 40, L + 130]) {
      for (const dx of [0, 45]) p.push(caja(x0 + dx, 45, W / 2 - 3, 1, H + 75, 1, 'metal'));
      p.push(caja(x0 - 3, 42, W / 2 - 13, 52, 3, 20, 'imp', 'Asiento'));
    }
  }
  return p;
}

// Balancín (subibaja) con pivote central y manillas.
export function balancin({ L = 300 } = {}) {
  const p = [];
  for (const x of [L / 2 - 30, L / 2 + 21]) p.push(caja(x, 0, -5, 9, 9, 50, 'imp', 'Base'));
  for (const z of [5, 31]) {
    p.push(tablaXY([L / 2 - 30, 9], [L / 2, 45], 9, z, 4.1, 'imp', 'Pata pivote'));
    p.push(tablaXY([L / 2 + 30, 9], [L / 2, 45], 9, z, 4.1, 'imp', 'Pata pivote'));
  }
  p.push(cil(L / 2, 48, 0, 2, 40, 'metal', 'z'));
  p.push(tablaXY([0, 30], [L, 66], 4.1, 9, 22, 'imp', 'Tabla balancín'));
  for (const x of [35, L - 35]) {
    const y = 30 + (36 * x) / L;
    p.push(caja(x - 2, y + 2, 13, 4, 30, 4, 'imp', 'Manilla'));
    p.push(cil(x, y + 28, 2, 1.6, 26, 'metal', 'z'));
    p.push(caja(x - 25, y + 3, 9.5, 18, 6, 21, 'cojin'));
  }
  return p;
}

// Triángulo de escalada (tipo Pikler) plegable.
export function trianguloPikler({ H = 85, B = 90, W = 70 } = {}) {
  const p = [];
  for (const z of [0, W - 2.5]) {
    p.push(tablaXY([0, 0], [B / 2, H], 5, z, 2.5, 'tablero', 'Costado'));
    p.push(tablaXY([B, 0], [B / 2, H], 5, z, 2.5, 'tablero', 'Costado'));
  }
  const n = 6;
  for (let i = 1; i <= n; i++) {
    const y = (i * H) / (n + 1);
    const dx = (y * B) / 2 / H;
    p.push(cil(dx + 1, y, 0, 1.4, W, 'pino', 'z'), cil(B - dx - 1, y, 0, 1.4, W, 'pino', 'z'));
  }
  p.push(cil(B / 2, H - 2, 0, 1.6, W, 'pino', 'z'));
  return p;
}

// Arco de escalada / mecedora (curva de peldaños).
export function arcoPikler({ L = 100, H = 45, W = 60 } = {}) {
  const p = [];
  const R = (L * L / 4 + H * H) / (2 * H);
  const c = H - R;
  const pts = [];
  const n = 9;
  for (let i = 0; i <= n; i++) {
    const x = (i * L) / n - L / 2;
    pts.push([x + L / 2, c + Math.sqrt(R * R - x * x)]);
  }
  for (const z of [0, W - 2.5]) for (let i = 0; i < n; i++) p.push(tablaXY(pts[i], pts[i + 1], 6, z, 2.5, 'tablero', 'Costado'));
  for (let i = 0; i <= n; i++) p.push(cil(pts[i][0], pts[i][1] - 2, 0, 1.4, W, 'pino', 'z'));
  return p;
}

// Muro de escalada con colchoneta.
export function muroEscalada({ L = 240, H = 240 } = {}) {
  const p = [];
  for (const x of [0, L - 9]) {
    p.push(caja(x, 0, 0, 9, H + 10, 9, 'imp', 'Poste'));
    p.push(tablaZY([-110, 0], [0, H * 0.75], 9, x, 9, 'imp', 'Pie de amigo'));
  }
  p.push(caja(9, 10, 9, L - 18, H, 1.8, 'tablero', 'Panel'));
  for (const y of [20, H / 2, H - 10]) p.push(caja(9, y, 4.9, L - 18, 9, 4.1, 'imp', 'Travesaño'));
  const colores = ['rojo', 'azul', 'verde', 'amarillo'];
  for (let i = 0; i < 26; i++) p.push(caja(20 + ((i * 53) % (L - 50)), 25 + ((i * 29) % (H - 40)), 10.8, 6, 5, 4, colores[i % 4]));
  p.push(caja(0, 0, 11, L, 12, 120, 'azul'));
  return p;
}

// Caballete de pintura doble.
export function caballete({ H = 110, L = 60 } = {}) {
  const p = [];
  const a = 22;
  for (const s of [-1, 1]) {
    for (const x of [0, L - 4]) p.push(tablaZY([s * a, 0], [0, H], 4, x, 4, 'pino', 'Pata'));
    p.push(tablaZY([s * a * 0.15, H * 0.85], [s * a * 0.75, H * 0.25], 1.2, 4, L - 8, 'oscuro', 'Pizarra'));
    p.push(caja(4, H * 0.25 - 2, s > 0 ? a * 0.75 - 1 : -a * 0.75 - 7, L - 8, 2, 8, 'pino', 'Bandeja'));
  }
  p.push(caja(0, H * 0.25 - 4, -2, L, 3, 4, 'pino', 'Travesaño'));
  return p;
}

// Tipi de palos con tela.
export function tipi({ B = 140, H = 180 } = {}) {
  const p = [];
  const c = B / 2;
  for (const [x, z] of [[4, 4], [B - 4, 4], [4, B - 4], [B - 4, B - 4]]) p.push(cil(x, 0, z, 2, 6, 'pino'));
  for (const z of [4, B - 4]) {
    p.push(tablaXY([4, 0], [c + (z < c ? -2 : 2), H + 15], 4, z - 2, 4, 'pino', 'Palo'));
    p.push(tablaXY([B - 4, 0], [c + (z < c ? 2 : -2), H + 15], 4, z - 2, 4, 'pino', 'Palo'));
  }
  p.push(perfil([[6, 0], [c, H], [B - 6, 0]], 6, 1, 'tela'));
  p.push(perfil([[6, 0], [c, H], [c - 25, 0]], B - 7, 1, 'tela'));
  p.push(perfil([[c + 25, 0], [c, H], [B - 6, 0]], B - 7, 1, 'tela'));
  p.push(perfil([[6, 0], [c, H], [B - 6, 0]], 6, 1, 'tela', 'x'));
  p.push(perfil([[6, 0], [c, H], [B - 6, 0]], B - 7, 1, 'tela', 'x'));
  p.push(caja(15, 0, 15, B - 30, 6, B - 30, 'cojin'));
  return p;
}

// Casa en el árbol: plataforma sobre 4 postes, casita, baranda y escalera.
export function casaArbol({ L = 200, W = 200, h = 200 } = {}) {
  const p = edificio({ L, W, H: 150, piso: h, alzada: 70, alero: 20, puertas: [{ lado: 'f', pos: L / 2 - 35, w: 70, h: 140 }], ventanas: [{ lado: 'i', pos: W / 2 - 30, w: 60, h: 50, alt: 60 }, { lado: 'd', pos: W / 2 - 30, w: 60, h: 50, alt: 60 }], terraza: 80, pilotes: false });
  for (const x of [0, L - 12]) for (const z of [0, W + 68]) p.push(caja(x, 0, z, 12, h - 20, 12, 'imp', 'Poste'));
  for (const x of [0, L - 9]) p.push(caja(x, h + 2.5, W + 71, 9, 90, 9, 'imp', 'Pilar baranda'));
  p.push(caja(0, h + 88, W + 71, L, 5, 9, 'imp', 'Pasamanos'));
  for (const x of [L + 4, L + 52]) p.push(tablaZY([W + 80 + 120, 0], [W + 30, h + 3], 9, x, 4.1, 'imp', 'Larguero escalera'));
  const pe = Math.round(h / 25);
  for (let i = 1; i < pe; i++) p.push(caja(L + 8, (i * h) / pe - 1, W + 200 - (i * 170) / pe - 6, 44, 2.5, 13, 'imp', 'Peldaño'));
  p.push(entorno(cil(L / 2, 0, -60, 25, h + 260, 'oscuro')));
  return p;
}

// Mesa de agua y arena: mesa con dos bandejas.
export function mesaAguaArena({ L = 110, W = 60, H = 55 } = {}) {
  const p = mesa({ L, W, H, pata: 5, cub: 2, fald: 0, vuelo: 0, repisa: 15, m: 'imp' });
  p.shift();
  for (const [x, z, w, d] of [[0, 0, L, 2], [0, W - 2, L, 2], [0, 2, 2, W - 4], [L - 2, 2, 2, W - 4], [L / 2 - 1, 2, 2, W - 4]]) p.push(caja(x, H - 14, z, w, 14, d, 'imp', 'Borde'));
  p.push(caja(2, H - 14, 2, L / 2 - 3, 2, W - 4, 'imp', 'Fondo'), caja(L / 2 + 1, H - 14, 2, L / 2 - 3, 2, W - 4, 'imp', 'Fondo'));
  p.push(caja(3, H - 12, 3, L / 2 - 5, 7, W - 6, 'arena'));
  p.push(caja(L / 2 + 2, H - 12, 3, L / 2 - 5, 8, W - 6, 'agua'));
  return p;
}

// Teatro de títeres de mesa o piso, con telón.
export function teatroTiteres({ L = 100, H = 140 } = {}) {
  const p = [];
  const W = 40;
  for (const x of [0, L - 2]) p.push(caja(x, 0, 0, 2, H, W, 'tablero', 'Costado'));
  p.push(caja(2, 0, W - 2, L - 4, H * 0.55, 2, 'tablero', 'Frente'));
  p.push(caja(2, H - 25, W - 2, L - 4, 25, 2, 'tablero', 'Frente'));
  p.push(caja(2, H * 0.55, W - 6, L - 4, 2, 8, 'tablero', 'Repisa'));
  p.push(caja(2, H - 2, 0, L - 4, 2, W, 'tablero', 'Techo'));
  p.push(caja(4, H * 0.55 + 2, W - 5, 18, H * 0.45 - 27, 1, 'rojo'), caja(L - 22, H * 0.55 + 2, W - 5, 18, H * 0.45 - 27, 1, 'rojo'));
  p.push(caja(8, H - 18, W + 0.1, L - 16, 10, 0.5, 'amarillo'));
  return p;
}

// Cocina de barro (mud kitchen): mesón con lavatorio, respaldo y repisas.
export function cocinaBarro({ L = 100, W = 45, H = 60 } = {}) {
  const p = mesa({ L, W, H, pata: 7, cub: 2.5, fald: 9, vuelo: 0, repisa: 15, m: 'imp' });
  p.push(caja(0, H, -3, L, 60, 2, 'imp', 'Respaldo'));
  for (const x of [0, L - 7]) p.push(caja(x, H, -3, 7, 60, 7, 'imp', 'Pata'));
  p.push(caja(0, H + 40, -1, L, 2, 15, 'imp', 'Repisa'));
  p.push(cil(L * 0.3, H + 0.2, W / 2, 13, 2, 'metal'));
  p.push(cil(L * 0.72, H + 0.2, W / 2 - 8, 6, 2, 'fuego'), cil(L * 0.72, H + 0.2, W / 2 + 10, 6, 2, 'fuego'));
  for (let i = 0; i < 3; i++) p.push(caja(10 + i * 12, H + 47, 3, 1, 8, 1, 'metal'));
  return p;
}

// Cocina de juguete de interior: mueble con horno, lavaplatos y respaldo.
export function cocinaJuguete({ L = 90, W = 35, H = 50 } = {}) {
  const p = mueble({ L, W, H, base: 'zocalo', hb: 5, divisiones: [L / 2 - 0.9], frentes: [{ tipo: 'puerta', x: 0, y: 5, w: L / 2 - 0.2, h: H - 5, lado: 'der' }, { tipo: 'puerta', x: L / 2 + 0.2, y: 5, w: L / 2 - 0.2, h: H - 5, lado: 'izq' }] });
  p.push(caja(L / 2 + 6, 14, W + 1.8, L / 2 - 12, 22, 0.4, 'vidrio'));
  p.push(caja(0, H, -2, L, 45, 1.8, 'tablero', 'Respaldo'));
  p.push(caja(0, H + 30, -0.2, L, 1.8, 12, 'tablero', 'Repisa'));
  p.push(cil(L * 0.25, H + 0.1, W / 2, 11, 1.5, 'metal'));
  for (const [x, z] of [[0.62, 0.3], [0.85, 0.3], [0.62, 0.7], [0.85, 0.7]]) p.push(cil(L * x, H + 0.1, W * z, 6, 0.6, 'fuego'));
  p.push(caja(L * 0.25 - 1, H, 2, 2, 18, 2, 'metal'), caja(L * 0.25 - 1, H + 16, 2, 2, 2, 10, 'metal'));
  return p;
}

// Casa de muñecas abierta por delante.
export function casaMunecas({ L = 70, W = 30, H = 70 } = {}) {
  const p = [];
  const t = 1.2;
  p.push(caja(0, 0, 0, L, t, W, 'tablero', 'Base'));
  for (const x of [0, L - t]) p.push(caja(x, t, 0, t, H - t, W, 'tablero', 'Costado'));
  p.push(caja(t, t, 0, L - 2 * t, H - t, 0.5, 'tablero', 'Fondo'));
  p.push(caja(t, H / 2, 0, L - 2 * t, t, W, 'tablero', 'Piso'));
  p.push(caja(L / 2 - t / 2, t, 0, t, H / 2 - t, W, 'tablero', 'División'));
  p.push(perfil([[0, H], [L / 2, H + 32], [L, H]], 0, W, 'tablero'));
  p.push(perfil([[-3, H - 2], [L / 2, H + 33], [L / 2, H + 35], [-3, H]], -2, W + 3, 'rojo'));
  p.push(perfil([[L + 3, H - 2], [L / 2, H + 33], [L / 2, H + 35], [L + 3, H]], -2, W + 3, 'rojo'));
  p.push(caja(L / 2 - 8, H / 2 + 8, 0.5, 16, 12, 0.3, 'vidrio'));
  p.push(caja(8, t, 6, 14, 8, 10, 'azul'), caja(L / 2 + 6, H / 2 + t, 5, 18, 5, 12, 'cojin'));
  return p;
}

// Tren de madera con vagones-banco.
export function trenMadera({ vagones = 2 } = {}) {
  const p = [];
  let x = 0;
  for (let v = 0; v <= vagones; v++) {
    const L = v === 0 ? 70 : 55;
    p.push(caja(x, 12, 0, L, 3, 40, 'imp', 'Base'));
    for (const xx of [x + 10, x + L - 10]) for (const z of [-2, 42]) p.push(cil(xx, 12, z, 11, 3, 'rojo', 'z'));
    if (v === 0) {
      p.push(caja(x + 30, 15, 2, 38, 45, 36, 'imp', 'Cabina'));
      p.push(caja(x + 26, 60, 0, 46, 3, 40, 'rojo', 'Techo'));
      p.push(cil(x + 12, 15, 20, 9, 30, 'oscuro'));
      p.push(caja(x + 2, 15, 6, 28, 18, 28, 'imp', 'Caldera'));
    } else {
      cajon({ L: L - 6, W: 36, H: 25, tabla: 12, esp: 2, poste: 4, m: 'imp' }).forEach((q) => p.push({ ...q, x: q.x + x + 3, y: q.y + 15, z: q.z + 2 }));
    }
    x += L + 8;
  }
  return p;
}

// Barra de equilibrio baja.
export function barraEquilibrio({ L = 240 } = {}) {
  const p = [caja(0, 12, 0, L, 9, 9, 'imp', 'Viga')];
  for (const x of [10, L / 2 - 4.5, L - 19]) {
    p.push(caja(x, 0, -20, 9, 4.1, 49, 'imp', 'Pie'));
    p.push(caja(x, 4.1, -2, 9, 8, 13, 'imp', 'Taco'));
  }
  return p;
}

// Escalera de aprendizaje (torre de cocina para niños).
export function torreAprendizaje({ L = 45, W = 50, H = 90 } = {}) {
  const p = [];
  for (const x of [0, L - 1.8]) {
    p.push(caja(x, 0, 0, 1.8, 52, W, 'tablero', 'Costado'));
    p.push(caja(x, 52, 0, 1.8, H - 52, 8, 'tablero', 'Montante'), caja(x, 52, W - 22, 1.8, H - 52, 8, 'tablero', 'Montante'));
  }
  p.push(caja(1.8, 20, 6, L - 3.6, 1.8, W - 6, 'tablero', 'Peldaño'));
  p.push(caja(1.8, 45, 2, L - 3.6, 1.8, W - 14, 'tablero', 'Plataforma'));
  p.push(caja(1.8, 0, W - 10, L - 3.6, 8, 1.8, 'tablero', 'Travesaño'));
  for (const y of [H - 8, H - 30]) p.push(cil(1.8, y, 3, 1.4, L - 3.6, 'pino', 'x'), cil(1.8, y, W - 18, 1.4, L - 3.6, 'pino', 'x'));
  p.push(caja(1.8, H - 12, 0, L - 3.6, 10, 1.8, 'tablero', 'Respaldo'));
  return p;
}

// Librero frontal infantil (portadas a la vista).
export function libreroFrontal({ L = 80, H = 100 } = {}) {
  const p = [];
  for (const x of [0, L - 1.8]) p.push(perfil([[0, 0], [30, 0], [30, 8], [12, H], [0, H]], x, 1.8, 'tablero', 'x'));
  for (let i = 0; i < 4; i++) {
    const y = 10 + i * (H - 15) / 4;
    const z = 30 - 18 * (y / H) - 2;
    p.push(caja(1.8, y, 1, L - 3.6, 1.8, z, 'tablero', 'Repisa'));
    p.push(caja(1.8, y, z, L - 3.6, 8, 1.2, 'tablero', 'Borde'));
  }
  p.push(caja(1.8, 0, -0.4, L - 3.6, H, 0.4, 'tablero'));
  const col = ['rojo', 'azul', 'verde', 'amarillo'];
  for (let i = 0; i < 4; i++) p.push(girar(caja(5 + i * 17, 12 + (i % 2) * 21, 14, 14, 18, 1, col[i]), -12, 0, 0));
  return p;
}

// Pizarra y franelógrafo de pie.
export function pizarraPie({ L = 80, H = 120 } = {}) {
  const p = [];
  for (const x of [0, L - 4]) {
    p.push(caja(x, 0, 0, 4, H, 4, 'pino', 'Pata'));
    p.push(caja(x - 10, 0, -20, 24, 4, 44, 'pino', 'Pie'));
  }
  p.push(caja(4, H * 0.3, 1, L - 8, H * 0.65, 1.2, 'oscuro', 'Pizarra'));
  p.push(caja(4, H * 0.3 - 3, -2, L - 8, 3, 9, 'pino', 'Bandeja'));
  p.push(caja(4, 15, 0, L - 8, 4, 4, 'pino', 'Travesaño'));
  return p;
}

// Columpio doble con asiento de disco y asiento tabla.
export function columpioDisco({ L = 260 } = {}) {
  const p = [caja(-10, 200, 70, L + 20, 14, 9, 'imp', 'Viga superior')];
  for (const x of [0, L - 9]) {
    p.push(girar(caja(x, -5, 40, 9, 220, 9, 'imp', 'Pata'), 16, 0, 0));
    p.push(girar(caja(x, -5, 101, 9, 220, 9, 'imp', 'Pata'), -16, 0, 0));
  }
  p.push(caja(L * 0.3, 45, 74, 1, 155, 1, 'metal'));
  p.push(cil(L * 0.3, 40, 74, 18, 4, 'imp'));
  for (const dx of [0, 45]) p.push(caja(L * 0.62 + dx, 45, 74, 1, 155, 1, 'metal'));
  p.push(caja(L * 0.62 - 3, 42, 64, 52, 3, 20, 'imp', 'Asiento'));
  return p;
}

// ---------- Animales ----------

// Casita de pájaros (nido) con tamaño y agujero a elección, sobre poste o colgada.
export function nido({ L = 15, W = 15, H = 22, agujero = 3.2, poste = 0, muro = false, m = 'pino', mt = 'oscuro', abierto: frenteAbierto = false } = {}) {
  const p = [];
  const y0 = poste;
  if (poste) p.push(caja(L / 2 - 3.5, 0, W / 2 - 3.5, 7, poste, 7, 'imp', 'Poste'));
  if (muro) p.push(entorno(caja(-30, y0 - 40, -3, L + 60, H + 90, 3, 'pared')));
  caja5(p, { x: 0, y: y0, z: 0, L, H, W, t: 1.8, m, frente: false });
  if (frenteAbierto) p.push(caja(1.8, y0 + 1.8, W - 1.8, L - 3.6, H * 0.4, 1.8, m, 'Frente'));
  else {
    p.push(caja(1.8, y0 + 1.8, W - 1.8, L - 3.6, H - 1.8, 1.8, m, 'Frente'));
    p.push(cil(L / 2, y0 + H * 0.7, W - 0.2, agujero / 2, 0.4, 'fuego', 'z'));
    p.push(cil(L / 2, y0 + H * 0.45, W, 0.5, 5, 'pino', 'z'));
  }
  techoDos(p, { L, W, y: y0 + H, R: L * 0.45, alero: 4, e: 1.8, m: mt, mf: m });
  return p;
}

// Casa para murciélagos: caja plana y alta con rampa de aterrizaje.
export function casaMurcielagos() {
  const p = [entorno(caja(-20, 0, -3, 100, 160, 3, 'pared'))];
  p.push(caja(0, 60, 0, 60, 70, 1.8, 'pino', 'Fondo'));
  p.push(caja(0, 70, 0, 1.8, 60, 8, 'pino', 'Costado'), caja(58.2, 70, 0, 1.8, 60, 8, 'pino', 'Costado'));
  p.push(caja(0, 75, 8, 60, 55, 1.8, 'pino', 'Frente'));
  p.push(caja(-3, 130, -1, 66, 1.8, 13, 'oscuro', 'Techo'));
  for (let i = 0; i < 4; i++) p.push(caja(4, 62 + i * 3, 1.8, 52, 0.4, 0.4, 'oscuro'));
  return p;
}

// Comedero tolva: depósito con frente de vidrio y bandeja.
export function comederoTolva({ poste = 140 } = {}) {
  const p = [caja(14, 0, 14, 7, poste, 7, 'imp', 'Poste')];
  p.push(caja(0, poste, 0, 35, 2, 35, 'pino', 'Bandeja'));
  for (const [x, z, w, d] of [[0, 0, 35, 2], [0, 33, 35, 2]]) p.push(caja(x, poste + 2, z, w, 3, d, 'pino', 'Borde'));
  p.push(caja(4, poste + 2, 8, 2, 25, 19, 'pino', 'Costado'), caja(29, poste + 2, 8, 2, 25, 19, 'pino', 'Costado'));
  p.push(caja(6, poste + 4, 8, 23, 23, 0.4, 'vidrio'), caja(6, poste + 4, 26.6, 23, 23, 0.4, 'vidrio'));
  p.push(caja(6, poste + 2, 9, 23, 15, 17, 'arena'));
  techoDos(p, { x: 0, z: 2, L: 35, W: 31, y: poste + 27, R: 12, alero: 4, e: 2, m: 'oscuro', mf: 'pino' });
  return p;
}

// Bebedero / bañera de aves sobre pedestal de madera.
export function bebederoAves() {
  const p = [caja(-15, 0, -15, 30, 4, 30, 'imp', 'Base')];
  p.push(caja(-6, 4, -6, 12, 80, 12, 'imp', 'Pedestal'));
  p.push(caja(-22, 84, -22, 44, 3, 44, 'imp', 'Plato'));
  for (const [x, z, w, d] of [[-22, -22, 44, 3], [-22, 19, 44, 3], [-22, -19, 3, 38], [19, -19, 3, 38]]) p.push(caja(x, 87, z, w, 5, d, 'imp', 'Borde'));
  p.push(caja(-19, 87, -19, 38, 3.5, 38, 'agua'));
  p.push(caja(-5, 90, -8, 6, 2, 4, 'piedra'));
  return p;
}

// Rascador para gatos en torre, con plataformas, casita y postes con cuerda.
export function rascador({ H = 150, L = 60, W = 50 } = {}) {
  const p = [caja(0, 0, 0, L, 2, W, 'tablero', 'Base')];
  caja5(p, { x: 2, y: 2, z: 2, L: 38, H: 32, W: 36, t: 1.5, m: 'tablero', techo: true, frente: false });
  p.push(caja(3.5, 3.5, 36.5, 35, 30, 1.5, 'tablero', 'Frente'));
  p.push(cil(21, 12, 38.1, 9, 0.3, 'fuego', 'z'));
  const postes = [[50, 10, H * 0.55], [50, 40, H], [10, 44, H * 0.8]];
  for (const [x, z, h] of postes) p.push(cil(x, 2, z, 4.5, h - 2, 'cojin'));
  p.push(caja(32, H * 0.55, 0, 28, 2, 26, 'tablero', 'Plataforma'));
  p.push(caja(0, H * 0.8, 28, 30, 2, 26, 'tablero', 'Plataforma'));
  p.push(caja(30, H, 25, 30, 2, 28, 'tablero', 'Plataforma'));
  p.push(caja(32, H * 0.55 + 2, 2, 24, 3, 22, 'manta'), caja(31, H + 2, 26, 28, 4, 26, 'manta'));
  p.push(caja(4, 36, 4, 34, 3, 32, 'manta'));
  return p;
}

// Repisas de escalada para gatos en el muro.
export function repisasGato() {
  const p = [entorno(caja(-20, 0, -3, 220, 250, 3, 'pared'))];
  const pasos = [[0, 40], [45, 75], [10, 110], [60, 140], [110, 165], [150, 195]];
  pasos.forEach(([x, y], i) => {
    const w = i === 5 ? 50 : 35;
    p.push(caja(x, y, 0, w, 2.5, 25, 'pino', 'Repisa'));
    p.push(caja(x + 4, y - 15, 0, 2.5, 15, 15, 'pino', 'Escuadra'), caja(x + w - 6.5, y - 15, 0, 2.5, 15, 15, 'pino', 'Escuadra'));
    p.push(caja(x + 1, y + 2.5, 1, w - 2, 1, 23, 'manta'));
  });
  p.push(cil(130, 0, 15, 5, 160, 'cojin'));
  return p;
}

// Cama para perro o gato con patas y cojín.
export function camaMascota({ L = 90, W = 65, H = 25 } = {}) {
  const p = [];
  for (const x of [0, L - 5]) for (const z of [0, W - 5]) p.push(caja(x, 0, z, 5, 10, 5, 'pino', 'Pata'));
  p.push(caja(0, 10, 0, L, 2, W, 'tablero', 'Base'));
  p.push(caja(0, 12, 0, L, H - 2, 2, 'pino', 'Respaldo'));
  for (const x of [0, L - 2]) p.push(caja(x, 12, 2, 2, H - 8, W - 2, 'pino', 'Costado'));
  p.push(caja(2, 12, W - 2, L - 4, 8, 2, 'pino', 'Frente'));
  p.push(caja(3, 12, 3, L - 6, 10, W - 6, 'manta'));
  return p;
}

// Comedero elevado con dos platos.
export function comederoElevado({ L = 60, W = 30, H = 30 } = {}) {
  const p = mesa({ L, W, H, pata: 4, cub: 2, fald: 6, vuelo: 1 });
  for (const x of [L * 0.27, L * 0.73]) p.push(cil(x, H - 6, W / 2, 9, 8, 'metal'));
  return p;
}

// Caseta para gatos de exterior, aislada y elevada.
export function casetaGato() {
  const p = [];
  for (const x of [0, 55]) for (const z of [0, 40]) p.push(caja(x, 0, z, 5, 15, 5, 'imp', 'Pata'));
  caja5(p, { x: 0, y: 15, z: 0, L: 60, H: 42, W: 45, t: 2, m: 'pino', frente: false });
  p.push(caja(2, 17, 43, 18, 40, 2, 'tinglado'), caja(40, 17, 43, 18, 40, 2, 'tinglado'), caja(20, 39, 43, 20, 18, 2, 'tinglado'));
  p.push(caja(4, 17, 4, 52, 6, 37, 'manta'));
  techoDos(p, { L: 60, W: 45, y: 57, R: 20, alero: 6, e: 2, m: 'techo', mf: 'tinglado' });
  return p;
}

// Mueble que esconde el arenero del gato.
export function muebleArenero({ L = 80, W = 50, H = 55 } = {}) {
  const p = mueble({ L, W, H, base: 'zocalo', hb: 4, sobre: 2.8, frentes: [{ tipo: 'puerta', x: 0, y: 4, w: L / 2 - 0.2, h: H - 7, lado: 'der' }, { tipo: 'puerta', x: L / 2 + 0.2, y: 4, w: L / 2 - 0.2, h: H - 7, lado: 'izq' }] });
  p.push(cil(-0.2, 18, W / 2, 9, 0.5, 'fuego', 'x'));
  p.push(caja(4, 6, 6, L - 20, 14, W - 12, 'azul'));
  return p;
}

// Colmena tipo Langstroth sobre soporte.
export function colmena({ alzas = 2 } = {}) {
  const p = [];
  for (const x of [0, 40]) for (const z of [0, 45]) p.push(caja(x, 0, z, 6, 40, 6, 'imp', 'Pata'));
  p.push(caja(-3, 40, -3, 52, 2.5, 57, 'imp', 'Base'));
  let y = 42.5;
  for (let i = 0; i <= alzas; i++) {
    const h = i === 0 ? 24 : 17;
    p.push(caja(1, y, 1, 44, h, 2, 'pino', 'Alza'), caja(1, y, 48, 44, h, 2, 'pino', 'Alza'));
    p.push(caja(1, y, 3, 2, h, 45, 'pino', 'Alza'), caja(43, y, 3, 2, h, 45, 'pino', 'Alza'));
    p.push(caja(-1, y + h / 2, 10, 2, 2, 30, 'pino', 'Manilla'), caja(45, y + h / 2, 10, 2, 2, 30, 'pino', 'Manilla'));
    y += h;
  }
  p.push(caja(-2, y, -2, 50, 6, 56, 'zinc', 'Techo'));
  p.push(caja(15, 42.5, 50, 16, 1.5, 1, 'fuego'));
  return p;
}

// Hotel de insectos: marco con techo y compartimentos rellenos.
export function hotelInsectos({ L = 60, H = 90 } = {}) {
  const p = [caja(L / 2 - 4, 0, 6, 8, 60, 8, 'imp', 'Poste')];
  const y0 = 55;
  caja5(p, { x: 0, y: y0, z: 0, L, H: H - 5, W: 20, t: 2, m: 'imp', techo: false, frente: false });
  for (const y of [y0 + 25, y0 + 50]) p.push(caja(2, y, 0, L - 4, 2, 20, 'imp', 'Repisa'));
  p.push(caja(L / 2 - 1, y0 + 2, 0, 2, 23, 20, 'imp', 'División'));
  for (let i = 0; i < 18; i++) p.push(cil(5 + (i % 6) * 4, y0 + 5 + Math.floor(i / 6) * 6.5, 2, 2, 17, 'oscuro', 'z'));
  for (let i = 0; i < 4; i++) p.push(caja(L / 2 + 2, y0 + 3 + i * 5.5, 2, L / 2 - 4, 4, 17, 'piedra'));
  for (let i = 0; i < 8; i++) p.push(caja(3 + i * 7, y0 + 28, 2, 6, 20, 17, i % 2 ? 'imp' : 'arena'));
  for (let i = 0; i < 12; i++) p.push(cil(4 + (i % 6) * 9, y0 + 56 + Math.floor(i / 6) * 9, 2, 4, 17, 'pino', 'z'));
  techoDos(p, { L, W: 20, y: y0 + H - 5, R: 18, alero: 5, e: 2, m: 'zinc', mf: 'imp' });
  return p;
}

// Gallinero móvil (tractor) triangular con ruedas.
export function gallineroMovil({ L = 240, W = 120, H = 110 } = {}) {
  const p = [];
  for (const x of [0, L - 5]) {
    p.push(tablaZY([0, 0], [W / 2, H], 5, x, 5, 'imp', 'Par'));
    p.push(tablaZY([W, 0], [W / 2, H], 5, x, 5, 'imp', 'Par'));
  }
  for (const z of [0, W - 5]) p.push(caja(0, 0, z, L, 5, 5, 'imp', 'Base'));
  p.push(caja(0, H - 5, W / 2 - 2.5, L, 5, 5, 'imp', 'Cumbrera'));
  p.push(tablaZY([0, 1], [W / 2, H + 1], 0.5, 5, L * 0.55, 'malla'), tablaZY([W, 1], [W / 2, H + 1], 0.5, 5, L * 0.55, 'malla'));
  p.push(tablaZY([0, 2], [W / 2, H + 2], 1.5, L * 0.55, L * 0.45, 'tinglado'), tablaZY([W, 2], [W / 2, H + 2], 1.5, L * 0.55, L * 0.45, 'tinglado'));
  p.push(caja(L * 0.58, H * 0.4, W / 2 - 30, L * 0.38, 2, 60, 'imp', 'Piso dormidero'));
  for (const z of [-6, W + 3]) p.push(cil(L - 15, 15, z, 15, 3, 'fuego', 'z'));
  p.push(caja(-40, 25, W / 2 - 20, 42, 4, 4, 'imp', 'Manilla'), caja(-40, 25, W / 2 + 16, 42, 4, 4, 'imp', 'Manilla'));
  return p;
}

// Nidales para gallinas: fila de compartimentos con techo inclinado.
export function nidales({ n = 3 } = {}) {
  const p = [];
  const a = 32;
  const L = n * a + 2;
  for (const x of [0, L - 5]) for (const z of [0, 35]) p.push(caja(x, 0, z, 5, 50, 5, 'imp', 'Pata'));
  p.push(caja(0, 50, 0, L, 2, 40, 'pino', 'Base'));
  p.push(caja(0, 52, 0, L, 35, 2, 'pino', 'Fondo'));
  for (let i = 0; i <= n; i++) p.push(caja(i * a, 52, 2, 2, 35, 38, 'pino', 'División'));
  p.push(caja(0, 52, 38, L, 10, 2, 'pino', 'Frente'));
  p.push(tablaZY([0, 87], [44, 75], 1.8, -2, L + 4, 'zinc', 'Techo'));
  p.push(caja(0, 40, 40, L, 3, 5, 'pino', 'Percha'));
  for (let i = 0; i < n; i++) p.push(caja(i * a + 5, 52, 8, a - 8, 5, 26, 'arena'));
  return p;
}

// Percha para loros y aves grandes.
export function perchaAves() {
  const p = [caja(0, 0, 0, 60, 3, 50, 'tablero', 'Base'), caja(4, 3, 4, 52, 3, 42, 'tablero', 'Bandeja')];
  p.push(caja(27, 6, 22, 6, 120, 6, 'pino', 'Poste'));
  for (const [y, L] of [[80, 50], [126, 60]]) p.push(cil(30 - L / 2, y, 25, 1.6, L, 'pino', 'x'));
  p.push(cil(10, 82, 25, 4, 4, 'metal'), cil(50, 82, 25, 4, 4, 'metal'));
  return p;
}

// Rampa para perros con travesaños y patas plegables.
export function rampaPerro({ L = 150, W = 40, H = 55 } = {}) {
  const p = [tablaZY([0, 2], [L, H], 2, 0, W, 'tablero', 'Rampa')];
  const n = 8;
  for (let i = 1; i < n; i++) p.push(caja(2, 2 + (i * (H - 2)) / n + 1.5, (i * L) / n - 2, W - 4, 1.5, 3, 'pino', 'Listón'));
  for (const x of [-2, W]) p.push(tablaZY([0, 0], [L, H - 3], 6, x, 2, 'pino', 'Larguero'));
  for (const x of [2, W - 6]) p.push(caja(x, 0, L - 10, 4, H - 4, 4, 'pino', 'Pata'));
  p.push(caja(4, 10, L - 9, W - 8, 4, 2, 'pino', 'Travesaño'));
  return p;
}

// Comedero de heno en V para conejos y cabras.
export function comederoHeno({ L = 60 } = {}) {
  const p = [];
  for (const x of [0, L - 2]) p.push(perfil([[0, 0], [25, 0], [25, 40], [12.5, 10], [0, 40]], x, 2, 'pino', 'x'));
  p.push(caja(0, 0, 0, L, 2, 25, 'pino', 'Base'));
  for (let i = 0; i < 7; i++) {
    const x = 4 + i * (L - 8) / 6;
    p.push(tablaZY([12.5, 10], [0, 40], 1.5, x, 2, 'pino', 'Listón'));
    p.push(tablaZY([12.5, 10], [25, 40], 1.5, x, 2, 'pino', 'Listón'));
  }
  p.push(caja(2, 12, 3, L - 4, 20, 19, 'verde'));
  return p;
}

// Caseta para patos: baja, con rampa hacia el agua.
export function casaPatos() {
  const p = [];
  caja5(p, { x: 0, y: 10, z: 0, L: 100, H: 55, W: 70, t: 2, m: 'pino', frente: false });
  p.push(caja(2, 12, 68, 30, 53, 2, 'tinglado'), caja(68, 12, 68, 30, 53, 2, 'tinglado'), caja(32, 50, 68, 36, 15, 2, 'tinglado'));
  for (const x of [0, 95]) for (const z of [0, 65]) p.push(caja(x, 0, z, 5, 10, 5, 'imp', 'Taco'));
  p.push(tablaZY([70, 11], [140, 0], 2, 35, 30, 'imp', 'Rampa'));
  for (let i = 1; i < 6; i++) p.push(caja(37, 11 - i * 2 + 1.5, 70 + i * 11, 26, 1.5, 2, 'imp', 'Listón'));
  p.push(tablaZY([-10, 72], [85, 62], 2, -8, 116, 'techo', 'Techo'));
  p.push(entorno(caja(-40, -1, 135, 200, 1, 120, 'agua')));
  return p;
}

// Terrario / jaula para roedores con frente de vidrio sobre mueble.
export function terrario({ L = 100, W = 50 } = {}) {
  const p = mueble({ L, W, H: 70, base: 'zocalo', hb: 6, repisas: [38], fondo: true });
  const y = 70;
  p.push(caja(0, y, 0, L, 1.8, W, 'tablero', 'Base'));
  for (const x of [0, L - 1.8]) p.push(caja(x, y + 1.8, 0, 1.8, 50, W, 'tablero', 'Costado'));
  p.push(caja(1.8, y + 1.8, 0, L - 3.6, 50, 1.8, 'tablero', 'Fondo'));
  p.push(caja(1.8, y + 1.8, W - 0.6, L - 3.6, 50, 0.6, 'vidrio'));
  p.push(caja(0, y + 51.8, 0, L, 1.8, W, 'malla'));
  p.push(caja(2, y + 1.8, 2, L - 4, 6, W - 4, 'arena'));
  p.push(caja(L - 30, y + 7.8, 8, 22, 15, 20, 'pino', 'Casita'));
  return p;
}

// Corral con caseta para cabras, ovejas o alpacas.
export function corralCabras({ L = 400, W = 300 } = {}) {
  const p = edificio({ L: 200, W: 150, H: 160, techo: 'uno', alzada: 30, alero: 20, piso: 0, sinPiso: true, puertas: [{ lado: 'f', pos: 60, w: 80, h: 140 }] });
  const postes = [];
  for (let i = 0; i <= 4; i++) postes.push([i * L / 4, W + 150], [i * L / 4, 150]);
  for (let j = 1; j < 3; j++) postes.push([0, 150 + j * W / 3], [L, 150 + j * W / 3]);
  for (const [x, z] of postes) p.push(caja(x - 5, 0, z - 5, 10, 120, 10, 'imp', 'Poste'));
  for (const y of [30, 70, 110]) {
    p.push(caja(0, y, W + 150 - 2, L, 9, 2.5, 'imp', 'Tabla'));
    p.push(caja(-2.5, y, 150, 2.5, 9, W, 'imp', 'Tabla'), caja(L, y, 150, 2.5, 9, W, 'imp', 'Tabla'));
    p.push(caja(200, y, 150, L - 200, 9, 2.5, 'imp', 'Tabla'));
  }
  return p;
}

// Barrera de madera para escaleras o puertas (mascotas o niños).
export function barreraMascotas({ L = 90, H = 75 } = {}) {
  const p = [entorno(caja(-12, 0, -10, 12, 220, 30, 'pared')), entorno(caja(L, 0, -10, 12, 220, 30, 'pared'))];
  for (const x of [0, L - 6]) p.push(caja(x, 0, 0, 6, H, 3, 'pino', 'Marco'));
  for (const y of [5, H - 9]) p.push(caja(0, y, 3, L, 7, 2, 'pino', 'Travesaño'));
  const n = Math.floor((L - 12) / 8.5);
  for (let i = 0; i < n; i++) p.push(caja(8 + i * 8.5, 7, 1, 3.5, H - 9, 2, 'pino', 'Barrote'));
  for (const y of [15, H - 15]) p.push(caja(-1, y, 0.5, 2, 6, 2, 'metal'));
  return p;
}

// Hamaca para gato que se cuelga de la ventana o el radiador (marco con tela).
export function hamacaGato() {
  const p = [];
  for (const x of [0, 56]) for (const z of [0, 46]) p.push(caja(x, 0, z, 4, 30, 4, 'pino', 'Pata'));
  for (const z of [0, 46]) p.push(caja(0, 28, z, 60, 4, 4, 'pino', 'Larguero'));
  for (const x of [0, 56]) p.push(caja(x, 28, 4, 4, 4, 42, 'pino', 'Travesaño'));
  for (const x of [0, 56]) p.push(tablaZY([0, 2], [50, 26], 2.5, x, 4, 'pino', 'Diagonal'));
  p.push(caja(4, 24, 4, 52, 4, 42, 'manta'));
  return p;
}

// ---------- Muebles y jardín ----------

// Cuna con barrotes y somier regulable.
export function cuna({ W = 60, L = 120, H = 90 } = {}) {
  const p = [];
  const Lx = L + 10;
  const Wz = W + 10;
  for (const x of [0, Lx - 5]) for (const z of [0, Wz - 5]) p.push(caja(x, 0, z, 5, H, 5, 'pino', 'Poste'));
  for (const y of [25, H - 6]) {
    for (const z of [0.5, Wz - 4.5]) p.push(caja(5, y, z, Lx - 10, 5, 4, 'pino', 'Larguero'));
    for (const x of [0.5, Lx - 4.5]) p.push(caja(x, y, 5, 4, 5, Wz - 10, 'pino', 'Travesaño'));
  }
  const nb = Math.round((Lx - 10) / 8);
  for (const z of [1.5, Wz - 3.5]) for (let i = 0; i < nb; i++) p.push(caja(7 + i * (Lx - 14) / nb, 30, z, 3, H - 36, 2, 'pino', 'Barrote'));
  for (const x of [1, Lx - 4]) p.push(caja(x, 30, 6, 3, H - 36, Wz - 12, 'pino', 'Panel'));
  p.push(caja(5, 28, 5, Lx - 10, 2, Wz - 10, 'tablero', 'Somier'));
  p.push(caja(6, 30, 6, Lx - 12, 10, Wz - 12, 'tela'), caja(8, 40, 8, 30, 6, Wz - 16, 'blanco'));
  return p;
}

// Cabecero de cama de tablas, fijo al muro, con veladores flotantes.
export function cabeceroMuro({ L = 220, H = 110 } = {}) {
  const p = [entorno(caja(-40, 0, -3, L + 80, 260, 3, 'pared'))];
  const n = Math.round(L / 14.5);
  for (let i = 0; i < n; i++) p.push(caja(i * L / n, 30, 0, 14, H, 2, i % 3 ? 'pino' : 'oscuro', 'Tabla'));
  for (const x of [5, L - 50]) p.push(caja(x, 55, 2, 45, 2.8, 35, 'pino', 'Velador'));
  return p;
}

// Arco para rosas o enredaderas.
export function arcoRosas({ L = 120, H = 220, W = 50 } = {}) {
  const p = [];
  for (const x of [0, L - 7]) for (const z of [0, W - 7]) p.push(caja(x, 0, z, 7, H, 7, 'imp', 'Poste'));
  for (const z of [-5, W]) p.push(caja(-20, H, z, L + 40, 14, 5, 'imp', 'Viga'));
  for (let i = 0; i < 5; i++) p.push(caja(-12 + i * (L + 24) / 4, H + 14, -15, 5, 5, W + 30, 'imp', 'Listón'));
  for (const x of [-3, L - 4]) for (let i = 0; i < 6; i++) p.push(caja(x, 30 + i * 30, 7, 7 + (x > 0 ? 0 : 0), 3, W - 14, 'imp', 'Listón'));
  for (let i = 0; i < 8; i++) p.push(cil(i % 2 ? L - 3 : 3, 20 + i * 25, 10 + (i * 13) % 30, 6, 6, 'verde'));
  return p;
}

// Buzón de correo de madera sobre poste.
export function buzon() {
  const p = [caja(15, 0, 10, 9, 110, 9, 'imp', 'Poste'), caja(5, 100, 0, 30, 3, 9, 'imp', 'Brazo')];
  caja5(p, { x: 2, y: 110, z: -15, L: 36, H: 22, W: 45, t: 1.8, m: 'imp' });
  techoDos(p, { x: 2, z: -15, L: 36, W: 45, y: 132, R: 10, alero: 3, e: 1.8, m: 'zinc', mf: 'imp' });
  p.push(caja(8, 124, 30.2, 24, 2, 0.5, 'fuego'));
  return p;
}

// Escalera de jardín en un talud: peldaños de durmiente con estacas.
export function escaleraJardin({ n = 5, ancho = 100 } = {}) {
  const p = [];
  for (let i = 0; i < n; i++) {
    p.push(caja(0, i * 15, i * 35, ancho, 15, 12, 'imp', 'Durmiente'));
    p.push(caja(0, i * 15, i * 35 + 12, ancho, 13, 23, 'arena'));
    if (i) p.push(entorno(caja(-40, 0, i * 35 - 5, ancho + 80, i * 15, 40, 'tierra')));
    for (const x of [8, ancho - 13]) p.push(caja(x, i * 15 - 20, i * 35 - 5, 5, 35, 5, 'imp', 'Estaca'));
  }
  return p;
}

// Soporte para hamaca de tela.
export function soporteHamaca({ L = 360 } = {}) {
  const p = [caja(0, 0, -45, 12, 9, 100, 'imp', 'Base'), caja(L - 12, 0, -45, 12, 9, 100, 'imp', 'Base')];
  p.push(caja(0, 0, 0, L, 12, 9, 'imp', 'Viga base'));
  p.push(tablaXY([10, 9], [70, 160], 9, 0, 9, 'imp', 'Brazo'), tablaXY([L - 10, 9], [L - 70, 160], 9, 0, 9, 'imp', 'Brazo'));
  for (const x of [0, L - 50]) p.push(tablaXY([x + (x ? 50 : 0), 9], [x ? x + 20 : 30, 70], 9, -2, 2, 'imp', 'Pie de amigo'));
  for (let i = 0; i < 10; i++) {
    const t = i / 9;
    const x = 75 + t * (L - 150);
    const y = 140 - Math.sin(t * Math.PI) * 60;
    p.push(caja(x - 12, y, -25, 26, 2, 60, 'cojin'));
  }
  return p;
}

// Letrero de direcciones en un poste.
export function letrero() {
  const p = [caja(0, 0, 0, 9, 200, 9, 'imp', 'Poste')];
  [[20, 150], [-25, 125], [10, 100]].forEach(([dx, y], i) => p.push(girar(caja(dx < 0 ? -60 : 9, y, 2, 60, 14, 2.5, i % 2 ? 'oscuro' : 'imp', 'Tabla'), 0, (i - 1) * 15, 0)));
  p.push(perfil([[-4, 200], [4.5, 210], [13, 200]], -2, 13, 'zinc'));
  return p;
}

// Banca cuadrada alrededor de un árbol.
export function bancaArbol({ L = 200, hueco = 80, H = 45 } = {}) {
  const p = [entorno(cil(L / 2, 0, L / 2, 22, 320, 'oscuro'))];
  const a = (L - hueco) / 2;
  const tramos = [[0, 0, L, a], [0, L - a, L, a], [0, a, a, hueco], [L - a, a, a, hueco]];
  for (const [x, z, w, d] of tramos) {
    const horizontal = w > d;
    const n = Math.round((horizontal ? d : w) / 13);
    for (let i = 0; i < n; i++) {
      if (horizontal) p.push(caja(x, H - 3.5, z + i * d / n, w, 3.5, d / n - 1, 'imp', 'Tabla asiento'));
      else p.push(caja(x + i * w / n, H - 3.5, z, w / n - 1, 3.5, d, 'imp', 'Tabla asiento'));
    }
  }
  for (const [x, z] of [[0, 0], [L - 7, 0], [0, L - 7], [L - 7, L - 7], [a - 7, a - 7], [L - a, a - 7], [a - 7, L - a], [L - a, L - a]]) p.push(caja(x, 0, z, 7, H - 3.5, 7, 'imp', 'Pata'));
  for (const z of [3, L - 10]) p.push(caja(0, H - 12, z, L, 8.5, 4.1, 'imp', 'Travesaño'));
  for (const x of [3, L - 10]) p.push(caja(x, H - 12, 7, 4.1, 8.5, L - 14, 'imp', 'Travesaño'));
  return p;
}

// Cerco de tablas horizontales (moderno).
export function cercoHorizontal({ L = 240, H = 180 } = {}) {
  const p = [caja(0, 0, 0, 9, H + 5, 9, 'imp', 'Poste'), caja(L - 9, 0, 0, 9, H + 5, 9, 'imp', 'Poste'), caja(L / 2 - 4.5, 0, 0, 9, H + 5, 9, 'imp', 'Poste')];
  const n = Math.floor(H / 11.5);
  for (let i = 0; i < n; i++) p.push(caja(0, 5 + i * 11.5, 9, L, 9.5, 2, 'imp', 'Tabla'));
  p.push(caja(-2, H + 5, -1, L + 4, 3, 13, 'imp', 'Remate'));
  return p;
}

// Cama fría (mini invernadero) con tapa de vidrio inclinada.
export function camaFria({ L = 120, W = 60 } = {}) {
  const p = cajon({ L, W, H: 30, tabla: 14, esp: 2.5, poste: 5, m: 'imp' });
  for (const x of [0, L - 2.5]) p.push(perfil([[0, 30], [W, 30], [0, 50]], x, 2.5, 'imp', 'x'));
  p.push(caja(0, 30, 0, L, 20, 2.5, 'imp', 'Tabla lateral larga'));
  p.push(tablaZY([0, 51], [W + 2, 30], 3, 0, L, 'pino', 'Marco tapa'));
  p.push(tablaZY([2, 52.6], [W, 32], 0.4, 3, L - 6, 'vidrio'));
  p.push(caja(3, 2, 3, L - 6, 22, W - 6, 'tierra'));
  for (let i = 0; i < 6; i++) p.push(cil(15 + i * 18, 24, W / 2, 5, 8, 'verde'));
  return p;
}

// Muelle de madera sobre pilotes en un lago.
export function muelle({ L = 600, W = 180 } = {}) {
  const p = [entorno(caja(-150, 0, L * 0.3, W + 300, 1, L, 'agua'))];
  const nz = Math.ceil(L / 200) + 1;
  for (let i = 0; i < nz; i++) for (const x of [0, W - 15]) p.push(cil(x + 7.5, -120, i * (L - 15) / (nz - 1) + 7.5, 7.5, 180, 'imp'));
  for (const x of [-4.1, W]) p.push(caja(x, 40, 0, 4.1, 19, L, 'imp', 'Viga'));
  const nv = Math.round(L / 60) + 1;
  for (let i = 0; i < nv; i++) p.push(caja(0, 40, i * (L - 4.1) / (nv - 1), W, 14, 4.1, 'imp', 'Cadeneta'));
  const n = Math.round(L / 15);
  for (let i = 0; i < n; i++) p.push(caja(-6, 54, i * L / n, W + 12, 3.2, L / n - 0.8, 'deck', 'Tabla deck'));
  for (const z of [L - 30, L - 120]) for (const x of [-10, W + 2]) p.push(caja(x, 57, z, 8, 30, 8, 'imp', 'Bita'));
  return p;
}

// Caballo balancín: dos balancines curvos, asiento, cuello, cabeza y manilla.
export function caballoBalancin() {
  const p = [];
  const L = 100;
  const R = 120;
  const pts = [];
  for (let i = 0; i <= 8; i++) {
    const x = (i * L) / 8 - L / 2;
    pts.push([x + L / 2, R - Math.sqrt(R * R - x * x)]);
  }
  for (const z of [0, 33]) for (let i = 0; i < 8; i++) p.push(tablaXY(pts[i], pts[i + 1], 6, z, 2.5, 'tablero', 'Balancín'));
  for (const x of [22, 70]) p.push(caja(x, 4, 0, 8, 2.5, 35.5, 'tablero', 'Travesaño'));
  for (const x of [26, 70]) for (const z of [2.5, 29]) p.push(caja(x, 6.5, z, 4, 32, 4, 'pino', 'Pata'));
  p.push(caja(20, 38.5, 4, 60, 2.5, 28, 'tablero', 'Asiento'));
  p.push(caja(22, 41, 6, 26, 4, 24, 'cojin'));
  p.push(tablaXY([72, 40], [86, 70], 9, 14, 2.5, 'tablero', 'Cuello'));
  p.push(caja(80, 68, 14, 26, 14, 2.5, 'tablero', 'Cabeza'));
  p.push(cil(84, 62, 4, 1.4, 28, 'pino', 'z'));
  p.push(caja(14, 41, 12, 6, 14, 8, 'oscuro'));
  return p;
}

// Carrito de arrastre (tipo wagon) con baranda de tablas y ruedas.
export function carritoArrastre({ L = 80, W = 45 } = {}) {
  const p = [caja(0, 15, 0, L, 2, W, 'pino', 'Base')];
  for (const y of [17, 27]) {
    for (const z of [0, W - 2]) p.push(caja(0, y, z, L, 8, 2, 'pino', 'Baranda'));
    for (const x of [0, L - 2]) p.push(caja(x, y, 2, 2, 8, W - 4, 'pino', 'Baranda'));
  }
  for (const x of [4, L - 8]) for (const z of [2, W - 6]) p.push(caja(x, 17, z, 4, 18, 4, 'pino', 'Esquinero'));
  for (const x of [12, L - 12]) {
    p.push(caja(x - 2.5, 10, 0, 5, 5, W, 'pino', 'Eje'));
    for (const z of [-3, W]) p.push(cil(x, 9, z, 9, 3, 'fuego', 'z'));
  }
  p.push(tablaXY([L, 16], [L + 50, 40], 3, W / 2 - 1.5, 3, 'pino', 'Lanza'));
  p.push(cil(L + 50, 41, W / 2 - 8, 1.6, 16, 'pino', 'z'));
  return p;
}

// Catio: recinto exterior con malla para gatos, con repisas y rampa.
export function catio({ L = 180, W = 90, H = 180 } = {}) {
  const p = [entorno(caja(-20, 0, -3, L + 40, 260, 3, 'pared'))];
  for (const x of [0, L - 5]) for (const z of [0, W - 5]) p.push(caja(x, 0, z, 5, H, 5, 'pino', 'Pie derecho'));
  for (const y of [0, H - 5]) {
    for (const z of [0, W - 5]) p.push(caja(5, y, z, L - 10, 5, 5, 'pino', 'Solera'));
    for (const x of [0, L - 5]) p.push(caja(x, y, 5, 5, 5, W - 10, 'pino', 'Solera'));
  }
  p.push(caja(L / 2 - 2.5, 0, W - 5, 5, H, 5, 'pino', 'Pie derecho'));
  p.push(caja(0, H, -2, L, 1.8, W + 6, 'zinc', 'Techo'));
  p.push(caja(5, 5, W - 0.5, L - 10, H - 10, 0.3, 'malla'));
  for (const x of [-0.5, L]) p.push(caja(x, 5, 5, 0.5, H - 10, W - 10, 'malla'));
  p.push(caja(5, 60, 0, 50, 2.5, 30, 'pino', 'Repisa'), caja(L - 65, 110, 0, 60, 2.5, 35, 'pino', 'Repisa'));
  p.push(tablaXY([55, 61], [L - 65, 111], 2.5, 10, 20, 'pino', 'Rampa'));
  p.push(caja(20, 5, W - 45, 40, 30, 35, 'pino', 'Casita'));
  return p;
}
