// Cuentas con correo y contraseña (Supabase). Solo se activa si index.html define
// window.PLANOS_NUBE = { url, clave } con la URL del proyecto y su clave pública (anon).
const SUPABASE = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';

const config = window.PLANOS_NUBE;
export const disponible = Boolean(config?.url && config?.clave);

let cliente = null;
async function obtener() {
  if (!disponible) return null;
  if (!cliente) {
    const { createClient } = await import(SUPABASE);
    cliente = createClient(config.url, config.clave, { auth: { persistSession: true, autoRefreshToken: true } });
  }
  return cliente;
}

let usuario = null;
export const usuarioActual = () => usuario;

const MENSAJES = [
  [/invalid login credentials/i, 'Correo o contraseña incorrectos.'],
  [/already registered|already been registered/i, 'Ese correo ya tiene cuenta. Entra con tu contraseña.'],
  [/password should be at least/i, 'La contraseña debe tener al menos 6 caracteres.'],
  [/valid email|invalid.*email/i, 'Revisa que el correo esté bien escrito.'],
  [/email not confirmed/i, 'Falta confirmar el correo: revisa tu bandeja de entrada.'],
  [/rate limit/i, 'Demasiados intentos seguidos. Espera un minuto y vuelve a probar.'],
  [/fetch|network/i, 'Sin conexión. Revisa tu internet.'],
];
const traducir = (e) => (MENSAJES.find(([re]) => re.test(e?.message || '')) || [null, 'No se pudo completar. Intenta de nuevo.'])[1];

// Al abrir la app: recupera la sesión guardada, si la hay.
export async function iniciar(alCambiarSesion) {
  const sb = await obtener().catch(() => null);
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  usuario = data.session?.user || null;
  sb.auth.onAuthStateChange((_evento, sesion) => {
    const antes = usuario?.id;
    usuario = sesion?.user || null;
    if (antes !== usuario?.id) alCambiarSesion(usuario);
  });
  return usuario;
}

export async function entrar(correo, clave) {
  const sb = await obtener();
  const { data, error } = await sb.auth.signInWithPassword({ email: correo, password: clave });
  if (error) throw new Error(traducir(error));
  usuario = data.user;
  return usuario;
}

export async function registrar(correo, clave, nombre) {
  const sb = await obtener();
  const { data, error } = await sb.auth.signUp({ email: correo, password: clave, options: { data: { nombre } } });
  if (error) throw new Error(traducir(error));
  if (!data.session) {
    // Si el proyecto pide confirmar el correo, no hay sesión hasta que la persona lo confirme.
    throw new Error('Te enviamos un correo para confirmar la cuenta. Ábrelo y luego entra aquí.');
  }
  usuario = data.user;
  return usuario;
}

export async function salir() {
  const sb = await obtener();
  await sb?.auth.signOut();
  usuario = null;
}

export async function recuperar(correo) {
  const sb = await obtener();
  const { error } = await sb.auth.resetPasswordForEmail(correo, { redirectTo: location.origin });
  if (error) throw new Error(traducir(error));
}

export async function bajar() {
  const sb = await obtener();
  if (!sb || !usuario) return null;
  const { data, error } = await sb.from('trabajos').select('datos').eq('usuario', usuario.id).maybeSingle();
  if (error) throw error;
  return data?.datos || null;
}

export async function subir(datos) {
  const sb = await obtener();
  if (!sb || !usuario) return;
  const { error } = await sb.from('trabajos').upsert({ usuario: usuario.id, datos, actualizado: new Date().toISOString() });
  if (error) throw error;
}
