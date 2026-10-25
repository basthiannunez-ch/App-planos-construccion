// Modelos 3D de objetos con forma propia (no caben en una familia genérica).

import { caja, perfil, girar, cil, entorno } from './modelos.js';
import { cama, cajon, mesa } from './familias.js';

// Mesa de picnic con patas en A y bancas integradas.
export function picnic({ L = 180, m = 'imp' } = {}) {
  const p = [];
  for (let i = 0; i < 4; i++) p.push(caja(0, 71, 45 + i * 15, L, 4.1, 14, m, 'Tabla cubierta'));
  for (const z0 of [0, 122]) for (let i = 0; i < 2; i++) p.push(caja(0, 41, z0 + i * 14.5, L, 4.1, 13.8, m, 'Tabla banca'));
  for (const x of [20, L - 29]) {
    p.push(caja(x, 37, 0, 4.1, 9, 150, m, 'Travesaño banca'));
    p.push(caja(x, 62, 45, 4.1, 9, 60, m, 'Travesaño cubierta'));
    p.push(girar(caja(x + 4.1, -2, 35, 4.1, 80, 9, m, 'Pata'), 22, 0, 0));
    p.push(girar(caja(x + 4.1, -2, 106, 4.1, 80, 9, m, 'Pata'), -22, 0, 0));
  }
  p.push(caja(29, 30, 71, L - 58, 9, 4.1, m, 'Riostra'));
  return p;
}

// Silla Adirondack: asiento inclinado, respaldo alto en abanico y brazos anchos.
export function adirondack({ m = 'imp' } = {}) {
  const p = [];
  for (const x of [0, 62]) {
    p.push(girar(caja(x, 22, 5, 4, 9, 85, m, 'Larguero'), -12, 0, 0));
    p.push(caja(x, 0, 70, 4, 55, 9, m, 'Pata delantera'));
    p.push(caja(x - 4, 55, 30, 12, 2, 70, m, 'Brazo'));
    p.push(caja(x, 30, 32, 4, 25, 6, m, 'Soporte brazo'));
  }
  for (let i = 0; i < 6; i++) p.push(girar(caja(4, 36 - i * 1.4, 18 + i * 9.5, 58, 2, 8.5, m, 'Tabla asiento'), -8, 0, 0));
  const tablas = 7;
  for (let i = 0; i < tablas; i++) {
    const x = 3 + i * 8.6;
    const alto = 85 - Math.abs(i - 3) * 6;
    p.push(girar(caja(x, 28, 12, 8, alto, 2, m, 'Tabla respaldo'), -20, 0, 0));
  }
  p.push(caja(0, 45, 4, 66, 8, 2, m, 'Travesaño respaldo'));
  return p;
}

// Reposera / tumbona con respaldo reclinado y ruedas de madera.
export function tumbona({ m = 'imp' } = {}) {
  const p = [];
  for (const x of [0, 61]) p.push(caja(x, 22, 0, 4, 12, 190, m, 'Larguero'));
  for (const z of [10, 175]) for (const x of [2, 59]) p.push(caja(x, 0, z, 5, 22, 5, m, 'Pata'));
  for (let i = 0; i < 9; i++) p.push(caja(-1, 34, 70 + i * 13.5, 67, 2, 12, m, 'Tabla asiento'));
  // Respaldo inclinado 35° que sube hacia la cabecera (z = 0).
  const inc = (s0, y0, w, h, d, mat, n) => {
    const a = (35 * Math.PI) / 180;
    const cz = 70 - s0 * Math.cos(a);
    const cy = 36 + s0 * Math.sin(a);
    return girar(caja(4, cy - h / 2, cz - d / 2, w, h, d, mat, n), 35, 0, 0);
  };
  for (let i = 0; i < 6; i++) p.push(inc(6 + i * 11, 0, 57, 2, 10, m, 'Tabla respaldo'));
  p.push(caja(4, 22, 12, 57, 30, 4, m, 'Apoyo respaldo'));
  p.push({ ...inc(34, 0, 57, 6, 62, 'cojin'), y: inc(34, 0, 57, 6, 62, 'cojin').y + 4 });
  p.push(caja(4, 36, 72, 57, 6, 115, 'cojin'));
  return p;
}

// Columpio con pórtico en A y dos asientos.
export function columpio() {
  const p = [];
  const L = 300;
  p.push(caja(-10, 200, 70, L + 20, 14, 9, 'imp', 'Viga superior'));
  for (const x of [0, L - 9]) {
    p.push(girar(caja(x, -5, 40, 9, 220, 9, 'imp', 'Pata'), 16, 0, 0));
    p.push(girar(caja(x, -5, 101, 9, 220, 9, 'imp', 'Pata'), -16, 0, 0));
    p.push(caja(x, 80, 30, 9, 9, 150, 'imp', 'Travesaño'));
  }
  for (const x0 of [70, 180]) {
    for (const dx of [0, 45]) p.push(caja(x0 + dx, 45, 74, 1, 155, 1, 'metal'));
    p.push(caja(x0 - 3, 42, 64, 52, 3, 20, 'imp', 'Asiento'));
  }
  return p;
}

// Banca colgante (columpio de terraza) con su marco.
export function bancaColgante() {
  const p = [];
  for (const x of [0, 220]) {
    p.push(girar(caja(x, -3, 33, 9, 215, 9, 'imp', 'Pata'), 12, 0, 0));
    p.push(girar(caja(x, -3, 78, 9, 215, 9, 'imp', 'Pata'), -12, 0, 0));
    p.push(caja(x, 0, 0, 9, 9, 120, 'imp', 'Base'));
  }
  p.push(caja(-10, 200, 55, 249, 14, 9, 'imp', 'Viga'));
  const b = 40;
  for (const dx of [0, 140]) p.push(caja(b + dx, 50, 60, 1, 150, 1, 'metal'));
  for (let i = 0; i < 4; i++) p.push(caja(b - 5, 45, 40 + i * 12, 150, 2.5, 11, 'imp', 'Tabla asiento'));
  for (let i = 0; i < 4; i++) p.push(girar(caja(b - 5, 55 + i * 10, 33, 150, 9, 2, 'imp', 'Tabla respaldo'), -12, 0, 0));
  for (const x of [b - 5, b + 141]) p.push(caja(x, 45, 38, 4, 30, 50, 'imp', 'Costado'));
  p.push(caja(b - 2, 47.5, 42, 144, 8, 45, 'cojin'));
  return p;
}

// Banca de exterior con respaldo y apoyabrazos.
export function bancaRespaldo({ L = 150, m = 'imp' } = {}) {
  const p = [];
  for (const x of [0, L - 6]) {
    p.push(caja(x, 0, 45, 6, 60, 6, m, 'Pata delantera'));
    p.push(girar(caja(x, 0, 2, 6, 85, 6, m, 'Pata trasera'), -10, 0, 0));
    p.push(caja(x - 2, 60, 0, 10, 3, 55, m, 'Apoyabrazos'));
    p.push(caja(x, 35, 5, 6, 8, 45, m, 'Travesaño asiento'));
  }
  for (let i = 0; i < 4; i++) p.push(caja(6, 43, 6 + i * 11, L - 12, 3, 10, m, 'Tabla asiento'));
  for (let i = 0; i < 3; i++) p.push(girar(caja(6, 52 + i * 11, 2, L - 12, 9, 2.5, m, 'Tabla respaldo'), -10, 0, 0));
  return p;
}

