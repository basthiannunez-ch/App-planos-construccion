import { mesa, mueble, cama, estante, silla } from '../familias.js';
import { repisaFlotante } from '../especiales.js';

// Planos de muebles de interior. Coordenadas en centímetros, eje Y hacia abajo.

const tablillasCama = Array.from({ length: 12 }, (_, i) => ({ tipo: 'oculto', x: 4, y: 22 + i * 14.5, w: 152, h: 8 }));

export default [
  {
    id: 'mesa-comedor', categoria: 'muebles', nombre: 'Mesa de comedor',
    modelo: mesa({ L: 180, W: 90, H: 75, tablas: 18.5, sep: 0.2, fald: 10 }),
    resumen: 'Mesa robusta de pino para 6 personas, con faldones y patas de 7×7 cm.',
    medidas: { largo: 180, ancho: 90, alto: 75 }, unidad: 'cm', dificultad: 2, tiempo: '2 fines de semana', personas: 1,
    vistas: [
      { nombre: 'Frente', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 180, h: 4 }, { tipo: 'madera', x: 10, y: 4, w: 7, h: 71 },
          { tipo: 'madera', x: 163, y: 4, w: 7, h: 71 }, { tipo: 'madera', x: 17, y: 4, w: 146, h: 10 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 180, y2: 0, off: -14 }, { x1: 180, y1: 0, x2: 180, y2: 75, off: 14 },
          { x1: 17, y1: 75, x2: 163, y2: 75, off: 14 },
        ] },
      { nombre: 'Lateral', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 90, h: 4 }, { tipo: 'madera', x: 10, y: 4, w: 7, h: 71 },
          { tipo: 'madera', x: 73, y: 4, w: 7, h: 71 }, { tipo: 'madera', x: 17, y: 4, w: 56, h: 10 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 90, y2: 0, off: -14 }, { x1: 90, y1: 0, x2: 90, y2: 75, off: 14 },
        ] },
    ],
    materiales: [
      { item: 'Tabla pino cepillado 2×8" (41×185 mm), 1,8 m', cantidad: '5 un.', uso: 'Cubierta' },
      { item: 'Pino cepillado 3×3" (70×70 mm), 3,2 m', cantidad: '1 un.', uso: '4 patas de 71 cm' },
      { item: 'Tabla pino cepillado 1×4" (19×95 mm), 3,2 m', cantidad: '2 un.', uso: 'Faldones (2 × 146 y 2 × 56 cm)' },
      { item: 'Tornillo para madera 8 × 2½"', cantidad: '40 un.' },
      { item: 'Escuadra metálica o clip para cubierta', cantidad: '10 un.' },
      { item: 'Cola fría para madera', cantidad: '250 ml' },
      { item: 'Lija grano 80, 120 y 180', cantidad: '3 pliegos c/u' },
      { item: 'Aceite o barniz para muebles', cantidad: '1 L' },
    ],
    herramientas: ['Sierra circular o ingletadora', 'Taladro atornillador', 'Brocas para madera', 'Prensas (mínimo 4)', 'Escuadra y huincha', 'Lijadora orbital'],
    pasos: [
      { titulo: 'Corta las piezas', detalle: 'Corta las 4 patas a 71 cm, 2 faldones largos de 146 cm y 2 cortos de 56 cm. Revisa que los cortes queden a escuadra.' },
      { titulo: 'Arma la cubierta', detalle: 'Encola los cantos de las 5 tablas, júntalas con prensas y deja secar 24 h. Recorta a 180 × 90 cm.' },
      { titulo: 'Arma el marco', detalle: 'Une faldones y patas con cola y 2 tornillos por unión, dejando los faldones al ras de la parte superior de las patas.' },
      { titulo: 'Comprueba la escuadra', detalle: 'Mide las dos diagonales del marco: deben ser iguales. Ajusta antes de que seque la cola.' },
      { titulo: 'Fija la cubierta', detalle: 'Centra la cubierta sobre el marco (5 cm de vuelo a cada lado) y fíjala con escuadras o clips para que la madera pueda dilatarse.' },
      { titulo: 'Lija y termina', detalle: 'Lija con grano 80, 120 y 180. Aplica 2 o 3 manos de aceite o barniz, lijando suave entre manos.' },
    ],
    notas: ['Usa madera seca (humedad bajo 15 %) para evitar que la cubierta se tuerza.', 'Pre-perfora siempre cerca de los extremos para no partir la madera.'],
  },
  {
    id: 'escritorio', categoria: 'muebles', nombre: 'Escritorio',
    modelo: mesa({ L: 120, W: 60, H: 75, pata: 4.1, cub: 2.8, fald: 8, vuelo: 3, trav: 10, cajon: true }),
    resumen: 'Escritorio de pino de 120 cm con travesaño bajo para apoyar los pies.',
    medidas: { largo: 120, ancho: 60, alto: 75 }, unidad: 'cm', dificultad: 1, tiempo: '1 día', personas: 1,
    vistas: [
      { nombre: 'Frente', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 120, h: 3 }, { tipo: 'madera', x: 3, y: 3, w: 5, h: 72 },
          { tipo: 'madera', x: 112, y: 3, w: 5, h: 72 }, { tipo: 'madera', x: 8, y: 3, w: 104, h: 8 },
          { tipo: 'madera', x: 8, y: 60, w: 104, h: 5 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 120, y2: 0, off: -12 }, { x1: 120, y1: 0, x2: 120, y2: 75, off: 12 },
        ] },
      { nombre: 'Lateral', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 60, h: 3 }, { tipo: 'madera', x: 3, y: 3, w: 5, h: 72 },
          { tipo: 'madera', x: 52, y: 3, w: 5, h: 72 }, { tipo: 'madera', x: 8, y: 3, w: 44, h: 8 },
          { tipo: 'madera', x: 8, y: 60, w: 44, h: 5 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 60, y2: 0, off: -12 }, { x1: 60, y1: 60, x2: 60, y2: 75, off: 12 },
        ] },
    ],
    materiales: [
      { item: 'Tablero pino finger-joint 28 mm, 120 × 60 cm', cantidad: '1 un.', uso: 'Cubierta' },
      { item: 'Pino cepillado 2×2" (41×41 mm), 3,2 m', cantidad: '1 un.', uso: '4 patas de 72 cm' },
      { item: 'Tabla pino cepillado 1×4" (19×95 mm), 3,2 m', cantidad: '2 un.', uso: 'Faldones y travesaños' },
      { item: 'Tornillo para madera 6 × 2"', cantidad: '30 un.' },
      { item: 'Cola fría', cantidad: '250 ml' },
      { item: 'Barniz al agua', cantidad: '1 L' },
    ],
    herramientas: ['Sierra circular o serrucho', 'Taladro atornillador', 'Escuadra y huincha', 'Lijadora'],
    pasos: [
      { titulo: 'Corta', detalle: '4 patas de 72 cm, 2 faldones de 104 cm, 2 faldones de 44 cm y los mismos largos para los travesaños bajos.' },
      { titulo: 'Arma los costados', detalle: 'Une cada par de patas con un faldón corto arriba y un travesaño corto a 10 cm del suelo.' },
      { titulo: 'Une los costados', detalle: 'Atornilla los faldones y travesaños largos entre ambos costados. Revisa diagonales.' },
      { titulo: 'Cubierta y terminación', detalle: 'Fija la cubierta desde abajo con escuadras, lija y barniza con 3 manos.' },
    ],
    notas: ['Un tablero de 28 mm evita que la cubierta se pandee con un monitor o una impresora.'],
  },
  {
    id: 'mesa-centro', categoria: 'muebles', nombre: 'Mesa de centro',
    modelo: mesa({ L: 100, W: 50, H: 45, pata: 6, tablas: 12.5, sep: 0.3, fald: 6, repisa: 10 }),
    resumen: 'Mesa baja de living con repisa inferior para revistas.',
    medidas: { largo: 100, ancho: 50, alto: 45 }, unidad: 'cm', dificultad: 1, tiempo: '1 día', personas: 1,
    vistas: [
      { nombre: 'Frente', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 100, h: 4 }, { tipo: 'madera', x: 5, y: 4, w: 6, h: 41 },
          { tipo: 'madera', x: 89, y: 4, w: 6, h: 41 }, { tipo: 'madera', x: 11, y: 4, w: 78, h: 6 },
          { tipo: 'madera', x: 11, y: 32, w: 78, h: 3 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 100, y2: 0, off: -10 }, { x1: 100, y1: 0, x2: 100, y2: 45, off: 10 },
        ] },
      { nombre: 'Lateral', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 50, h: 4 }, { tipo: 'madera', x: 5, y: 4, w: 6, h: 41 },
          { tipo: 'madera', x: 39, y: 4, w: 6, h: 41 }, { tipo: 'madera', x: 11, y: 4, w: 28, h: 6 },
          { tipo: 'madera', x: 11, y: 32, w: 28, h: 3 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 50, y2: 0, off: -10 }, { x1: 50, y1: 0, x2: 50, y2: 45, off: 10 },
        ] },
    ],
    materiales: [
      { item: 'Tabla pino cepillado 2×6" (41×138 mm), 1 m', cantidad: '4 un.', uso: 'Cubierta' },
      { item: 'Pino cepillado 3×3", 1,8 m', cantidad: '1 un.', uso: '4 patas de 41 cm' },
      { item: 'Tabla pino 1×4", 3,2 m', cantidad: '2 un.', uso: 'Faldones y repisa' },
      { item: 'Tornillo para madera 6 × 2½"', cantidad: '30 un.' },
      { item: 'Cera o aceite para madera', cantidad: '½ L' },
    ],
    herramientas: ['Sierra ingletadora', 'Taladro', 'Prensas', 'Lijadora'],
    pasos: [
      { titulo: 'Cubierta', detalle: 'Encola y prensa las 4 tablas por el canto. Recorta a 100 × 50 cm.' },
      { titulo: 'Marco', detalle: 'Une patas y faldones dejando 5 cm de vuelo de cubierta en cada lado.' },
      { titulo: 'Repisa', detalle: 'Atornilla listones de apoyo a 10 cm del suelo y coloca encima las tablas de la repisa.' },
      { titulo: 'Termina', detalle: 'Redondea un poco los cantos con lija y aplica cera.' },
    ],
    notas: [],
  },
  {
    id: 'velador', categoria: 'muebles', nombre: 'Velador con cajón',
    modelo: mueble({ L: 45, W: 40, H: 55, base: 'patas', hb: 10, sobre: 2, repisas: [28], frentes: [{ tipo: 'cajon', x: 0.2, y: 38, w: 44.6, h: 14 }] }),
    resumen: 'Mesa de noche con un cajón y una repisa abierta, sobre patas cortas.',
    medidas: { largo: 45, ancho: 40, alto: 55 }, unidad: 'cm', dificultad: 2, tiempo: '1 día', personas: 1,
    vistas: [
      { nombre: 'Frente', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 45, h: 2 }, { tipo: 'madera', x: 0, y: 2, w: 2, h: 43 },
          { tipo: 'madera', x: 43, y: 2, w: 2, h: 43 }, { tipo: 'madera', x: 3, y: 4, w: 39, h: 14 },
          { tipo: 'muro', x: 19, y: 10, w: 7, h: 1.2 }, { tipo: 'madera', x: 2, y: 30, w: 41, h: 2 },
          { tipo: 'madera', x: 2, y: 43, w: 41, h: 2 }, { tipo: 'madera', x: 2, y: 45, w: 4, h: 10 },
          { tipo: 'madera', x: 39, y: 45, w: 4, h: 10 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 45, y2: 0, off: -8 }, { x1: 45, y1: 0, x2: 45, y2: 55, off: 8 },
        ] },
      { nombre: 'Lateral', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 40, h: 2 }, { tipo: 'madera', x: 0, y: 2, w: 40, h: 43 },
          { tipo: 'oculto', x: 1, y: 4, w: 35, h: 14 }, { tipo: 'madera', x: 2, y: 45, w: 4, h: 10 },
          { tipo: 'madera', x: 34, y: 45, w: 4, h: 10 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 40, y2: 0, off: -8 }, { x1: 40, y1: 45, x2: 40, y2: 55, off: 8 },
        ] },
    ],
    materiales: [
      { item: 'Tablero pino 18 mm, 40 cm de ancho', cantidad: '2,2 m lineales', uso: 'Cubierta, laterales, repisa y base' },
      { item: 'Tablero pino 12 mm', cantidad: '0,5 m²', uso: 'Caja del cajón' },
      { item: 'Corredera telescópica 35 cm', cantidad: '1 par' },
      { item: 'Pino cepillado 2×2", 0,5 m', cantidad: '1 un.', uso: '4 patas de 10 cm' },
      { item: 'MDF 3 mm, 45 × 45 cm', cantidad: '1 un.', uso: 'Fondo' },
      { item: 'Tirador de madera', cantidad: '1 un.' },
      { item: 'Tornillo 4 × 40 mm', cantidad: '30 un.' },
    ],
    herramientas: ['Sierra circular con guía', 'Taladro', 'Escuadra', 'Prensas'],
    pasos: [
      { titulo: 'Cuerpo', detalle: 'Atornilla base, repisa y travesaño superior entre los dos laterales de 43 cm.' },
      { titulo: 'Fondo', detalle: 'Clava el fondo de MDF con el cuerpo a escuadra.' },
      { titulo: 'Cajón', detalle: 'Arma una caja de 12 mm de 38 × 33 × 12 cm, monta las correderas y el frente de 39 × 14 cm.' },
      { titulo: 'Patas y cubierta', detalle: 'Atornilla las 4 patas cortas en la base y la cubierta con 1 cm de vuelo.' },
    ],
    notas: ['Deja 2–3 mm de luz alrededor del frente del cajón para que no roce.'],
  },
  {
    id: 'cama-dos-plazas', categoria: 'muebles', nombre: 'Cama de 2 plazas con respaldo',
    modelo: cama({ W: 150, Lc: 190, respaldo: 100 }),
    resumen: 'Base de madera para colchón de 150 × 190 cm, con tablillas y respaldo de tablas.',
    medidas: { largo: 200, ancho: 160, alto: 100 }, unidad: 'cm', dificultad: 2, tiempo: '1 fin de semana', personas: 2,
    vistas: [
      { nombre: 'Planta', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 160, h: 10 }, { tipo: 'madera', x: 0, y: 192, w: 160, h: 8 },
          { tipo: 'madera', x: 0, y: 10, w: 4, h: 182 }, { tipo: 'madera', x: 156, y: 10, w: 4, h: 182 },
          { tipo: 'madera', x: 78, y: 10, w: 4, h: 182 }, ...tablillasCama,
        ], cotas: [
          { x1: 0, y1: 0, x2: 160, y2: 0, off: -16 }, { x1: 160, y1: 0, x2: 160, y2: 200, off: 16 },
        ] },
      { nombre: 'Lateral', piezas: [
          { tipo: 'tinglado', x: 0, y: 0, w: 10, h: 100, paso: 100 }, { tipo: 'madera', x: 10, y: 65, w: 190, h: 15 },
          { tipo: 'madera', x: 192, y: 80, w: 8, h: 20 }, { tipo: 'madera', x: 96, y: 80, w: 8, h: 20 },
          { tipo: 'oculto', x: 10, y: 45, w: 190, h: 20 }, { tipo: 'texto', x: 105, y: 58, texto: 'Colchón', chico: true },
        ], cotas: [
          { x1: 0, y1: 100, x2: 200, y2: 100, off: 16 }, { x1: 0, y1: 0, x2: 0, y2: 100, off: -16 },
          { x1: 200, y1: 65, x2: 200, y2: 100, off: 16 },
        ] },
    ],
    materiales: [
      { item: 'Pino cepillado 2×6" (41×138 mm), 4 m', cantidad: '2 un.', uso: 'Largueros y pie' },
      { item: 'Pino cepillado 2×4", 4 m', cantidad: '2 un.', uso: 'Viga central y listones de apoyo' },
      { item: 'Pino cepillado 3×3", 2,4 m', cantidad: '2 un.', uso: 'Postes del respaldo (100 cm) y patas' },
      { item: 'Tabla pino 1×6", 3,2 m', cantidad: '3 un.', uso: 'Tablas del respaldo' },
      { item: 'Tablilla pino 1×4", 3,2 m', cantidad: '6 un.', uso: '12 tablillas de 152 cm' },
      { item: 'Perno coche ⅜" × 4" con tuerca y golilla', cantidad: '8 un.', uso: 'Unión desarmable largueros-respaldo' },
      { item: 'Tornillo 6 × 2"', cantidad: '80 un.' },
    ],
    herramientas: ['Sierra circular', 'Taladro con broca de 10 mm', 'Llave de punta', 'Escuadra', 'Lijadora'],
    pasos: [
      { titulo: 'Respaldo', detalle: 'Atornilla las tablas de 1×6" entre los dos postes de 100 cm, dejando 1 cm entre tablas.' },
      { titulo: 'Largueros', detalle: 'Atornilla un listón 2×2" por dentro de cada larguero, a 2 cm del borde inferior, para apoyar las tablillas.' },
      { titulo: 'Unión desarmable', detalle: 'Une largueros al respaldo y al pie con pernos coche: así la cama se desarma para mudanzas.' },
      { titulo: 'Viga central', detalle: 'Coloca la viga central con dos patas intermedias que lleguen al suelo.' },
      { titulo: 'Tablillas', detalle: 'Atornilla las 12 tablillas separadas 6–7 cm para que el colchón ventile.' },
    ],
    notas: ['Mide tu colchón antes de cortar: el interior del marco debe tener 1–2 cm de holgura.'],
  },
  {
    id: 'ropero', categoria: 'muebles', nombre: 'Ropero de 2 puertas',
    modelo: mueble({ L: 100, W: 55, H: 200, frentes: [{ tipo: 'puerta', x: 0.2, y: 10.2, w: 49.6, h: 189.6 }, { tipo: 'puerta', x: 50.2, y: 10.2, w: 49.6, h: 189.6, lado: 'izq' }] }),
    resumen: 'Closet independiente con barra para colgar y repisa superior.',
    medidas: { largo: 100, ancho: 55, alto: 200 }, unidad: 'cm', dificultad: 2, tiempo: '1 fin de semana', personas: 2,
    vistas: [
      { nombre: 'Frente', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 2, h: 200 }, { tipo: 'madera', x: 98, y: 0, w: 2, h: 200 },
          { tipo: 'madera', x: 2, y: 0, w: 96, h: 2 }, { tipo: 'madera', x: 2, y: 190, w: 96, h: 10 },
          { tipo: 'madera', x: 2.5, y: 2.5, w: 47, h: 187 }, { tipo: 'madera', x: 50.5, y: 2.5, w: 47, h: 187 },
          { tipo: 'muro', x: 45, y: 90, w: 1.5, h: 15 }, { tipo: 'muro', x: 53.5, y: 90, w: 1.5, h: 15 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 100, y2: 0, off: -16 }, { x1: 100, y1: 0, x2: 100, y2: 200, off: 16 },
        ] },
      { nombre: 'Interior', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 2, h: 200 }, { tipo: 'madera', x: 98, y: 0, w: 2, h: 200 },
          { tipo: 'madera', x: 2, y: 0, w: 96, h: 2 }, { tipo: 'madera', x: 2, y: 30, w: 96, h: 2 },
          { tipo: 'madera', x: 2, y: 188, w: 96, h: 2 }, { tipo: 'madera', x: 2, y: 190, w: 96, h: 10 },
          { tipo: 'muro', x: 2, y: 38, w: 96, h: 2.5 }, { tipo: 'texto', x: 50, y: 110, texto: 'Ropa colgada', chico: true },
        ], cotas: [
          { x1: 0, y1: 32, x2: 0, y2: 188, off: -16 }, { x1: 100, y1: 0, x2: 100, y2: 30, off: 16 },
        ] },
    ],
    materiales: [
      { item: 'Tablero pino finger-joint 18 mm, 55 cm de ancho', cantidad: '7 m lineales', uso: 'Laterales, techo, repisa y base' },
      { item: 'Tablero pino 18 mm, 47 × 187 cm', cantidad: '2 un.', uso: 'Puertas' },
      { item: 'Terciado o MDF 3 mm', cantidad: '100 × 200 cm', uso: 'Fondo' },
      { item: 'Bisagra cazoleta 35 mm', cantidad: '6 un.' },
      { item: 'Barra de closet 25 mm y soportes', cantidad: '1 m + 2 soportes' },
      { item: 'Tornillo 4 × 50 mm', cantidad: '40 un.' },
      { item: 'Escuadras para anclar al muro', cantidad: '2 un.' },
    ],
    herramientas: ['Sierra circular con guía', 'Taladro', 'Broca Forstner 35 mm', 'Nivel', 'Escuadra'],
    pasos: [
      { titulo: 'Cuerpo', detalle: 'Arma laterales, techo, base y zócalo en el suelo, con el mueble acostado.' },
      { titulo: 'Fondo', detalle: 'Clava el fondo a escuadra: es lo que da rigidez al ropero.' },
      { titulo: 'Levanta y ancla', detalle: 'Entre dos personas, ponlo de pie, nivélalo y fíjalo al muro.' },
      { titulo: 'Interior', detalle: 'Coloca la repisa a 30 cm del techo y la barra justo debajo.' },
      { titulo: 'Puertas', detalle: 'Perfora cazoletas (3 bisagras por puerta), cuelga y regula.' },
    ],
    notas: ['Por su altura, el ropero siempre debe ir anclado al muro.'],
  },
  {
    id: 'estanteria', categoria: 'muebles', nombre: 'Estantería de 5 repisas',
    modelo: estante({ L: 80, W: 30, H: 180, niveles: 5, zocalo: 10 }),
    resumen: 'Librero simple de tablero de 18 mm con zócalo y fondo de MDF.',
    medidas: { largo: 80, ancho: 30, alto: 180 }, unidad: 'cm', dificultad: 1, tiempo: '1 día', personas: 1,
    vistas: [
      { nombre: 'Frente', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 2, h: 180 }, { tipo: 'madera', x: 78, y: 0, w: 2, h: 180 },
          { tipo: 'madera', x: 2, y: 0, w: 76, h: 2 }, { tipo: 'madera', x: 2, y: 42, w: 76, h: 2 },
          { tipo: 'madera', x: 2, y: 84, w: 76, h: 2 }, { tipo: 'madera', x: 2, y: 126, w: 76, h: 2 },
          { tipo: 'madera', x: 2, y: 168, w: 76, h: 2 }, { tipo: 'madera', x: 2, y: 170, w: 76, h: 10 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 80, y2: 0, off: -14 }, { x1: 80, y1: 0, x2: 80, y2: 180, off: 14 },
          { x1: 0, y1: 2, x2: 0, y2: 42, off: -12 },
        ] },
      { nombre: 'Lateral', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 30, h: 180 }, { tipo: 'oculto', x: 0, y: 0, w: 30, h: 2 },
          { tipo: 'oculto', x: 0, y: 42, w: 30, h: 2 }, { tipo: 'oculto', x: 0, y: 84, w: 30, h: 2 },
          { tipo: 'oculto', x: 0, y: 126, w: 30, h: 2 }, { tipo: 'oculto', x: 0, y: 168, w: 30, h: 2 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 30, y2: 0, off: -14 }, { x1: 30, y1: 0, x2: 30, y2: 180, off: 14 },
        ] },
    ],
    materiales: [
      { item: 'Tablero pino finger-joint 18 mm, 30 cm ancho', cantidad: '7,6 m lineales', uso: '2 laterales de 180 cm y 5 repisas de 76 cm' },
      { item: 'Tablero pino 18 mm, 10 × 76 cm', cantidad: '1 un.', uso: 'Zócalo' },
      { item: 'Placa MDF 3 mm, 80 × 180 cm', cantidad: '1 un.', uso: 'Fondo' },
      { item: 'Tornillo para madera 4 × 50 mm', cantidad: '24 un.' },
      { item: 'Clavo de cabeza perdida 1"', cantidad: '50 un.', uso: 'Fondo' },
      { item: 'Escuadra para fijar a muro', cantidad: '2 un.' },
      { item: 'Barniz o pintura', cantidad: '1 L' },
    ],
    herramientas: ['Serrucho o sierra circular', 'Taladro atornillador', 'Broca avellanadora', 'Escuadra y huincha', 'Lápiz carpintero', 'Martillo'],
    pasos: [
      { titulo: 'Corta las piezas', detalle: '2 laterales de 180 cm, 5 repisas de 76 cm y un zócalo de 76 × 10 cm.' },
      { titulo: 'Marca las repisas', detalle: 'Junta los dos laterales y marca ambos a la vez cada 42 cm desde arriba para que las repisas queden parejas.' },
      { titulo: 'Atornilla la estructura', detalle: 'Pre-perfora y avellana. Fija la repisa superior, la inferior y el zócalo primero; luego las intermedias.' },
      { titulo: 'Escuadra y fondo', detalle: 'Comprueba diagonales iguales y clava el fondo de MDF cada 15 cm. El fondo mantiene el mueble a escuadra.' },
      { titulo: 'Termina y ancla', detalle: 'Lija, barniza y fija la estantería al muro con 2 escuadras. Es obligatorio en zonas sísmicas.' },
    ],
    notas: ['Una repisa de 76 cm en 18 mm soporta libros sin pandearse. Para más largo, agrega un apoyo central.'],
  },
  {
    id: 'zapatero', categoria: 'muebles', nombre: 'Zapatero de entrada',
    modelo: mueble({ L: 80, W: 30, H: 50, sobre: 3, repisas: [20], hb: 5 }),
    resumen: 'Mueble bajo de 3 niveles para zapatos, que también sirve de banca.',
    medidas: { largo: 80, ancho: 30, alto: 50 }, unidad: 'cm', dificultad: 1, tiempo: '1 tarde', personas: 1,
    vistas: [
      { nombre: 'Frente', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 80, h: 3 }, { tipo: 'madera', x: 0, y: 3, w: 2, h: 47 },
          { tipo: 'madera', x: 78, y: 3, w: 2, h: 47 }, { tipo: 'madera', x: 2, y: 20, w: 76, h: 2 },
          { tipo: 'madera', x: 2, y: 37, w: 76, h: 2 }, { tipo: 'madera', x: 2, y: 45, w: 76, h: 5 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 80, y2: 0, off: -8 }, { x1: 80, y1: 0, x2: 80, y2: 50, off: 8 },
        ] },
      { nombre: 'Lateral', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 30, h: 3 }, { tipo: 'madera', x: 0, y: 3, w: 30, h: 47 },
          { tipo: 'oculto', x: 0, y: 20, w: 30, h: 2 }, { tipo: 'oculto', x: 0, y: 37, w: 30, h: 2 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 30, y2: 0, off: -8 }, { x1: 30, y1: 0, x2: 30, y2: 50, off: 8 },
        ] },
    ],
    materiales: [
      { item: 'Tablero pino 18 mm, 30 cm de ancho', cantidad: '3,3 m lineales', uso: 'Laterales y repisas' },
      { item: 'Tabla pino 1×8" (19×185 mm) o tablero 28 mm, 80 cm', cantidad: '2 un.', uso: 'Cubierta para sentarse' },
      { item: 'Tornillo 4 × 50 mm', cantidad: '20 un.' },
      { item: 'Barniz', cantidad: '½ L' },
    ],
    herramientas: ['Serrucho', 'Taladro', 'Escuadra', 'Lija'],
    pasos: [
      { titulo: 'Corta', detalle: '2 laterales de 47 cm, 2 repisas y el zócalo de 76 cm.' },
      { titulo: 'Arma', detalle: 'Atornilla repisas y zócalo entre los laterales, a 20 y 37 cm desde arriba.' },
      { titulo: 'Cubierta', detalle: 'Fija la cubierta con 2 cm de vuelo hacia adelante. Lija bien los cantos.' },
    ],
    notas: ['Para ventilar los zapatos, puedes hacer las repisas con listones separados 2 cm.'],
  },
  {
    id: 'piso-cocina', categoria: 'muebles', nombre: 'Piso alto de cocina',
    modelo: silla({ A: 35, P: 35, hs: 65, apoyapies: 20 }),
    resumen: 'Taburete alto para isla o barra, con apoyapiés.',
    medidas: { largo: 35, ancho: 35, alto: 65 }, unidad: 'cm', dificultad: 2, tiempo: '1 tarde', personas: 1,
    vistas: [
      { nombre: 'Frente', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 35, h: 3 }, { tipo: 'madera', x: 2, y: 3, w: 4, h: 62 },
          { tipo: 'madera', x: 29, y: 3, w: 4, h: 62 }, { tipo: 'madera', x: 6, y: 3, w: 23, h: 6 },
          { tipo: 'madera', x: 6, y: 42, w: 23, h: 3 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 35, y2: 0, off: -6 }, { x1: 35, y1: 0, x2: 35, y2: 65, off: 6 },
          { x1: 0, y1: 45, x2: 0, y2: 65, off: -6 },
        ] },
      { nombre: 'Superior', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 35, h: 35 }, { tipo: 'oculto', x: 2, y: 2, w: 4, h: 4 },
          { tipo: 'oculto', x: 29, y: 2, w: 4, h: 4 }, { tipo: 'oculto', x: 2, y: 29, w: 4, h: 4 },
          { tipo: 'oculto', x: 29, y: 29, w: 4, h: 4 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 35, y2: 0, off: -6 }, { x1: 35, y1: 0, x2: 35, y2: 35, off: 6 },
        ] },
    ],
    materiales: [
      { item: 'Pino cepillado 2×2" (41×41 mm), 3,2 m', cantidad: '1 un.', uso: '4 patas de 62 cm' },
      { item: 'Tabla pino 1×3", 2 m', cantidad: '1 un.', uso: 'Faldones y apoyapiés' },
      { item: 'Tabla pino 1×6", 0,7 m', cantidad: '1 un.', uso: 'Asiento (2 tablas de 35 cm + recorte)' },
      { item: 'Tarugo de madera 8 mm', cantidad: '24 un.' },
      { item: 'Cola fría', cantidad: '100 ml' },
    ],
    herramientas: ['Ingletadora', 'Taladro', 'Guía para tarugos', 'Prensas'],
    pasos: [
      { titulo: 'Corta', detalle: '4 patas de 62 cm, 4 faldones y 4 travesaños de 23 cm.' },
      { titulo: 'Une con tarugos', detalle: 'Une faldones y travesaños a las patas con 2 tarugos y cola por unión. Prensa y deja secar.' },
      { titulo: 'Asiento', detalle: 'Encola el asiento, redondea las esquinas y fíjalo desde abajo con tornillos.' },
    ],
    notas: ['La altura de 65 cm sirve para una barra de 90 cm. Para un mesón de 105 cm usa 75 cm.'],
  },
  {
    id: 'mueble-cocina', categoria: 'muebles', nombre: 'Mueble bajo de cocina',
    modelo: mueble({ L: 60, W: 56, H: 88, sobre: 3, frentes: [{ tipo: 'cajon', x: 0.2, y: 68.5, w: 59.6, h: 16 }, { tipo: 'puerta', x: 0.2, y: 10.2, w: 59.6, h: 57.8 }] }),
    resumen: 'Módulo de 60 cm en tablero de pino con un cajón, una puerta y zócalo.',
    medidas: { largo: 60, ancho: 60, alto: 85 }, unidad: 'cm', dificultad: 2, tiempo: '1 día', personas: 1,
    vistas: [
      { nombre: 'Frente', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 60, h: 3 }, { tipo: 'madera', x: 0, y: 3, w: 60, h: 72 },
          { tipo: 'madera', x: 1, y: 4, w: 58, h: 16 }, { tipo: 'madera', x: 1, y: 21, w: 58, h: 53 },
          { tipo: 'muro', x: 26, y: 11, w: 8, h: 1.5 }, { tipo: 'muro', x: 52, y: 40, w: 1.5, h: 10 },
          { tipo: 'madera', x: 3, y: 75, w: 54, h: 10 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 60, y2: 0, off: -12 }, { x1: 60, y1: 0, x2: 60, y2: 85, off: 12 },
          { x1: 60, y1: 75, x2: 60, y2: 85, off: 24 },
        ] },
      { nombre: 'Lateral', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 60, h: 3 }, { tipo: 'madera', x: 4, y: 3, w: 56, h: 72 },
          { tipo: 'oculto', x: 5, y: 5, w: 50, h: 13 }, { tipo: 'madera', x: 9, y: 75, w: 51, h: 10 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 60, y2: 0, off: -12 }, { x1: 4, y1: 85, x2: 60, y2: 85, off: 12 },
        ] },
    ],
    materiales: [
      { item: 'Tablero pino finger-joint 18 mm', cantidad: '1,5 m²', uso: 'Laterales 2 × (72 × 56), piso 57 × 56, travesaños 2 × (57 × 10), puerta 58 × 53, frente cajón 58 × 16' },
      { item: 'Tablero pino 12 mm', cantidad: '0,4 m²', uso: 'Cajón: laterales 2 × (50 × 12), frente y trasera 2 × (51,5 × 12)' },
      { item: 'Terciado 3 mm', cantidad: '60 × 72 cm + 54 × 50 cm', uso: 'Fondo del mueble y del cajón' },
      { item: 'Bisagra cazoleta 35 mm', cantidad: '2 un.' },
      { item: 'Corredera telescópica 50 cm', cantidad: '1 par' },
      { item: 'Pino cepillado 1×4", 60 cm', cantidad: '1 un.', uso: 'Zócalo' },
      { item: 'Tornillo 4 × 40 mm', cantidad: '40 un.' },
      { item: 'Tirador', cantidad: '2 un.' },
      { item: 'Cubierta de madera (tablero 28 mm) o postformada 60 cm', cantidad: '1 un.' },
      { item: 'Barniz poliuretano (resistente al agua)', cantidad: '1 L' },
    ],
    herramientas: ['Sierra circular con guía', 'Taladro atornillador', 'Broca Forstner 35 mm', 'Escuadra', 'Nivel', 'Huincha'],
    pasos: [
      { titulo: 'Corta las piezas', detalle: 'Usa una guía para que los cortes del tablero queden perfectamente a escuadra.' },
      { titulo: 'Arma el cuerpo', detalle: 'Atornilla el piso entre los laterales y los dos travesaños superiores (adelante y atrás).' },
      { titulo: 'Fondo y zócalo', detalle: 'Fija el fondo con el cuerpo a escuadra y atornilla el zócalo retranqueado 5 cm.' },
      { titulo: 'Cajón', detalle: 'Arma la caja del cajón, instala las correderas a 4 cm del borde superior y monta el frente.' },
      { titulo: 'Puerta', detalle: 'Perfora las cazoletas de 35 mm a 3 mm del canto, monta bisagras y regula hasta que quede pareja.' },
      { titulo: 'Protege e instala', detalle: 'Aplica 3 manos de barniz poliuretano, nivela el mueble y fija la cubierta desde abajo.' },
    ],
    notas: ['Si va bajo el lavaplatos, sella los cantos y el piso con barniz extra para protegerlos de la humedad.'],
  },
  {
    id: 'repisa-flotante', categoria: 'muebles', nombre: 'Repisa flotante',
    modelo: repisaFlotante(),
    resumen: 'Repisa sin soportes visibles: un listón oculto en el muro y una caja que se encaja encima.',
    medidas: { largo: 80, ancho: 20, alto: 5 }, unidad: 'cm', dificultad: 1, tiempo: '3 horas', personas: 1,
    vistas: [
      { nombre: 'Corte', piezas: [
          { tipo: 'muro', x: 0, y: 0, w: 4, h: 20 }, { tipo: 'madera', x: 4, y: 7, w: 20, h: 5 },
          { tipo: 'oculto', x: 4, y: 8, w: 16, h: 3 }, { tipo: 'texto', x: 13, y: 17, texto: 'Listón oculto' },
        ], cotas: [
          { x1: 4, y1: 7, x2: 24, y2: 7, off: -5 }, { x1: 24, y1: 7, x2: 24, y2: 12, off: 5 },
        ] },
      { nombre: 'Frente', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 80, h: 5 }, { tipo: 'oculto', x: 2, y: 1, w: 76, h: 3 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 80, y2: 0, off: -8 },
        ] },
    ],
    materiales: [
      { item: 'Tabla pino cepillado 1×8" (19×185 mm), 1,6 m', cantidad: '1 un.', uso: 'Tapa superior e inferior' },
      { item: 'Listón pino 2×2" (41×41 mm)', cantidad: '0,8 m', uso: 'Listón oculto' },
      { item: 'Tarugo plástico N.º 8 + tornillo 8 × 3"', cantidad: '4 un.' },
      { item: 'Cola fría y clavos 1"', cantidad: '—' },
    ],
    herramientas: ['Taladro percutor', 'Broca para concreto 8 mm', 'Nivel', 'Serrucho', 'Huincha'],
    pasos: [
      { titulo: 'Fija el listón', detalle: 'Marca una línea nivelada, perfora el muro y atornilla el listón con 4 tarugos.' },
      { titulo: 'Arma la caja', detalle: 'Encola y clava las tapas superior e inferior al frente, dejando un hueco del tamaño del listón.' },
      { titulo: 'Encaja', detalle: 'Desliza la caja sobre el listón y fíjala con 3 tornillos finos desde arriba.' },
    ],
    notas: ['En tabiques de madera, el listón debe ir atornillado a los pies derechos, no solo al revestimiento.'],
  },
];
