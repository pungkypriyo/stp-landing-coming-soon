import * as THREE from 'three';

/* ---------- multilingual word cloud data ---------- */
interface Word {
  t: string;
  lang: string;
  hl: boolean;
}

const WORDS: Word[] = [
  { t: 'Relax yet Productive',             lang: 'English',          hl: true  },
  { t: 'Santai Tapi Productive',           lang: 'Bahasa Indonesia', hl: true  },
  { t: 'Santai Tapi Produktif',            lang: 'Melayu',           hl: false },
  { t: 'リラックスして生産的に',           lang: '日本語',           hl: false },
  { t: '轻松而高效',                       lang: '中文 (简体)',      hl: false },
  { t: '輕鬆而高效',                       lang: '中文 (繁體)',      hl: false },
  { t: '편안하지만 생산적으로',            lang: '한국어',           hl: false },
  { t: 'Relajado pero Productivo',        lang: 'Español',          hl: false },
  { t: 'Détendu mais Productif',          lang: 'Français',         hl: false },
  { t: 'Entspannt, aber produktiv',       lang: 'Deutsch',          hl: false },
  { t: 'Rilassato ma Produttivo',         lang: 'Italiano',         hl: false },
  { t: 'Relaxado mas Produtivo',          lang: 'Português',        hl: false },
  { t: 'Ontspannen maar productief',      lang: 'Nederlands',       hl: false },
  { t: 'Расслабленно, но продуктивно',    lang: 'Русский',          hl: false },
  { t: 'استرخِ وكن منتجًا',               lang: 'العربية',          hl: false },
  { t: 'आराम से लेकिन उत्पादक',           lang: 'हिन्दी',           hl: false },
  { t: 'ผ่อนคลายแต่มีประสิทธิภาพ',         lang: 'ไทย',              hl: false },
  { t: 'Thư giãn nhưng hiệu quả',         lang: 'Tiếng Việt',       hl: false },
  { t: 'Rahat ama Üretken',               lang: 'Türkçe',           hl: false },
  { t: 'Avslappnad men produktiv',        lang: 'Svenska',          hl: false },
  { t: 'Zrelaksowany, ale produktywny',   lang: 'Polski',           hl: false },
  { t: 'Χαλαρά αλλά παραγωγικά',          lang: 'Ελληνικά',         hl: false },
  { t: 'Розслаблено, але продуктивно',    lang: 'Українська',       hl: false },
  { t: 'Uvolněně, ale produktivně',       lang: 'Čeština',          hl: false },
  { t: 'Rentoutuneesti mutta tuottavasti', lang: 'Suomi',           hl: false },
  { t: 'Relaxed pero Produktibo',         lang: 'Filipino',         hl: false },
  { t: 'Avslappet, men produktiv',        lang: 'Norsk',            hl: false },
  { t: 'Afslappet, men produktiv',        lang: 'Dansk',            hl: false },
];

/* ---------- renderer ---------- */
const stage = document.getElementById('stage') as HTMLElement;
const noWebgl = document.getElementById('no-webgl') as HTMLElement;

let renderer: THREE.WebGLRenderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
} catch (e) {
  noWebgl.style.display = 'inline-block';
  throw e;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x05060f);
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05060f, 0.00022);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.z = 560;

/* ---------- starfield ---------- */
(function stars() {
  const n = 900;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = 500 + Math.random() * 900;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    pos[i * 3 + 2] = r * Math.cos(ph);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({ color: 0x64748b, size: 1.6, sizeAttenuation: true, transparent: true, opacity: 0.55 });
  scene.add(new THREE.Points(g, m));
})();

/* ---------- text sprites ---------- */
interface SpriteMeta {
  base: THREE.Vector3;
  target: number; // 0 = idle, 1 = hovered
  hover: number;  // eased 0..1
}

const FONT = '"Segoe UI", system-ui, -apple-system, "Noto Sans", "Helvetica Neue", sans-serif';

