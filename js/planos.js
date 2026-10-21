// Catálogo de planos. Cada categoría vive en su propio archivo dentro de js/datos/.
// Tipos de pieza: madera, tinglado, muro, existente, ventana, hueco, oculto, poligono, puerta, texto.

import muebles from './datos/muebles.js';
import exterior from './datos/exterior.js';
import construcciones from './datos/construcciones.js';

export const CATEGORIAS = [
  {
    id: 'muebles',
    nombre: 'Muebles',
    descripcion: 'Mesas, camas, roperos, repisas y muebles de cocina.',
    icono: '🪑',
  },
  {
    id: 'exterior',
    nombre: 'Jardín y exterior',
    descripcion: 'Bancos, huertos, pérgolas, cercos y leñeras.',
    icono: '🌳',
  },
  {
    id: 'construcciones',
    nombre: 'Construcciones en madera',
    descripcion: 'Habitaciones, ampliaciones, cabañas, bodegas y quinchos.',
    icono: '🏠',
  },
];

export const DIFICULTAD = {
  1: 'Fácil',
  2: 'Media',
  3: 'Avanzada',
};

export const PLANOS = [...muebles, ...exterior, ...construcciones];

export function buscarPlano(id) {
  return PLANOS.find((p) => p.id === id);
}