// Sillón o sofá de exterior con cojines.
export function sillonExterior({ L = 75, m = 'imp' } = {}) {
  const p = [];
  for (const x of [0, L - 8]) {
    for (const z of [0, 70]) p.push(caja(x, 0, z, 8, 60, 8, m, 'Pata'));
    for (let i = 0; i < 4; i++) p.push(caja(x, 14 + i * 11, 8, 8, 9, 62, m, 'Tabla costado'));
    p.push(caja(x - 1, 60, -1, 10, 3, 80, m, 'Apoyabrazos'));
  }
  for (let i = 0; i < 6; i++) p.push(caja(8, 26, i * 13.3, L - 16, 2.5, 12, m, 'Tabla asiento'));
  for (let i = 0; i < 5; i++) p.push(caja(8, 28 + i * 11, 0, L - 16, 9, 2.5, m, 'Tabla respaldo'));
  p.push(caja(9, 28.5, 3, L - 18, 12, 74, 'cojin'));
  p.push(girar(caja(9, 42, 4, L - 18, 40, 12, 'cojin'), -10, 0, 0));
  return p;
}

// Casa para perro con techo a dos aguas y tinglado.
export function casaPerro({ L = 80, W = 100, H = 55 } = {}) {
  const p = [];
  for (const x of [0, L - 5]) for (const z of [0, W - 5]) p.push(caja(x, 0, z, 5, 5, 5, 'imp', 'Taco'));
  p.push(caja(0, 5, 0, L, 2, W, 'imp', 'Piso'));
  p.push(caja(0, 7, 0, 2, H, W, 'tinglado'));
  p.push(caja(L - 2, 7, 0, 2, H, W, 'tinglado'));
  p.push(caja(2, 7, 0, L - 4, H, 2, 'tinglado'));
  p.push(caja(2, 7, W - 2, 25, H, 2, 'tinglado'));
  p.push(caja(L - 27, 7, W - 2, 25, H, 2, 'tinglado'));
  p.push(caja(27, 47, W - 2, L - 54, H - 40, 2, 'tinglado'));
  const yt = 7 + H;
  const R = 28;
  for (const z of [0, W - 2]) p.push(perfil([[0, yt], [L / 2, yt + R], [L, yt]], z, 2, 'tinglado'));
  p.push(perfil([[-8, yt - 5], [L / 2, yt + R], [L / 2, yt + R + 2], [-8, yt - 3]], -8, W + 16, 'techo'));
  p.push(perfil([[L + 8, yt - 5], [L / 2, yt + R], [L / 2, yt + R + 2], [L + 8, yt - 3]], -8, W + 16, 'techo'));
  return p;
}

// Tramo de cerco de tablas verticales entre dos postes.
export function cerco({ L = 240, H = 180, tabla = 12, sep = 2.7, punta = false } = {}) {
  const p = [caja(0, 0, 0, 9, H + 5, 9, 'imp', 'Poste'), caja(L - 9, 0, 0, 9, H + 5, 9, 'imp', 'Poste')];
  for (const y of [25, H - 35]) p.push(caja(9, y, 3, L - 18, 9, 4, 'imp', 'Travesaño'));
  const n = Math.floor((L - 18) / (tabla + sep));
  for (let i = 0; i < n; i++) {
    const x = 10 + i * (tabla + sep);
    p.push(caja(x, 5, 7, tabla, H - 5 - (punta ? 6 : 0), 2, 'imp', 'Tabla'));
    if (punta) p.push(perfil([[x, H - 6], [x + tabla / 2, H], [x + tabla, H - 6]], 7, 2, 'imp'));
  }
  return p;
}

// Leñera abierta con techo a un agua y piso ventilado.
export function lenera({ L = 200, W = 80, H = 180 } = {}) {
  const p = [];
  for (const x of [0, L / 2 - 4.5, L - 9]) {
    p.push(caja(x, 0, W - 9, 9, H, 9, 'imp', 'Poste delantero'));
    p.push(caja(x, 0, 0, 9, H - 18, 9, 'imp', 'Poste trasero'));
  }
  p.push(caja(0, 12, 0, L, 9, W, 'imp', 'Bastidor piso'));
  for (let i = 0; i < 7; i++) p.push(caja(0, 21, 2 + i * 11, L, 2, 9, 'imp', 'Tabla piso'));
  for (let i = 0; i < Math.floor((H - 50) / 20) + 1; i++) p.push(caja(0, 40 + i * 20, -2, L, 9, 2, 'imp', 'Listón trasero'));
  p.push(perfil([[W + 12, H + 2], [-12, H - 20], [-12, H - 16], [W + 12, H + 6]], -12, L + 24, 'zinc', 'x'));
  const nf = Math.min(6, Math.floor((H - 60) / 15));
  const nz = Math.floor((W - 22) / 7.5) + 1;
  for (let f = 0; f < nf; f++) for (let i = 0; i < nz; i++) p.push(cil(-2, 31 + f * 15, 12 + i * 7.5 + (f % 2) * 3, 6.5, L / 2 - 6, 'oscuro', 'x'));
  for (let f = 0; f < nf - 1; f++) for (let i = 0; i < nz; i++) p.push(cil(L / 2 + 5, 31 + f * 15, 12 + i * 7.5 + (f % 2) * 3, 6.5, L / 2 - 12, 'oscuro', 'x'));
  return p;
}

// Camarote: dos camas de una plaza superpuestas, escalera y baranda.
export function camarote() {
  const p = [];
  const W = 90;
  const Lc = 190;
  const post = 7;
  const L = W + 2 * post;
  const Z = Lc + 2 * post;
  for (const x of [0, L - post]) for (const z of [0, Z - post]) p.push(caja(x, 0, z, post, 165, post, 'pino', 'Pilar'));
  for (const y of [20, 120]) {
    for (const x of [post - 4.1, L - post]) p.push(caja(x, y, post, 4.1, 14, Lc, 'pino', 'Larguero'));
    for (const z of [0, Z - post]) p.push(caja(post, y, z + 1, W, 14, 4.1, 'pino', 'Travesaño'));
    for (let i = 0; i < 12; i++) p.push(caja(post, y + 12, post + 4 + i * 15.5, W, 1.9, 9, 'pino', 'Tablilla'));
    p.push(caja(post + 1, y + 14, post + 1, W - 2, 18, Lc - 2, 'tela'));
    p.push(caja(post + 8, y + 32, post + 4, W - 16, 9, 35, 'blanco'));
    p.push(caja(post - 1, y + 32, post + 45, W + 2, 4, Lc - 45, y > 50 ? 'azul' : 'rojo'));
  }
  for (const z of [post, Z - post - 70]) p.push(caja(L - post + 2, 150, z, 4.1, 14, z < 50 ? Lc - 60 : 70, 'pino', 'Baranda'));
  for (const zz of [Lc - 60, Lc - 30]) p.push(caja(L + 2, 0, zz + post, 4.1, 165, 6, 'pino', 'Larguero escalera'));
  for (let i = 0; i < 5; i++) p.push(caja(L + 2, 25 + i * 28, Lc - 54 + post, 4.1, 4, 30, 'pino', 'Peldaño'));
  return p;
}

