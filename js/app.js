import { CATEGORIAS, DIFICULTAD, PLANOS, buscarPlano } from './planos.js';
import { dibujarVista } from './dibujo.js';
import * as cuenta from './cuenta.js';
import { detallar, materialesConFijaciones } from './detalle.js';
import { tarjetaPieza } from './despiece.js';

const app = document.getElementById('app');
const titulo = document.getElementById('titulo');
const volver = document.getElementById('volver');

const marcas = cuenta.marcas;

// --- Utilidades de vista ----------------------------------------------------

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

function medidasTexto(p, { conAlto = true } = {}) {
  const { largo, ancho, alto } = p.medidas;
  if (p.unidad === 'm') {
    const m = (cm) => (cm / 100).toLocaleString('es-CL', { maximumFractionDigits: 2 });
    return `${m(largo)} × ${m(ancho)} m`;
  }
  return conAlto ? `${largo} × ${ancho} × ${alto} cm` : `${largo} × ${ancho} cm`;
}

// Imágenes del objeto terminado. El motor 3D se carga aparte: si falla, quedan los dibujos.
let motor3d = null;
const cargar3d = () => (motor3d ??= import('./render3d.js').catch(() => null));
const fotos = new Map();
const cola = [];
let trabajando = false;
let limpiar3d = null;

function mostrarFoto(el, url) {
  if (el.querySelector('img')) return;
  const img = new Image();
  img.alt = '';
  img.className = 'foto';
  img.src = url;
  el.append(img);
  el.classList.add('con-foto');
}

async function procesarCola() {
  if (trabajando) return;
  trabajando = true;
  const m = await cargar3d();
  while (cola.length) {
    const el = cola.shift();
    if (!el.isConnected) continue;
    const id = el.dataset.foto;
    if (!fotos.has(id) && m) {
      try {
        fotos.set(id, m.foto(buscarPlano(id)));
      } catch {
        fotos.set(id, null);
      }
    }
    if (fotos.get(id)) mostrarFoto(el, fotos.get(id));
    await new Promise((listo) => setTimeout(listo, 0));
  }
  trabajando = false;
}

const observador = 'IntersectionObserver' in window
  ? new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      observador.unobserve(e.target);
      cola.push(e.target);
      procesarCola();
    }
  }, { rootMargin: '300px' })
  : null;

function activarFotos(raiz = app) {
  raiz.querySelectorAll('[data-foto]').forEach((el) => {
    if (fotos.get(el.dataset.foto)) mostrarFoto(el, fotos.get(el.dataset.foto));
    else if (observador) observador.observe(el);
    else {
      cola.push(el);
      procesarCola();
    }
  });
}

const ESTADOS = { haciendo: 'En progreso', hecho: 'Realizado' };

function tarjeta(p) {
  const fav = cuenta.esFavorito(p.id);
  const est = cuenta.estado(p.id);
  return `<a class="tarjeta" href="#/plano/${p.id}">
    <div class="tarjeta-foto" data-foto="${p.id}">${dibujarVista(p.vistas[0], p.unidad, { conCotas: false })}${est ? `<span class="sello sello-${est}">${ESTADOS[est]}</span>` : ''}</div>
    <div class="tarjeta-cuerpo">
      <h3>${esc(p.nombre)}${fav ? ' <span class="estrella" aria-label="Favorito">★</span>' : ''}</h3>
      <p class="tarjeta-medidas">${medidasTexto(p)}</p>
      <div class="etiquetas">
        <span class="etiqueta nivel-${p.dificultad}">${DIFICULTAD[p.dificultad]}</span>
        <span class="etiqueta">⏱ ${esc(p.tiempo)}</span>
      </div>
    </div>
  </a>`;
}

function listaTarjetas(planos, vacio) {
  if (!planos.length) return `<p class="vacio">${vacio}</p>`;
  return `<div class="lista">${planos.map(tarjeta).join('')}</div>`;
}

