import { mesa, cajon, abierto } from '../familias.js';
import { picnic, casaPerro, lenera, cerco } from '../especiales.js';
import { caja } from '../modelos.js';

// Planos de jardín y exterior, todos en madera impregnada. Coordenadas en centímetros.

const tablasCerco = Array.from({ length: 15 }, (_, i) => ({ tipo: 'madera', x: 10 + i * 14.7, y: 5, w: 12, h: 170 }));
const cabiosPergola = Array.from({ length: 8 }, (_, i) => ({ tipo: 'madera', x: i * 42, y: -20, w: 5, h: 340 }));
const cabiosFrente = Array.from({ length: 8 }, (_, i) => ({ tipo: 'madera', x: i * 42, y: -12, w: 5, h: 12 }));

export default [
  {
    id: 'banco-jardin', categoria: 'exterior', nombre: 'Banco de jardín',
    modelo: mesa({ L: 120, W: 40, H: 45, pata: 7, cub: 4.1, tablas: 9, sep: 1.3, fald: 9, vuelo: 8, trav: 6, m: 'imp' }),
    resumen: 'Banco de exterior en pino impregnado, ideal como primer proyecto.',
    medidas: { largo: 120, ancho: 40, alto: 45 }, unidad: 'cm', dificultad: 1, tiempo: '1 tarde', personas: 1,
    vistas: [
      { nombre: 'Frente', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 120, h: 4 }, { tipo: 'madera', x: 8, y: 4, w: 7, h: 41 },
          { tipo: 'madera', x: 105, y: 4, w: 7, h: 41 }, { tipo: 'madera', x: 15, y: 30, w: 90, h: 9 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 120, y2: 0, off: -12 }, { x1: 120, y1: 0, x2: 120, y2: 45, off: 12 },
        ] },
      { nombre: 'Lateral', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 40, h: 4 }, { tipo: 'madera', x: 3, y: 4, w: 7, h: 41 },
          { tipo: 'madera', x: 30, y: 4, w: 7, h: 41 }, { tipo: 'madera', x: 10, y: 4, w: 20, h: 9 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 40, y2: 0, off: -12 }, { x1: 40, y1: 0, x2: 40, y2: 45, off: 12 },
        ] },
    ],
    materiales: [
      { item: 'Pino impregnado 2×4" (41×90 mm), 2,4 m', cantidad: '3 un.', uso: '4 tablas de asiento de 120 cm, 2 travesaños de 20 cm' },
      { item: 'Pino impregnado 3×3" (70×70 mm), 2,4 m', cantidad: '1 un.', uso: '4 patas de 41 cm' },
      { item: 'Pino impregnado 2×4", 0,9 m', cantidad: '1 un.', uso: 'Travesaño inferior' },
      { item: 'Tornillo exterior (zincado) 8 × 3"', cantidad: '30 un.' },
      { item: 'Protector de madera para exterior', cantidad: '1 L' },
    ],
    herramientas: ['Serrucho o sierra circular', 'Taladro atornillador', 'Escuadra y huincha', 'Lija grano 80'],
    pasos: [
      { titulo: 'Corta', detalle: '4 tablas de 120 cm, 4 patas de 41 cm, 2 travesaños de 20 cm y 1 travesaño inferior de 90 cm.' },
      { titulo: 'Arma los costados', detalle: 'Une cada par de patas con un travesaño de 20 cm, al ras de la parte superior.' },
      { titulo: 'Une los costados', detalle: 'Atornilla el travesaño inferior a 6 cm del suelo entre ambos costados.' },
      { titulo: 'Asiento', detalle: 'Atornilla las 4 tablas dejando 1,3 cm entre ellas para que escurra el agua.' },
      { titulo: 'Protege', detalle: 'Lija los cantos y aplica protector, sobre todo en cortes y en las patas que tocan el suelo.' },
    ],
    notas: ['Usa guantes y mascarilla al cortar madera impregnada y no quemes los restos.'],
  },
  {
    id: 'mesa-picnic', categoria: 'exterior', nombre: 'Mesa de picnic',
    modelo: picnic({ L: 180 }),
    resumen: 'Clásica mesa de exterior con bancas integradas para 6 personas.',
    medidas: { largo: 180, ancho: 150, alto: 75 }, unidad: 'cm', dificultad: 2, tiempo: '1 fin de semana', personas: 2,
    vistas: [
      { nombre: 'Lateral', piezas: [
          { tipo: 'poligono', puntos: [[55, 4], [63, 4], [36, 75], [28, 75]] },
          { tipo: 'poligono', puntos: [[87, 4], [95, 4], [122, 75], [114, 75]] },
          { tipo: 'madera', x: 0, y: 34, w: 150, h: 9 },
          { tipo: 'madera', x: 45, y: 0, w: 60, h: 4 },
          { tipo: 'madera', x: 0, y: 30, w: 28, h: 4 }, { tipo: 'madera', x: 122, y: 30, w: 28, h: 4 },
        ], cotas: [
          { x1: 0, y1: 75, x2: 150, y2: 75, off: 14 }, { x1: 150, y1: 0, x2: 150, y2: 75, off: 14 },
          { x1: 45, y1: 0, x2: 105, y2: 0, off: -10 }, { x1: 0, y1: 30, x2: 0, y2: 75, off: -12 },
        ] },
      { nombre: 'Frente', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 180, h: 4 }, { tipo: 'madera', x: 0, y: 30, w: 180, h: 4 },
          { tipo: 'madera', x: 20, y: 4, w: 8, h: 71 }, { tipo: 'madera', x: 152, y: 4, w: 8, h: 71 },
          { tipo: 'madera', x: 28, y: 50, w: 124, h: 9 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 180, y2: 0, off: -12 }, { x1: 180, y1: 0, x2: 180, y2: 75, off: 12 },
        ] },
    ],
    materiales: [
      { item: 'Pino impregnado 2×6" (41×138 mm), 3,6 m', cantidad: '6 un.', uso: 'Cubierta (4 tablas) y bancas (2 + 2 tablas)' },
      { item: 'Pino impregnado 2×4", 3,6 m', cantidad: '4 un.', uso: 'Patas en A, travesaños y riostra' },
      { item: 'Perno coche ⅜" × 5" con tuerca y golilla', cantidad: '12 un.' },
      { item: 'Tornillo exterior 8 × 3"', cantidad: '60 un.' },
      { item: 'Protector o aceite para exterior', cantidad: '2 L' },
    ],
    herramientas: ['Sierra circular o ingletadora', 'Taladro con broca de 10 mm', 'Llave de punta', 'Escuadra falsa (para ángulos)'],
    pasos: [
      { titulo: 'Corta las patas', detalle: 'Corta 4 patas de 2×4" de 80 cm con los extremos a 22° para que apoyen planas arriba y en el suelo.' },
      { titulo: 'Arma las A', detalle: 'Une cada par de patas con el travesaño de cubierta (60 cm) arriba y el de bancas (150 cm) a 34 cm del suelo, con pernos.' },
      { titulo: 'Cubierta', detalle: 'Atornilla las 4 tablas de cubierta sobre ambas A, separadas 6 mm.' },
      { titulo: 'Bancas', detalle: 'Atornilla 2 tablas por lado sobre los travesaños largos.' },
      { titulo: 'Riostras', detalle: 'Coloca una riostra diagonal desde el travesaño de bancas hasta el centro de la cubierta para que no se mueva.' },
    ],
    notas: ['Es pesada: ármala cerca de donde quedará.'],
  },
  {
    id: 'jardinera-elevada', categoria: 'exterior', nombre: 'Huerto elevado',
    modelo: [...cajon({ L: 120, W: 60, H: 70, patas: 14, fondo: true }), caja(2, 64, 2, 116, 2, 56, 'tierra'), ...[0, 1, 2, 3, 4].map((i) => caja(10 + i * 21, 66, 15 + (i % 2) * 15, 14, 14 + (i % 3) * 6, 14, 'verde'))],
    resumen: 'Jardinera alta de tablas para cultivar sin agacharse.',
    medidas: { largo: 120, ancho: 60, alto: 70 }, unidad: 'cm', dificultad: 1, tiempo: '1 tarde', personas: 1,
    vistas: [
      { nombre: 'Frente', piezas: [
          { tipo: 'tinglado', x: 0, y: 0, w: 120, h: 56, paso: 14 },
          { tipo: 'oculto', x: 3, y: 0, w: 7, h: 56 }, { tipo: 'oculto', x: 110, y: 0, w: 7, h: 56 },
          { tipo: 'madera', x: 3, y: 56, w: 7, h: 14 }, { tipo: 'madera', x: 110, y: 56, w: 7, h: 14 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 120, y2: 0, off: -12 }, { x1: 120, y1: 0, x2: 120, y2: 70, off: 12 },
          { x1: 0, y1: 0, x2: 0, y2: 56, off: -12 },
        ] },
      { nombre: 'Lateral', piezas: [
          { tipo: 'tinglado', x: 0, y: 0, w: 60, h: 56, paso: 14 },
          { tipo: 'madera', x: 3, y: 56, w: 7, h: 14 }, { tipo: 'madera', x: 50, y: 56, w: 7, h: 14 },
        ], cotas: [
          { x1: 0, y1: 0, x2: 60, y2: 0, off: -12 },
        ] },
    ],
    materiales: [
      { item: 'Tabla pino impregnado 1×6" (19×138 mm), 3,6 m', cantidad: '8 un.', uso: '4 hiladas de tablas' },
      { item: 'Pino impregnado 3×3", 3 m', cantidad: '1 un.', uso: '4 postes de 70 cm' },
      { item: 'Malla de polietileno o geotextil', cantidad: '4 m²', uso: 'Forro interior' },
      { item: 'Tornillo exterior 6 × 2"', cantidad: '70 un.' },
      { item: 'Corchetes para engrapadora', cantidad: '1 caja' },
    ],
    herramientas: ['Serrucho', 'Taladro atornillador', 'Engrapadora', 'Nivel'],
    pasos: [
      { titulo: 'Corta', detalle: '8 tablas de 120 cm, 8 de 53 cm y 4 postes de 70 cm.' },
      { titulo: 'Arma los lados', detalle: 'Atornilla 4 hiladas de tablas a los postes, dejando los postes 14 cm bajo la última tabla como patas.' },
      { titulo: 'Fondo', detalle: 'Coloca tablas separadas 1 cm en el fondo, apoyadas en listones, para que drene.' },
      { titulo: 'Forra', detalle: 'Engrapa el geotextil por dentro para que la tierra no toque la madera.' },
    ],
    notas: ['No uses madera impregnada sin forro si vas a cultivar alimentos.'],
  },
  {
    id: 'casa-perro', categoria: 'exterior', nombre: 'Casa para perro',
    modelo: casaPerro({ L: 80, W: 100, H: 55 }),
    resumen: 'Casita aislada del suelo, con techo a dos aguas y tinglado de madera.',
    medidas: { largo: 100, ancho: 80, alto: 90 }, unidad: 'cm', dificultad: 1, tiempo: '1 fin de semana', personas: 1,
    vistas: [
      { nombre: 'Frente', piezas: [
          { tipo: 'poligono', puntos: [[0, 32], [40, 8], [80, 32], [80, 85], [0, 85]] },
          { tipo: 'poligono', puntos: [[-8, 38], [40, 0], [88, 38], [80, 38], [40, 8], [0, 38]] },
          { tipo: 'hueco', x: 25, y: 45, w: 30, h: 40 }, { tipo: 'madera', x: 0, y: 85, w: 80, h: 5 },
        ], cotas: [
          { x1: 0, y1: 90, x2: 80, y2: 90, off: 10 }, { x1: 88, y1: 0, x2: 88, y2: 90, off: 10 },
          { x1: 25, y1: 45, x2: 55, y2: 45, off: -6 },
        ] },
      { nombre: 'Lateral', piezas: [
          { tipo: 'madera', x: -8, y: 24, w: 116, h: 8 },
          { tipo: 'tinglado', x: 0, y: 32, w: 100, h: 53, paso: 10 }, { tipo: 'madera', x: 0, y: 85, w: 100, h: 5 },
        ], cotas: [
          { x1: 0, y1: 90, x2: 100, y2: 90, off: 10 },
        ] },
    ],
    materiales: [
      { item: 'Pino impregnado 2×2", 3,2 m', cantidad: '4 un.', uso: 'Bastidor de piso, muros y techo' },
      { item: 'Tinglado de pino 1×6", 3,2 m', cantidad: '8 un.', uso: 'Revestimiento' },
      { item: 'Terciado estructural 15 mm', cantidad: '1 placa', uso: 'Piso y techo' },
      { item: 'Fieltro asfáltico o tejuela de madera', cantidad: '2 m²', uso: 'Cubierta' },
      { item: 'Tornillo exterior 6 × 1½"', cantidad: '150 un.' },
      { item: 'Pintura o protector no tóxico', cantidad: '2 L' },
    ],
    herramientas: ['Sierra circular', 'Caladora (para la puerta)', 'Taladro', 'Engrapadora'],
    pasos: [
      { titulo: 'Base', detalle: 'Arma un bastidor de 2×2" de 80 × 100 cm con terciado encima, elevado 5 cm del suelo.' },
      { titulo: 'Muros', detalle: 'Levanta 4 bastidores, los frontales con la forma de la cumbrera, y atorníllalos a la base.' },
      { titulo: 'Revestimiento', detalle: 'Tingla de abajo hacia arriba, traslapando 2 cm cada tabla. Corta la puerta con caladora.' },
      { titulo: 'Techo', detalle: 'Coloca dos paneles de terciado con 8 cm de alero y cúbrelos con fieltro o tejuela.' },
    ],
    notas: ['Mide a tu perro: la puerta debe ser un 25 % más alta que su lomo y el interior permitirle girar.'],
  },
  {
    id: 'lenera', categoria: 'exterior', nombre: 'Leñera',
    modelo: lenera({ L: 200, W: 80, H: 180 }),
    resumen: 'Cobertizo abierto para guardar leña seca, con techo a un agua.',
    medidas: { largo: 200, ancho: 80, alto: 180 }, unidad: 'cm', dificultad: 2, tiempo: '1 fin de semana', personas: 2,
    vistas: [
      { nombre: 'Frente', piezas: [
          { tipo: 'madera', x: -10, y: 0, w: 220, h: 6 },
          { tipo: 'madera', x: 0, y: 6, w: 9, h: 174 }, { tipo: 'madera', x: 95, y: 6, w: 9, h: 174 },
          { tipo: 'madera', x: 191, y: 6, w: 9, h: 174 }, { tipo: 'madera', x: 9, y: 160, w: 182, h: 8 },
          { tipo: 'oculto', x: 9, y: 20, w: 182, h: 140 },
        ], cotas: [
          { x1: 0, y1: 180, x2: 200, y2: 180, off: 18 }, { x1: 210, y1: 0, x2: 210, y2: 180, off: 16 },
        ] },
      { nombre: 'Lateral', piezas: [
          { tipo: 'poligono', puntos: [[-10, 0], [92, 18], [92, 24], [-10, 6]] },
          { tipo: 'madera', x: 0, y: 6, w: 9, h: 174 }, { tipo: 'madera', x: 71, y: 22, w: 9, h: 158 },
          { tipo: 'madera', x: 0, y: 160, w: 80, h: 8 },
        ], cotas: [
          { x1: 0, y1: 180, x2: 80, y2: 180, off: 18 }, { x1: 80, y1: 22, x2: 80, y2: 180, off: 22 },
        ] },
    ],
    materiales: [
      { item: 'Polín impregnado 4" o pino 3×3" impregnado, 2,4 m', cantidad: '6 un.', uso: 'Postes (enterrados 50 cm)' },
      { item: 'Pino impregnado 2×4", 3,2 m', cantidad: '6 un.', uso: 'Vigas de techo y bastidor de piso' },
      { item: 'Tabla pino impregnado 1×4", 3,2 m', cantidad: '12 un.', uso: 'Piso ventilado y listones traseros' },
      { item: 'Zinc acanalado 0,35 mm o tejuela de madera', cantidad: '2,2 m²' },
      { item: 'Tornillo exterior y clavos 3"', cantidad: '1 kg' },
    ],
    herramientas: ['Pala o chuzo', 'Nivel y lienza', 'Sierra circular', 'Taladro'],
    pasos: [
      { titulo: 'Postes', detalle: 'Entierra 3 postes adelante (180 cm libres) y 3 atrás (158 cm libres), aplomados y con ripio compactado.' },
      { titulo: 'Piso', detalle: 'Arma un bastidor a 12 cm del suelo y clava tablas separadas 2 cm para que ventile.' },
      { titulo: 'Techo', detalle: 'Coloca vigas inclinadas de adelante hacia atrás con 10 cm de alero y cubre.' },
      { titulo: 'Costados', detalle: 'Clava listones horizontales separados 3 cm atrás y a los costados: retienen la leña y dejan pasar el aire.' },
    ],
    notas: ['Oriéntala con la parte abierta hacia el norte (en Chile) para que el sol seque la leña.'],
  },
  {
    id: 'pergola', categoria: 'exterior', nombre: 'Pérgola 3 × 3 m',
    modelo: abierto({ L: 300, W: 300, H: 225, pilar: 12, viga: 15, cabios: 42, alero: 40 }),
    resumen: 'Estructura de sombra con 4 pilares, vigas dobles y cabios cada 42 cm.',
    medidas: { largo: 300, ancho: 300, alto: 240 }, unidad: 'm', dificultad: 2, tiempo: '1 fin de semana', personas: 2,
    vistas: [
      { nombre: 'Planta', piezas: [
          { tipo: 'madera', x: -20, y: 0, w: 340, h: 12 }, { tipo: 'madera', x: -20, y: 288, w: 340, h: 12 },
          ...cabiosPergola,
          { tipo: 'muro', x: 0, y: 0, w: 12, h: 12 }, { tipo: 'muro', x: 288, y: 0, w: 12, h: 12 },
          { tipo: 'muro', x: 0, y: 288, w: 12, h: 12 }, { tipo: 'muro', x: 288, y: 288, w: 12, h: 12 },
        ], cotas: [
          { x1: 0, y1: 320, x2: 300, y2: 320, off: 30 }, { x1: 320, y1: 0, x2: 320, y2: 300, off: 30 },
          { x1: 0, y1: -20, x2: 42, y2: -20, off: -20 },
        ] },
      { nombre: 'Frente', piezas: [
          ...cabiosFrente,
          { tipo: 'madera', x: -20, y: 0, w: 340, h: 15 },
          { tipo: 'madera', x: 0, y: 15, w: 12, h: 225 }, { tipo: 'madera', x: 288, y: 15, w: 12, h: 225 },
          { tipo: 'poligono', puntos: [[12, 55], [12, 63], [52, 15], [44, 15]] },
          { tipo: 'poligono', puntos: [[288, 55], [288, 63], [248, 15], [256, 15]] },
        ], cotas: [
          { x1: 0, y1: 240, x2: 300, y2: 240, off: 25 }, { x1: 320, y1: 0, x2: 320, y2: 240, off: 25 },
        ] },
    ],
    materiales: [
      { item: 'Pino impregnado 5×5" (115×115 mm) o polín 5", 3 m', cantidad: '4 un.', uso: 'Pilares' },
      { item: 'Pino impregnado 2×6", 3,6 m', cantidad: '4 un.', uso: 'Vigas dobles' },
      { item: 'Pino impregnado 2×4", 3,6 m', cantidad: '8 un.', uso: 'Cabios' },
      { item: 'Pino impregnado 2×4", 1 m', cantidad: '4 un.', uso: 'Pies de amigo a 45°' },
      { item: 'Base metálica para pilar + hormigón para poyo', cantidad: '4 un.' },
      { item: 'Perno coche ½" × 8"', cantidad: '8 un.' },
      { item: 'Tornillo exterior 8 × 3"', cantidad: '80 un.' },
    ],
    herramientas: ['Nivel láser o manguera', 'Sierra circular', 'Taladro con broca de 12 mm', 'Escalera ×2', 'Prensas'],
    pasos: [
      { titulo: 'Trazado y poyos', detalle: 'Marca un cuadrado de 3 × 3 m (diagonales de 4,24 m) y hormigona 4 poyos con la base metálica.' },
      { titulo: 'Pilares', detalle: 'Fija los pilares a las bases, aplómalos y arriostra provisoriamente.' },
      { titulo: 'Vigas dobles', detalle: 'Coloca una viga 2×6" a cada lado de los pilares (abrazándolos) y fíjalas con pernos coche.' },
      { titulo: 'Cabios', detalle: 'Atornilla 8 cabios de 3,4 m sobre las vigas, cada 42 cm, con 20 cm de vuelo.' },
      { titulo: 'Pies de amigo', detalle: 'Coloca diagonales a 45° entre pilar y viga en las 4 esquinas para rigidizar.' },
    ],
    notas: ['Puedes cubrirla con malla raschel, policarbonato o enredaderas.'],
  },
  {
    id: 'cerco-madera', categoria: 'exterior', nombre: 'Cerco de madera (tramo 2,4 m)',
    modelo: cerco({ L: 240, H: 180 }),
    resumen: 'Módulo de cerco con tablas verticales sobre dos travesaños, repetible.',
    medidas: { largo: 240, ancho: 9, alto: 180 }, unidad: 'cm', dificultad: 1, tiempo: '½ día por tramo', personas: 2,
    vistas: [
      { nombre: 'Frente', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 9, h: 180 }, { tipo: 'madera', x: 231, y: 0, w: 9, h: 180 },
          ...tablasCerco,
          { tipo: 'oculto', x: 9, y: 30, w: 222, h: 9 }, { tipo: 'oculto', x: 9, y: 140, w: 222, h: 9 },
        ], cotas: [
          { x1: 0, y1: 180, x2: 240, y2: 180, off: 18 }, { x1: 240, y1: 0, x2: 240, y2: 180, off: 18 },
        ] },
      { nombre: 'Corte', piezas: [
          { tipo: 'madera', x: 0, y: 0, w: 9, h: 180 }, { tipo: 'madera', x: 9, y: 30, w: 4, h: 9 },
          { tipo: 'madera', x: 9, y: 140, w: 4, h: 9 }, { tipo: 'madera', x: 13, y: 5, w: 2, h: 170 },
          { tipo: 'oculto', x: 0, y: 180, w: 9, h: 60 }, { tipo: 'texto', x: 30, y: 215, texto: 'Enterrado', chico: true },
        ], cotas: [
          { x1: 0, y1: 180, x2: 0, y2: 240, off: -10 },
        ] },
    ],
    materiales: [
      { item: 'Polín impregnado 4", 2,4 m', cantidad: '1 un. por tramo', uso: 'Poste (60 cm enterrado)' },
      { item: 'Pino impregnado 2×4", 2,4 m', cantidad: '2 un. por tramo', uso: 'Travesaños' },
      { item: 'Tabla pino impregnado 1×5", 1,7 m', cantidad: '15 un. por tramo' },
      { item: 'Clavo galvanizado 2½"', cantidad: '½ kg por tramo' },
      { item: 'Ripio para compactar postes', cantidad: '1 saco por poste' },
    ],
    herramientas: ['Chuzo y pala', 'Lienza y nivel', 'Martillo o clavadora', 'Serrucho'],
    pasos: [
      { titulo: 'Línea del cerco', detalle: 'Tensa una lienza y marca los postes cada 2,4 m.' },
      { titulo: 'Postes', detalle: 'Excava 60 cm, aploma cada poste y compacta con ripio en capas de 15 cm.' },
      { titulo: 'Travesaños', detalle: 'Clava los travesaños a 30 cm del borde superior e inferior de las tablas.' },
      { titulo: 'Tablas', detalle: 'Clava las tablas con 2 clavos por travesaño, separadas 2,7 cm, usando un taco como guía.' },
    ],
    notas: ['Revisa el deslinde con tu vecino antes de construir y deja las tablas 5 cm sobre el suelo para que no se pudran.'],
  },
];