// Cama casita (estilo Montessori): cama baja con marco de casa a dos aguas.
export function camaCasita() {
  const p = cama({ W: 90, Lc: 190, respaldo: 30, alto: 20, colchon: true });
  const L = 104;
  const Z = 204;
  const H = 120;
  for (const z of [0, Z - 7]) {
    for (const x of [0, L - 7]) p.push(caja(x, 0, z, 7, H, 7, 'pino', 'Poste casa'));
    const R = 45;
    const largo = Math.hypot(L / 2, R);
    const ang = (Math.atan2(L / 2, R) * 180) / Math.PI;
    p.push(girar(caja(L / 4 - 3.5, H + R / 2 - largo / 2, z, 7, largo, 7, 'pino', 'Par techo'), 0, 0, -ang));
    p.push(girar(caja(3 * L / 4 - 3.5, H + R / 2 - largo / 2, z, 7, largo, 7, 'pino', 'Par techo'), 0, 0, ang));
  }
  p.push(caja(L / 2 - 3.5, H + 40, 0, 7, 7, Z, 'pino', 'Cumbrera'));
  for (const x of [0, L - 7]) p.push(caja(x, H - 7, 0, 7, 7, Z, 'pino', 'Larguero alto'));
  return p;
}

// Librero tipo escalera apoyado en el muro.
export function libreroEscalera({ H = 180, L = 60 } = {}) {
  const p = [caja(-40, 0, -6, L + 80, 230, 4, 'pared')];
  const ang = -12;
  for (const x of [0, L - 4]) p.push(girar(caja(x, 0, 12, 4, H, 6, 'pino', 'Larguero'), ang, 0, 0));
  const n = 5;
  for (let i = 0; i < n; i++) {
    const y = 12 + i * (H - 30) / (n - 1);
    const prof = 38 - i * 6;
    const zr = 15 + (y - H / 2) * Math.sin((ang * Math.PI) / 180);
    const z0 = Math.max(zr + 3 - prof, -2);
    p.push(caja(4, y, z0, L - 8, 2, zr + 3 - z0, 'pino', 'Repisa'));
  }
  return p;
}

// Perchero de pie con base en cruz y colgadores.
export function percheroPie() {
  const p = [caja(20, 0, 0, 5, 3, 45, 'pino', 'Base'), caja(0, 0, 20, 45, 3, 5, 'pino', 'Base'), caja(19.5, 3, 19.5, 6, 172, 6, 'pino', 'Poste')];
  p.push(girar(caja(21, 158, 25, 3, 3, 12, 'oscuro', 'Colgador'), -35, 0, 0));
  p.push(girar(caja(21, 158, 8, 3, 3, 12, 'oscuro', 'Colgador'), 35, 0, 0));
  p.push(girar(caja(25, 148, 21, 12, 3, 3, 'oscuro', 'Colgador'), 0, 0, 35));
  p.push(girar(caja(8, 148, 21, 12, 3, 3, 'oscuro', 'Colgador'), 0, 0, -35));
  return p;
}

// Banco de recibidor con panel, colgadores y repisa.
export function recibidor() {
  const p = mesa({ L: 100, W: 38, H: 46, pata: 5, cub: 3, fald: 8, vuelo: 2, repisa: 10, m: 'pino' });
  p.push(caja(0, 46, 0, 3, 134, 3, 'pino', 'Montante'));
  p.push(caja(97, 46, 0, 3, 134, 3, 'pino', 'Montante'));
  for (let i = 0; i < 6; i++) p.push(caja(3, 70 + i * 15, 0, 94, 13.8, 2, 'pino', 'Tabla panel'));
  p.push(caja(-3, 180, -2, 106, 2.5, 25, 'pino', 'Repisa superior'));
  for (let i = 0; i < 4; i++) p.push(girar(caja(15 + i * 22, 150, 2, 2.5, 2.5, 9, 'metal'), 30, 0, 0));
  p.push(caja(-40, 0, -4, 180, 240, 2, 'pared'));
  return p;
}

// Mesa plegable de muro: cubierta abatible sobre un listón y una pata plegable.
export function mesaPlegable() {
  return [
    caja(-30, 0, -4, 160, 230, 3, 'pared'),
    caja(0, 70, -1, 100, 8, 3, 'pino', 'Listón al muro'),
    caja(0, 76, 2, 100, 2.8, 60, 'tablero', 'Cubierta'),
    caja(5, 0, 50, 5, 76, 5, 'pino', 'Pata plegable'),
    caja(90, 0, 50, 5, 76, 5, 'pino', 'Pata plegable'),
    caja(5, 30, 51, 90, 5, 3, 'pino', 'Travesaño pata'),
    caja(20, 69, 0.5, 6, 2, 3, 'metal'), caja(74, 69, 0.5, 6, 2, 3, 'metal'),
  ];
}

// Repisa flotante con libros, sobre un muro.
export function repisaFlotante() {
  const p = [caja(-25, 0, -4, 130, 220, 4, 'pared'), caja(0, 140, 0, 80, 5, 20, 'pino', 'Repisa')];
  const colores = ['rojo', 'azul', 'cojin', 'verde', 'tela', 'manta'];
  let x = 6;
  for (let i = 0; i < 9; i++) {
    const w = 2.5 + (i % 3);
    p.push(caja(x, 145, 3, w, 18 + (i * 7) % 8, 14, colores[i % colores.length]));
    x += w + 0.3;
  }
  p.push(cil(62, 145, 10, 5, 12, 'ceramica'));
  p.push(caja(57, 157, 5, 10, 8, 10, 'verde'));
  return p;
}

// Mueble de baño (vanitorio) con lavamanos y llave.
export function vanitorioExtras(L, W, H) {
  return [
    caja(L / 2 - 22, H, W / 2 - 17, 44, 12, 34, 'ceramica'),
    cil(L / 2, H, 8, 1.5, 22, 'metal'),
    caja(L / 2 - 1.5, H + 19, 8, 3, 3, 12, 'metal'),
    caja(-30, 0, -4, L + 60, 240, 4, 'pared'),
    caja(L / 2 - 30, H + 35, -1, 60, 80, 1.5, 'vidrio'),
    caja(L / 2 - 32, H + 33, -1.5, 64, 84, 1, 'pino'),
  ];
}