function makeSprite(word: Word, i: number): THREE.Sprite {
  const size = word.hl ? 58 : 42;
  const font = `600 ${size}px ${FONT}`;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d')!;
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(word.t).width) + 28;
  const h = Math.ceil(size * 1.8);
  c.width = w;
  c.height = h;
  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  let color: string;
  if (word.hl && word.lang === 'Bahasa Indonesia') color = '#38bdf8';
  else if (word.hl) color = '#f8fafc';
  else color = `hsl(${205 + (i % 7) * 9}, ${word.lang.length % 3 === 0 ? 34 : 22}%, 72%)`;

  ctx.shadowColor = word.hl ? 'rgba(56,189,248,0.75)' : 'rgba(15,23,42,0.9)';
  ctx.shadowBlur = word.hl ? 22 : 10;
  ctx.fillStyle = color;
  ctx.fillText(word.t, w / 2, h / 2);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const s = new THREE.Sprite(mat);
  const scale = word.hl ? 1.45 : 1;
  s.scale.set((w / 9) * scale, (h / 9) * scale, 1);
  s.userData = { base: s.scale.clone(), target: 0, hover: 0 } as SpriteMeta;
  return s;
}

const sprites = WORDS.map(makeSprite);
const cloud = new THREE.Group();
scene.add(cloud);

/* fibonacci sphere placement */
const N = sprites.length;
const RADIUS = 300;
const PHI = Math.PI * (3 - Math.sqrt(5));
sprites.forEach((sp, i) => {
  const y = 1 - (i / (N - 1)) * 2;
  const r = Math.sqrt(1 - y * y);
  const th = PHI * i;
  sp.position.set(Math.cos(th) * r * RADIUS, y * RADIUS, Math.sin(th) * r * RADIUS);
  cloud.add(sp);
});

/* ---------- interaction: drag + inertia ---------- */
const state = {
  dragging: false,
  rotY: 0,
  rotX: 0,
  velY: 0,
  velX: 0,
  lastX: 0,
  lastY: 0,
  hovered: null as THREE.Sprite | null,
};
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const el = renderer.domElement;
el.addEventListener('pointerdown', (e: PointerEvent) => {
  state.dragging = true;
  state.lastX = e.clientX;
  state.lastY = e.clientY;
  state.velX = 0;
  state.velY = 0;
});
window.addEventListener('pointermove', (e: PointerEvent) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  if (!state.dragging) return;
  const dx = e.clientX - state.lastX;
  const dy = e.clientY - state.lastY;
  state.lastX = e.clientX;
  state.lastY = e.clientY;
  state.rotY += dx * 0.005;
  state.rotX = Math.max(-0.7, Math.min(0.7, state.rotX + dy * 0.005));
  state.velY = dx * 0.0012;
  state.velX = dy * 0.0012;
});
window.addEventListener('pointerup', () => {
  state.dragging = false;
});

/* hover highlight */
function pick() {
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(sprites);
  const next = hits.length ? (hits[0].object as THREE.Sprite) : null;
  if (next !== state.hovered) {
    if (state.hovered) state.hovered.userData.target = 0;
    if (next) next.userData.target = 1;
    state.hovered = next;
    el.style.cursor = next ? 'pointer' : 'grab';
  }
}

/* ---------- resize ---------- */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ---------- loop ---------- */
function animate() {
  requestAnimationFrame(animate);
  if (!reducedMotion) {
    if (!state.dragging) {
      state.rotY += 0.0016;
      state.velY *= 0.94;
      state.velX *= 0.94;
      state.rotY += state.velY;
      state.rotX = Math.max(-0.7, Math.min(0.7, state.rotX + state.velX));
    }
  }
  cloud.rotation.y = state.rotY;
  cloud.rotation.x = state.rotX;
  pick();
  for (const sp of sprites) {
    const meta = sp.userData as SpriteMeta;
    meta.hover += (meta.target - meta.hover) * 0.12;
    sp.scale.copy(meta.base).multiplyScalar(1 + 0.28 * meta.hover);
  }
  renderer.render(scene, camera);
}
el.style.cursor = 'grab';
animate();
