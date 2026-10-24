// Modelos 3D simples de cada plano y utilidades para sacar de ellos las vistas 2D,
// las medidas y la lista de cortes. Todo en centímetros: x = largo, y = alto, z = fondo.
// El frente del objeto mira hacia +z.

export const caja = (x, y, z, w, h, d, m = 'pino', n = '') => ({ t: 'caja', x, y, z, w, h, d, m, n });
// Perfil dibujado en el plano XY y extruido en z (eje 'z'), o dibujado en ZY y extruido en x (eje 'x').
export const perfil = (pts, desde, largo, m = 'techo', eje = 'z', n = '') => ({ t: 'perfil', pts, desde, largo, m, eje, n });
// Cilindro: eje 'y' (base en x, y, z centrada en x/z), 'x' o 'z' (empieza en x o z, centrado en los otros dos).
export const cil = (x, y, z, r, h, m = 'imp', eje = 'y', n = '') => ({ t: 'cil', x, y, z, r, h, m, eje, n });
// Gira una caja (grados) alrededor de su centro, en orden X, Y, Z.
export const girar = (p, rx = 0, ry = 0, rz = 0) => ({ ...p, r: [rx, ry, rz] });

const MADERAS = ['pino', 'imp', 'tablero', 'oscuro', 'machi', 'tinglado', 'deck'];
const ENTORNO = ['pared', 'meson', 'piedra'];

// Marca una parte como entorno (muro, mesón, suelo): se ve en la imagen pero no en planos, medidas ni cortes.
export const entorno = (p) => ({ ...p, ctx: true });
export const esEntorno = (p) => p.ctx || ENTORNO.includes(p.m);
const propias = (partes) => partes.filter((p) => !esEntorno(p));

// ---------- Geometría ----------

function rotar([x, y, z], [rx, ry, rz]) {
  const [a, b, c] = [rx, ry, rz].map((g) => (g * Math.PI) / 180);
  // Mismo orden que three.js ('XYZ'): v' = Rx · Ry · Rz · v
  let [x1, y1] = [x * Math.cos(c) - y * Math.sin(c), x * Math.sin(c) + y * Math.cos(c)];
  let z1 = z;
  const x2 = x1 * Math.cos(b) + z1 * Math.sin(b);
  const z2 = -x1 * Math.sin(b) + z1 * Math.cos(b);
  const y3 = y1 * Math.cos(a) - z2 * Math.sin(a);
  const z3 = y1 * Math.sin(a) + z2 * Math.cos(a);
  return [x2, y3, z3];
}

export function esquinas(p) {
  if (p.t === 'perfil') {
    const out = [];
    for (const [u, v] of p.pts) {
      for (const s of [p.desde, p.desde + p.largo]) {
        out.push(p.eje === 'z' ? [u, v, s] : [s, v, u]);
      }
    }
    return out;
  }
  if (p.t === 'cil') {
    const [x0, x1] = p.eje === 'x' ? [p.x, p.x + p.h] : [p.x - p.r, p.x + p.r];
    const [y0, y1] = p.eje === 'y' ? [p.y, p.y + p.h] : [p.y - p.r, p.y + p.r];
    const [z0, z1] = p.eje === 'z' ? [p.z, p.z + p.h] : [p.z - p.r, p.z + p.r];
    const out = [];
    for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) out.push([x, y, z]);
    return out;
  }
  const out = [];
  const c = [p.x + p.w / 2, p.y + p.h / 2, p.z + p.d / 2];
  for (const dx of [-1, 1]) for (const dy of [-1, 1]) for (const dz of [-1, 1]) {
    let v = [dx * p.w / 2, dy * p.h / 2, dz * p.d / 2];
    if (p.r) v = rotar(v, p.r);
    out.push([v[0] + c[0], v[1] + c[1], v[2] + c[2]]);
  }
  return out;
}

export function caja3d(partes) {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (const p of partes) {
    for (const v of esquinas(p)) {
      for (let i = 0; i < 3; i++) {
        min[i] = Math.min(min[i], v[i]);
        max[i] = Math.max(max[i], v[i]);
      }
    }
  }
  return { min, max };
}

function envolvente(puntos) {
  const pts = [...puntos].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cruz = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const abajo = [];
  for (const p of pts) {
    while (abajo.length >= 2 && cruz(abajo[abajo.length - 2], abajo[abajo.length - 1], p) <= 0) abajo.pop();
    abajo.push(p);
  }
  const arriba = [];
  for (const p of pts.reverse()) {
    while (arriba.length >= 2 && cruz(arriba[arriba.length - 2], arriba[arriba.length - 1], p) <= 0) arriba.pop();
    arriba.push(p);
  }
  return abajo.slice(0, -1).concat(arriba.slice(0, -1));
}

// ---------- Vistas 2D ----------

const r1 = (n) => Math.round(n * 10) / 10;

function tipoPieza(m) {
  if (m === 'tinglado') return 'tinglado';
  if (MADERAS.includes(m) || m === 'osb') return 'madera';
  if (m === 'vidrio') return 'ventana';
  if (m === 'techo' || m === 'zinc') return 'techo';
  if (m === 'metal') return 'muro';
  return 'existente';
}