// Casita para pájaros sobre un poste.
export function casaPajaros() {
  const p = [caja(13, 0, 13, 7, 150, 7, 'imp', 'Poste')];
  p.push(caja(4, 150, 4, 25, 2, 25, 'pino', 'Base'));
  p.push(caja(6, 152, 6, 2, 22, 21, 'pino', 'Costado'), caja(25, 152, 6, 2, 22, 21, 'pino', 'Costado'));
  p.push(caja(8, 152, 6, 17, 22, 2, 'pino', 'Fondo'), caja(8, 152, 25, 17, 22, 2, 'pino', 'Frente'));
  p.push(cil(16.5, 166, 27, 2.5, 0.3, 'fuego', 'z'));
  p.push(perfil([[6, 174], [16.5, 183], [27, 174]], 6, 21, 'pino'));
  p.push(perfil([[2, 171], [16.5, 184], [16.5, 186], [2, 173]], 2, 29, 'oscuro'));
  p.push(perfil([[31, 171], [16.5, 184], [16.5, 186], [31, 173]], 2, 29, 'oscuro'));
  p.push(cil(16.5, 160, 27, 0.6, 6, 'pino', 'z'));
  return p;
}

// Comedero de aves: bandeja con techo sobre un poste.
export function comedero() {
  const p = [caja(16, 0, 16, 7, 140, 7, 'imp', 'Poste'), caja(0, 140, 0, 40, 2, 40, 'pino', 'Bandeja')];
  for (const [x, z, w, d] of [[0, 0, 40, 2], [0, 38, 40, 2], [0, 2, 2, 36], [38, 2, 2, 36]]) p.push(caja(x, 142, z, w, 3, d, 'pino', 'Borde'));
  for (const x of [2, 35]) for (const z of [2, 35]) p.push(caja(x, 142, z, 3, 25, 3, 'pino', 'Columna'));
  p.push(perfil([[-4, 164], [20, 178], [20, 180], [-4, 166]], -4, 48, 'oscuro'));
  p.push(perfil([[44, 164], [20, 178], [20, 180], [44, 166]], -4, 48, 'oscuro'));
  p.push(caja(8, 142, 8, 24, 2, 24, 'arena'));
  return p;
}

// Portón peatonal de jardín con diagonal.
export function porton({ L = 100, H = 150 } = {}) {
  const p = [caja(-12, 0, 0, 10, H + 20, 10, 'imp', 'Poste'), caja(L + 2, 0, 0, 10, H + 20, 10, 'imp', 'Poste')];
  for (const y of [15, H - 20]) p.push(caja(0, y, 4, L, 9, 4.1, 'imp', 'Travesaño'));
  const d = Math.hypot(L - 10, H - 50);
  const ang = (Math.atan2(H - 50, L - 10) * 180) / Math.PI;
  p.push(girar(caja(L / 2 - d / 2, H / 2 - 4, 4, d, 9, 4.1, 'imp', 'Diagonal'), 0, 0, ang));
  const n = Math.floor(L / 12.5);
  for (let i = 0; i < n; i++) p.push(caja(i * 12.5 + 0.5, 5, 8.1, 11.5, H, 2, 'imp', 'Tabla'));
  p.push(caja(L - 10, 75, 10.5, 3, 12, 3, 'metal'));
  for (const y of [20, H - 15]) p.push(caja(-3, y, 9, 12, 3, 1, 'metal'));
  return p;
}

// Puente de jardín con tablas en arco y barandas.
export function puente({ L = 240, W = 90 } = {}) {
  const p = [];
  const arco = (x) => 30 * Math.sin((x / L) * Math.PI);
  const n = 22;
  for (let i = 0; i < n; i++) {
    const x = (i * L) / n;
    const y = arco(x + L / n / 2) + 12;
    const ang = (Math.atan((30 * Math.PI / L) * Math.cos(((x + L / n / 2) / L) * Math.PI)) * 180) / Math.PI;
    p.push(girar(caja(x, y, 0, L / n - 1, 3, W, 'imp', 'Tabla'), 0, 0, ang));
  }
  for (const z of [0, W - 5]) {
    for (let i = 0; i < 10; i++) {
      const x = (i * L) / 10;
      const ang = (Math.atan((30 * Math.PI / L) * Math.cos(((x + L / 20) / L) * Math.PI)) * 180) / Math.PI;
      p.push(girar(caja(x, arco(x + L / 20) - 2, z, L / 10 + 1, 14, 5, 'imp', 'Viga en arco'), 0, 0, ang));
    }
    for (const x of [5, L / 2 - 4, L - 13]) p.push(caja(x, arco(x) + 12, z === 0 ? -5 : W, 8, 90, 8, 'imp', 'Pilar baranda'));
    for (let i = 0; i < 6; i++) {
      const x = (i * L) / 6;
      const ang = (Math.atan((30 * Math.PI / L) * Math.cos(((x + L / 12) / L) * Math.PI)) * 180) / Math.PI;
      p.push(girar(caja(x, arco(x + L / 12) + 100, z === 0 ? -5 : W, L / 6 + 2, 5, 8, 'imp', 'Pasamanos'), 0, 0, ang));
    }
  }
  p.push(entorno(caja(-40, -1, 20, L + 80, 1, W - 40, 'agua')));
  return p;
}

// Panel de celosía (enrejado) entre dos postes, con enredadera.
export function celosia({ L = 180, H = 180 } = {}) {
  const p = [caja(-9, 0, 0, 9, H + 20, 9, 'imp', 'Poste'), caja(L, 0, 0, 9, H + 20, 9, 'imp', 'Poste')];
  for (const y of [10, H + 5]) p.push(caja(0, y, 2.5, L, 5, 4, 'imp', 'Marco'));
  const paso = 15;
  for (let x = paso; x < L; x += paso) p.push(caja(x - 1.5, 15, 3, 3, H - 10, 1.5, 'imp', 'Listón vertical'));
  for (let y = 15 + paso; y < H + 5; y += paso) p.push(caja(0, y - 1.5, 4.5, L, 3, 1.5, 'imp', 'Listón horizontal'));
  for (let i = 0; i < 26; i++) p.push(caja(10 + ((i * 37) % (L - 30)), 15 + ((i * 53) % (H - 20)), 6, 14, 10, 4, 'verde'));
  p.push(entorno(caja(-20, -1, -10, L + 40, 1, 30, 'tierra')));
  return p;
}

// Jardinera vertical escalonada de tres niveles.
export function jardineraVertical() {
  const p = [];
  for (const x of [0, 76]) {
    p.push(girar(caja(x, -0.5, 32, 4, 121, 6, 'imp', 'Pata delantera'), -8.5, 0, 0));
    p.push(caja(x, 0, 0, 4, 120, 6, 'imp', 'Pata trasera'));
  }
  for (let i = 0; i < 3; i++) {
    const y = 15 + i * 38;
    const z = 6;
    const prof = 36 - i * 9;
    const c = cajon({ L: 72, W: prof, H: 18, tabla: 8.5, esp: 2, poste: 3, m: 'imp', fondo: true });
    for (const q of c) p.push({ ...q, x: q.x + 4, y: q.y + y, z: q.z + z });
    p.push(caja(6, y + 14, z + 2, 68, 2, prof - 4, 'tierra'));
    for (let k = 0; k < 4; k++) p.push(caja(10 + k * 16, y + 16, z + 4, 10, 10 + (k % 2) * 5, prof - 10, 'verde'));
  }
  return p;
}

