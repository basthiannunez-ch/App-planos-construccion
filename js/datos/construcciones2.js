import { armar, caja, cil, entorno, proyectar } from '../modelos.js';
import { edificio, plantaEdificio, abierto, deck, mesa, cama, mueble } from '../familias.js';
import {
  aFrame, invernadero, tinaja, escalera, tabique, cerchas, glamping, casetaBano, mirador, altillo,
} from '../especiales.js';

const cat = 'construcciones';
const notaProfesional = 'Ejemplo orientativo: no reemplaza un proyecto firmado por un profesional ni el permiso municipal.';
const r = (n) => Math.ceil(n);

// Estima materiales de una construcción de entramado a partir de sus medidas (cm).
export function estimar(e) {
  const { L, W, H = 240, techo = 'dos', cumbrera = 'z', alero = 30, puertas = [], ventanas = [], tabiques = [], terraza = 0, sinPiso = false } = e;
  const perim = (2 * (L + W)) / 100;
  const vanos = puertas.reduce((s, v) => s + (v.w || 90) * (v.h || 205), 0) + ventanas.reduce((s, v) => s + (v.w || 120) * (v.h || 100), 0);
  const largoTab = tabiques.reduce((s, t) => s + Math.abs(t.x2 - t.x1) + Math.abs(t.z2 - t.z1), 0) / 100;
  let alzada = e.alzada;
  let techoM2;
  if (techo === 'dos') {
    const luz = cumbrera === 'z' ? L : W;
    const largo = (cumbrera === 'z' ? W : L) + 2 * alero;
    alzada ??= luz * 0.3;
    techoM2 = (2 * Math.hypot(luz / 2 + alero, alzada) * largo) / 1e4;
  } else {
    alzada ??= W * 0.12;
    techoM2 = (Math.hypot(W + 2 * alero, alzada) * (L + 2 * alero)) / 1e4;
  }
  const frontones = techo === 'dos' ? ((cumbrera === 'z' ? L : W) * alzada) / 1e4 : (W * alzada) / 1e4;
  const muros = (perim * H) / 100 - vanos / 1e4 + frontones;
  const pisoM2 = (L * W) / 1e4;
  const piezas = r(perim * 100 / 40 + largoTab * 100 / 40 + 4 * (puertas.length + ventanas.length) + 8);
  const lista = [];
  if (!sinPiso) {
    const nx = Math.max(2, Math.ceil(L / 150) + 1);
    const nz = Math.max(2, Math.ceil((W + terraza) / 150) + 1);
    lista.push({ item: 'Polín impregnado 5" (CCA), 1,2 m', cantidad: `${nx * nz} un.`, uso: `Fundación: ${nz} filas de ${nx}, enterrados 80 cm` });
    lista.push({ item: `Pino impregnado 2×${W > 400 ? 8 : 6}", ${Math.min(4.8, Math.ceil(W / 80) * 0.8).toLocaleString('es-CL')} m`, cantidad: `${r(L / 40) + 3} un.`, uso: 'Vigas maestras y vigas de piso cada 40 cm' });
    lista.push({ item: 'Placa OSB 15 mm (1,22 × 2,44 m)', cantidad: `${r(pisoM2 / 2.98 * 1.1)} un.`, uso: 'Piso' });
  } else {
    lista.push({ item: 'Radier de hormigón 10 cm con malla', cantidad: `${pisoM2.toLocaleString('es-CL', { maximumFractionDigits: 1 })} m²`, uso: 'Piso (lo hace un maestro)' });
    lista.push({ item: 'Pino impregnado 2×4", 3,2 m', cantidad: `${r(perim / 3.2) + 1} un.`, uso: 'Solera inferior anclada al radier' });
  }
  lista.push({ item: `Pino dimensionado seco 2×4", ${H > 250 ? '3,6' : '3,2'} m`, cantidad: `≈ ${piezas} un.`, uso: 'Soleras y pies derechos cada 40 cm' });
  lista.push({ item: 'Pino 2×6", 4 m', cantidad: `${r(((cumbrera === 'z' || techo !== 'dos' ? W : L) + 2 * alero) / 60 + 1) * (techo === 'dos' ? 2 : 1)} un.`, uso: 'Vigas o pares de techo cada 60 cm' });
  lista.push({ item: 'Placa OSB 11 mm (1,22 × 2,44 m)', cantidad: `${r((muros + techoM2) / 2.98 * 1.1)} un.`, uso: 'Arriostre de muros y base de techo' });
  lista.push({ item: 'Membrana hidrófuga', cantidad: `${r(muros * 1.15)} m²` });
  lista.push({ item: 'Tinglado de pino 1×6"', cantidad: `≈ ${r(muros * 1.1)} m²`, uso: 'Revestimiento exterior' });
  lista.push({ item: 'Machihembrado pino 1×4"', cantidad: `≈ ${r(muros * 0.95 + pisoM2 + largoTab * H / 100 * 2)} m²`, uso: 'Muros interiores, tabiques y cielo' });
  lista.push({ item: 'Lana mineral 50–100 mm', cantidad: `${r(muros + pisoM2 * 2)} m²`, uso: 'Muros, piso y cielo' });
  lista.push({ item: 'Fieltro asfáltico y teja asfáltica o zinc', cantidad: `≈ ${r(techoM2 * 1.1)} m²`, uso: 'Cubierta' });
  if (terraza) lista.push({ item: 'Tabla deck pino impregnado 1×5"', cantidad: `≈ ${r((L * terraza) / 1e4 * 1.1)} m²`, uso: 'Terraza' });
  for (const v of puertas) lista.push({ item: `Puerta de madera ${v.w || 90} × ${v.h || 205} cm con marco`, cantidad: '1 un.' });
  const vent = ventanas.reduce((m, v) => m.set(`${v.w || 120} × ${v.h || 100}`, (m.get(`${v.w || 120} × ${v.h || 100}`) || 0) + 1), new Map());
  for (const [med, n] of vent) lista.push({ item: `Ventana de madera ${med} cm`, cantidad: `${n} un.` });
  lista.push({ item: 'Clavos 3" y 4", tornillos y conectores para madera', cantidad: 'Según avance' });
  lista.push({ item: 'Protector para madera exterior (stain)', cantidad: `${r(muros / 5)} L` });
  return lista;
}