function normalizar(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// --- Pantallas --------------------------------------------------------------

function pantallaInicio() {
  titulo.textContent = 'Planos';
  const destacados = ['cabana-madera', 'mesa-comedor', 'quincho', 'cama-dos-plazas', 'pergola', 'habitacion'].map(buscarPlano);
  app.innerHTML = `
    <section class="hero">
      <h2>¿Qué quieres construir hoy?</h2>
      <p>${PLANOS.length} planos con medidas, materiales y pasos para trabajar en madera.</p>
      <form class="buscador" id="form-buscar" role="search">
        <input type="search" id="buscar" placeholder="Buscar: mesa, cabaña, deck…" autocomplete="off" aria-label="Buscar planos">
      </form>
    </section>
    <h2 class="seccion">Categorías</h2>
    <div class="categorias">
      ${CATEGORIAS.map((c) => `
        <a class="categoria" href="#/catalogo/${c.id}">
          <span class="categoria-icono" aria-hidden="true">${c.icono}</span>
          <strong>${c.nombre}</strong>
          <span>${c.descripcion}</span>
          <span class="categoria-cuenta">${PLANOS.filter((p) => p.categoria === c.id).length} planos</span>
        </a>`).join('')}
    </div>
    <h2 class="seccion">Destacados</h2>
    ${listaTarjetas(destacados, '')}
  `;
  activarFotos();
  document.getElementById('form-buscar').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('buscar').value.trim();
    location.hash = `#/catalogo/todos/${encodeURIComponent(q)}`;
  });
}

function pantallaCatalogo(categoria = 'todos', consulta = '') {
  titulo.textContent = 'Catálogo';
  const filtros = [{ id: 'todos', nombre: 'Todos' }, ...CATEGORIAS];
  app.innerHTML = `
    <form class="buscador compacto" id="form-buscar" role="search">
      <input type="search" id="buscar" value="${esc(consulta)}" placeholder="Buscar planos…" autocomplete="off" aria-label="Buscar planos">
    </form>
    <div class="chips" role="tablist">
      ${filtros.map((f) => `<a role="tab" class="chip${f.id === categoria ? ' activo' : ''}" aria-selected="${f.id === categoria}" href="#/catalogo/${f.id}">${f.nombre}</a>`).join('')}
    </div>
    <div id="resultados"></div>
  `;
  const input = document.getElementById('buscar');
  const pintar = () => {
    const q = normalizar(input.value.trim());
    const planos = PLANOS.filter((p) => (categoria === 'todos' || p.categoria === categoria)
      && (!q || normalizar(`${p.nombre} ${p.resumen}`).includes(q)));
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = listaTarjetas(planos, 'No encontramos planos con esa búsqueda.');
    activarFotos(resultados);
  };
  input.addEventListener('input', pintar);
  document.getElementById('form-buscar').addEventListener('submit', (e) => {
    e.preventDefault();
    input.blur();
  });
  pintar();
}

function pantallaMisTrabajos(lista = 'favoritos') {
  titulo.textContent = 'Mis trabajos';
  const perfil = cuenta.perfil();
  const listas = [
    { id: 'favoritos', nombre: 'Favoritos', ids: cuenta.favoritos(), vacio: 'Aún no tienes favoritos. Toca la ☆ en un plano para guardarlo aquí.' },
    { id: 'haciendo', nombre: 'En progreso', ids: cuenta.conEstado('haciendo'), vacio: 'Cuando empieces un plano, toca «Lo estoy haciendo» y aparecerá aquí con su avance.' },
    { id: 'hecho', nombre: 'Realizados', ids: cuenta.conEstado('hecho'), vacio: 'Aquí quedan los trabajos que ya terminaste.' },
  ];
  const actual = listas.find((l) => l.id === lista) || listas[0];
  app.innerHTML = `
    <section class="perfil">${seccionPerfil(perfil, listas)}
    </section>
    <div class="chips" role="tablist">
      ${listas.map((l) => `<a role="tab" class="chip${l === actual ? ' activo' : ''}" aria-selected="${l === actual}" href="#/mis/${l.id}">${l.nombre} <span class="chip-cuenta">${l.ids.length}</span></a>`).join('')}
    </div>
    ${actual.id === 'haciendo' && actual.ids.length ? `<div class="lista-avance">${actual.ids.map((id) => {
      const p = buscarPlano(id);
      if (!p) return '';
      const hechos = marcas(id, 'pasos').length;
      return `<a class="avance-fila" href="#/plano/${id}">
        <div class="tarjeta-foto mini" data-foto="${id}">${dibujarVista(p.vistas[0], p.unidad, { conCotas: false })}</div>
        <div><strong>${esc(p.nombre)}</strong><span>${hechos} de ${p.pasos.length} pasos</span>
        <div class="barra-avance"><i style="width:${Math.round((hechos / p.pasos.length) * 100)}%"></i></div></div></a>`;
    }).join('')}</div>` : listaTarjetas(actual.ids.map(buscarPlano).filter(Boolean), actual.vacio)}
  `;
  activarFotos();
  activarPerfil(() => pantallaMisTrabajos(actual.id));
}