// Gallinero elevado con nidal lateral, rampa y corral de malla.
export function gallinero() {
  const p = [];
  const L = 150;
  const W = 120;
  const y0 = 60;
  for (const x of [0, L - 7]) for (const z of [0, W - 7]) p.push(caja(x, 0, z, 7, y0 + 110, 7, 'imp', 'Pilar'));
  p.push(caja(0, y0 - 4, 0, L, 4, W, 'imp', 'Piso'));
  for (const [x, z, w, d] of [[0, 0, L, 2], [0, W - 2, L, 2], [0, 2, 2, W - 4], [L - 2, 2, 2, W - 4]]) {
    if (z === W - 2) {
      p.push(caja(0, y0, z, 50, 100, 2, 'tinglado'));
      p.push(caja(85, y0, z, L - 85, 100, 2, 'tinglado'));
      p.push(caja(50, y0 + 60, z, 35, 40, 2, 'tinglado'));
      p.push(caja(52, y0, z + 1, 31, 58, 2, 'oscuro'));
    } else p.push(caja(x, y0, z, w, 100, d, 'tinglado'));
  }
  const yt = y0 + 100;
  for (const z of [0, W - 2]) p.push(perfil([[0, yt], [L / 2, yt + 40], [L, yt]], z, 2, 'tinglado'));
  p.push(perfil([[-15, yt - 8], [L / 2, yt + 40], [L / 2, yt + 43], [-15, yt - 5]], -15, W + 30, 'zinc'));
  p.push(perfil([[L + 15, yt - 8], [L / 2, yt + 40], [L / 2, yt + 43], [L + 15, yt - 5]], -15, W + 30, 'zinc'));
  p.push(caja(L, y0 + 20, 20, 40, 40, 70, 'tinglado'));
  p.push(caja(L - 2, y0 + 60, 18, 46, 2.5, 74, 'oscuro'));
  const rampa = Math.hypot(y0, 110);
  p.push(girar(caja(55, y0 / 2 - 1, W + 50 - rampa / 2, 28, 2.5, rampa, 'imp', 'Rampa'), 28.6, 0, 0));
  return p;
}

// Conejera con patas, techo inclinado y frente de malla.
export function conejera() {
  const p = [];
  const L = 140;
  const W = 70;
  for (const x of [0, L - 6]) for (const z of [0, W - 6]) p.push(caja(x, 0, z, 6, 60, 6, 'imp', 'Pata'));
  p.push(caja(0, 55, 0, L, 3, W, 'imp', 'Piso'));
  p.push(caja(0, 58, 0, L, 60, 2, 'tinglado'));
  p.push(caja(0, 58, 2, 2, 60, W - 2, 'tinglado'));
  p.push(caja(L - 2, 58, 2, 2, 60, W - 2, 'tinglado'));
  p.push(caja(L / 2 - 1, 58, 2, 2, 60, W - 4, 'tinglado'));
  p.push(caja(L / 2 + 1, 58, W - 2, L / 2 - 3, 60, 2, 'oscuro'));
  p.push(caja(2, 58, W - 2, L / 2 - 3, 60, 1, 'malla'));
  for (const x of [2, L / 2 - 4]) p.push(caja(x, 58, W - 3, 3, 60, 3, 'pino'));
  p.push(caja(2, 58, W - 3, L / 2 - 3, 3, 3, 'pino'), caja(2, 115, W - 3, L / 2 - 3, 3, 3, 'pino'));
  p.push(perfil([[W + 8, 122], [-8, 128], [-8, 131], [W + 8, 125]], -8, L + 16, 'techo', 'x'));
  p.push(perfil([[0, 118], [W, 118], [0, 127]], 0, 2, 'tinglado', 'x'), perfil([[0, 118], [W, 118], [0, 127]], L - 2, 2, 'tinglado', 'x'));
  return p;
}

// Casita de juegos elevada con escalera y resbalín.
export function casitaJuegos() {
  const p = [];
  const L = 150;
  const W = 150;
  const y0 = 120;
  for (const x of [0, L - 9]) for (const z of [0, W - 9]) p.push(caja(x, 0, z, 9, y0 + 130, 9, 'imp', 'Pilar'));
  p.push(caja(0, y0 - 14, 0, L, 14, W + 60, 'imp', 'Bastidor'));
  for (let i = 0; i < 14; i++) p.push(caja(0, y0, i * 15, L, 2.5, 14, 'deck', 'Tabla piso'));
  for (const x of [0, L - 9]) p.push(caja(x, y0, W + 51, 9, 90, 9, 'imp', 'Pilar baranda'));
  p.push(caja(0, y0 + 85, W + 51, L, 5, 9, 'imp', 'Pasamanos'));
  p.push(caja(0, y0, 0, L, 110, 2, 'tinglado'));
  p.push(caja(0, y0, 2, 2, 110, W - 2, 'tinglado'));
  p.push(caja(L - 2, y0, 2, 2, 110, W - 2, 'tinglado'));
  p.push(caja(0, y0, W - 2, 45, 110, 2, 'tinglado'));
  p.push(caja(105, y0, W - 2, 45, 110, 2, 'tinglado'));
  p.push(caja(45, y0 + 80, W - 2, 60, 30, 2, 'tinglado'));
  p.push(caja(L - 2, y0 + 40, 50, 1, 45, 50, 'vidrio'));
  const yt = y0 + 110;
  for (const z of [0, W - 2]) p.push(perfil([[0, yt], [L / 2, yt + 60], [L, yt]], z, 2, 'tinglado'));
  p.push(perfil([[-15, yt - 12], [L / 2, yt + 60], [L / 2, yt + 64], [-15, yt - 8]], -15, W + 30, 'techo'));
  p.push(perfil([[L + 15, yt - 12], [L / 2, yt + 60], [L / 2, yt + 64], [L + 15, yt - 8]], -15, W + 30, 'techo'));
  const esc = Math.hypot(y0, 100);
  for (const z of [30, 75]) p.push(girar(caja(-50 - esc / 2, y0 / 2 - 4.5, z, esc, 9, 4.1, 'imp', 'Larguero escalera'), 0, 0, 50.2));
  for (let i = 1; i < 6; i++) p.push(caja(-100 + i * 17, i * 20 - 2, 34, 12, 2.5, 41, 'imp', 'Peldaño'));
  const rb = Math.hypot(y0, 170);
  p.push(girar(caja(L + 85 - rb / 2, y0 / 2, 60, rb, 2, 45, 'rojo'), 0, 0, -35.2));
  return p;
}

