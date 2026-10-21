import { CATEGORIAS, DIFICULTAD, PLANOS, buscarPlano } from './planos.js';
import { dibujarVista } from './dibujo.js';

const app = document.getElementById('app');
const titulo = document.getElementById('titulo');
const volver = document.getElementById('volver');

// --- Estado guardado en el teléfono ---------------------------------------

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

let favoritos = new Set(leer('favoritos', []));
const progreso = leer('progreso', {});

function alternarFavorito(id) {
  if (favoritos.has(id)) favoritos.delete(id);
  else favoritos.add(id);
  guardar('favoritos', [...favoritos]);
}

function marcas(id, lista) {
  progreso[id] ??= {};
  progreso[id][lista] ??= [];
  return progreso[id][lista];
}

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

function tarjeta(p) {
  const fav = favoritos.has(p.id);
  return `<a class="tarjeta" href="#/plano/${p.id}">
    <div class="tarjeta-mini">${dibujarVista(p.vistas[0], p.unidad, { conCotas: false })}</div>
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
  const destacados = ['mesa-comedor', 'cabana-prefabricada', 'estanteria', 'habitacion'].map(buscarPlano);
  app.innerHTML = `
    <section class="hero">
      <h2>¿Qué quieres construir hoy?</h2>
      <p>Planos con medidas, materiales y pasos para muebles y construcciones.</p>
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
    document.getElementById('resultados').innerHTML = listaTarjetas(planos, 'No encontramos planos con esa búsqueda.');
  };
  input.addEventListener('input', pintar);
  document.getElementById('form-buscar').addEventListener('submit', (e) => {
    e.preventDefault();
    input.blur();
  });
  pintar();
}

function pantallaFavoritos() {
  titulo.textContent = 'Favoritos';
  const planos = PLANOS.filter((p) => favoritos.has(p.id));
  app.innerHTML = listaTarjetas(planos, 'Aún no tienes favoritos. Toca la ☆ en un plano para guardarlo aquí.');
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

  app.innerHTML = `
    <article class="plano">
      <div class="visor">
        <div class="vistas" role="tablist">
          ${p.vistas.map((v, i) => `<button role="tab" class="chip${i === 0 ? ' activo' : ''}" data-vista="${i}" aria-selected="${i === 0}">${v.nombre}</button>`).join('')}
        </div>
        <div class="lienzo" id="lienzo">${dibujarVista(p.vistas[0], p.unidad)}</div>
      </div>

      <header class="plano-cabecera">
        <span class="miga">${cat.icono} ${cat.nombre}</span>
        <div class="plano-titulo">
          <h2>${esc(p.nombre)}</h2>
          <button class="btn-icono" id="fav" aria-pressed="${favoritos.has(p.id)}" aria-label="Guardar en favoritos">${favoritos.has(p.id) ? '★' : '☆'}</button>
        </div>
        <p>${esc(p.resumen)}</p>
      </header>

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
        <button role="tab" class="pestana" data-panel="pasos" aria-selected="false">Pasos</button>
        <button role="tab" class="pestana" data-panel="herramientas" aria-selected="false">Herramientas</button>
      </div>

      <section class="panel" id="panel-materiales">
        ${listaChequeo(p, 'materiales', p.materiales, (m) => `
          <span class="mat-nombre">${esc(m.item)}</span>
          <span class="mat-cantidad">${esc(m.cantidad)}</span>
          ${m.uso ? `<span class="mat-uso">${esc(m.uso)}</span>` : ''}`)}
      </section>
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
    document.getElementById('lienzo').innerHTML = dibujarVista(p.vistas[+b.dataset.vista], p.unidad);
  }));

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
    guardar('progreso', progreso);
    document.getElementById('avance').textContent = `${marcas(p.id, 'pasos').length}/${p.pasos.length} pasos`;
  }));

  const fav = document.getElementById('fav');
  fav.addEventListener('click', () => {
    alternarFavorito(p.id);
    const activo = favoritos.has(p.id);
    fav.textContent = activo ? '★' : '☆';
    fav.setAttribute('aria-pressed', activo);
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
  volver.hidden = seccion !== 'plano';

  document.querySelectorAll('.nav a').forEach((link) => {
    const destino = link.dataset.seccion;
    link.classList.toggle('activo', destino === (seccion || 'inicio'));
  });

  if (seccion === 'catalogo') pantallaCatalogo(a || 'todos', b ? decodeURIComponent(b) : '');
  else if (seccion === 'favoritos') pantallaFavoritos();
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