function seccionPerfil(perfil, listas) {
  const usuario = cuenta.sesion();
  const resumen = `${listas[2].ids.length} realizados · ${listas[1].ids.length} en progreso`;
  if (usuario || (perfil && !cuenta.hayNube)) {
    const nombre = perfil?.nombre || usuario?.email || '';
    return `
      <div class="avatar" aria-hidden="true">${esc(nombre.trim()[0] || '?').toUpperCase()}</div>
      <div class="perfil-texto">
        <strong>${esc(nombre)}</strong>
        <span>${usuario ? `${esc(usuario.email)} · ` : ''}${resumen}</span>
      </div>
      <div class="perfil-acciones">
        <button class="btn-texto" id="editar-perfil">Editar</button>
        ${usuario ? '<button class="btn-texto suave" id="salir">Salir</button>' : ''}
      </div>`;
  }
  if (!cuenta.hayNube) {
    return `
      <form id="form-perfil" class="perfil-form">
        <label for="nombre-perfil">¿Cómo te llamas?</label>
        <div class="fila">
          <input id="nombre-perfil" maxlength="40" placeholder="Tu nombre" autocomplete="name">
          <button class="btn btn-chico">Guardar</button>
        </div>
        <span class="perfil-ayuda">Tus trabajos se guardan en este teléfono.</span>
      </form>`;
  }
  const crear = modoCuenta === 'crear';
  return `
    <form id="form-cuenta" class="perfil-form" novalidate>
      <strong class="perfil-titulo">${crear ? 'Crea tu cuenta' : 'Entra a tu cuenta'}</strong>
      <span class="perfil-ayuda">${crear ? 'Guarda tus favoritos y tus trabajos y míralos desde cualquier teléfono.' : 'Tus favoritos y trabajos te siguen a cualquier teléfono.'}</span>
      ${crear ? '<input id="cuenta-nombre" maxlength="40" placeholder="Tu nombre" autocomplete="name">' : ''}
      <input id="cuenta-correo" type="email" placeholder="Correo" autocomplete="email" inputmode="email" required>
      <input id="cuenta-clave" type="password" placeholder="Contraseña${crear ? ' (mínimo 6 caracteres)' : ''}" autocomplete="${crear ? 'new-password' : 'current-password'}" minlength="6" required>
      <p class="perfil-error" id="cuenta-error" role="alert" hidden></p>
      <button class="btn" id="cuenta-enviar">${crear ? 'Crear cuenta' : 'Entrar'}</button>
      <div class="perfil-links">
        <button type="button" class="btn-texto" id="cuenta-cambiar">${crear ? 'Ya tengo cuenta' : 'Crear una cuenta nueva'}</button>
        ${crear ? '' : '<button type="button" class="btn-texto suave" id="cuenta-olvide">Olvidé mi contraseña</button>'}
      </div>
    </form>`;
}

let modoCuenta = 'entrar';