// Ducha exterior: base de tablas, poste con ducha y paneles de listones.
export function duchaExterior() {
  const p = [];
  const L = 110;
  for (let i = 0; i < 8; i++) p.push(caja(0, 10, i * 14, L, 2.5, 12.5, 'deck', 'Tabla base'));
  p.push(caja(0, 0, 0, L, 10, L, 'imp', 'Bastidor'));
  for (const [x, z] of [[0, 0], [L - 9, 0], [0, L - 9], [L - 9, L - 9]]) p.push(caja(x, 0, z, 9, 210, 9, 'imp', 'Pilar'));
  for (let i = 0; i < 14; i++) {
    p.push(caja(9, 30 + i * 12, 0, L - 18, 9, 2, 'imp', 'Listón'));
    p.push(caja(0, 30 + i * 12, 9, 2, 9, L - 18, 'imp', 'Listón'));
    p.push(caja(L - 2, 30 + i * 12, 9, 2, 9, L - 18, 'imp', 'Listón'));
  }
  p.push(cil(L / 2, 12, 6, 1.5, 200, 'metal'));
  p.push(caja(L / 2 - 1, 210, 6, 2, 2, 25, 'metal'));
  p.push(cil(L / 2, 204, 31, 8, 3, 'metal'));
  return p;
}

// Tendedero con dos postes en T y cuerdas.
export function tendedero() {
  const L = 300;
  const p = [];
  for (const x of [0, L]) {
    p.push(caja(x, 0, 0, 9, 190, 9, 'imp', 'Poste'));
    p.push(caja(x - 2, 175, -45, 13, 9, 99, 'imp', 'Travesaño'));
    p.push(girar(caja(x + 2, 140, -14, 5, 40, 5, 'imp', 'Pie de amigo'), 45, 0, 0));
    p.push(girar(caja(x + 2, 140, 18, 5, 40, 5, 'imp', 'Pie de amigo'), -45, 0, 0));
  }
  for (let i = 0; i < 5; i++) p.push(caja(4, 184, -40 + i * 22, L, 0.5, 0.5, 'metal'));
  const ropa = ['tela', 'azul', 'rojo', 'cojin'];
  for (let i = 0; i < 6; i++) p.push(caja(40 + i * 40, 140, -40 + (i % 5) * 22, 30, 44, 0.5, ropa[i % 4]));
  return p;
}

// Soporte para bicicletas de piso con ranuras.
export function soporteBicis() {
  const p = [caja(0, 0, 0, 180, 9, 9, 'imp', 'Base'), caja(0, 0, 50, 180, 9, 9, 'imp', 'Base')];
  for (let i = 0; i < 6; i++) {
    const x = 10 + i * 30;
    p.push(caja(x, 9, 0, 4.1, 30, 59, 'imp', 'Separador'));
    p.push(caja(x + 10, 9, 0, 4.1, 30, 59, 'imp', 'Separador'));
  }
  p.push(caja(0, 39, 25, 180, 9, 9, 'imp', 'Travesaño superior'));
  return p;
}

// Invernadero de madera con paredes y techo de policarbonato.
export function invernadero({ L = 300, W = 400, H = 200 } = {}) {
  const p = [];
  p.push(caja(0, 0, 0, L, 20, W, 'imp', 'Solera base'));
  const paso = 60;
  const nx = Math.round(L / paso);
  const nz = Math.round(W / paso);
  for (let i = 0; i <= nx; i++) for (const z of [0, W - 5]) p.push(caja(i * (L - 5) / nx, 20, z, 5, H, 5, 'pino', 'Pie derecho'));
  for (let j = 1; j < nz; j++) for (const x of [0, L - 5]) p.push(caja(x, 20, j * (W - 5) / nz, 5, H, 5, 'pino', 'Pie derecho'));
  p.push(caja(0, 20 + H, 0, L, 5, 5, 'pino', 'Solera superior'), caja(0, 20 + H, W - 5, L, 5, 5, 'pino', 'Solera superior'));
  p.push(caja(0, 20 + H, 5, 5, 5, W - 10, 'pino', 'Solera superior'), caja(L - 5, 20 + H, 5, 5, 5, W - 10, 'pino', 'Solera superior'));
  p.push(caja(1, 20, 1, L - 2, H, 1, 'vidrio'), caja(1, 20, 1, 1, H, W - 2, 'vidrio'), caja(L - 2, 20, 1, 1, H, W - 2, 'vidrio'));
  p.push(caja(1, 20, W - 2, L / 2 - 40, H, 1, 'vidrio'), caja(L / 2 + 40, 20, W - 2, L / 2 - 41, H, 1, 'vidrio'));
  p.push(caja(L / 2 - 40, 20, W - 3, 80, H, 3, 'pino'), caja(L / 2 - 36, 24, W - 2.5, 72, H - 8, 1, 'vidrio'));
  const yt = 20 + H + 5;
  const R = 90;
  for (const z of [0, W - 2]) p.push(perfil([[0, yt], [L / 2, yt + R], [L, yt]], z, 1, 'vidrio'));
  p.push(perfil([[-5, yt - 3], [L / 2, yt + R], [L / 2, yt + R + 1], [-5, yt - 2]], -5, W + 10, 'vidrio'));
  p.push(perfil([[L + 5, yt - 3], [L / 2, yt + R], [L / 2, yt + R + 1], [L + 5, yt - 2]], -5, W + 10, 'vidrio'));
  for (let j = 0; j <= nz; j++) {
    const z = j * (W - 5) / nz;
    p.push(perfil([[0, yt], [L / 2, yt + R], [L / 2, yt + R - 7], [6, yt]], z, 5, 'pino'));
    p.push(perfil([[L, yt], [L / 2, yt + R], [L / 2, yt + R - 7], [L - 6, yt]], z, 5, 'pino'));
  }
  p.push(caja(L / 2 - 3, yt + R - 8, 0, 6, 8, W, 'pino', 'Cumbrera'));
  for (const x of [20, L - 80]) {
    p.push(caja(x, 20, 30, 60, 60, W - 120, 'imp'));
    p.push(caja(x + 3, 75, 33, 54, 5, W - 126, 'tierra'));
    for (let k = 0; k < 8; k++) p.push(caja(x + 10 + (k % 2) * 22, 80, 40 + k * 30, 16, 18, 16, 'verde'));
  }
  return p;
}

// Cabaña A (A-frame): techo que llega al suelo y frente vidriado.
export function aFrame({ L = 600, W = 800, piso = 60 } = {}) {
  const p = [];
  p.push(caja(0, piso - 20, 0, L, 20, W + 150, 'imp'));
  for (let i = 0; i < 5; i++) for (let j = 0; j < 7; j++) p.push(caja(4 + i * (L - 20) / 4, 0, 4 + j * (W + 130) / 6, 12, piso - 20, 12, 'imp'));
  const n = Math.round(L / 15);
  for (let i = 0; i < n; i++) p.push(caja(i * L / n, piso, W, L / n - 0.6, 2.5, 150, 'deck'));
  const R = 560;
  const y0 = piso;
  const e = 12;
  p.push(perfil([[-40, y0 - 20], [L / 2, y0 + R], [L / 2, y0 + R + e], [-40 + 2, y0 - 20 + e]], -30, W + 60, 'techo'));
  p.push(perfil([[L + 40, y0 - 20], [L / 2, y0 + R], [L / 2, y0 + R + e], [L + 40 - 2, y0 - 20 + e]], -30, W + 60, 'techo'));
  p.push(perfil([[0, y0], [L / 2, y0 + R * (L / 2) / (L / 2 + 40) - 4], [L, y0]], 0, 12, 'tinglado'));
  p.push(perfil([[20, y0], [L / 2, y0 + R - 60], [L - 20, y0]], W - 6, 2, 'vidrio'));
  for (const x of [L / 2 - 120, L / 2, L / 2 + 120]) {
    const alto = (R - 60) * (1 - Math.abs(x - L / 2) / (L / 2 - 20));
    p.push(caja(x - 4, y0, W - 10, 8, alto, 12, 'pino', 'Montante'));
  }
  p.push(caja(40, y0 + 240, W - 10, L - 80, 8, 12, 'pino', 'Travesaño'));
  p.push(caja(L / 2 - 60, y0, W - 8, 112, 210, 4, 'oscuro'));
  p.push(caja(140, y0 + 260, 0, L - 280, 15, W - 10, 'machi'));
  return p;
}

