// Catálogo de planos. Cada categoría vive en su propio archivo dentro de js/datos/.
// Tipos de pieza: madera, tinglado, muro, existente, ventana, hueco, oculto, poligono, puerta, texto.
// Cada plano trae además `modelo`: las partes 3D con que se dibuja la imagen del objeto terminado.

import muebles from './datos/muebles.js';
import muebles2 from './datos/muebles2.js';
import exterior from './datos/exterior.js';
import exterior2 from './datos/exterior2.js';
import construcciones from './datos/construcciones.js';
import construcciones2 from './datos/construcciones2.js';
import muebles3 from './datos/muebles3.js';
import exterior3 from './datos/exterior3.js';
import construcciones3 from './datos/construcciones3.js';
import infantiles from './datos/infantiles.js';
import animales from './datos/animales.js';

export const CATEGORIAS = [
  {
    id: 'muebles',
    nombre: 'Muebles',
    descripcion: 'Mesas, sillas, camas, cómodas, repisas y muebles de cocina y baño.',
    icono: '🪑',
  },
  {
    id: 'exterior',
    nombre: 'Jardín y exterior',
    descripcion: 'Sillas, bancas, mesas, huertos, jardineras, pérgolas, decks y cercos.',
    icono: '🌳',
  },
  {
    id: 'construcciones',
    nombre: 'Construcciones en madera',
    descripcion: 'Cabañas, casas, ampliaciones, talleres, bodegas, quinchos y terrazas.',
    icono: '🏠',
  },
  {
    id: 'infantiles',
    nombre: 'Juegos infantiles',
    descripcion: 'Torres con resbalín, columpios, casitas, triángulos Pikler, cocinitas y juguetes.',
    icono: '🧸',
  },
  {
    id: 'animales',
    nombre: 'Animales',
    descripcion: 'Casas de pájaros, comederos, rascadores para gatos, casas de perro, gallineros y colmenas.',
    icono: '🐦',
  },
];

// Planos que se crearon en Jardín y ahora viven en las categorías nuevas.
const MOVIDOS = {
  columpio: 'infantiles', arenero: 'infantiles', 'casita-juegos': 'infantiles',
  'casa-pajaros': 'animales', 'comedero-aves': 'animales', gallinero: 'animales', conejera: 'animales', 'casa-perro': 'animales',
};

export const DIFICULTAD = {
  1: 'Fácil',
  2: 'Media',
  3: 'Avanzada',
};

export const PLANOS = [
  ...muebles, ...muebles2, ...muebles3,
  ...exterior, ...exterior2, ...exterior3,
  ...construcciones, ...construcciones2, ...construcciones3,
  ...infantiles, ...animales,
].map((p) => (MOVIDOS[p.id] ? { ...p, categoria: MOVIDOS[p.id] } : p));

export function buscarPlano(id) {
  return PLANOS.find((p) => p.id === id);
}
