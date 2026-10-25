import { caja, cil, entorno } from '../modelos.js';
import { mesa, mueble, cama, cajon, estante, silla } from '../familias.js';
import { cuna, cabeceroMuro } from '../especiales2.js';
import { plano } from './ayudas.js';

const cat = 'muebles';
const cola = { item: 'Cola fría para madera', cantidad: '250 ml' };
const lijas = { item: 'Lija grano 80, 120 y 180', cantidad: '2 pliegos c/u' };
const corredera = (n, l = 45) => ({ item: `Corredera telescópica ${l} cm (par)`, cantidad: `${n} un.` });
const bisagra = (n) => ({ item: 'Bisagra cazoleta 35 mm con cierre suave', cantidad: `${n} un.` });
const tirador = (n) => ({ item: 'Tirador metálico', cantidad: `${n} un.` });

// Frentes de cajón apilados en una o más columnas.
function cajones(L, H, y0, filas, cols = 1) {
  const f = [];
  const w = L / cols;
  const h = (H - y0) / filas;
  for (let c = 0; c < cols; c++) for (let i = 0; i < filas; i++) f.push({ tipo: 'cajon', x: c * w + 0.2, y: y0 + i * h + 0.2, w: w - 0.4, h: h - 0.4 });
  return f;
}

const pasosMesa = (extra = []) => [
  ['Corta y cepilla', 'Corta patas, faldones y tablas de cubierta según la lista de cortes. Lija las piezas antes de armar.'],
  ['Bastidor', 'Une los faldones a las patas con cola y 2 tornillos avellanados por unión (o tarugos). Revisa la escuadra midiendo las diagonales.'],
  ...extra,
  ['Cubierta', 'Encola las tablas de cubierta con prensas o atorníllala desde abajo con escuadras metálicas, dejando que la madera se mueva.'],
  ['Termina', 'Rompe los cantos con lija 120, aspira el polvo y aplica 2 manos de barniz o aceite.'],
];

const pasosMueble = (extra = []) => [
  ['Corta el tablero', 'Pide el corte en la barraca o córtalo con guía: costados, base, techo, repisas y frentes. Tapa los cantos vistos con tapacanto.'],
  ['Caja', 'Une los costados con la base y el techo usando tornillos avellanados de 4 × 50 mm cada 15 cm y cola.'],
  ['Fondo', 'Clava o atornilla el fondo de 3 mm: así el mueble queda a escuadra.'],
  ...extra,
  ['Termina', 'Nivela el mueble, ajusta frentes y bisagras, y fíjalo al muro si es alto.'],
];

const pasosCama = (extra = []) => [
  ['Cortes', 'Corta postes, largueros, travesaños y tablas del respaldo según la lista de cortes.'],
  ['Respaldo', 'Arma el respaldo uniendo las tablas a los postes con tornillos avellanados y cola.'],
  ['Largueros', 'Une los largueros a los postes con herraje de cama desmontable y pon un listón de apoyo a lo largo, por dentro.'],
  ...extra,
  ['Tablillas', 'Atornilla las tablillas sobre los listones, separadas máximo 7 cm, y pon una viga central si la cama es de 1,5 plazas o más.'],
  ['Termina', 'Lija, barniza y monta el colchón.'],
];

