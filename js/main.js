/* ─────────────────────────────────────────────────────────────
   Hero animation: a snippet of code drifts down the canvas
   and as it falls each character "decays" into a 1 or 0,
   producing a stream of binary that pools at the bottom.
   ───────────────────────────────────────────────────────────── */

const SOURCE_LINES = [
  'async function buildAgent(model, tools) {',
  '  const ctx = await loadContext();',
  '  const prompt = compose(SYSTEM, ctx);',
  '  return new Agent({ model, tools, prompt });',
  '}',
  '',
  'class Embedding {',
  '  constructor(vec) { this.vec = vec; }',
  '  similarity(other) {',
  '    return dot(this.vec, other.vec);',
  '  }',
  '}',
  '',
  'for (const chunk of stream) {',
  '  yield decode(chunk.tokens);',
  '}',
  '',
  'const result = await llm.complete({',
  '  messages, temperature: 0.7,',
  '  max_tokens: 2048,',
  '});',
  '',
  'if (loss < threshold) save(model);'
];

const COLOR_CODE   = '#9ca3af';
const COLOR_DECAY  = '#00d4ff';
const COLOR_BINARY = '#00ff9c';
const FONT_SIZE    = 14;
const LINE_HEIGHT  = 18;
const FALL_SPEED   = 0.55;
const DECAY_DEPTH  = 0.45;
const BINARY_DEPTH = 0.78;

const canvas = document.getElementById('matrixCanvas');
const ctx    = canvas.getContext('2d');

let width = 0;
let height = 0;
let columns = [];

function resize() {
  const dpr = window.devicePixelRatio || 1;
  width  = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width  = width  * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  rebuildColumns();
}

function rebuildColumns() {
  ctx.font = `${FONT_SIZE}px ui-monospace, monospace`;
  const colWidth = ctx.measureText('M').width * 22;
  const count    = Math.max(3, Math.floor(width / colWidth));
  columns = [];
  for (let i = 0; i < count; i++) {
    columns.push(makeColumn(i, count));
  }
}

function makeColumn(i, total) {
  const x = (i + 0.5) * (width / total);
  const lineIdx = Math.floor(Math.random() * SOURCE_LINES.length);
  const text = SOURCE_LINES[lineIdx] || '0';
  return {
    x,
    text,
    y: -Math.random() * height,
    speed: FALL_SPEED + Math.random() * 0.6,
    seed: Math.random() * 1000,
  };
}

/* deterministic-ish hash for stable per-cell binary picks */
function hash(a, b, c) {
  let h = (a * 73856093) ^ (b * 19349663) ^ (c * 83492791);
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function drawColumn(col, t) {
  const lines = col.text.split('');
  const headY = col.y;

  /* tail of trailing characters above the head, fading out */
  const TRAIL = 18;
  for (let k = -2; k < TRAIL; k++) {
    const y = headY - k * LINE_HEIGHT;
    if (y < -LINE_HEIGHT || y > height + LINE_HEIGHT) continue;

    const ch = lines[((k % lines.length) + lines.length) % lines.length] || ' ';
    if (ch === ' ') continue;

    /* fall progress 0 (top) → 1 (bottom) */
    const p = Math.max(0, Math.min(1, y / height));

    let glyph = ch;
    let color = COLOR_CODE;
    let alpha = 1;

    if (p > BINARY_DEPTH) {
      /* fully decayed: stable 0/1 per (column,row) */
      const r = hash(Math.floor(col.x), Math.floor(y / LINE_HEIGHT), Math.floor(col.seed));
      glyph = r > 0.5 ? '1' : '0';
      color = COLOR_BINARY;
      alpha = 0.95;
    } else if (p > DECAY_DEPTH) {
      /* mid-decay: flicker between original char and 0/1 */
      const localT  = (p - DECAY_DEPTH) / (BINARY_DEPTH - DECAY_DEPTH);
      const flicker = hash(Math.floor(col.x), Math.floor(y / LINE_HEIGHT), Math.floor(t / 90));
      if (flicker < localT) {
        glyph = flicker > 0.5 - localT * 0.5 ? '1' : '0';
        color = COLOR_DECAY;
      }
      alpha = 0.85 + 0.15 * (1 - localT);
    }

    /* fade trailing characters and the very-top edge */
    if (k > 6) alpha *= Math.max(0, 1 - (k - 6) / (TRAIL - 6));
    if (y < 30) alpha *= y / 30;

    ctx.globalAlpha = alpha;
    ctx.fillStyle   = color;
    /* head glyph gets a glow */
    if (k === 0) {
      ctx.shadowColor = color;
      ctx.shadowBlur  = 8;
    } else {
      ctx.shadowBlur  = 0;
    }
    ctx.fillText(glyph, col.x, y);
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur  = 0;
}

function frame(t) {
  /* slight trail by overlaying a translucent dark rectangle */
  ctx.fillStyle = 'rgba(10, 14, 26, 0.18)';
  ctx.fillRect(0, 0, width, height);

  ctx.font = `${FONT_SIZE}px ui-monospace, monospace`;
  ctx.textBaseline = 'middle';

  for (const col of columns) {
    col.y += col.speed * (LINE_HEIGHT / 14);
    if (col.y - LINE_HEIGHT * 30 > height) {
      /* recycle the column with a fresh code line */
      col.text = SOURCE_LINES[Math.floor(Math.random() * SOURCE_LINES.length)];
      col.y = -Math.random() * height * 0.3;
      col.speed = FALL_SPEED + Math.random() * 0.6;
      col.seed = Math.random() * 1000;
    }
    drawColumn(col, t);
  }

  requestAnimationFrame(frame);
}

resize();
window.addEventListener('resize', resize);
requestAnimationFrame(frame);

/* ─────────────────────────────────────────────────────────────
   Page UX: nav toggle, smooth nav close, year, contact form,
   skill bar reveal on scroll.
   ───────────────────────────────────────────────────────────── */

document.getElementById('year').textContent = new Date().getFullYear();

document.querySelector('.nav__toggle').addEventListener('click', () => {
  document.querySelector('.nav__links').classList.toggle('open');
});

document.querySelectorAll('.nav__links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav__links').classList.remove('open');
  });
});

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const feedback = document.getElementById('formFeedback');
  feedback.textContent = '> message_received. thanks for reaching out.';
  feedback.hidden = false;
  e.target.reset();
  setTimeout(() => { feedback.hidden = true; }, 4000);
});

/* trigger skill bars when the resume scrolls into view */
const skillBars = document.querySelectorAll('.skill__bar span');
const initialWidths = Array.from(skillBars).map(el => el.style.width);
skillBars.forEach(el => { el.style.width = '0%'; });

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      skillBars.forEach((el, i) => { el.style.width = initialWidths[i]; });
      skillObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const resumeSection = document.getElementById('resume');
if (resumeSection) skillObserver.observe(resumeSection);