// Tinaja (hot tub) de madera con escalón.
export function tinaja(x, y, z) {
  const p = [];
  const r = 95;
  const n = 30;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    p.push(girar(caja(x + Math.cos(a) * r - 1, y, z + Math.sin(a) * r - 10, 3.5, 100, 20, 'imp', 'Duela'), 0, -a * 180 / Math.PI, 0));
  }
  for (const yy of [15, 80]) p.push(cil(x, y + yy, z, r + 3, 3, 'metal'));
  p.push(cil(x, y + 80, z, r - 3, 2, 'agua'));
  p.push(caja(x - 40, y, z + r + 5, 80, 35, 40, 'imp', 'Escalón'));
  return p;
}

// Escalera recta interior con zancas, peldaños y pasamanos.
export function escalera({ alto = 260, ancho = 90 } = {}) {
  const p = [];
  const n = Math.round(alto / 18);
  const h = alto / n;
  const huella = 27;
  const largo = huella * (n - 1);
  const ang = (Math.atan2(alto, largo) * 180) / Math.PI;
  const zanca = Math.hypot(alto, largo);
  for (const z of [0, ancho - 4.1]) p.push(girar(caja(largo / 2 - zanca / 2, alto / 2 - 12, z, zanca, 24, 4.1, 'pino', 'Zanca'), 0, 0, ang));
  for (let i = 0; i < n; i++) p.push(caja(i * huella - 2, (i + 1) * h - 3.2, 0, huella + 2, 3.2, ancho, 'oscuro', 'Peldaño'));
  for (const [x, y] of [[-4, 0], [largo - 4, alto]]) p.push(caja(x, y, ancho, 7, 95, 7, 'pino', 'Pilar pasamanos'));
  p.push(girar(caja(largo / 2 - zanca / 2, alto / 2 + 90, ancho + 1, zanca, 5, 5, 'pino', 'Pasamanos'), 0, 0, ang));
  p.push(entorno(caja(largo - 10, alto - 20, -40, 300, 20, ancho + 80, 'machi')));
  return p;
}

// Tabique interior de madera con puerta, mostrando la estructura en una mitad.
export function tabique({ L = 360, H = 240 } = {}) {
  const p = [];
  p.push(caja(0, 0, 0, L, 4.1, 9, 'pino', 'Solera inferior'));
  p.push(caja(0, H - 8.2, 0, L, 4.1, 9, 'pino', 'Solera superior'), caja(0, H - 4.1, 0, L, 4.1, 9, 'pino', 'Solera de amarre'));
  const puerta = { x: 200, w: 80, h: 205 };
  for (let x = 0; x <= L - 4.1; x += 40) {
    if (x > puerta.x - 4 && x < puerta.x + puerta.w) continue;
    p.push(caja(x, 4.1, 0, 4.1, H - 12.3, 9, 'pino', 'Pie derecho'));
  }
  for (const x of [puerta.x - 8.2, puerta.x + puerta.w]) p.push(caja(x, 4.1, 0, 8.2, H - 12.3, 9, 'pino', 'Pie derecho doble'));
  p.push(caja(puerta.x, puerta.h, 0, puerta.w, 14, 9, 'pino', 'Dintel'));
  for (let x = 0; x < 160; x += 40) p.push(caja(x + 4.1, 120, 0, 35.9, 4.1, 9, 'pino', 'Cadeneta'));
  p.push(caja(0, 0, 9, 180, H, 1.4, 'machi'));
  p.push(caja(puerta.x + 4, 0, 3, puerta.w - 8, puerta.h - 2, 3.5, 'oscuro'));
  p.push(caja(puerta.x + puerta.w - 14, 100, 6.5, 3, 3, 4, 'metal'));
  return p;
}

// Cercha de techo a dos aguas repetida (vista de la estructura de techumbre).
export function cerchas({ L = 600, W = 480, alzada = 160, paso = 60 } = {}) {
  const p = [];
  for (const z of [0, W - 9]) p.push(caja(0, 0, z, 9, 240, 9, 'imp', 'Pilar'));
  for (const z of [0, W - 9]) p.push(caja(L - 9, 0, z, 9, 240, 9, 'imp', 'Pilar'));
  for (const z of [0, W - 9]) p.push(caja(0, 240, z, L, 14, 9, 'pino', 'Viga perimetral'));
  const n = Math.round(L / paso);
  const par = Math.hypot(W / 2 + 30, alzada + 30 * alzada / (W / 2));
  const ang = (Math.atan2(alzada, W / 2) * 180) / Math.PI;
  for (let i = 0; i <= n; i++) {
    const x = Math.min(i * paso, L - 4.1);
    p.push(caja(x, 254, 0, 4.1, 14, W, 'pino', 'Tirante'));
    p.push(girar(caja(x, 254 + alzada / 2 + 2, W / 4 - par / 2 + 4, 4.1, 14, par, 'pino', 'Par'), -ang, 0, 0));
    p.push(girar(caja(x, 254 + alzada / 2 + 2, 3 * W / 4 - par / 2 - 4, 4.1, 14, par, 'pino', 'Par'), ang, 0, 0));
    p.push(caja(x, 268, W / 2 - 4.5, 4.1, alzada - 12, 9, 'pino', 'Pendolón'));
    const diag = Math.hypot(W / 4, alzada / 2);
    const ad = (Math.atan2(alzada / 2, W / 4) * 180) / Math.PI;
    p.push(girar(caja(x, 268 + alzada / 4 - 4, W * 3 / 8 - diag / 2, 4.1, 9, diag, 'pino', 'Diagonal'), -ad, 0, 0));
    p.push(girar(caja(x, 268 + alzada / 4 - 4, W * 5 / 8 - diag / 2, 4.1, 9, diag, 'pino', 'Diagonal'), ad, 0, 0));
  }
  p.push(caja(0, 254 + alzada + 2, W / 2 - 4.5, L, 9, 9, 'pino', 'Cumbrera'));
  const R = alzada;
  p.push(perfil([[-30, 268 - 30 * R / (W / 2)], [W / 2, 268 + R], [W / 2, 270 + R], [-30, 270 - 30 * R / (W / 2)]], 0, L / 2, 'osb', 'x'));
  return p;
}

