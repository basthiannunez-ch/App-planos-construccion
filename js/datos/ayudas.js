// Ayudas para escribir planos cortos: herramientas, terminación y notas según el tipo de trabajo,
// y pasos escritos como pares [título, detalle].

import { armar } from '../modelos.js';

export const HERR = {
  interior: ['Sierra circular con guía o ingletadora', 'Taladro atornillador', 'Broca avellanadora', 'Escuadra y huincha', 'Prensas', 'Lijadora orbital'],
  exterior: ['Sierra circular o serrucho', 'Taladro atornillador', 'Escuadra y huincha', 'Lija grano 80'],
  infantil: ['Sierra circular o caladora', 'Taladro atornillador', 'Broca avellanadora', 'Escuadra y huincha', 'Router o lija para redondear cantos', 'Lijadora orbital'],
  animal: ['Sierra circular o caladora', 'Taladro atornillador', 'Broca copa (para el agujero de entrada)', 'Escuadra y huincha', 'Lija grano 80 y 120'],
};

const ACABADO = {
  interior: (l) => ({ item: 'Barniz al agua o aceite para madera', cantidad: `${l} L` }),
  exterior: (l) => ({ item: 'Protector o aceite para madera exterior', cantidad: `${l} L` }),
  infantil: (l) => ({ item: 'Aceite o barniz al agua no tóxico (apto juguetes)', cantidad: `${l} L` }),
  animal: (l) => ({ item: 'Aceite de linaza o protector al agua sin solventes', cantidad: `${l} L`, uso: 'Solo por fuera' }),
};

const NOTAS = {
  interior: [],
  exterior: ['Usa guantes y mascarilla al cortar madera impregnada y no quemes los restos.'],
  infantil: ['Redondea todos los cantos y avellana cada tornillo: no deben quedar astillas ni puntas salientes.', 'Revisa uniones y tornillos al inicio de cada temporada.'],
  animal: ['Donde el animal pueda morder o picotear usa pino sin tratar; la madera impregnada solo en patas, postes y piezas que no alcance.'],
};

export function plano(def) {
  const tipo = def.tipo || 'interior';
  return armar({
    ...def,
    escena: def.escena || (tipo === 'interior' || tipo === 'infantil' ? 'interior' : undefined),
    herramientas: def.herramientas || HERR[tipo],
    materiales: [...(def.materiales || []), ...(def.acabado === false ? [] : [ACABADO[tipo](def.litros || 1)])],
    pasos: def.pasos.map(([titulo, detalle]) => ({ titulo, detalle })),
    notas: [...(def.notas || []), ...NOTAS[tipo]],
  });
}

// Mueve un grupo de partes.
export const mover = (partes, dx = 0, dy = 0, dz = 0) => partes.map((q) => (q.t === 'perfil'
  ? { ...q, pts: q.pts.map(([a, b]) => (q.eje === 'x' ? [a + dz, b + dy] : [a + dx, b + dy])), desde: q.desde + (q.eje === 'x' ? dx : dz) }
  : { ...q, x: q.x + dx, y: q.y + dy, z: q.z + dz }));
