// Entrega a la página la URL de Supabase y su clave pública (anon), que Vercel guarda
// como variables del proyecto al conectar Supabase. Ambas son públicas por diseño:
// la seguridad la dan los permisos por fila de la tabla (sql/trabajos.sql).
module.exports = (req, res) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const clave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.end(url && clave ? `window.PLANOS_NUBE = ${JSON.stringify({ url, clave })};\n` : '');
};