function activarPerfil(repintar) {
  document.getElementById('form-perfil')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre-perfil').value.trim();
    if (nombre) {
      cuenta.ponerPerfil(nombre);
      repintar();
    }
  });
  document.getElementById('editar-perfil')?.addEventListener('click', () => {
    const nombre = prompt('Tu nombre', cuenta.perfil()?.nombre || '');
    if (nombre === null) return;
    cuenta.ponerPerfil(nombre.trim());
    repintar();
  });
  document.getElementById('salir')?.addEventListener('click', async () => {
    if (!confirm('¿Cerrar sesión en este teléfono? Tus trabajos quedan guardados en tu cuenta.')) return;
    await cuenta.salir();
    aviso('Sesión cerrada');
    repintar();
  });
  const form = document.getElementById('form-cuenta');
  if (!form) return;
  const error = document.getElementById('cuenta-error');
  const mostrarError = (t) => { error.textContent = t; error.hidden = !t; };
  document.getElementById('cuenta-cambiar').addEventListener('click', () => {
    modoCuenta = modoCuenta === 'crear' ? 'entrar' : 'crear';
    repintar();
  });
  document.getElementById('cuenta-olvide')?.addEventListener('click', async () => {
    const correo = document.getElementById('cuenta-correo').value.trim();
    if (!correo) return mostrarError('Escribe tu correo y vuelve a tocar «Olvidé mi contraseña».');
    try {
      await cuenta.recuperar(correo);
      mostrarError('');
      aviso('Te enviamos un correo para crear una contraseña nueva');
    } catch (err) {
      mostrarError(err.message);
    }
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const correo = document.getElementById('cuenta-correo').value.trim();
    const clave = document.getElementById('cuenta-clave').value;
    const nombre = document.getElementById('cuenta-nombre')?.value.trim();
    if (!correo || !clave) return mostrarError('Escribe tu correo y tu contraseña.');
    if (modoCuenta === 'crear' && !nombre) return mostrarError('Escribe tu nombre.');
    const boton = document.getElementById('cuenta-enviar');
    boton.disabled = true;
    boton.textContent = modoCuenta === 'crear' ? 'Creando cuenta…' : 'Entrando…';
    try {
      if (modoCuenta === 'crear') await cuenta.registrar(correo, clave, nombre);
      else await cuenta.entrar(correo, clave);
      aviso(modoCuenta === 'crear' ? `¡Bienvenido, ${nombre}!` : 'Sesión iniciada');
      modoCuenta = 'entrar';
      repintar();
    } catch (err) {
      mostrarError(err.message);
      boton.disabled = false;
      boton.textContent = modoCuenta === 'crear' ? 'Crear cuenta' : 'Entrar';
    }
  });
}

function listaChequeo(plano, lista, items, render) {
  const hechos = marcas(plano.id, lista);
  return `<ul class="chequeo" data-lista="${lista}">
    ${items.map((it, i) => `
      <li class="${hechos.includes(i) ? 'hecho' : ''}">
        <label>
          <input type="checkbox" data-i="${i}" ${hechos.includes(i) ? 'checked' : ''}>
          <div>${render(it, i)}</div>
        </label>
      </li>`).join('')}
  </ul>`;
}

