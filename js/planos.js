// Catálogo de planos. Cada categoría vive en su propio archivo dentro de js/datos/.
// Tipos de pieza: madera, tinglado, muro, existente, ventana, hueco, oculto, poligono, puerta, texto.
// Cada plano trae además `modelo`: las partes 3D con que se dibuja la imagen del objeto terminado.

import muebles from './datos/muebles.js';
import muebles2 from './datos/muebles2.js';
import exterior from './datos/exterior.js';
import exterior2 from './datos/exterior2.js';
import construcciones from './datos/construcciones.js';
import construcciones2 from './datos/construcciones2.js';

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
    descripcion: 'Sillas, bancas, columpios, huertos, gallineros, pérgolas y cercos.',
    icono: '🌳',
  },
  {
    id: 'construcciones',
    nombre: 'Construcciones en madera',
    descripcion: 'Cabañas, casas, ampliaciones, talleres, bodegas, quinchos y terrazas.',
    icono: '🏠',
  },
];

export const DIFICULTAD = {
  1: 'Fácil',
  2: 'Media',
  3: 'Avanzada',
};

export const PLANOS = [...muebles, ...muebles2, ...exterior, ...exterior2, ...construcciones, ...construcciones2];

export function buscarPlano(id) {
  return PLANOS.find((p) => p.id === id);
}