// Carpa de glamping sobre plataforma de madera.
export function glamping({ L = 500, W = 400 } = {}) {
  const p = [];
  const h = 50;
  const nx = 5;
  const nz = 4;
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) p.push(caja(i * (L - 10) / (nx - 1), 0, j * (W + 150 - 10) / (nz - 1), 10, h - 17, 10, 'imp', 'Polín'));
  p.push(caja(0, h - 17, 0, L, 14, W + 150, 'imp', 'Viga'));
  const n = Math.round(L / 14.5);
  for (let i = 0; i < n; i++) p.push(caja(i * L / n, h - 3, 0, L / n - 0.5, 2.5, W + 150, 'deck', 'Tabla deck'));
  const y = h;
  p.push(perfil([[40, y], [40, y + 150], [L / 2, y + 330], [L - 40, y + 150], [L - 40, y]], 20, W - 40, 'tela'));
  p.push(perfil([[L / 2 - 70, y], [L / 2 - 70, y + 200], [L / 2 + 70, y + 200], [L / 2 + 70, y]], W - 21, 2, 'oscuro'));
  for (const x of [20, L - 32]) p.push(caja(x, y, W + 130, 12, 100, 12, 'imp', 'Pilar baranda'));
  p.push(caja(20, y + 95, W + 130, L - 40, 6, 12, 'imp', 'Pasamanos'));
  return p;
}

// Caseta de baño seco exterior.
export function casetaBano() {
  const p = [];
  const L = 120;
  const W = 130;
  for (const x of [0, L - 10]) for (const z of [0, W - 10]) p.push(caja(x, 0, z, 10, 30, 10, 'imp'));
  p.push(caja(0, 30, 0, L, 10, W, 'imp'));
  p.push(caja(0, 40, 0, L, 210, 12, 'tinglado'), caja(0, 40, 12, 12, 210, W - 24, 'tinglado'), caja(L - 12, 40, 12, 12, 210, W - 24, 'tinglado'));
  p.push(caja(0, 40, W - 12, 15, 200, 12, 'tinglado'), caja(L - 15, 40, W - 12, 15, 200, 12, 'tinglado'), caja(0, 240, W - 12, L, 10, 12, 'tinglado'));
  p.push(caja(15, 40, W - 8, L - 30, 195, 4, 'oscuro'));
  p.push(perfil([[-4, 210], [-4, 206], [18, 206], [18, 210]], W - 7, 1, 'oscuro'));
  p.push(caja(L / 2 - 5, 200, W - 4, 10, 10, 1, 'fuego'));
  p.push(perfil([[W + 15, 262], [-15, 246], [-15, 250], [W + 15, 266]], -15, L + 30, 'zinc', 'x'));
  p.push(perfil([[0, 250], [W, 250], [W, 262], [0, 255]], 0, 12, 'tinglado', 'x'), perfil([[0, 250], [W, 250], [W, 262], [0, 255]], L - 12, 12, 'tinglado', 'x'));
  p.push(cil(L - 25, 250, 20, 6, 60, 'metal'));
  return p;
}

// Mirador elevado: torre de madera con plataforma, baranda, escalera y techo.
export function mirador() {
  const p = [];
  const L = 250;
  const y0 = 250;
  for (const x of [0, L - 14]) for (const z of [0, L - 14]) p.push(caja(x, 0, z, 14, y0 + 230, 14, 'imp', 'Pilar'));
  for (const y of [100, 180]) {
    p.push(girar(caja(14, y, 2, 225, 9, 4.1, 'imp', 'Diagonal'), 0, 0, 18));
    p.push(girar(caja(2, y, 14, 4.1, 9, 225, 'imp', 'Diagonal'), -18, 0, 0));
  }
  p.push(caja(0, y0 - 18, 0, L, 18, L, 'imp', 'Viga'));
  for (let i = 0; i < 17; i++) p.push(caja(0, y0, i * 14.7, L, 2.5, 14, 'deck', 'Tabla piso'));
  for (const z of [0, L - 4]) p.push(caja(0, y0 + 90, z, L, 9, 4.1, 'imp', 'Pasamanos'));
  for (const x of [0, L - 4]) p.push(caja(x, y0 + 90, 0, 4.1, 9, L, 'imp', 'Pasamanos'));
  for (let i = 0; i < 18; i++) {
    p.push(caja(14 + i * 12.4, y0, 0, 4, 90, 2, 'imp', 'Balaustre'));
    p.push(caja(0, y0, 14 + i * 12.4, 2, 90, 4, 'imp', 'Balaustre'));
    p.push(caja(L - 2, y0, 14 + i * 12.4, 2, 90, 4, 'imp', 'Balaustre'));
  }
  const yt = y0 + 230;
  p.push(perfil([[-30, yt - 20], [L / 2, yt + 70], [L / 2, yt + 78], [-30, yt - 12]], -30, L + 60, 'techo'));
  p.push(perfil([[L + 30, yt - 20], [L / 2, yt + 70], [L / 2, yt + 78], [L + 30, yt - 12]], -30, L + 60, 'techo'));
  const lz = Math.hypot(y0, 330);
  const ang = (Math.atan2(y0, 330) * 180) / Math.PI;
  for (const x of [L / 2 - 46, L / 2 + 42]) p.push(girar(caja(x, y0 / 2 - 12, L + 165 - lz / 2, 4.1, 24, lz, 'imp', 'Zanca'), ang, 0, 0));
  const n = 14;
  for (let i = 1; i <= n; i++) p.push(caja(L / 2 - 42, y0 - i * y0 / (n + 1), L + i * 330 / (n + 1) - 13, 84, 3.2, 26, 'imp', 'Peldaño'));
  return p;
}

// Altillo o entrepiso interior sobre pilares, con baranda y escalera de gato.
export function altillo({ L = 300, W = 200, h = 220 } = {}) {
  const p = [];
  for (const x of [0, L - 9]) p.push(caja(x, 0, W - 9, 9, h + 100, 9, 'pino', 'Pilar'));
  p.push(caja(0, h - 18, 0, L, 18, W, 'pino', 'Viga'));
  for (let i = 0; i < 14; i++) p.push(caja(0, h, i * W / 14, L, 2, W / 14 - 0.4, 'machi'));
  p.push(caja(0, h + 90, W - 9, L, 9, 9, 'pino', 'Pasamanos'));
  for (let i = 0; i < 22; i++) p.push(caja(12 + i * 13, h + 2, W - 6, 4, 88, 2, 'pino', 'Balaustre'));
  for (const x of [L - 90, L - 45]) p.push(girar(caja(x, h / 2 - 5, W + 25, 4.1, 9, h + 20, 'pino', 'Larguero escalera'), 80, 0, 0));
  for (let i = 0; i < 8; i++) p.push(caja(L - 90, 25 + i * 26, W + 22 + (8 - i) * 4.6, 49, 3, 10, 'pino', 'Peldaño'));
  p.push(caja(-20, 0, -25, L + 40, h + 140, 5, 'pared'));
  p.push(entorno(caja(20, h + 2, 20, 140, 16, 150, 'tela')), entorno(caja(30, h + 18, 25, 120, 10, 35, 'blanco')));
  return p;
}
