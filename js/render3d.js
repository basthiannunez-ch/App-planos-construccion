// Imagen realista del objeto terminado: arma una escena 3D con three.js a partir del modelo
// del plano (madera con veta, luz de sol, sombras y entorno) y la dibuja en un canvas.

import * as THREE from 'three';
import { esEntorno } from './modelos.js';
import { RoomEnvironment } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js';

const TILE = 80; // cm que cubre una repetición de textura

function lienzo(tam = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = tam;
  return [c, c.getContext('2d')];
}

// Generador pseudoaleatorio con semilla para que las texturas salgan siempre iguales.
function azar(semilla) {
  let s = semilla;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function veta(ctx, tam, base, oscuro, rnd, { tablas = 0, nudos = 3, intensidad = 1 } = {}) {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, tam, tam);
  const lineas = 70;
  for (let i = 0; i < lineas; i++) {
    const y0 = rnd() * tam;
    const amp = 2 + rnd() * 6;
    const fase = rnd() * Math.PI * 2;
    ctx.strokeStyle = oscuro;
    ctx.globalAlpha = (0.08 + rnd() * 0.22) * intensidad;
    ctx.lineWidth = 0.6 + rnd() * 2.2;
    ctx.beginPath();
    for (let x = 0; x <= tam; x += 8) {
      const y = y0 + Math.sin(x / tam * Math.PI * 2 + fase) * amp + Math.sin(x / 37 + fase) * 1.2;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  for (let k = 0; k < nudos; k++) {
    const x = rnd() * tam;
    const y = rnd() * tam;
    const r = 4 + rnd() * 7;
    for (let j = 4; j > 0; j--) {
      ctx.globalAlpha = 0.12 * intensidad;
      ctx.fillStyle = oscuro;
      ctx.beginPath();
      ctx.ellipse(x, y, r * j * 0.9, r * j * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  if (tablas) {
    const alto = tam / tablas;
    for (let i = 0; i < tablas; i++) {
      const g = ctx.createLinearGradient(0, i * alto, 0, (i + 1) * alto);
      g.addColorStop(0, 'rgba(255,255,255,0.10)');
      g.addColorStop(0.85, 'rgba(0,0,0,0.0)');
      g.addColorStop(0.93, 'rgba(0,0,0,0.25)');
      g.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = g;
      ctx.fillRect(0, i * alto, tam, alto);
    }
  }
}

function ruido(ctx, tam, colores, rnd, n = 9000, r = 2) {
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = colores[Math.floor(rnd() * colores.length)];
    ctx.globalAlpha = 0.25 + rnd() * 0.5;
    ctx.fillRect(rnd() * tam, rnd() * tam, r * rnd() + 0.5, r * rnd() + 0.5);
  }
  ctx.globalAlpha = 1;
}

const DIBUJOS = {
  pino: (ctx, t, rnd) => veta(ctx, t, '#d6a46a', '#7a4a20', rnd),
  tablero: (ctx, t, rnd) => veta(ctx, t, '#dcae74', '#8a5a28', rnd, { nudos: 1, intensidad: 0.8 }),
  imp: (ctx, t, rnd) => veta(ctx, t, '#9a7c52', '#4a3a20', rnd, { intensidad: 1.1 }),
  deck: (ctx, t, rnd) => veta(ctx, t, '#8f6440', '#3e2612', rnd, { intensidad: 1.1 }),
  oscuro: (ctx, t, rnd) => veta(ctx, t, '#7a4b2a', '#2e1a0c', rnd, { nudos: 1 }),
  machi: (ctx, t, rnd) => veta(ctx, t, '#e6c9a0', '#a77a48', rnd, { tablas: 8, nudos: 2, intensidad: 0.6 }),
  tinglado: (ctx, t, rnd) => veta(ctx, t, '#a8774a', '#4f2f15', rnd, { tablas: 5, nudos: 2 }),
  osb: (ctx, t, rnd) => {
    ctx.fillStyle = '#c9a26b';
    ctx.fillRect(0, 0, t, t);
    for (let i = 0; i < 900; i++) {
      ctx.save();
      ctx.translate(rnd() * t, rnd() * t);
      ctx.rotate(rnd() * Math.PI);
      ctx.fillStyle = ['#b08452', '#dcb780', '#9a6e3e', '#e6c690'][Math.floor(rnd() * 4)];
      ctx.globalAlpha = 0.6;
      ctx.fillRect(-14, -3, 28, 6);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  },
  techo: (ctx, t, rnd) => {
    ctx.fillStyle = '#3d3f42';
    ctx.fillRect(0, 0, t, t);
    const filas = 10;
    const h = t / filas;
    for (let f = 0; f < filas; f++) {
      const off = (f % 2) * h * 0.8;
      for (let x = -off; x < t; x += h * 1.6) {
        const g = 50 + Math.floor(rnd() * 30);
        ctx.fillStyle = `rgb(${g},${g + 2},${g + 6})`;
        ctx.fillRect(x + 1, f * h + 1, h * 1.6 - 2, h - 2);
      }
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(0, f * h + h - 3, t, 3);
    }
    ruido(ctx, t, ['#222', '#666', '#555'], rnd, 5000, 1.5);
  },
  zinc: (ctx, t) => {
    const g = ctx.createLinearGradient(0, 0, t / 8, 0);
    g.addColorStop(0, '#9aa3ab');
    g.addColorStop(0.5, '#d8dee3');
    g.addColorStop(1, '#9aa3ab');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, t, t);
  },
  pasto: (ctx, t, rnd) => {
    ctx.fillStyle = '#5f8a3a';
    ctx.fillRect(0, 0, t, t);
    ruido(ctx, t, ['#4b7a2c', '#76a04a', '#3f6623', '#8bb35a', '#6a8f3c'], rnd, 26000, 3);
  },
  piso: (ctx, t, rnd) => {
    veta(ctx, t, '#c79a6a', '#7a5230', rnd, { tablas: 6, nudos: 2, intensidad: 0.7 });
  },
  tierra: (ctx, t, rnd) => {
    ctx.fillStyle = '#5a4030';
    ctx.fillRect(0, 0, t, t);
    ruido(ctx, t, ['#3e2a1e', '#7a5a42', '#4a3426'], rnd, 12000, 3);
  },
  piedra: (ctx, t, rnd) => {
    ctx.fillStyle = '#9a9690';
    ctx.fillRect(0, 0, t, t);
    ruido(ctx, t, ['#77736d', '#b8b4ad', '#8a867f'], rnd, 12000, 3);
  },
};

const COLORES = {
  vidrio: { color: '#a9cde0', transparent: true, opacity: 0.35, roughness: 0.05, metalness: 0.1 },
  metal: { color: '#2b2d30', roughness: 0.35, metalness: 0.8 },
  tela: { color: '#f2efe9', roughness: 0.95 },
  blanco: { color: '#ffffff', roughness: 0.9 },
  manta: { color: '#8aa1b4', roughness: 0.95 },
  verde: { color: '#3f7a35', roughness: 0.9 },
  agua: { color: '#5aa5c8', roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.8 },
  ladrillo: { color: '#9a5038', roughness: 0.9 },
  fuego: { color: '#2a2a2a', roughness: 0.6, metalness: 0.4 },
  pared: { color: '#eeeae3', roughness: 0.95 },
  arena: { color: '#e2cd9a', roughness: 1 },
  malla: { color: '#4a4d50', roughness: 0.6, metalness: 0.5, transparent: true, opacity: 0.35 },
  cojin: { color: '#cdbb9c', roughness: 0.95 },
  rojo: { color: '#a8473a', roughness: 0.9 },
  azul: { color: '#3f5f7f', roughness: 0.9 },
  ceramica: { color: '#f7f7f5', roughness: 0.25 },
  meson: { color: '#d9d4cb', roughness: 0.5 },
  amarillo: { color: '#d9a521', roughness: 0.85 },
};

const texturas = new Map();
function textura(nombre) {
  if (!texturas.has(nombre)) {
    const [c, ctx] = lienzo(512);
    let semilla = 7;
    for (const ch of nombre) semilla = (semilla * 31 + ch.charCodeAt(0)) % 2147483647;
    DIBUJOS[nombre](ctx, 512, azar(semilla || 1));
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    texturas.set(nombre, tex);
  }
  return texturas.get(nombre);
}

const materiales = new Map();
function material(nombre) {
  if (!materiales.has(nombre)) {
    let mat;
    if (DIBUJOS[nombre]) {
      const map = textura(nombre);
      const tile = nombre === 'techo' ? 120 : nombre === 'zinc' ? 60 : TILE;
      map.repeat.set(1 / tile, 1 / tile);
      mat = new THREE.MeshStandardMaterial({
        map,
        bumpMap: map,
        bumpScale: nombre === 'techo' || nombre === 'tinglado' ? 2.5 : 0.8,
        roughness: nombre === 'zinc' ? 0.35 : nombre === 'tablero' || nombre === 'pino' ? 0.6 : 0.8,
        metalness: nombre === 'zinc' ? 0.6 : 0,
        envMapIntensity: 0.45,
      });
    } else {
      mat = new THREE.MeshStandardMaterial({ envMapIntensity: 0.5, ...(COLORES[nombre] || COLORES.tela) });
    }
    materiales.set(nombre, mat);
  }
  return materiales.get(nombre);
}

// Caja con coordenadas de textura en centímetros y la veta siguiendo el lado más largo.
function geometriaCaja(w, h, d, m) {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.attributes.uv;
  // Orden de caras en BoxGeometry: +x, -x, +y, -y, +z, -z (4 vértices cada una)
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  const fijo = m === 'tinglado' || m === 'machi' || m === 'techo' || m === 'zinc';
  for (let cara = 0; cara < 6; cara++) {
    const [du, dv] = dims[cara];
    const girada = !fijo && dv > du;
    for (let k = 0; k < 4; k++) {
      const i = cara * 4 + k;
      const u = uv.getX(i);
      const v = uv.getY(i);
      if (girada) uv.setXY(i, v * dv + cara * 13, u * du);
      else uv.setXY(i, u * du + cara * 13, v * dv);
    }
  }
  return g;
}

function malla(p) {
  let mesh;
  if (p.t === 'perfil') {
    const forma = new THREE.Shape(p.pts.map(([u, v]) => new THREE.Vector2(p.eje === 'z' ? u : -u, v)));
    const g = new THREE.ExtrudeGeometry(forma, { depth: p.largo, bevelEnabled: false });
    mesh = new THREE.Mesh(g, material(p.m));
    if (p.eje === 'z') mesh.position.z = p.desde;
    else {
      mesh.rotation.y = Math.PI / 2;
      mesh.position.x = p.desde;
    }
  } else if (p.t === 'cil') {
    const g = new THREE.CylinderGeometry(p.r, p.r, p.h, 28);
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getY(i) * p.h, uv.getX(i) * Math.PI * 2 * p.r);
    mesh = new THREE.Mesh(g, material(p.m));
    if (p.eje === 'y') mesh.position.set(p.x, p.y + p.h / 2, p.z);
    else if (p.eje === 'x') {
      mesh.rotation.z = Math.PI / 2;
      mesh.position.set(p.x + p.h / 2, p.y, p.z);
    } else {
      mesh.rotation.x = Math.PI / 2;
      mesh.position.set(p.x, p.y, p.z + p.h / 2);
    }
  } else {
    mesh = new THREE.Mesh(geometriaCaja(p.w, p.h, p.d, p.m), material(p.m));
    mesh.position.set(p.x + p.w / 2, p.y + p.h / 2, p.z + p.d / 2);
    if (p.r) mesh.rotation.set(...p.r.map((g) => (g * Math.PI) / 180));
  }
  mesh.castShadow = p.m !== 'vidrio';
  mesh.receiveShadow = true;
  return mesh;
}

// Fondo: degradado de cielo que termina en el color de la niebla, para que no se note el horizonte.
const fondos = {};
function fondo(interior) {
  const clave = interior ? 'i' : 'e';
  if (!fondos[clave]) {
    const [c, ctx] = lienzo(256);
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, interior ? '#f1ece4' : '#79acdf');
    g.addColorStop(0.3, interior ? '#ede6dc' : '#c4dcef');
    g.addColorStop(0.52, interior ? '#e9e1d4' : '#e3edf2');
    g.addColorStop(1, interior ? '#e9e1d4' : '#e3edf2');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    fondos[clave] = new THREE.CanvasTexture(c);
    fondos[clave].colorSpace = THREE.SRGBColorSpace;
  }
  return fondos[clave];
}

let motor = null;
function obtenerMotor() {
  if (motor) return motor;
  const canvas = document.createElement('canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const entorno = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  motor = { renderer, entorno };
  return motor;
}

// Arma la escena de un plano. escena: 'interior' (piso de madera) o 'exterior' (pasto y cielo).
// Vista de armado: la madera se ve translúcida y cada tornillo aparece en rojo, en su lugar y con su largo.
const transparentes = new Map();
function translucido(mat) {
  if (!transparentes.has(mat)) {
    const t = mat.clone();
    t.transparent = true;
    t.opacity = 0.32;
    t.depthWrite = false;
    transparentes.set(mat, t);
  }
  return transparentes.get(mat);
}

function agregarTornillos(grupo, uniones, radio) {
  const puntos = uniones.flatMap((u) => u.puntos.map((pt) => ({ pt, u })));
  if (!puntos.length) return;
  const grosor = Math.max(0.4, radio * 0.006);
  const colores = { tornillo: 0xd7261e, clavo: 0x2f6fd6, tirafondo: 0x8e24aa, perno: 0x8e24aa };
  const porTipo = new Map();
  for (const x of puntos) {
    if (!porTipo.has(x.u.tipo)) porTipo.set(x.u.tipo, []);
    porTipo.get(x.u.tipo).push(x);
  }
  const arriba = new THREE.Vector3(0, 1, 0);
  for (const [tipo, lista] of porTipo) {
    const mat = new THREE.MeshStandardMaterial({ color: colores[tipo] || 0xd7261e, roughness: 0.4, metalness: 0.2, emissive: colores[tipo] || 0xd7261e, emissiveIntensity: 0.25 });
    const caña = new THREE.InstancedMesh(new THREE.CylinderGeometry(grosor, grosor * 0.6, 1, 8), mat, lista.length);
    const cabeza = new THREE.InstancedMesh(new THREE.CylinderGeometry(grosor * 2.4, grosor * 2.4, grosor * 1.2, 12), mat, lista.length);
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    lista.forEach(({ pt, u }, i) => {
      const dir = new THREE.Vector3(...u.dir).normalize();
      q.setFromUnitVectors(arriba, dir);
      const largo = u.largo / 10;
      const inicio = new THREE.Vector3(...pt).addScaledVector(dir, -grosor * 0.6);
      m4.compose(inicio.clone().addScaledVector(dir, largo / 2), q, new THREE.Vector3(1, largo, 1));
      caña.setMatrixAt(i, m4);
      m4.compose(inicio, q, new THREE.Vector3(1, 1, 1));
      cabeza.setMatrixAt(i, m4);
    });
    grupo.add(caña, cabeza);
  }
}

function armarEscena(plano, renderer, opciones = {}) {
  const m = obtenerMotor();
  const interior = (plano.escena || (plano.categoria === 'muebles' ? 'interior' : 'exterior')) === 'interior';
  const escena = new THREE.Scene();
  escena.environment = m.entorno;
  const grupo = new THREE.Group();
  const caja = new THREE.Box3();
  plano.modelo.forEach((p) => {
    const m3 = malla(p);
    grupo.add(m3);
    if (!esEntorno(p)) caja.expandByObject(m3);
  });
  if (opciones.tornillos) {
    grupo.children.forEach((m3) => {
      m3.material = translucido(m3.material);
      m3.castShadow = false;
    });
    agregarTornillos(grupo, opciones.tornillos, caja.getSize(new THREE.Vector3()).length() / 2);
  }
  escena.add(grupo);
  const suelo0 = new THREE.Box3().setFromObject(grupo).min.y;
  const centro = caja.getCenter(new THREE.Vector3());
  const tam = caja.getSize(new THREE.Vector3());
  const radio = tam.length() / 2;

  const suelo = new THREE.Mesh(
    new THREE.CircleGeometry(radio * 40, 48),
    new THREE.MeshStandardMaterial({ map: textura(interior ? 'piso' : 'pasto'), roughness: 0.95 }),
  );
  const ts = textura(interior ? 'piso' : 'pasto').clone();
  ts.needsUpdate = true;
  ts.repeat.set(interior ? 1 / 120 : 1 / 90, interior ? 1 / 120 : 1 / 90);
  suelo.material.map = ts;
  suelo.rotation.x = -Math.PI / 2;
  suelo.position.y = Math.min(suelo0, caja.min.y) - 0.05;
  suelo.receiveShadow = true;
  // Las coordenadas de textura del círculo van de 0 a 1: se pasan a centímetros.
  const uv = suelo.geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) - 0.5) * radio * 80, (uv.getY(i) - 0.5) * radio * 80);
  escena.add(suelo);
  const horizonte = interior ? 0xe9e1d4 : 0xe3edf2;
  escena.fog = new THREE.Fog(horizonte, radio * 3, radio * 10);
  escena.background = fondo(interior);

  escena.add(new THREE.HemisphereLight(interior ? 0xfff6e8 : 0xcfe6ff, interior ? 0x8a6a4a : 0x5a6b3a, interior ? 0.45 : 0.4));
  const sol = new THREE.DirectionalLight(interior ? 0xfff1dd : 0xfff4e0, interior ? 2.2 : 2.8);
  sol.position.set(centro.x + radio * 1.6, centro.y + radio * 3, centro.z + radio * 2.2);
  sol.target.position.copy(centro);
  sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048);
  const s = radio * 1.8;
  Object.assign(sol.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: radio * 0.5, far: radio * 8 });
  sol.shadow.bias = -0.0004;
  sol.shadow.normalBias = radio * 0.004;
  escena.add(sol, sol.target);
  return { escena, centro, radio, tam };
}

