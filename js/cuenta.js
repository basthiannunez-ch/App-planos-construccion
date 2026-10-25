// Cuenta de la persona: su nombre y sus trabajos (favoritos, en progreso, realizados y el
// avance de cada plano). Siempre se guarda en el teléfono; si la persona entra con su cuenta,
// además se sincroniza con la nube para verlo desde cualquier teléfono.
import * as nube from './nube.js';

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
  // id → { pasos: [índices], materiales: [índices] }
  progreso: leer('progreso', {}),
};

const oyentes = new Set();
let pendiente = null;

const comoJson = () => ({
  perfil: datos.perfil,
  favoritos: [...datos.favoritos],
  trabajos: datos.trabajos,
  progreso: datos.progreso,
});

function guardarLocal() {
  guardar('perfil', datos.perfil);
  guardar('favoritos', [...datos.favoritos]);
  guardar('trabajos', datos.trabajos);
  guardar('progreso', datos.progreso);
}

function avisar() {
  guardarLocal();
  oyentes.forEach((fn) => fn());
  if (nube.usuarioActual()) {
    clearTimeout(pendiente);
    pendiente = setTimeout(() => nube.subir(comoJson()).catch(() => {}), 800);
  }
}

export const alCambiar = (fn) => oyentes.add(fn);

// --- Sesión -----------------------------------------------------------------

export const hayNube = nube.disponible;
export const sesion = () => nube.usuarioActual();

// Junta lo guardado en el teléfono con lo de la nube, sin perder nada de ninguno de los dos.
function mezclar(remoto) {
  if (!remoto) return;
  datos.perfil = remoto.perfil || datos.perfil;
  remoto.favoritos?.forEach((id) => datos.favoritos.add(id));
  for (const [id, t] of Object.entries(remoto.trabajos || {})) {
    const local = datos.trabajos[id];
    const fecha = (x) => x?.hasta || x?.desde || '';
    if (!local || fecha(t) > fecha(local)) datos.trabajos[id] = t;
  }
  for (const [id, listas] of Object.entries(remoto.progreso || {})) {
    datos.progreso[id] ??= {};
    for (const [lista, indices] of Object.entries(listas)) {
      datos.progreso[id][lista] = [...new Set([...(datos.progreso[id][lista] || []), ...indices])];
    }
  }
}

async function alEntrar(usuario) {
  if (!usuario) return;
  const remoto = await nube.bajar().catch(() => null);
  mezclar(remoto);
  if (!datos.perfil && usuario.user_metadata?.nombre) datos.perfil = { nombre: usuario.user_metadata.nombre, desde: new Date().toISOString() };
  guardarLocal();
  await nube.subir(comoJson()).catch(() => {});
  oyentes.forEach((fn) => fn());
}

export async function iniciarSesion() {
  const u = await nube.iniciar((nuevo) => {
    if (nuevo) alEntrar(nuevo);
    else oyentes.forEach((fn) => fn());
  });
  if (u) await alEntrar(u);
}

export async function entrar(correo, clave) {
  await alEntrar(await nube.entrar(correo, clave));
}

export async function registrar(correo, clave, nombre) {
  if (nombre) datos.perfil = { nombre, desde: new Date().toISOString() };
  await alEntrar(await nube.registrar(correo, clave, nombre));
}

export async function salir() {
  await nube.salir();
  // Al salir, el teléfono queda limpio para que otra persona pueda entrar con su cuenta.
  datos.perfil = null;
  datos.favoritos.clear();
  datos.trabajos = {};
  datos.progreso = {};
  guardarLocal();
  oyentes.forEach((fn) => fn());
}

export const recuperar = (correo) => nube.recuperar(correo);

// --- Perfil y listas -----------------------------------------------------------

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

// Avance de un plano: lista de índices marcados (pasos o materiales).
export function marcas(id, lista) {
  datos.progreso[id] ??= {};
  datos.progreso[id][lista] ??= [];
  return datos.progreso[id][lista];
}
export const guardarProgreso = () => avisar();