function pantallaPlano(id) {
  const p = buscarPlano(id);
  if (!p) {
    titulo.textContent = 'Plano';
    app.innerHTML = '<p class="vacio">Este plano no existe.</p>';
    return;
  }
  titulo.textContent = p.nombre;
  const cat = CATEGORIAS.find((c) => c.id === p.categoria);
  const pasosHechos = marcas(p.id, 'pasos').length;
  const det = detallar(p);
  const materiales = materialesConFijaciones(p);
  const est = cuenta.estado(p.id);

  app.innerHTML = `
    <article class="plano">
      <div class="visor">
        <div class="vistas" role="tablist">
          <button role="tab" class="chip activo" data-vista="3d" aria-selected="true">Terminado</button>
          ${det.uniones.length ? '<button role="tab" class="chip" data-vista="tornillos" aria-selected="false">Tornillos</button>' : ''}
          ${p.vistas.map((v, i) => `<button role="tab" class="chip" data-vista="${i}" aria-selected="false">${v.nombre}</button>`).join('')}
        </div>
        <div class="lienzo" id="lienzo"></div>
      </div>

      <header class="plano-cabecera">
        <span class="miga">${cat.icono} ${cat.nombre}</span>
        <div class="plano-titulo">
          <h2>${esc(p.nombre)}</h2>
          <button class="btn-icono" id="fav" aria-pressed="${cuenta.esFavorito(p.id)}" aria-label="Guardar en favoritos">${cuenta.esFavorito(p.id) ? '★' : '☆'}</button>
        </div>
        <p>${esc(p.resumen)}</p>
      </header>

      <div class="estado" role="group" aria-label="Mi trabajo">
        <button class="estado-btn${est === 'haciendo' ? ' activo' : ''}" data-estado="haciendo" aria-pressed="${est === 'haciendo'}">🔨 Lo estoy haciendo</button>
        <button class="estado-btn${est === 'hecho' ? ' activo' : ''}" data-estado="hecho" aria-pressed="${est === 'hecho'}">✓ Ya lo hice</button>
      </div>
      <button class="btn btn-pdf" id="pdf">⬇ Descargar plano en PDF</button>

      <dl class="datos">
        <div><dt>Largo × ancho</dt><dd>${medidasTexto(p, { conAlto: false })}</dd></div>
        <div><dt>Altura</dt><dd>${p.unidad === 'm' ? `${(p.medidas.alto / 100).toLocaleString('es-CL')} m` : `${p.medidas.alto} cm`}</dd></div>
        <div><dt>Dificultad</dt><dd><span class="etiqueta nivel-${p.dificultad}">${DIFICULTAD[p.dificultad]}</span></dd></div>
        <div><dt>Tiempo</dt><dd>${esc(p.tiempo)}</dd></div>
        <div><dt>Personas</dt><dd>${p.personas}</dd></div>
        <div><dt>Avance</dt><dd id="avance">${pasosHechos}/${p.pasos.length} pasos</dd></div>
      </dl>

      <div class="pestanas" role="tablist">
        <button role="tab" class="pestana activo" data-panel="materiales" aria-selected="true">Materiales</button>
        <button role="tab" class="pestana" data-panel="cortes" aria-selected="false">Cortes</button>
        <button role="tab" class="pestana" data-panel="pasos" aria-selected="false">Pasos</button>
        <button role="tab" class="pestana" data-panel="herramientas" aria-selected="false">Herramientas</button>
      </div>

      <section class="panel" id="panel-materiales">
        ${listaChequeo(p, 'materiales', materiales, (m) => `
          <span class="mat-nombre">${m.pieza ? `<span class="letra chica">${m.pieza}</span> ` : ''}${esc(m.item)}</span>
          <span class="mat-cantidad">${esc(m.cantidad)}</span>
          ${m.uso ? `<span class="mat-uso">${esc(m.uso)}</span>` : ''}`)}
      </section>
      <section class="panel" id="panel-cortes" hidden>${panelCortes(p, det)}</section>
      <section class="panel" id="panel-pasos" hidden>
        ${listaChequeo(p, 'pasos', p.pasos, (s, i) => `
          <span class="paso-num">Paso ${i + 1}</span>
          <strong>${esc(s.titulo)}</strong>
          <span class="paso-detalle">${esc(s.detalle)}</span>`)}
      </section>
      <section class="panel" id="panel-herramientas" hidden>
        <ul class="herramientas">${p.herramientas.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      </section>

      ${p.notas?.length ? `<aside class="notas"><strong>Ten en cuenta</strong><ul>${p.notas.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></aside>` : ''}

      <button class="btn" id="compartir">Compartir plano</button>
    </article>
  `;

  app.querySelectorAll('[data-vista]').forEach((b) => b.addEventListener('click', () => {
    app.querySelectorAll('[data-vista]').forEach((o) => {
      o.classList.toggle('activo', o === b);
      o.setAttribute('aria-selected', o === b);
    });
    mostrarVista(b.dataset.vista);
  }));

  function mostrarVista(v) {
    limpiar3d?.();
    limpiar3d = null;
    const lienzo = document.getElementById('lienzo');
    if (v !== '3d' && v !== 'tornillos') {
      lienzo.innerHTML = dibujarVista(p.vistas[+v], p.unidad);
      return;
    }
    const conTornillos = v === 'tornillos';
    lienzo.innerHTML = `<div class="lienzo-3d"><div class="cargando">${!conTornillos && fotos.get(p.id) ? `<img src="${fotos.get(p.id)}" alt="">` : 'Preparando imagen…'}</div></div>
      <p class="ayuda-3d">${conTornillos ? '<span class="punto rojo"></span>tornillo <span class="punto azul"></span>clavo <span class="punto morado"></span>tirafondo o perno · desliza para girar' : 'Desliza para girar · así se verá terminado'}</p>`;
    cargar3d().then((m) => {
      const cont = lienzo.querySelector('.lienzo-3d');
      if (!cont || !cont.isConnected) return;
      try {
        if (!m) throw new Error('sin 3D');
        limpiar3d = m.visor(p, cont, conTornillos ? { tornillos: det.uniones } : {});
      } catch {
        lienzo.innerHTML = dibujarVista(p.vistas[0], p.unidad);
      }
    });
  }
  mostrarVista('3d');

  app.querySelectorAll('.pestana').forEach((b) => b.addEventListener('click', () => {
    app.querySelectorAll('.pestana').forEach((o) => {
      o.classList.toggle('activo', o === b);
      o.setAttribute('aria-selected', o === b);
    });
    app.querySelectorAll('.panel').forEach((s) => { s.hidden = s.id !== `panel-${b.dataset.panel}`; });
  }));

  app.querySelectorAll('.chequeo').forEach((ul) => ul.addEventListener('change', (e) => {
    const i = +e.target.dataset.i;
    const lista = marcas(p.id, ul.dataset.lista);
    const pos = lista.indexOf(i);
    if (e.target.checked && pos < 0) lista.push(i);
    if (!e.target.checked && pos >= 0) lista.splice(pos, 1);
    e.target.closest('li').classList.toggle('hecho', e.target.checked);
    cuenta.guardarProgreso();
    if (ul.dataset.lista === 'pasos') {
      const n = marcas(p.id, 'pasos').length;
      if (n && !cuenta.estado(p.id)) cuenta.ponerEstado(p.id, 'haciendo');
      if (n === p.pasos.length && cuenta.estado(p.id) !== 'hecho') {
        cuenta.ponerEstado(p.id, 'hecho');
        aviso('¡Terminaste todos los pasos! Quedó en Realizados');
      }
      pintarEstado();
    }
    document.getElementById('avance').textContent = `${marcas(p.id, 'pasos').length}/${p.pasos.length} pasos`;
  }));

  const fav = document.getElementById('fav');
  fav.addEventListener('click', () => {
    const activo = cuenta.alternarFavorito(p.id);
    fav.textContent = activo ? '★' : '☆';
    fav.setAttribute('aria-pressed', activo);
    aviso(activo ? 'Guardado en favoritos' : 'Quitado de favoritos');
  });

  const pintarEstado = () => app.querySelectorAll('[data-estado]').forEach((b) => {
    const activo = cuenta.estado(p.id) === b.dataset.estado;
    b.classList.toggle('activo', activo);
    b.setAttribute('aria-pressed', activo);
  });
  app.querySelectorAll('[data-estado]').forEach((b) => b.addEventListener('click', () => {
    const nuevo = cuenta.estado(p.id) === b.dataset.estado ? null : b.dataset.estado;
    cuenta.ponerEstado(p.id, nuevo);
    pintarEstado();
    if (nuevo) aviso(nuevo === 'hecho' ? '¡Bien hecho! Quedó en Realizados' : 'Agregado a En progreso');
  }));

  document.getElementById('pdf').addEventListener('click', async (e) => {
    const b = e.currentTarget;
    b.disabled = true;
    b.textContent = 'Preparando PDF…';
    try {
      const { descargarPdf } = await import('./pdf.js');
      await descargarPdf(p, { det, materiales, foto: await fotoGrande(p), fotoTornillos: det.uniones.length ? await fotoGrande(p, det.uniones) : null });
    } catch (err) {
      console.error(err);
      aviso('No se pudo crear el PDF');
    }
    b.disabled = false;
    b.textContent = '⬇ Descargar plano en PDF';
  });

  document.getElementById('compartir').addEventListener('click', async () => {
    const datos = { title: p.nombre, text: p.resumen, url: location.href };
    if (navigator.share) {
      try { await navigator.share(datos); } catch { /* cancelado */ }
    } else {
      try {
        await navigator.clipboard.writeText(location.href);
        aviso('Enlace copiado');
      } catch {
        aviso(location.href);
      }
    }
  });
}

async function fotoGrande(p, tornillos) {
  const m = await cargar3d();
  if (!m) return null;
  try {
    return m.foto(p, 1200, 900, tornillos ? { tornillos } : {});
  } catch {
    return null;
  }
}

function panelCortes(p, det) {
  const fij = det.fijaciones.length ? `
    <h3 class="sub">Fijaciones</h3>
    <ul class="fijaciones">${det.fijaciones.map((f) => `<li><strong>${f.cantidad}</strong> <span>${esc(f.nombre)}${f.uso ? `<small>${esc(f.uso)}</small>` : ''}</span></li>`).join('')}</ul>
    ${det.edificio ? '' : '<p class="pieza-nota">Cantidades calculadas unión por unión, con 10 % de reserva. En la imagen «Tornillos» ves dónde va cada uno.</p>'}` : '';
  if (det.edificio) {
    return `${fij}<p class="pieza-nota">En construcciones, las piezas de tabiquería se cortan en obra a la medida de cada muro: sigue las medidas de la Planta y la lista de materiales.</p>`;
  }
  if (!det.grupos.length) return fij || '<p class="vacio">Este plano no tiene piezas de corte.</p>';
  return `${fij}<h3 class="sub">Despiece</h3><div class="piezas">${det.grupos.map(tarjetaPieza).join('')}</div>`;
}

function aviso(texto) {
  const el = document.createElement('div');
  el.className = 'aviso';
  el.textContent = texto;
  document.body.append(el);
  setTimeout(() => el.remove(), 2200);
}

// --- Navegación -------------------------------------------------------------

function ruta() {
  const [, seccion, a, b] = location.hash.split('/');
  limpiar3d?.();
  limpiar3d = null;
  volver.hidden = seccion !== 'plano';

  document.querySelectorAll('.nav a').forEach((link) => {
    const destino = link.dataset.seccion;
    link.classList.toggle('activo', destino === (seccion === 'favoritos' ? 'mis' : seccion || 'inicio'));
  });

  if (seccion === 'catalogo') pantallaCatalogo(a || 'todos', b ? decodeURIComponent(b) : '');
  else if (seccion === 'favoritos') pantallaMisTrabajos('favoritos');
  else if (seccion === 'mis') pantallaMisTrabajos(a);
  else if (seccion === 'plano') pantallaPlano(a);
  else pantallaInicio();

  window.scrollTo(0, 0);
}

volver.addEventListener('click', () => {
  if (history.length > 1) history.back();
  else location.hash = '#/';
});

window.addEventListener('hashchange', ruta);
ruta();

// Recupera la sesión guardada y, si cambia (entrar o salir), repinta Mis trabajos.
cuenta.iniciarSesion().then(() => {
  if (location.hash.startsWith('#/mis') || location.hash.startsWith('#/favoritos')) ruta();
}).catch(() => {});