function camara(aspecto, centro, radio, tam, azimut = 0.62, elevacion) {
  const cam = new THREE.PerspectiveCamera(32, aspecto, radio / 20, radio * 60);
  const elev = elevacion ?? (tam.y > Math.max(tam.x, tam.z) * 1.4 ? 0.18 : 0.32);
  // Encuadre: tamaño aparente del objeto visto desde este ángulo, con algo de aire alrededor.
  const ancho = tam.x * Math.abs(Math.cos(azimut)) + tam.z * Math.abs(Math.sin(azimut));
  const fondo = tam.x * Math.abs(Math.sin(azimut)) + tam.z * Math.abs(Math.cos(azimut));
  const alto = tam.y * Math.cos(elev) + fondo * Math.sin(elev);
  const vfov = (cam.fov * Math.PI) / 180;
  const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspecto);
  const dist = Math.max((alto / 2) / Math.tan(vfov / 2), (ancho / 2) / Math.tan(hfov / 2)) * 1.18 + fondo / 2;
  cam.position.set(
    centro.x + dist * Math.cos(elev) * Math.sin(azimut),
    centro.y + dist * Math.sin(elev),
    centro.z + dist * Math.cos(elev) * Math.cos(azimut),
  );
  cam.lookAt(centro);
  return cam;
}