export const pasosEdificio = (e, extra = []) => [
  { titulo: 'Permiso y diseño', detalle: 'Consulta en la Dirección de Obras de tu municipio y pide revisión estructural a un profesional.' },
  e.sinPiso
    ? { titulo: 'Radier', detalle: 'Encarga un radier de 10 cm con malla y deja pernos de anclaje cada 1 m para la solera.' }
    : { titulo: 'Polines', detalle: 'Traza con lienza (revisa diagonales iguales), entierra los polines 80 cm con ripio compactado y córtalos a la misma cota.' },
  ...(e.sinPiso ? [] : [{ titulo: 'Plataforma de piso', detalle: 'Coloca vigas maestras y vigas de piso cada 40 cm, aislación y OSB de 15 mm.' }]),
  { titulo: 'Muros', detalle: 'Arma los paneles en el piso con soleras y pies derechos cada 40 cm; deja los vanos con dintel doble. Levanta, aploma y arriostra con OSB.' },
  { titulo: 'Techumbre', detalle: e.techo === 'uno' ? 'Coloca vigas de techo cada 60 cm con al menos 10 % de pendiente, OSB, fieltro y cubierta con alero de 30 cm.' : 'Coloca la cumbrera y los pares cada 60 cm, OSB, fieltro y cubierta con alero de 30 cm.' },
  { titulo: 'Revestimiento exterior', detalle: 'Membrana hidrófuga y tinglado de abajo hacia arriba, traslapando 2,5 cm. Protege con stain.' },
  ...extra,
  { titulo: 'Interior', detalle: 'Instalaciones con profesional autorizado, lana mineral entre pies derechos y machihembrado en muros y cielo.' },
];

// Construcción cerrada: modelo 3D, planta, fachada, lateral, materiales estimados y pasos.
export function construccion(def) {
  const e = def.e;
  const partes = [...edificio(e), ...(def.extra || [])];
  return armar({
    ...def,
    categoria: cat,
    partes,
    unidad: 'm',
    medidas: { largo: e.L, ancho: e.W + (e.terraza || 0), alto: Math.round(Math.max(...partes.filter((p) => p.t === 'perfil').flatMap((p) => p.pts.map((q) => q[1])), (e.piso ?? 50) + (e.H || 240))) },
    vistas: [
      plantaEdificio({ ...e, ambientes: def.ambientes || [] }),
      { nombre: 'Fachada', ...proyectar(partes, 'frente') },
      { nombre: 'Lateral', ...proyectar(partes, 'lateral') },
    ],
    sinCortes: true,
    materiales: [...estimar(e), ...(def.materiales || [])],
    herramientas: def.herramientas || ['Chuzo y pala', 'Nivel láser o manguera', 'Sierra circular', 'Clavadora o martillo', 'Taladro atornillador', 'Andamio', 'Plomada'],
    pasos: def.pasos || pasosEdificio(e, def.pasosExtra),
    notas: [notaProfesional, ...(def.notas || [])],
  });
}

// Estructura abierta u objeto especial con vistas proyectadas.
export function estructura(def) {
  return armar({
    ...def,
    categoria: cat,
    unidad: def.unidad || 'm',
    planta: def.planta ?? true,
    herramientas: def.herramientas || ['Chuzo y pala', 'Nivel láser', 'Sierra circular', 'Taladro con broca de 12 mm', 'Llave de punta', 'Andamio o escalera'],
    notas: [...(def.profesional === false ? [] : [notaProfesional]), ...(def.notas || [])],
  });
}

