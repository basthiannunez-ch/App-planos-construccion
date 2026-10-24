// Cuenta de la persona: su nombre y sus trabajos (favoritos, en progreso y realizados).
// Se guarda en el teléfono. Está separado del resto de la app para poder sincronizarlo
// con una cuenta en la nube sin tocar las pantallas.

function leer(clave, porDefecto) {
  try {
    return JSON.parse(localStorage.getItem(clave)) ?? porDefecto;
  } catch {
    return porDefecto;
  }
}

function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // Sin almacenamiento disponible: la app sigue funcionando sin recordar.
  }
}

const datos = {
  perfil: leer('perfil', null),
  favoritos: new Set(leer('favoritos', [])),
  // id → { estado: 'haciendo' | 'hecho', desde: fecha ISO, hasta?: fecha ISO }
  trabajos: leer('trabajos', {}),
};

const oyentes = new Set();
function avisar() {
  guardar('perfil', datos.perfil);
  guardar('favoritos', [...datos.favoritos]);
  guardar('trabajos', datos.trabajos);
  oyentes.forEach((fn) => fn());
}

export const alCambiar = (fn) => oyentes.add(fn);

export const perfil = () => datos.perfil;
export function ponerPerfil(nombre) {
  datos.perfil = nombre ? { nombre, desde: datos.perfil?.desde || new Date().toISOString() } : null;
  avisar();
}

export const esFavorito = (id) => datos.favoritos.has(id);
export const favoritos = () => [...datos.favoritos];
export function alternarFavorito(id) {
  if (datos.favoritos.has(id)) datos.favoritos.delete(id);
  else datos.favoritos.add(id);
  avisar();
  return datos.favoritos.has(id);
}

export const estado = (id) => datos.trabajos[id]?.estado || null;
export const trabajo = (id) => datos.trabajos[id] || null;
export const conEstado = (e) => Object.keys(datos.trabajos)
  .filter((id) => datos.trabajos[id].estado === e)
  .sort((a, b) => (datos.trabajos[b].hasta || datos.trabajos[b].desde).localeCompare(datos.trabajos[a].hasta || datos.trabajos[a].desde));

export function ponerEstado(id, e) {
  const ahora = new Date().toISOString();
  if (!e) delete datos.trabajos[id];
  else if (e === 'haciendo') datos.trabajos[id] = { estado: e, desde: datos.trabajos[id]?.desde || ahora };
  else datos.trabajos[id] = { estado: e, desde: datos.trabajos[id]?.desde || ahora, hasta: ahora };
  avisar();
}