function liberar(escena) {
  escena.traverse((o) => {
    if (o.isMesh) {
      o.geometry.dispose();
      if (![...materiales.values()].includes(o.material) && ![...transparentes.values()].includes(o.material)) {
        o.material.map?.dispose();
        o.material.dispose();
      }
    }
  });
}

// Imagen fija (JPEG) para las tarjetas del catálogo.
export function foto(plano, ancho = 480, alto = 360, opciones = {}) {
  const { renderer } = obtenerMotor();
  renderer.setPixelRatio(1);
  renderer.setSize(ancho, alto, false);
  const { escena, centro, radio, tam } = armarEscena(plano, renderer, opciones);
  renderer.render(escena, camara(ancho / alto, centro, radio, tam));
  const url = renderer.domElement.toDataURL('image/jpeg', 0.86);
  liberar(escena);
  return url;
}

// Visor que se puede girar con el dedo, para la página de cada plano.
export function visor(plano, contenedor, opciones = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'visor-3d';
  contenedor.replaceChildren(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const pmrem = new THREE.PMREMGenerator(renderer);
  const entorno = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const { escena, centro, radio, tam } = armarEscena(plano, renderer, opciones);
  escena.environment = entorno;
  let azimut = 0.62;
  let elev = tam.y > Math.max(tam.x, tam.z) * 1.4 ? 0.18 : 0.32;
  let zoom = 1;
  let cam;
  const dibujar = () => {
    const w = contenedor.clientWidth || 320;
    const h = Math.round(w * 0.75);
    renderer.setSize(w, h, false);
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    cam = camara(w / h, centro, radio, tam.clone().multiplyScalar(zoom), azimut, elev);
    renderer.render(escena, cam);
  };
  let arrastre = null;
  canvas.addEventListener('pointerdown', (e) => {
    arrastre = { x: e.clientX, y: e.clientY, a: azimut, e: elev };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!arrastre) return;
    azimut = arrastre.a - (e.clientX - arrastre.x) * 0.01;
    elev = Math.min(1.3, Math.max(0.03, arrastre.e + (e.clientY - arrastre.y) * 0.006));
    requestAnimationFrame(dibujar);
  });
  const soltar = () => { arrastre = null; };
  canvas.addEventListener('pointerup', soltar);
  canvas.addEventListener('pointercancel', soltar);
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoom = Math.min(2, Math.max(0.5, zoom * (e.deltaY > 0 ? 1.1 : 0.9)));
    requestAnimationFrame(dibujar);
  }, { passive: false });
  dibujar();
  const alCambiar = () => dibujar();
  window.addEventListener('resize', alCambiar);
  return () => {
    window.removeEventListener('resize', alCambiar);
    liberar(escena);
    entorno.dispose();
    pmrem.dispose();
    renderer.dispose();
  };
}