// Proyecta las partes en una vista: 'frente' (desde +z), 'lateral' (desde +x) o 'planta' (desde arriba).
export function proyectar(todas, vista) {
  const partes = propias(todas);
  const { min, max } = caja3d(partes);
  const a = (v) => {
    if (vista === 'frente') return [v[0], max[1] - v[1], v[2]];
    if (vista === 'lateral') return [max[2] - v[2], max[1] - v[1], v[0]];
    return [v[0], v[2], v[1]];
  };
  const piezas = partes.map((p) => {
    const pts = esquinas(p).map(a);
    const prof = pts.reduce((s, q) => s + q[2], 0) / pts.length;
    const tipo = tipoPieza(p.m);
    const recto = !p.r && (p.t === 'caja' || p.t === 'cil' || (p.t === 'perfil' && !((vista === 'frente' && p.eje === 'z') || (vista === 'lateral' && p.eje === 'x'))));
    if (recto) {
      const xs = pts.map((q) => q[0]);
      const ys = pts.map((q) => q[1]);
      const x = Math.min(...xs);
      const y = Math.min(...ys);
      const w = Math.max(...xs) - x;
      const h = Math.max(...ys) - y;
      const pieza = { tipo, x: r1(x), y: r1(y), w: r1(w), h: r1(h) };
      if (tipo === 'tinglado') {
        if (vista === 'planta') pieza.tipo = 'madera';
        else pieza.paso = 16;
      }
      return { prof, pieza };
    }
    const poli = envolvente(pts.map((q) => [r1(q[0]), r1(q[1])]));
    const clase = tipo === 'techo' ? 'p-techo' : tipo === 'ventana' ? 'p-ventana' : tipo === 'muro' ? 'p-muro' : 'p-madera';
    return { prof, pieza: { tipo: 'poligono', puntos: poli, clase } };
  });
  piezas.sort((p, q) => p.prof - q.prof);
  const ancho = vista === 'lateral' ? max[2] - min[2] : max[0] - min[0];
  const alto = vista === 'planta' ? max[2] - min[2] : max[1] - min[1];
  const x0 = vista === 'lateral' ? 0 : min[0];
  const y0 = vista === 'planta' ? min[2] : 0;
  const off = Math.max(ancho, alto) * 0.09;
  return {
    piezas: piezas.map((p) => p.pieza),
    cotas: [
      { x1: r1(x0), y1: r1(y0 + alto), x2: r1(x0 + ancho), y2: r1(y0 + alto), off: r1(off) },
      ...(vista === 'planta' ? [] : [{ x1: r1(x0 + ancho), y1: r1(y0), x2: r1(x0 + ancho), y2: r1(y0 + alto), off: r1(off) }]),
    ],
  };
}

// ---------- Lista de cortes ----------

const NOMINAL = [[2.6, '1'], [3.4, '1½'], [5, '2'], [7.5, '3'], [10.5, '4'], [13, '5'], [16, '6'], [20, '8'], [26, '10']];
const pulgadas = (cm) => (NOMINAL.find(([lim]) => cm <= lim) || [0, String(Math.round(cm / 2.54))])[1];

const cm = (n) => (Math.round(n * 2) / 2).toLocaleString('es-CL');

export function listaCortes(partes) {
  const grupos = new Map();
  for (const p of propias(partes)) {
    if (p.t !== 'caja' || !MADERAS.includes(p.m) || p.m === 'tinglado' || p.m === 'machi') continue;
    const [a, b, c] = [p.w, p.h, p.d].map((n) => Math.round(n * 10) / 10).sort((x, y) => x - y);
    if (a < 0.6) continue;
    const pref = p.m === 'imp' || p.m === 'deck' ? 'Pino impregnado' : p.m === 'oscuro' ? 'Madera nativa o pino teñido' : 'Pino cepillado';
    let item;
    let corte;
    if (a <= 2.9 && b > 16) {
      item = `${p.m === 'imp' ? 'Tablero/tabla impregnada' : 'Tablero de pino'} ${Math.round(a * 10)} mm`;
      corte = `${cm(c)} × ${cm(b)} cm`;
    } else {
      item = `${pref} ${pulgadas(a)}×${pulgadas(b)}" (${Math.round(a * 10)}×${Math.round(b * 10)} mm)`;
      corte = `${cm(c)} cm`;
    }
    const clave = `${item}|${corte}|${p.n}`;
    const g = grupos.get(clave) || { item, corte, n: p.n, cuenta: 0 };
    g.cuenta++;
    grupos.set(clave, g);
  }
  return [...grupos.values()]
    .sort((g, h) => g.item.localeCompare(h.item) || parseFloat(h.corte.replace(',', '.')) - parseFloat(g.corte.replace(',', '.')))
    .map((g) => ({ item: g.item, cantidad: `${g.cuenta} × ${g.corte}`, uso: g.n || undefined }));
}

// ---------- Armar un plano a partir de su modelo ----------

export function armar(def) {
  const partes = def.partes;
  const { min, max } = caja3d(propias(partes));
  const largo = Math.round(max[0] - min[0]);
  const ancho = Math.round(max[2] - min[2]);
  const alto = Math.round(max[1] - min[1]);
  const unidad = def.unidad || (Math.max(largo, ancho, alto) > 260 ? 'm' : 'cm');
  const vistas = def.vistas || [
    { nombre: 'Frente', ...proyectar(partes, 'frente') },
    { nombre: 'Lateral', ...proyectar(partes, 'lateral') },
    ...(def.planta ? [{ nombre: 'Planta', ...proyectar(partes, 'planta') }] : []),
  ];
  const cortes = def.sinCortes ? [] : listaCortes(partes);
  return {
    id: def.id, categoria: def.categoria, nombre: def.nombre, resumen: def.resumen,
    medidas: def.medidas || { largo, ancho, alto }, unidad,
    dificultad: def.dificultad || 1, tiempo: def.tiempo || '1 día', personas: def.personas || 1,
    escena: def.escena,
    modelo: partes,
    vistas: [...(def.vistasExtra || []), ...vistas],
    materiales: [...cortes, ...(def.materiales || [])],
    herramientas: def.herramientas || ['Sierra circular o ingletadora', 'Taladro atornillador', 'Escuadra y huincha', 'Lijadora'],
    pasos: def.pasos,
    notas: def.notas || [],
  };
}