export default [
  construccion({
    id: 'refugio-3x3', nombre: 'Refugio de madera 3 × 3 m',
    resumen: 'Cabañita de 9 m² con techo a dos aguas, ideal como pieza de invitados o refugio de fin de semana.',
    dificultad: 2, tiempo: '3 semanas', personas: 2,
    e: { L: 300, W: 300, H: 230, alzada: 100, puertas: [{ lado: 'f', pos: 105 }], ventanas: [{ lado: 'd', pos: 90, w: 100 }, { lado: 'i', pos: 90, w: 100 }] },
    ambientes: [{ x: 150, z: 150, texto: 'Refugio', m2: '7,8 m²' }],
    notas: ['En muchas comunas, construcciones bajo 9 m² siguen requiriendo aviso a la DOM: consulta antes.'],
  }),
  estructura({
    id: 'cabana-a', nombre: 'Cabaña A (A-frame) 6 × 8 m',
    resumen: 'Cabaña de techo inclinado hasta el suelo, frente vidriado, terraza y altillo dormitorio.',
    dificultad: 3, tiempo: '6 a 8 semanas', personas: 3,
    partes: aFrame({ L: 600, W: 800, piso: 60 }),
    sinCortes: true,
    materiales: [
      { item: 'Polín impregnado 5", 1,2 m', cantidad: '35 un.', uso: 'Fundación' },
      { item: 'Pino impregnado 2×8", 4,8 m', cantidad: '24 un.', uso: 'Vigas de piso cada 40 cm' },
      { item: 'Pino 2×10", 6 m', cantidad: '28 un.', uso: 'Pares en A cada 60 cm' },
      { item: 'Pino 2×6", 4 m', cantidad: '14 un.', uso: 'Tirantes que forman el piso del altillo' },
      { item: 'Placa OSB 15 mm', cantidad: '22 un.', uso: 'Piso y altillo' },
      { item: 'Placa OSB 11 mm', cantidad: '45 un.', uso: 'Base del techo' },
      { item: 'Teja asfáltica y fieltro', cantidad: '≈ 115 m²' },
      { item: 'Machihembrado pino 1×4"', cantidad: '≈ 130 m²', uso: 'Cielo inclinado interior' },
      { item: 'Lana mineral 100 mm', cantidad: '120 m²' },
      { item: 'Ventanal de madera en frontón', cantidad: '≈ 14 m²' },
      { item: 'Tabla deck 1×5"', cantidad: '≈ 10 m²', uso: 'Terraza' },
    ],
    pasos: [
      { titulo: 'Permiso y cálculo', detalle: 'La estructura en A trabaja con grandes pares: pide el cálculo a un profesional y tramita el permiso.' },
      { titulo: 'Plataforma', detalle: 'Entierra los polines, arma vigas cada 40 cm y la terraza delantera.' },
      { titulo: 'Pares en A', detalle: 'Arma cada A en el piso (2 pares + tirante del altillo) y levántalas cada 60 cm, arriostrándolas.' },
      { titulo: 'Techo', detalle: 'OSB, fieltro y teja desde el suelo hasta la cumbrera. Instala forros en la cumbrera.' },
      { titulo: 'Frontones', detalle: 'Cierra el frontón trasero con tinglado y el delantero con montantes y vidrio termopanel.' },
      { titulo: 'Interior', detalle: 'Aislación entre pares, machihembrado inclinado y escalera al altillo.' },
    ],
    notas: ['El espacio útil se reduce en los costados: calcula la superficie con altura mayor a 1,5 m.'],
  }),
  construccion({
    id: 'cabana-altillo', nombre: 'Cabaña con altillo 6 × 5 m',
    resumen: 'Cabaña de muros altos y techo empinado que deja un altillo dormitorio sobre el estar.',
    dificultad: 3, tiempo: '6 semanas', personas: 3,
    e: { L: 500, W: 600, H: 300, cumbrera: 'z', alzada: 230, puertas: [{ lado: 'f', pos: 70 }], ventanas: [{ lado: 'f', pos: 260, w: 180, h: 140, alt: 80 }, { lado: 'd', pos: 150, w: 150 }, { lado: 'i', pos: 300 }], tabiques: [{ x1: 330, z1: 12, x2: 330, z2: 230 }, { x1: 330, z1: 230, x2: 488, z2: 230 }], terraza: 160, porche: true },
    ambientes: [{ x: 180, z: 330, texto: 'Estar / cocina', m2: '20 m²' }, { x: 410, z: 120, texto: 'Baño', chico: true }],
    materiales: [{ item: 'Pino 2×8", 5 m', cantidad: '10 un.', uso: 'Vigas del altillo' }, { item: 'Escalera de madera al altillo', cantidad: '1 un.' }],
    pasosExtra: [{ titulo: 'Altillo', detalle: 'Coloca vigas 2×8" cada 40 cm a 2,40 m sobre el piso, con OSB de 18 mm y baranda.' }],
  }),
  construccion({
    id: 'tiny-house', nombre: 'Tiny house 7,2 × 2,5 m',
    resumen: 'Casa pequeña de 18 m² con techo a un agua, cocina, baño y cama en altillo.',
    dificultad: 3, tiempo: '6 a 8 semanas', personas: 2,
    e: { L: 720, W: 250, H: 260, techo: 'uno', alzada: 60, piso: 60, puertas: [{ lado: 'f', pos: 300, w: 80 }], ventanas: [{ lado: 'f', pos: 60, w: 150, h: 110 }, { lado: 'f', pos: 470, w: 120, h: 100 }, { lado: 'i', pos: 70, w: 100, h: 80, alt: 150 }], tabiques: [{ x1: 590, z1: 12, x2: 590, z2: 238 }] },
    ambientes: [{ x: 300, z: 125, texto: 'Estar / cocina', m2: '13 m²' }, { x: 650, z: 125, texto: 'Baño', chico: true }],
    pasosExtra: [{ titulo: 'Altillo cama', detalle: 'Sobre el baño y la cocina arma un altillo de 2 × 2,3 m para la cama, con escalera-mueble.' }],
    notas: ['Si se construirá sobre un carro, la estructura y el peso deben calcularse para el traslado.'],
  }),
  construccion({
    id: 'casa-2-dormitorios', nombre: 'Casa de madera de 2 dormitorios',
    resumen: 'Casa de 56 m² con estar-comedor-cocina, 2 dormitorios, baño y corredor techado.',
    dificultad: 3, tiempo: '3 a 4 meses', personas: 3,
    e: { L: 800, W: 700, H: 240, cumbrera: 'x', alzada: 140, puertas: [{ lado: 'f', pos: 330 }], ventanas: [{ lado: 'f', pos: 80, w: 180, h: 120 }, { lado: 'f', pos: 520, w: 150 }, { lado: 'i', pos: 450 }, { lado: 'd', pos: 450 }, { lado: 'b', pos: 120 }, { lado: 'b', pos: 560 }, { lado: 'b', pos: 360, w: 60, h: 50, alt: 150 }], tabiques: [{ x1: 12, z1: 330, x2: 788, z2: 330 }, { x1: 290, z1: 12, x2: 290, z2: 330 }, { x1: 490, z1: 12, x2: 490, z2: 330 }], terraza: 200, porche: true },
    ambientes: [{ x: 150, z: 170, texto: 'Dormitorio 1', m2: '9 m²' }, { x: 390, z: 170, texto: 'Baño', chico: true }, { x: 640, z: 170, texto: 'Dormitorio 2', m2: '9,5 m²' }, { x: 400, z: 500, texto: 'Estar / comedor / cocina', m2: '27 m²' }],
    pasosExtra: [{ titulo: 'Tabiques', detalle: 'Arma los tabiques interiores en 2×3" o 2×4" cada 40 cm, con refuerzos para muebles de cocina y baño.' }],
  }),
  construccion({
    id: 'casa-3-dormitorios', nombre: 'Casa de madera de 3 dormitorios',
    resumen: 'Casa de 80 m² con estar amplio, cocina, 3 dormitorios, 2 baños y terraza.',
    dificultad: 3, tiempo: '4 a 5 meses', personas: 4,
    e: { L: 1000, W: 800, H: 240, cumbrera: 'x', alzada: 160, puertas: [{ lado: 'f', pos: 450 }], ventanas: [{ lado: 'f', pos: 100, w: 200, h: 130 }, { lado: 'f', pos: 650, w: 200, h: 130 }, { lado: 'i', pos: 500 }, { lado: 'd', pos: 500 }, { lado: 'b', pos: 100 }, { lado: 'b', pos: 440 }, { lado: 'b', pos: 780 }, { lado: 'd', pos: 150, w: 60, h: 50, alt: 150 }], tabiques: [{ x1: 12, z1: 350, x2: 988, z2: 350 }, { x1: 330, z1: 12, x2: 330, z2: 350 }, { x1: 660, z1: 12, x2: 660, z2: 350 }, { x1: 830, z1: 12, x2: 830, z2: 350 }], terraza: 220, porche: true },
    ambientes: [{ x: 170, z: 180, texto: 'Dormitorio 1', m2: '10,5 m²' }, { x: 495, z: 180, texto: 'Dormitorio 2', m2: '10,5 m²' }, { x: 745, z: 180, texto: 'Baño', chico: true }, { x: 910, z: 180, texto: 'Dorm. 3', chico: true }, { x: 500, z: 580, texto: 'Estar / comedor / cocina', m2: '42 m²' }],
    pasosExtra: [{ titulo: 'Tabiques', detalle: 'Arma los tabiques interiores cada 40 cm, con refuerzos para muebles de cocina y baño.' }],
  }),
  construccion({
    id: 'oficina-jardin', nombre: 'Oficina de jardín 3 × 2,5 m',
    resumen: 'Estudio para trabajar en casa, con ventanal grande y techo a un agua.',
    dificultad: 2, tiempo: '3 semanas', personas: 2,
    e: { L: 300, W: 250, H: 240, techo: 'uno', alzada: 35, puertas: [{ lado: 'f', pos: 30, w: 80 }], ventanas: [{ lado: 'f', pos: 130, w: 150, h: 150, alt: 60 }, { lado: 'd', pos: 70, w: 100 }] },
    ambientes: [{ x: 150, z: 125, texto: 'Oficina', m2: '6,4 m²' }],
    extra: mesa({ L: 140, W: 60, H: 75, pata: 4.1, cub: 2.8, vuelo: 2 }).map((q) => ({ ...q, x: q.x + 130, y: q.y + 50, z: q.z + 175 })),
    notas: ['Pide al eléctrico un circuito independiente con enchufes suficientes para computador y calefactor.'],
  }),
  construccion({
    id: 'taller', nombre: 'Taller de madera 4 × 6 m',
    resumen: 'Taller con portón doble para entrar materiales, ventanas altas y mesón de trabajo.',
    dificultad: 3, tiempo: '4 a 5 semanas', personas: 2,
    e: { L: 600, W: 400, H: 260, cumbrera: 'x', alzada: 110, puertas: [{ lado: 'f', pos: 60, w: 200, h: 220 }], ventanas: [{ lado: 'f', pos: 380, w: 150, h: 80, alt: 140 }, { lado: 'b', pos: 100, w: 150, h: 80, alt: 140 }, { lado: 'b', pos: 350, w: 150, h: 80, alt: 140 }, { lado: 'd', pos: 140, w: 120 }] },
    ambientes: [{ x: 300, z: 200, texto: 'Taller', m2: '22 m²' }],
    notas: ['Para máquinas pesadas, refuerza las vigas de piso a cada 30 cm o haz un radier.'],
  }),
  construccion({
    id: 'garaje', nombre: 'Garaje de madera 3,5 × 6 m',
    resumen: 'Garaje para un auto con portón de madera, sobre radier de hormigón.',
    dificultad: 3, tiempo: '4 semanas', personas: 2,
    e: { L: 350, W: 600, H: 240, sinPiso: true, cumbrera: 'z', alzada: 100, puertas: [{ lado: 'f', pos: 40, w: 270, h: 215 }], ventanas: [{ lado: 'd', pos: 250, w: 100, h: 60, alt: 130 }] },
    ambientes: [{ x: 175, z: 300, texto: 'Garaje', m2: '19,6 m²' }],
    materiales: [{ item: 'Portón batiente de madera 2,7 × 2,15 m (2 hojas)', cantidad: '1 un.' }],
  }),
  estructura({
    id: 'carport', nombre: 'Cobertizo para auto (carport)',
    resumen: 'Techo abierto de 3 × 5,5 m sobre 6 pilares, con cubierta a un agua.',
    dificultad: 2, tiempo: '2 fines de semana', personas: 2,
    partes: abierto({ L: 300, W: 550, H: 230, pilar: 12, nx: 2, nz: 3, techo: 'uno', alzada: 30, mtecho: 'zinc' }),
    materiales: [{ item: 'Base metálica para pilar + poyo de hormigón', cantidad: '6 un.' }, { item: 'Perno coche ½" × 8"', cantidad: '12 un.' }, { item: 'Zinc acanalado 0,35 mm o policarbonato', cantidad: '≈ 19 m²' }, { item: 'Tornillo autoperforante con golilla para techo', cantidad: '150 un.' }, { item: 'Protector exterior', cantidad: '4 L' }],
    pasos: [
      { titulo: 'Trazado y poyos', detalle: 'Marca el rectángulo (diagonales iguales) y hormigona 6 poyos con base metálica.' },
      { titulo: 'Pilares', detalle: 'Fija y aploma los pilares 4×4" o 5×5", arriostrándolos provisoriamente.' },
      { titulo: 'Vigas', detalle: 'Abraza los pilares con vigas dobles 2×8" a cada lado y pernos coche.' },
      { titulo: 'Costaneras y cubierta', detalle: 'Coloca vigas de techo cada 60 cm con pendiente, costaneras y la cubierta.' },
      { titulo: 'Pies de amigo', detalle: 'Agrega diagonales a 45° en cada pilar para rigidizar.' },
    ],
  }),
  construccion({
    id: 'galpon', nombre: 'Galpón de madera 6 × 9 m',
    resumen: 'Galpón para guardar maquinaria, leña o herramientas, con portón grande y radier.',
    dificultad: 3, tiempo: '6 semanas', personas: 3,
    e: { L: 600, W: 900, H: 300, sinPiso: true, cumbrera: 'z', alzada: 180, puertas: [{ lado: 'f', pos: 150, w: 300, h: 270 }], ventanas: [{ lado: 'i', pos: 200, w: 150, h: 80, alt: 180 }, { lado: 'i', pos: 550, w: 150, h: 80, alt: 180 }, { lado: 'd', pos: 200, w: 150, h: 80, alt: 180 }, { lado: 'd', pos: 550, w: 150, h: 80, alt: 180 }] },
    ambientes: [{ x: 300, z: 450, texto: 'Galpón', m2: '51 m²' }],
    materiales: [{ item: 'Portón corredero o batiente 3 × 2,7 m', cantidad: '1 un.' }, { item: 'Cerchas de techo prefabricadas o armadas (luz 6 m)', cantidad: '16 un.' }],
    pasosExtra: [{ titulo: 'Cerchas', detalle: 'Para 6 m de luz usa cerchas cada 60 cm en vez de pares sueltos (ver plano de cerchas).' }],
  }),
  construccion({
    id: 'bodega-pequena', nombre: 'Bodega pequeña 2 × 1,5 m',
    resumen: 'Bodega compacta para herramientas de jardín, con techo a un agua.',
    dificultad: 1, tiempo: '1 fin de semana', personas: 2,
    e: { L: 200, W: 150, H: 190, piso: 25, techo: 'uno', alzada: 25, alero: 20, puertas: [{ lado: 'f', pos: 55, w: 90, h: 180 }] },
    ambientes: [{ x: 100, z: 75, texto: 'Bodega', chico: true }],
  }),
  construccion({
    id: 'bodega-adosada', nombre: 'Bodega adosada a muro 2,5 × 1,2 m',
    resumen: 'Cobertizo apoyado en un muro existente, con dos puertas y techo a un agua.',
    dificultad: 2, tiempo: '1 fin de semana', personas: 2,
    e: { L: 250, W: 120, H: 200, piso: 25, techo: 'uno', alto: 'b', alzada: 30, alero: 20, puertas: [{ lado: 'f', pos: 20, w: 100, h: 185 }, { lado: 'f', pos: 130, w: 100, h: 185 }] },
    extra: [entorno(caja(-120, 0, -60, 490, 300, 60, 'pared'))],
    ambientes: [{ x: 125, z: 60, texto: 'Bodega', chico: true }],
    pasosExtra: [{ titulo: 'Unión al muro', detalle: 'Fija una viga al muro con pernos de expansión y sella la unión del techo con un forro metálico.' }],
  }),
  estructura({
    id: 'corredor-techado', nombre: 'Corredor techado 6 × 2,5 m',
    resumen: 'Alero o corredor de madera adosado a la casa, con piso de deck.',
    dificultad: 2, tiempo: '2 fines de semana', personas: 2,
    partes: [...abierto({ L: 600, W: 250, H: 230, pilar: 12, nx: 3, nz: 2, techo: 'uno', alzada: 30, piso: 30, mtecho: 'zinc' }), entorno(caja(-100, 0, -320, 800, 330, 300, 'pared'))],
    materiales: [{ item: 'Viga de apoyo 2×8" anclada al muro', cantidad: '1 un.' }, { item: 'Perno de expansión ½"', cantidad: '8 un.' }, { item: 'Zinc o policarbonato', cantidad: '≈ 17 m²' }, { item: 'Forro metálico de unión al muro', cantidad: '6 m' }],
    pasos: [
      { titulo: 'Viga al muro', detalle: 'Ancla una viga a la casa con pernos de expansión, a la altura del alero.' },
      { titulo: 'Pilares', detalle: 'Instala 3 pilares sobre poyos, a 2,5 m de la casa.' },
      { titulo: 'Vigas y techo', detalle: 'Une pilares con vigas, coloca vigas de techo cada 60 cm con pendiente hacia afuera y la cubierta.' },
      { titulo: 'Piso', detalle: 'Arma un deck sobre polines con tablas impregnadas.' },
    ],
  }),
  estructura({
    id: 'terraza-techada', nombre: 'Terraza techada 4 × 4 m',
    resumen: 'Deck con techo a dos aguas sobre 4 pilares, para comer afuera todo el año.',
    dificultad: 2, tiempo: '3 fines de semana', personas: 2,
    partes: [...abierto({ L: 400, W: 400, H: 230, pilar: 14, nx: 2, nz: 2, piso: 40, alzada: 110 }), ...mesa({ L: 180, W: 90, H: 75, m: 'imp', tablas: 14 }).map((q) => ({ ...q, x: q.x + 110, y: q.y + 42.5, z: q.z + 155 }))],
    materiales: [{ item: 'Machihembrado 1×4" para cielo', cantidad: '≈ 20 m²' }, { item: 'Teja asfáltica y fieltro', cantidad: '≈ 22 m²' }, { item: 'Perno coche ½" × 8"', cantidad: '16 un.' }],
    pasos: [
      { titulo: 'Deck', detalle: 'Entierra polines y arma la plataforma a 40 cm con tablas impregnadas.' },
      { titulo: 'Pilares', detalle: 'Fija 4 pilares de 5×5" a la estructura del deck o a poyos propios.' },
      { titulo: 'Vigas', detalle: 'Vigas dobles 2×8" perimetrales con pernos.' },
      { titulo: 'Techo', detalle: 'Cumbrera, pares cada 60 cm, machihembrado a la vista y teja.' },
    ],
  }),
  estructura({
    id: 'kiosko', nombre: 'Kiosco de jardín 3,5 × 3,5 m',
    resumen: 'Glorieta elevada con baranda, bancas interiores y techo a dos aguas.',
    dificultad: 3, tiempo: '3 fines de semana', personas: 2,
    partes: [
      ...abierto({ L: 350, W: 350, H: 220, pilar: 12, nx: 2, nz: 2, piso: 35, alzada: 120, pies: true }),
      ...[0, 338].map((z) => caja(12, 37.5 + 85, z, 326, 9, 12, 'imp', 'Pasamanos')),
      caja(0, 37.5 + 85, 12, 12, 9, 326, 'imp', 'Pasamanos'),
      ...Array.from({ length: 24 }, (_, i) => caja(16 + i * 13.5, 37.5, 4, 4, 85, 2, 'imp', 'Balaustre')),
      ...Array.from({ length: 24 }, (_, i) => caja(4, 37.5, 16 + i * 13.5, 2, 85, 4, 'imp', 'Balaustre')),
      ...Array.from({ length: 24 }, (_, i) => caja(16 + i * 13.5, 37.5, 344, 4, 85, 2, 'imp', 'Balaustre')),
      caja(12, 37.5 + 42, 12, 326, 4, 40, 'imp', 'Banca'), caja(12, 37.5 + 42, 52, 40, 4, 286, 'imp', 'Banca'),
    ],
    materiales: [{ item: 'Teja asfáltica o tejuela', cantidad: '≈ 20 m²' }, { item: 'Perno coche ½" × 8"', cantidad: '16 un.' }],
    pasos: [
      { titulo: 'Plataforma', detalle: 'Arma un deck cuadrado de 3,5 m a 35 cm del suelo sobre polines.' },
      { titulo: 'Pilares y vigas', detalle: 'Levanta 4 pilares, vigas dobles y pies de amigo.' },
      { titulo: 'Techo', detalle: 'Cumbrera y pares cada 60 cm con cubierta de teja.' },
      { titulo: 'Baranda y bancas', detalle: 'Baranda de 85 cm en 3 lados y bancas fijas en dos de ellos.' },
    ],
  }),
  construccion({
    id: 'sauna', nombre: 'Sauna de madera 2,5 × 2 m',
    resumen: 'Sauna con vestidor, banco de dos niveles y estufa a leña o eléctrica.',
    dificultad: 3, tiempo: '3 semanas', personas: 2,
    e: { L: 250, W: 200, H: 210, piso: 40, alzada: 70, puertas: [{ lado: 'f', pos: 30, w: 70, h: 190 }], ventanas: [{ lado: 'f', pos: 150, w: 60, h: 60, alt: 110 }], tabiques: [{ x1: 12, z1: 120, x2: 238, z2: 120 }] },
    extra: [caja(190, 252, 60, 20, 80, 20, 'metal'), cil(200, 330, 70, 8, 60, 'metal')],
    ambientes: [{ x: 125, z: 60, texto: 'Sauna', chico: true }, { x: 125, z: 165, texto: 'Vestidor', chico: true }],
    materiales: [{ item: 'Estufa para sauna (leña o eléctrica) y piedras', cantidad: '1 un.' }, { item: 'Barrera de vapor de aluminio', cantidad: '25 m²' }, { item: 'Tablas de álamo, abeto o cedro sin nudos', cantidad: '≈ 25 m²', uso: 'Interior y bancos (no usar impregnado)' }],
    pasosExtra: [{ titulo: 'Interior de sauna', detalle: 'Usa lana mineral, barrera de vapor de aluminio y tablas sin resina; los bancos a 45 y 95 cm del piso.' }],
    notas: ['La chimenea debe tener aislación certificada al pasar por el techo.'],
  }),
  estructura({
    id: 'deck-tinaja', nombre: 'Deck con tinaja de agua caliente',
    resumen: 'Terraza de 4 × 4 m con espacio para una tinaja de madera de 1,9 m de diámetro.',
    dificultad: 3, tiempo: '3 fines de semana', personas: 2,
    partes: [...deck({ L: 400, W: 400, h: 50, baranda: false }), ...tinaja(270, 50, 150)],
    materiales: [{ item: 'Tinaja de madera con calefactor a leña', cantidad: '1 un.' }, { item: 'Pino impregnado 2×8" (refuerzo bajo la tinaja)', cantidad: '6 un.' }],
    pasos: [
      { titulo: 'Fundación reforzada', detalle: 'Una tinaja llena pesa más de 2 toneladas: bajo ella pon polines cada 60 cm o un poyo de hormigón.' },
      { titulo: 'Deck', detalle: 'Arma el deck con vigas cada 40 cm (30 cm bajo la tinaja).' },
      { titulo: 'Tinaja', detalle: 'Instala la tinaja con su calefactor y deja 50 cm de distancia del fuego a cualquier madera.' },
      { titulo: 'Escalón', detalle: 'Coloca el escalón de acceso y un desagüe hacia una zona de infiltración.' },
    ],
  }),
  estructura({
    id: 'mirador', nombre: 'Mirador elevado 2,5 × 2,5 m',
    resumen: 'Torre de madera con plataforma a 2,5 m, baranda, escalera y techo.',
    dificultad: 3, tiempo: '1 mes', personas: 3,
    partes: mirador(),
    materiales: [{ item: 'Perno coche ½" × 10"', cantidad: '24 un.' }, { item: 'Hormigón para 4 poyos', cantidad: '0,6 m³' }],
    pasos: [
      { titulo: 'Fundación', detalle: 'Hormigona 4 poyos de 60 × 60 × 80 cm con base metálica para los pilares.' },
      { titulo: 'Pilares y diagonales', detalle: 'Levanta los 4 pilares 6×6" y arriostra cada cara con diagonales.' },
      { titulo: 'Plataforma', detalle: 'Vigas 2×8" a 2,5 m, piso de tablas y baranda de 90 cm con balaustres cada 12 cm.' },
      { titulo: 'Escalera', detalle: 'Arma la escalera con zancas 2×10" y peldaños de 26 cm de huella.' },
      { titulo: 'Techo', detalle: 'Pares y cubierta a dos aguas sobre los pilares.' },
    ],
    notas: ['Estructura en altura: exige cálculo profesional.'],
  }),
  estructura({
    id: 'altillo-interior', nombre: 'Altillo interior',
    resumen: 'Entrepiso de madera de 3 × 2 m dentro de una pieza alta, con baranda y escalera.',
    dificultad: 3, tiempo: '1 fin de semana', personas: 2, escena: 'interior', unidad: 'cm',
    partes: altillo({ L: 300, W: 200, h: 220 }),
    materiales: [{ item: 'Colgador metálico de viga', cantidad: '12 un.' }, { item: 'Perno de anclaje a muro', cantidad: '8 un.' }],
    pasos: [
      { titulo: 'Viga al muro', detalle: 'Ancla una viga 2×8" al muro (a los pies derechos) a 2,2 m del piso.' },
      { titulo: 'Pilares', detalle: 'Coloca 2 pilares 3×3" en el borde libre con viga sobre ellos.' },
      { titulo: 'Vigas y piso', detalle: 'Vigas 2×6" cada 40 cm con colgadores y piso machihembrado.' },
      { titulo: 'Baranda y escalera', detalle: 'Baranda de 90 cm con balaustres cada 12 cm y escalera de gato.' },
    ],
    notas: ['Necesitas al menos 2 m bajo el altillo y 1 m sobre él.'],
  }),
  estructura({
    id: 'escalera-interior', nombre: 'Escalera interior de madera',
    resumen: 'Escalera recta de 2,6 m de altura con zancas, peldaños y pasamanos.',
    dificultad: 3, tiempo: '1 fin de semana', personas: 2, escena: 'interior', unidad: 'cm', planta: false,
    partes: escalera({ alto: 260, ancho: 90 }),
    materiales: [{ item: 'Escuadra metálica para peldaños', cantidad: '30 un.' }, { item: 'Barniz poliuretano para pisos', cantidad: '1 L' }],
    herramientas: ['Sierra circular', 'Caladora', 'Escuadra de carpintero', 'Taladro', 'Nivel'],
    pasos: [
      { titulo: 'Calcula', detalle: 'Divide la altura en contrahuellas de 17–18 cm y usa huellas de 27 cm (2 contrahuellas + huella ≈ 63 cm).' },
      { titulo: 'Zancas', detalle: 'Traza las zancas 2×10" con la escuadra y recórtalas con sierra circular y caladora.' },
      { titulo: 'Instala', detalle: 'Fija las zancas arriba a la viga del entrepiso y abajo al piso.' },
      { titulo: 'Peldaños y pasamanos', detalle: 'Atornilla los peldaños de 32 mm y el pasamanos a 90 cm.' },
    ],
  }),
  estructura({
    id: 'tabique-interior', nombre: 'Tabique interior con puerta',
    resumen: 'Muro divisorio de 3,6 m en pino 2×4" con vano de puerta; se ve la estructura y el revestimiento.',
    dificultad: 2, tiempo: '1 fin de semana', personas: 2, escena: 'interior', unidad: 'cm', planta: false, profesional: false,
    partes: tabique({ L: 360, H: 240 }),
    materiales: [{ item: 'Machihembrado 1×4" o placa de yeso-cartón', cantidad: '≈ 16 m²', uso: 'Ambas caras' }, { item: 'Lana mineral 50 mm (aislación acústica)', cantidad: '8 m²' }, { item: 'Puerta 80 × 200 cm con marco', cantidad: '1 un.' }, { item: 'Clavos 4"', cantidad: '1 kg' }],
    herramientas: ['Sierra circular', 'Martillo o clavadora', 'Nivel', 'Plomada', 'Huincha'],
    pasos: [
      { titulo: 'Soleras', detalle: 'Fija la solera inferior al piso y la superior al cielo, aplomadas una sobre otra.' },
      { titulo: 'Pies derechos', detalle: 'Coloca pies derechos cada 40 cm; dobles a cada lado de la puerta.' },
      { titulo: 'Dintel y cadenetas', detalle: 'Pon el dintel sobre la puerta y cadenetas a media altura.' },
      { titulo: 'Revestimiento', detalle: 'Aísla con lana y reviste ambas caras con machihembrado o yeso-cartón.' },
    ],
  }),
  estructura({
    id: 'cerchas', nombre: 'Techumbre con cerchas 6 × 4,8 m',
    resumen: 'Estructura de techo a dos aguas con cerchas de pino cada 60 cm, sobre vigas perimetrales.',
    dificultad: 3, tiempo: '2 semanas', personas: 3,
    partes: cerchas({ L: 600, W: 480, alzada: 160, paso: 60 }),
    materiales: [{ item: 'Placa conectora dentada o terciado 15 mm', cantidad: '≈ 60 un.', uso: 'Uniones de cerchas' }, { item: 'Placa OSB 11 mm', cantidad: '22 un.' }],
    pasos: [
      { titulo: 'Plantilla', detalle: 'Dibuja una cercha a escala real en el piso y corta todas las piezas iguales a partir de ella.' },
      { titulo: 'Arma las cerchas', detalle: 'Une tirante, pares, pendolón y diagonales con placas conectoras por ambos lados.' },
      { titulo: 'Levanta', detalle: 'Sube las cerchas cada 60 cm, aplómalas y arriostra con una tabla provisoria.' },
      { titulo: 'Cumbrera y OSB', detalle: 'Coloca la cumbrera, arriostres en cruz y el OSB de techo.' },
    ],
  }),
  estructura({
    id: 'glamping', nombre: 'Plataforma de glamping',
    resumen: 'Deck de 5 × 5,5 m con carpa de lona y terraza, para turismo o camping en el terreno.',
    dificultad: 2, tiempo: '2 fines de semana', personas: 3,
    partes: glamping({ L: 500, W: 400 }),
    materiales: [{ item: 'Carpa de lona tipo safari 4,2 × 3,6 m', cantidad: '1 un.' }],
    pasos: [
      { titulo: 'Polines', detalle: 'Entierra 20 polines en 4 filas y córtalos a nivel.' },
      { titulo: 'Plataforma', detalle: 'Vigas cada 40 cm y tablas deck con 5 mm de separación.' },
      { titulo: 'Carpa', detalle: 'Arma la estructura de la carpa y fíjala a la plataforma con argollas.' },
      { titulo: 'Baranda', detalle: 'Coloca la baranda de la terraza delantera.' },
    ],
  }),
  estructura({
    id: 'caseta-bano', nombre: 'Caseta de baño seco',
    resumen: 'Caseta de 1,2 × 1,3 m para baño seco compostable en parcelas o campings.',
    dificultad: 2, tiempo: '1 fin de semana', personas: 2,
    partes: casetaBano(),
    materiales: [{ item: 'Kit de baño seco (asiento separador)', cantidad: '1 un.' }, { item: 'Tubo de ventilación PVC 110 mm', cantidad: '2 m' }, { item: 'Zinc acanalado', cantidad: '2,5 m²' }],
    pasos: [
      { titulo: 'Base', detalle: 'Arma un bastidor elevado sobre 4 polines.' },
      { titulo: 'Muros', detalle: 'Bastidores de 2×3" revestidos con tinglado; la puerta con ventilación arriba.' },
      { titulo: 'Techo', detalle: 'Techo a un agua con zinc.' },
      { titulo: 'Ventilación', detalle: 'Instala el tubo de ventilación del baño seco saliendo sobre el techo.' },
    ],
    profesional: false,
  }),
  estructura({
    id: 'invernadero', nombre: 'Invernadero de madera 3 × 4 m',
    resumen: 'Invernadero con estructura de pino y policarbonato, con mesones de cultivo.',
    dificultad: 2, tiempo: '2 fines de semana', personas: 2,
    partes: invernadero({ L: 300, W: 400, H: 200 }),
    materiales: [{ item: 'Policarbonato alveolar 6 mm', cantidad: '≈ 40 m²' }, { item: 'Tornillo con golilla para policarbonato', cantidad: '300 un.' }, { item: 'Perfil de cierre para policarbonato', cantidad: '20 m' }],
    pasos: [
      { titulo: 'Base', detalle: 'Arma un marco de pino impregnado 2×8" nivelado sobre estacas o poyos.' },
      { titulo: 'Muros', detalle: 'Pies derechos 2×2" cada 60 cm con soleras arriba y abajo.' },
      { titulo: 'Techo', detalle: 'Pares cada 60 cm y cumbrera a 2,9 m.' },
      { titulo: 'Policarbonato', detalle: 'Atornilla las placas con las celdas en vertical y sella los extremos con perfil.' },
    ],
    profesional: false,
  }),
  construccion({
    id: 'caballeriza', nombre: 'Caballeriza para 2 caballos',
    resumen: 'Pesebrera de 7 × 4 m con 2 boxes, puertas holandesas y techo a un agua.',
    dificultad: 3, tiempo: '5 semanas', personas: 3,
    e: { L: 700, W: 400, H: 260, sinPiso: true, techo: 'uno', alzada: 60, alero: 60, puertas: [{ lado: 'f', pos: 100, w: 120, h: 220 }, { lado: 'f', pos: 450, w: 120, h: 220 }], ventanas: [{ lado: 'f', pos: 260, w: 100, h: 60, alt: 160 }, { lado: 'f', pos: 600, w: 70, h: 60, alt: 160 }], tabiques: [{ x1: 350, z1: 12, x2: 350, z2: 388 }] },
    ambientes: [{ x: 175, z: 200, texto: 'Box 1', m2: '13 m²' }, { x: 525, z: 200, texto: 'Box 2', m2: '13 m²' }],
    materiales: [{ item: 'Tablón 2×8" impregnado para muros interiores hasta 1,3 m', cantidad: '≈ 25 m²', uso: 'Resiste patadas' }],
    pasosExtra: [{ titulo: 'Refuerzo interior', detalle: 'Reviste el interior hasta 1,3 m con tablones 2×8" impregnados: el tinglado no resiste patadas.' }],
  }),
];