export default [
  plano({
    id: 'mesa-cocina', categoria: cat, nombre: 'Mesa de cocina 4 personas',
    resumen: 'Mesa sencilla de 120 × 75 cm para la cocina o un comedor chico.',
    dificultad: 1, tiempo: '1 día',
    partes: mesa({ L: 120, W: 75, H: 76 }),
    materiales: [cola, lijas],
    pasos: pasosMesa(),
  }),
  plano({
    id: 'mesa-comedor-8', categoria: cat, nombre: 'Mesa de comedor 8 personas',
    resumen: 'Mesa grande de 2,4 m con patas gruesas y travesaños bajos para que no se mueva.',
    dificultad: 2, tiempo: '1 fin de semana', personas: 2,
    partes: mesa({ L: 240, W: 100, H: 76, pata: 9, cub: 4.5, fald: 11, trav: 15 }),
    materiales: [cola, lijas, { item: 'Escuadra metálica para cubierta', cantidad: '10 un.' }],
    pasos: pasosMesa([['Travesaños', 'Atornilla los travesaños bajos de lado a lado y el central a lo largo, a 15 cm del suelo.']]),
    litros: 2,
  }),
  plano({
    id: 'mesa-tablones', categoria: cat, nombre: 'Mesa rústica de tablones',
    resumen: 'Mesa de comedor de 2 m con cubierta de tablas anchas y terminación oscura.',
    dificultad: 2, tiempo: '1 fin de semana',
    partes: mesa({ L: 200, W: 90, H: 76, pata: 9, tablas: 15, sep: 0.3, m: 'oscuro' }),
    materiales: [cola, lijas, { item: 'Tinte nogal al agua', cantidad: '1 L' }],
    pasos: pasosMesa([['Une las tablas', 'Junta las tablas de cubierta con tarugos o galletas cada 30 cm y presiónalas con prensas toda la noche.']]),
  }),
  plano({
    id: 'escritorio-cajon', categoria: cat, nombre: 'Escritorio con cajón',
    resumen: 'Escritorio de 120 × 60 cm con un cajón al centro para lápices y cuadernos.',
    dificultad: 2, tiempo: '1 día',
    partes: mesa({ L: 120, W: 60, H: 75, pata: 5, cub: 2.8, cajon: true }),
    materiales: [cola, lijas, corredera(1, 40), tirador(1)],
    pasos: pasosMesa([['Cajón', 'Arma una caja de 48 × 40 cm con tablero de 15 mm, instala las correderas en los faldones de apoyo y atornilla el frente desde dentro.']]),
  }),
  plano({
    id: 'escritorio-pie', categoria: cat, nombre: 'Escritorio para trabajar de pie',
    resumen: 'Mesa alta de 105 cm con travesaños, para trabajar de pie o con piso alto.',
    dificultad: 1, tiempo: '1 día',
    partes: mesa({ L: 120, W: 60, H: 105, pata: 5, cub: 2.8, trav: 20, repisa: 20 }),
    materiales: [cola, lijas],
    pasos: pasosMesa([['Repisa baja', 'Apoya la repisa sobre los travesaños y atorníllala desde abajo.']]),
  }),
  plano({
    id: 'mesa-arrimo-repisa', categoria: cat, nombre: 'Mesa de arrimo con repisa',
    resumen: 'Mesita de 50 × 40 cm para el lado del sillón, con repisa para revistas.',
    dificultad: 1, tiempo: '½ día',
    partes: mesa({ L: 50, W: 40, H: 60, pata: 4, cub: 2.5, fald: 6, vuelo: 2, repisa: 15 }),
    materiales: [cola, lijas],
    pasos: pasosMesa([['Repisa', 'Atornilla la repisa a las patas a 15 cm del suelo con tornillos avellanados por fuera.']]),
    litros: 0.5,
  }),
  plano({
    id: 'banco-pie-cama', categoria: cat, nombre: 'Banca a los pies de la cama',
    resumen: 'Banca de 120 cm con repisa abajo para zapatos o mantas.',
    dificultad: 1, tiempo: '1 día',
    partes: mesa({ L: 120, W: 40, H: 45, pata: 6, cub: 3, fald: 7, vuelo: 2, tablas: 13, repisa: 12 }),
    materiales: [cola, lijas],
    pasos: pasosMesa(),
  }),
  plano({
    id: 'carro-cocina', categoria: cat, nombre: 'Carro de cocina con ruedas',
    resumen: 'Mesón auxiliar con ruedas y repisa, para picar o servir donde se necesite.',
    dificultad: 2, tiempo: '1 día',
    partes: [...mesa({ L: 70, W: 45, H: 85, pata: 5, cub: 3, fald: 6, vuelo: 2, repisa: 15 }), ...[[4, 4], [61, 4], [4, 36], [61, 36]].map(([x, z]) => cil(x + 2.5, -5, z + 2.5, 3, 5, 'fuego'))],
    materiales: [cola, lijas, { item: 'Rueda giratoria 50 mm con freno', cantidad: '4 un.' }, { item: 'Barra para paños', cantidad: '1 un.' }],
    pasos: pasosMesa([['Ruedas', 'Atornilla una rueda bajo cada pata con tornillos de 4 × 30 mm; deja las dos con freno al mismo lado.']]),
    litros: 0.5,
  }),
  plano({
    id: 'piso-alto-cocina', categoria: cat, nombre: 'Piso alto para isla o barra',
    resumen: 'Piso de 75 cm de altura con apoyapiés, para isla de cocina o barra.',
    dificultad: 2, tiempo: '½ día',
    partes: silla({ A: 38, P: 38, hs: 75, pata: 4, apoyapies: 30 }),
    materiales: [cola, lijas],
    pasos: [
      ['Cortes', 'Corta 4 patas de 73 cm, faldones y travesaños. Lija antes de armar.'],
      ['Laterales', 'Arma dos laterales (2 patas + faldón + travesaño) con cola y tornillos avellanados.'],
      ['Une', 'Une los laterales con los faldones y el apoyapiés delantero a 30 cm del suelo.'],
      ['Asiento', 'Atornilla las 3 tablas de asiento desde abajo y redondea los cantos.'],
    ],
    litros: 0.5,
  }),
  plano({
    id: 'banqueta-baja', categoria: cat, nombre: 'Banqueta baja',
    resumen: 'Pisito de 25 cm para alcanzar el lavamanos o sentarse en el jardín.',
    dificultad: 1, tiempo: '2 horas',
    partes: silla({ A: 35, P: 30, hs: 25, pata: 3.5, apoyapies: 8 }),
    materiales: [cola, lijas],
    pasos: [
      ['Cortes', 'Corta patas, faldones y tablas de asiento.'],
      ['Arma', 'Une patas y faldones con cola y tornillos, y luego los travesaños bajos.'],
      ['Asiento', 'Atornilla el asiento y redondea todos los cantos.'],
    ],
    litros: 0.25,
  }),
  plano({
    id: 'silla-respaldo-alto', categoria: cat, nombre: 'Silla de respaldo alto',
    resumen: 'Silla de comedor firme con respaldo de dos travesaños.',
    dificultad: 2, tiempo: '1 día',
    partes: silla({ A: 44, P: 44, hs: 46, hr: 100, pata: 4 }),
    materiales: [cola, lijas],
    pasos: [
      ['Cortes', 'Corta 2 patas traseras de 100 cm y 2 delanteras de 44 cm, faldones, travesaños y respaldos.'],
      ['Respaldo', 'Une las patas traseras con los dos travesaños de respaldo y el faldón trasero.'],
      ['Frente', 'Une las patas delanteras con su faldón y luego ambos lados con los faldones laterales.'],
      ['Asiento', 'Atornilla las tablas de asiento, lija y aplica barniz.'],
    ],
    litros: 0.5,
  }),
  plano({
    id: 'comoda-6-cajones', categoria: cat, nombre: 'Cómoda de 6 cajones',
    resumen: 'Cómoda ancha de 120 cm con dos columnas de tres cajones.',
    dificultad: 3, tiempo: '1 fin de semana',
    partes: mueble({ L: 120, W: 45, H: 85, base: 'zocalo', hb: 8, sobre: 2.8, divisiones: [59.1], frentes: cajones(120, 82, 8, 3, 2) }),
    materiales: [corredera(6, 40), tirador(6), { item: 'Tapacanto de melamina o madera', cantidad: '15 m' }],
    pasos: pasosMueble([['Cajones', 'Arma 6 cajas de cajón de 56 × 40 cm, instala las correderas y luego atornilla los frentes desde dentro dejando 3 mm de luz entre ellos.']]),
  }),
  plano({
    id: 'cajonera-3', categoria: cat, nombre: 'Cajonera de 3 cajones',
    resumen: 'Cajonera angosta de 50 cm para el dormitorio o bajo el escritorio.',
    dificultad: 2, tiempo: '1 día',
    partes: mueble({ L: 50, W: 45, H: 70, base: 'patas', hb: 12, frentes: cajones(50, 70, 12, 3) }),
    materiales: [corredera(3, 40), tirador(3)],
    pasos: pasosMueble([['Cajones', 'Arma 3 cajones de 43 × 40 cm, pon las correderas y alinea los frentes con calzas de 3 mm.'], ['Patas', 'Atornilla las 4 patas bajo la base, a 1 cm de cada borde.']]),
    litros: 0.5,
  }),
  plano({
    id: 'velador-puerta', categoria: cat, nombre: 'Velador con cajón y puerta',
    resumen: 'Velador de 45 cm con un cajón arriba y una puerta abajo.',
    dificultad: 2, tiempo: '1 día',
    partes: mueble({ L: 45, W: 38, H: 60, base: 'patas', hb: 14, frentes: [{ tipo: 'cajon', x: 0.2, y: 46, w: 44.6, h: 13.8 }, { tipo: 'puerta', x: 0.2, y: 14.2, w: 44.6, h: 31.4, lado: 'der' }], repisas: [44] }),
    materiales: [corredera(1, 35), bisagra(2), tirador(2)],
    pasos: pasosMueble([['Frentes', 'Instala el cajón y la puerta con 2 bisagras cazoleta; regula hasta que las luces queden parejas.']]),
    litros: 0.5,
  }),
  plano({
    id: 'ropero-2-puertas', categoria: cat, nombre: 'Ropero de 2 puertas y 2 cajones',
    resumen: 'Ropero de 100 cm con barra para colgar, repisa superior y dos cajones abajo.',
    dificultad: 3, tiempo: '1 fin de semana', personas: 2,
    partes: mueble({ L: 100, W: 58, H: 200, base: 'zocalo', hb: 8, repisas: [40, 170], frentes: [...cajones(100, 40, 8, 2), { tipo: 'puerta', x: 0.2, y: 40.2, w: 49.6, h: 159.6, lado: 'der' }, { tipo: 'puerta', x: 50.2, y: 40.2, w: 49.6, h: 159.6, lado: 'izq' }] }),
    materiales: [corredera(2, 50), bisagra(8), tirador(4), { item: 'Barra de closet ovalada con soportes', cantidad: '1 m' }],
    pasos: pasosMueble([['Interior', 'Fija la repisa de los cajones y la superior; atornilla la barra de colgar 5 cm bajo la repisa alta.'], ['Puertas', 'Instala 4 bisagras por puerta y regula. Ancla el ropero al muro con 2 escuadras.']]),
  }),
  plano({
    id: 'biblioteca-alta', categoria: cat, nombre: 'Biblioteca alta',
    resumen: 'Biblioteca de 90 × 200 cm con 6 niveles para libros.',
    dificultad: 1, tiempo: '1 día',
    partes: estante({ L: 90, W: 30, H: 200, niveles: 6 }),
    materiales: [{ item: 'Escuadra antivuelco para muro', cantidad: '2 un.' }],
    pasos: pasosMueble([['Repisas', 'Marca las repisas cada 37 cm en ambos costados y atorníllalas desde fuera con 3 tornillos por lado.']]),
  }),
  plano({
    id: 'estante-bajo-largo', categoria: cat, nombre: 'Estante bajo largo',
    resumen: 'Estante de 160 × 80 cm bajo la ventana, para libros, canastos o plantas.',
    dificultad: 1, tiempo: '½ día',
    partes: estante({ L: 160, W: 35, H: 80, niveles: 3 }),
    materiales: [],
    pasos: pasosMueble([['Refuerzo', 'Como es largo, agrega una división central bajo la repisa del medio para que no se arquee.']]),
  }),
  plano({
    id: 'columna-bano', categoria: cat, nombre: 'Mueble columna de baño',
    resumen: 'Columna angosta de 40 × 170 cm con puerta abajo y repisas abiertas arriba.',
    dificultad: 2, tiempo: '1 día',
    partes: mueble({ L: 40, W: 30, H: 170, base: 'zocalo', hb: 8, repisas: [70, 105, 140], frentes: [{ tipo: 'puerta', x: 0.2, y: 8.2, w: 39.6, h: 62, lado: 'der' }] }),
    materiales: [bisagra(2), tirador(1)],
    pasos: pasosMueble([['Humedad', 'Sella todos los cantos con barniz o tapacanto: en el baño el tablero se hincha si le entra agua.']]),
  }),
  plano({
    id: 'despensa', categoria: cat, nombre: 'Mueble despensa',
    resumen: 'Despensa de 60 × 180 cm con 2 puertas y 5 repisas para la cocina.',
    dificultad: 2, tiempo: '1 día',
    partes: mueble({ L: 60, W: 45, H: 180, base: 'zocalo', hb: 8, repisas: [40, 72, 104, 136], frentes: [{ tipo: 'puerta', x: 0.2, y: 8.2, w: 59.6, h: 80, lado: 'der' }, { tipo: 'puerta', x: 0.2, y: 88.6, w: 59.6, h: 91.2, lado: 'der' }] }),
    materiales: [bisagra(6), tirador(2)],
    pasos: pasosMueble([['Puertas', 'Instala 3 bisagras por puerta y fija el mueble al muro.']]),
  }),
  plano({
    id: 'mueble-vinilos', categoria: cat, nombre: 'Mueble para tocadiscos y vinilos',
    resumen: 'Mueble bajo con patas, cuatro casilleros para discos y cubierta para el tocadiscos.',
    dificultad: 2, tiempo: '1 día',
    partes: mueble({ L: 130, W: 40, H: 65, base: 'patas', hb: 20, sobre: 2.8, divisiones: [32, 64.1, 96.2] }),
    materiales: [],
    pasos: pasosMueble([['Divisiones', 'Instala las 3 divisiones a 32 cm entre ellas: los vinilos de 31,5 cm entran justos.'], ['Patas', 'Atornilla las patas por dentro de la base.']]),
  }),
  plano({
    id: 'consola-flotante', categoria: cat, nombre: 'Mueble flotante de TV',
    resumen: 'Mueble de 160 cm colgado del muro, con dos cajones abatibles.',
    dificultad: 2, tiempo: '1 día',
    partes: [entorno(caja(-30, -40, -3, 220, 220, 3, 'pared')), ...mueble({ L: 160, W: 35, H: 35, base: 'nada', hb: 0, divisiones: [79.1], frentes: cajones(160, 35, 0, 1, 2) }).map((q) => ({ ...q, y: q.y + 40 }))],
    materiales: [corredera(2, 30), { item: 'Riel francés (colgador) 150 cm', cantidad: '1 un.' }, { item: 'Tarugo y tornillo para muro', cantidad: '8 un.' }],
    pasos: pasosMueble([['Cuelga', 'Atornilla el riel francés al muro con tarugos cada 40 cm (bien nivelado) y engancha el mueble a 40 cm del suelo.']]),
    litros: 0.5,
  }),
  plano({
    id: 'vinoteca', categoria: cat, nombre: 'Vinoteca con casilleros',
    resumen: 'Mueble de 60 × 90 cm con casilleros cuadrados para 20 botellas.',
    dificultad: 2, tiempo: '1 día',
    partes: mueble({ L: 60, W: 30, H: 90, base: 'zocalo', hb: 6, repisas: [21, 37, 53, 69], divisiones: [14.4, 28.2, 42] }),
    materiales: [],
    pasos: pasosMueble([['Casilleros', 'Ranura repisas y divisiones a media madera para que se crucen, o atorníllalas por tramos.']]),
    litros: 0.5,
  }),
  plano({
    id: 'cuna', categoria: cat, nombre: 'Cuna de bebé',
    resumen: 'Cuna para colchón de 60 × 120 cm con barrotes y somier.',
    dificultad: 3, tiempo: '1 fin de semana',
    partes: cuna(),
    materiales: [cola, lijas, { item: 'Herraje de cama desmontable', cantidad: '8 un.' }, { item: 'Colchón de cuna 60 × 120 cm', cantidad: '1 un.' }],
    pasos: pasosCama([['Barrotes', 'Taladra los largueros y encola los barrotes; la separación entre barrotes no debe pasar de 6 cm.']]),
    notas: ['Entre barrotes deja máximo 6 cm: es la norma de seguridad para cunas.', 'Termina solo con barniz al agua no tóxico.'],
  }),
  plano({
    id: 'cabecero-muro', categoria: cat, nombre: 'Cabecero de tablas con veladores',
    resumen: 'Respaldo de cama fijo al muro, de tablas alternadas, con dos veladores flotantes.',
    dificultad: 1, tiempo: '1 día',
    partes: cabeceroMuro(),
    materiales: [{ item: 'Listón 2×2" para bastidor', cantidad: '6 m' }, { item: 'Tarugo y tornillo para muro', cantidad: '12 un.' }, { item: 'Escuadra oculta para repisa', cantidad: '4 un.' }],
    pasos: [
      ['Bastidor', 'Atornilla 3 listones horizontales al muro con tarugos, bien nivelados.'],
      ['Tablas', 'Clava o atornilla las tablas verticales sobre los listones, alternando tonos, separadas 5 mm.'],
      ['Veladores', 'Fija las escuadras ocultas al muro y desliza los veladores a la altura del colchón.'],
    ],
  }),
  plano({
    id: 'cama-plataforma', categoria: cat, nombre: 'Cama plataforma 2 plazas',
    resumen: 'Cama baja de estilo nórdico para colchón de 160 × 200 cm.',
    dificultad: 2, tiempo: '1 fin de semana',
    partes: cama({ W: 160, Lc: 200, respaldo: 110, alto: 30, poste: 9, m: 'oscuro' }),
    materiales: [cola, lijas, { item: 'Herraje de cama desmontable', cantidad: '4 pares' }],
    pasos: pasosCama(),
  }),
  plano({
    id: 'cama-plaza-media', categoria: cat, nombre: 'Cama 1½ plaza con piecera',
    resumen: 'Cama para colchón de 105 × 190 cm con respaldo y piecera.',
    dificultad: 2, tiempo: '1 fin de semana',
    partes: cama({ W: 105, Lc: 190, respaldo: 95, piecera: 50 }),
    materiales: [cola, lijas, { item: 'Herraje de cama desmontable', cantidad: '4 pares' }],
    pasos: pasosCama([['Piecera', 'Arma la piecera igual que el respaldo, con dos tablas.']]),
  }),
  plano({
    id: 'cama-king', categoria: cat, nombre: 'Cama king',
    resumen: 'Cama grande para colchón de 180 × 200 cm con respaldo alto.',
    dificultad: 3, tiempo: '1 fin de semana', personas: 2,
    partes: cama({ W: 180, Lc: 200, respaldo: 120, poste: 9 }),
    materiales: [cola, lijas, { item: 'Herraje de cama desmontable', cantidad: '4 pares' }, { item: 'Pata central regulable', cantidad: '2 un.' }],
    pasos: pasosCama(),
    litros: 2,
  }),
  plano({
    id: 'banca-zapatos', categoria: cat, nombre: 'Banca zapatero de entrada',
    resumen: 'Banca de 100 cm para sentarse a sacarse los zapatos, con dos niveles abajo.',
    dificultad: 1, tiempo: '½ día',
    partes: [...estante({ L: 100, W: 35, H: 48, niveles: 3, zocalo: 4, fondo: false }), caja(2, 48, 1, 96, 6, 33, 'cojin')],
    materiales: [{ item: 'Cojín de 96 × 33 cm', cantidad: '1 un.' }],
    pasos: pasosMueble(),
    litros: 0.5,
  }),
  plano({
    id: 'baul', categoria: cat, nombre: 'Baúl de tablas',
    resumen: 'Baúl de 80 × 45 cm con tapa para guardar mantas o juguetes.',
    dificultad: 1, tiempo: '1 día',
    partes: cajon({ L: 80, W: 45, H: 45, tabla: 14, esp: 2, poste: 4, tapa: true, fondo: true, m: 'pino' }),
    materiales: [{ item: 'Bisagra piano 75 cm', cantidad: '1 un.' }, { item: 'Compás de tapa (freno)', cantidad: '1 un.' }, { item: 'Manilla de baúl', cantidad: '2 un.' }],
    pasos: [
      ['Caja', 'Atornilla las tablas de los lados a los 4 postes de esquina, por dentro.'],
      ['Fondo', 'Coloca el fondo apoyado en listones atornillados a los postes.'],
      ['Tapa', 'Une las tablas de la tapa con dos listones por debajo e instala la bisagra piano y el compás.'],
      ['Termina', 'Atornilla las manillas a los costados, lija y barniza.'],
    ],
  }),
  plano({
    id: 'perchero-muro', categoria: cat, nombre: 'Perchero de muro con repisa',
    resumen: 'Tabla con 5 colgadores y una repisa encima, para la entrada.',
    dificultad: 1, tiempo: '2 horas',
    partes: [entorno(caja(-20, 100, -3, 140, 120, 3, 'pared')), caja(0, 150, 0, 100, 14, 2, 'pino', 'Respaldo'), caja(0, 164, 0, 100, 2, 20, 'pino', 'Repisa'), caja(10, 152, 2, 2, 10, 14, 'pino', 'Escuadra'), caja(88, 152, 2, 2, 10, 14, 'pino', 'Escuadra'), ...[16, 33, 50, 67, 84].map((x) => cil(x, 154, 2, 1, 7, 'pino', 'z'))],
    materiales: [{ item: 'Tarugo de madera 20 mm (colgadores)', cantidad: '5 un. de 9 cm' }, { item: 'Tarugo y tornillo para muro', cantidad: '3 un.' }],
    pasos: [
      ['Colgadores', 'Taladra 5 agujeros de 20 mm, inclinados 10°, y encola los tarugos.'],
      ['Repisa', 'Atornilla la repisa al respaldo desde atrás y las dos escuadras bajo ella.'],
      ['Cuelga', 'Fija al muro con 3 tornillos y tarugos, bien nivelado.'],
    ],
    litros: 0.25,
  }),
  plano({
    id: 'espejo-pie', categoria: cat, nombre: 'Espejo de pie con marco',
    resumen: 'Marco de madera de 60 × 170 cm para un espejo cuerpo entero, con pata de apoyo.',
    dificultad: 1, tiempo: '½ día',
    partes: [caja(0, 0, 0, 7, 170, 3, 'pino', 'Marco'), caja(53, 0, 0, 7, 170, 3, 'pino', 'Marco'), caja(7, 0, 0, 46, 7, 3, 'pino', 'Marco'), caja(7, 163, 0, 46, 7, 3, 'pino', 'Marco'), caja(7, 7, 1.5, 46, 156, 0.4, 'vidrio'), caja(26, 0, -45, 8, 4, 45, 'pino', 'Pata de apoyo')],
    materiales: [{ item: 'Espejo 4 mm de 48 × 158 cm', cantidad: '1 un.' }, { item: 'Bisagra pequeña', cantidad: '2 un.' }, cola],
    pasos: [
      ['Marco', 'Corta los 4 lados con rebaje de 1 × 1 cm por detrás, encólalos y une las esquinas con tornillos de 6 cm.'],
      ['Espejo', 'Apoya el espejo en el rebaje y fíjalo con grapas o listoncitos. Cierra con una placa de 3 mm.'],
      ['Pata', 'Instala la pata de apoyo con 2 bisagras para que el espejo quede inclinado 10°.'],
    ],
    litros: 0.25,
  }),
  plano({
    id: 'tablero-herramientas', categoria: cat, nombre: 'Panel organizador perforado',
    resumen: 'Tablero perforado de 120 × 60 cm con repisa, para el taller o la cocina.',
    dificultad: 1, tiempo: '2 horas',
    partes: [entorno(caja(-20, 80, -3, 160, 120, 3, 'pared')), caja(0, 110, 0, 120, 3, 3, 'pino', 'Listón'), caja(0, 165, 0, 120, 3, 3, 'pino', 'Listón'), caja(0, 108, 3, 120, 64, 0.9, 'tablero', 'Panel'), caja(0, 120, 3.9, 120, 1.8, 15, 'pino', 'Repisa'), ...[10, 30, 50, 70, 90, 110].map((x) => cil(x, 150, 4, 0.4, 6, 'metal', 'z'))],
    materiales: [{ item: 'Tablero perforado (pegboard) 9 mm', cantidad: '1 de 60 × 120 cm' }, { item: 'Ganchos para pegboard', cantidad: '1 set' }, { item: 'Tarugo y tornillo para muro', cantidad: '6 un.' }],
    pasos: [
      ['Listones', 'Atornilla 2 listones de 3 × 3 cm al muro: dejan espacio para que entren los ganchos.'],
      ['Panel', 'Atornilla el tablero perforado a los listones.'],
      ['Repisa', 'Agrega la repisa con 2 escuadras y ordena las herramientas.'],
    ],
    acabado: false,
  }),
];
