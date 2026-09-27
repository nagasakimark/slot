// ============================================================
//  TOAD'S PRIZE MACHINE — scenes
//  Title → Menu → Learn → Practice → Game
// ============================================================
'use strict';

const ART = {
  bg: 'background.jpg',
  machine: 'slots.png',
  front: 'front.png',
  coinFront: 'coinfront.png',
  toadTitle: 'toad.png',
  machineTitle: 'mysteryprizemachine.png',
  coin: 'coin.gif',
  toad: 'toad.gif'
};

// Machine artwork box (slots.png is 4405x2480) and features measured from the art
const MB = { x: 20, y: 24, w: 1216 };
MB.h = MB.w * 2480 / 4405;
const mf = (fx, fy) => ({ x: MB.x + fx * MB.w, y: MB.y + fy * MB.h });
function mrect(x0, y0, x1, y1) {
  const a = mf(x0, y0), b = mf(x1, y1);
  return { x: a.x, y: a.y, w: b.x - a.x, h: b.y - a.y, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
}
const REELS = [mrect(0.2425, 0.2351, 0.4770, 0.7585), mrect(0.5237, 0.2351, 0.7585, 0.7585)];
const FRONT = { x: MB.x + 0.205 * MB.w, y: MB.y + 0.101 * MB.h, w: 0.5908 * MB.w, h: 0.828 * MB.h };
const COINBOX = { x: MB.x + 0.8323 * MB.w, y: MB.y + 0.364 * MB.h, w: 0.1625 * MB.w };
COINBOX.h = COINBOX.w * 721 / 719;
const SLIT = mf(0.915, 0.503);
const TOAD_TITLE = { x: MB.x + 0.3595 * MB.w, y: MB.y + 0.0225 * MB.h, w: 0.294 * MB.w };
TOAD_TITLE.h = TOAD_TITLE.w * 425 / 1362;
const MACHINE_TITLE = { x: MB.x + 0.1945 * MB.w, y: MB.y + 0.811 * MB.h, w: 0.622 * MB.w };
MACHINE_TITLE.h = MACHINE_TITLE.w * 289 / 2706;
const BULBS = [[0.3429,0.0833],[0.2728,0.0913],[0.7134,0.0922],[0.7732,0.0987],[0.2024,0.1380],[0.7979,0.1687],[0.1979,0.2455],[0.8021,0.2687],[0.1930,0.3578],[0.8067,0.3641],[0.8097,0.4572],[0.1903,0.4664],[0.8104,0.5546],[0.1902,0.5680],[0.8073,0.6533],[0.1925,0.6805],[0.8045,0.7663],[0.1980,0.7942],[0.7988,0.8793],[0.2336,0.9088],[0.7397,0.9160],[0.3004,0.9171],[0.6765,0.9249],[0.3661,0.9265],[0.6189,0.9312],[0.4283,0.9333],[0.5583,0.9354],[0.4884,0.9379]]
  .map(([x, y]) => ({ ...mf(x, y), a: Math.atan2(y - 0.5, x - 0.5) }))
  .sort((p, q) => p.a - q.a);

const Game = { cat: null };

// ------------------------------------------------------------ shared helpers
const Settings = {
  load() { try { if (JSON.parse(localStorage.getItem('toadslots') || '{}').muted) Sound.setMuted(true); } catch (e) {} },
  save() { try { localStorage.setItem('toadslots', JSON.stringify({ muted: Sound.muted })); } catch (e) {} }
};
function toggleFullscreen() {
  try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (e) {}
}
function toggleMute() { Sound.setMuted(!Sound.muted); Settings.save(); }
function cornerButtons() {
  return [
    new Button({ x: 1160, y: 44, w: 56, circle: true, color: '#7b3fc4', icon: Icons.sound, onClick: toggleMute }),
    new Button({ x: 1226, y: 44, w: 56, circle: true, color: '#7b3fc4', icon: Icons.fullscreen, onClick: toggleFullscreen })
  ];
}
function backButton(onClick) {
  return new Button({ x: 46, y: 44, w: 60, circle: true, color: '#e52521', icon: Icons.back, onClick });
}
function commonKeys(e) {
  if (e.key === 'm' || e.key === 'M') toggleMute();
  if (e.key === 'f' || e.key === 'F') toggleFullscreen();
}

function drawCasino(ctx, dim = 0, t = 0) {
  const bg = Images.get(ART.bg);
  const v = Engine.view();
  const k = Math.max(v.w / 1280, v.h / 960) * 1.04;
  const w = 1280 * k, h = 960 * k;
  const x = W / 2 - w / 2 + Math.sin(t * 0.15) * 10, y = H / 2 - h / 2 - 60 * k + (h - v.h) * 0.12;
  if (bg) ctx.drawImage(bg, x, Math.min(v.y, y), w, h);
  // twinkling ceiling stars
  for (let i = 0; i < 18; i++) {
    const sx = (i * 173.3) % W, sy = 20 + ((i * 97.1) % 240);
    const a = 0.5 + 0.5 * Math.sin(t * 2.3 + i * 1.7);
    Glow.draw(ctx, '#fff3b0', sx, sy, 10 + a * 8, a * 0.7);
  }
  if (dim > 0) {
    ctx.fillStyle = `rgba(20,5,40,${dim})`;
    ctx.fillRect(v.x, v.y, v.w, v.h);
  }
}

function drawGoldPanel(ctx, x, y, w, h, r = 26) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  rr(ctx, x, y + 10, w, h, r); ctx.fill();
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, '#ffe680'); g.addColorStop(0.5, '#e8a712'); g.addColorStop(1, '#b8740a');
  ctx.fillStyle = g;
  rr(ctx, x, y, w, h, r); ctx.fill();
  const c = ctx.createLinearGradient(0, y, 0, y + h);
  c.addColorStop(0, '#fffaf0'); c.addColorStop(1, '#f5e6c8');
  ctx.fillStyle = c;
  rr(ctx, x + 9, y + 9, w - 18, h - 18, r - 8); ctx.fill();
  ctx.restore();
}

function drawRedBanner(ctx, x, y, w, h, text, size) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  rr(ctx, x - w / 2, y - h / 2 + 7, w, h, 18); ctx.fill();
  const g = ctx.createLinearGradient(0, y - h / 2, 0, y + h / 2);
  g.addColorStop(0, '#ff5a4f'); g.addColorStop(0.55, '#e52521'); g.addColorStop(1, '#a8120f');
  ctx.fillStyle = g;
  rr(ctx, x - w / 2, y - h / 2, w, h, 18); ctx.fill();
  ctx.strokeStyle = '#7a0a08'; ctx.lineWidth = 4;
  rr(ctx, x - w / 2, y - h / 2, w, h, 18); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  rr(ctx, x - w / 2 + 10, y - h / 2 + 6, w - 20, h * 0.3, 10); ctx.fill();
  txt(ctx, text, x, y + 3, { size: size || h * 0.55, fill: { grad: ['#fffbe0', '#ffd84a'] }, stroke: '#5a1200', lw: 8, maxW: w - 40 });
  ctx.restore();
}

// Item picture fitted into a box
function drawFit(ctx, img, cx, cy, bw, bh, cover = false) {
  if (!img) return;
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
  const k = cover ? Math.max(bw / iw, bh / ih) : Math.min(bw / iw, bh / ih);
  ctx.drawImage(img, cx - iw * k / 2, cy - ih * k / 2, iw * k, ih * k);
}

// A sprite character standing with feet at (x, y)
function drawSprite(ctx, entry, t, x, y, h, o = {}) {
  const fr = Anims.frame(entry, t);
  if (!fr) return;
  const fw = fr.naturalWidth || fr.width, fh = fr.naturalHeight || fr.height;
  let w = fw * h / fh;
  if (o.maxW && w > o.maxW) { h *= o.maxW / w; w = o.maxW; }
  ctx.save();
  ctx.globalAlpha *= o.alpha ?? 1;
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath(); ctx.ellipse(x, y - 4, w * 0.36, 12, 0, 0, TAU); ctx.fill();
  ctx.translate(x, y);
  ctx.rotate(o.rot || 0);
  ctx.scale((o.sx || 1) * (o.flip ? -1 : 1), o.sy || 1);
  ctx.drawImage(fr, -w / 2, -h, w, h);
  ctx.restore();
}

// Spinning coin particles use the coin GIF frames
function coinBurst(x, y, n = 14, power = 1) {
  const e = Anims.get(ART.coin, 160);
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + rand(-1.1, 1.1);
    const sp = rand(380, 720) * power;
    Particles.spawn({
      x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 1500, max: rand(1.1, 1.6),
      size: rand(38, 56), shape: 'img', layer: 'ui', rot: 0, phase: rand(0, 1),
      update: p => { p.img = Anims.frame(e, p.life * 1.4 + p.phase); }
    });
  }
}

// ------------------------------------------------------------ machine
const Machine = {
  reels: null,
  bulbMode: 'chase',
  bulbT: 0,
  shake: 0,

  init(items) {
    this.reels = REELS.map((r, i) => ({
      rect: r, i, p: 0, v: 0, items, target: null, targetK: -1, stopping: false, flipScale: 1,
      show: 'reel', prize: null, flip: 1, glow: 0, bounce: new Spring(1, 420, 14), sun: 0
    }));
  },

  setItems(items) { this.reels.forEach(r => { r.items = items; }); },

  itemAt(reel, k) {
    if (k === reel.targetK && reel.target) return reel.target;
    const n = reel.items.length;
    const idx = ((k * (reel.i ? 7 : 5) + reel.i * 3) % n + n) % n;
    return reel.items[idx];
  },

  update(dt) {
    this.bulbT += dt;
    this.shake = Math.max(0, this.shake - dt * 3);
    for (const r of this.reels) {
      if (!r.stopping) r.p += r.v * dt;
      r.bounce.update(dt);
    }
  },

  // Draw a reel window (clipped) — spinning strip or a revealed card
  drawReel(ctx, r, t) {
    const R = r.rect;
    ctx.save();
    rr(ctx, R.x, R.y, R.w, R.h, 34);
    ctx.clip();
    const bgG = ctx.createRadialGradient(R.cx, R.cy, 20, R.cx, R.cy, R.h * 0.7);
    bgG.addColorStop(0, '#ff7a93'); bgG.addColorStop(1, '#f23d64');
    ctx.fillStyle = bgG;
    ctx.fillRect(R.x, R.y, R.w, R.h);
    if (r.sun > 0) drawSunburst(ctx, R.cx, R.cy, R.h, r.sun * 0.7, Engine.realTime, '255,240,150');
    if (r.glow > 0) Glow.draw(ctx, '#fff6b0', R.cx, R.cy, R.w * 0.8, r.glow * 0.8);

    const cellH = R.h;
    const speed = Math.abs(r.v);
    if (r.show === 'reel') {
      const base = Math.floor(r.p);
      for (let k = base - 1; k <= base + 1; k++) {
        const it = this.itemAt(r, k);
        const img = Images.get(it.src);
        const y = R.cy + (r.p - k) * cellH;
        if (y < R.y - cellH || y > R.y + R.h + cellH) continue;
        const blur = clamp(speed / 22, 0, 1);
        ctx.save();
        ctx.translate(R.cx, y);
        const s = r.bounce.v;
        ctx.scale(s, s * (1 + blur * 0.35));
        if (blur > 0.2) {
          ctx.globalAlpha = 0.35;
          drawFit(ctx, img, 0, -cellH * 0.12 * blur, R.w * 0.72, R.h * 0.62);
          drawFit(ctx, img, 0, cellH * 0.12 * blur, R.w * 0.72, R.h * 0.62);
          ctx.globalAlpha = 0.6;
        }
        drawFit(ctx, img, 0, 0, R.w * 0.72, R.h * 0.62);
        ctx.restore();
      }
    } else {
      // flipping between the landed item and its prize
      ctx.save();
      ctx.translate(R.cx, R.cy);
      if (r.wobble > 0) ctx.rotate(Math.sin(Engine.realTime * 40) * 0.06 * r.wobble);
      const s = r.bounce.v;
      ctx.scale(s * r.flipScale, s);
      if (r.show === 'item') {
        drawFit(ctx, Images.get(r.target.src), 0, -8, R.w * 0.76, R.h * 0.6);
      } else {
        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 12;
        rr(ctx, -R.w * 0.42, -R.h * 0.38, R.w * 0.84, R.h * 0.76, 22); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.save();
        rr(ctx, -R.w * 0.42 + 8, -R.h * 0.38 + 8, R.w * 0.84 - 16, R.h * 0.76 - 16, 16); ctx.clip();
        drawFit(ctx, Images.get(r.prize), 0, 0, R.w * 0.8 - 20, R.h * 0.72 - 20);
        ctx.restore();
      }
      ctx.restore();
    }
    // speed streaks
    if (speed > 4) {
      ctx.fillStyle = `rgba(255,255,255,${clamp(speed / 60, 0, 0.35)})`;
      for (let i = 0; i < 5; i++) {
        const y = R.y + ((i * 97 + r.p * 170) % R.h);
        ctx.fillRect(R.x, y, R.w, 3);
      }
    }
    // glass shading and glare
    const sh = ctx.createLinearGradient(0, R.y, 0, R.y + R.h);
    sh.addColorStop(0, 'rgba(60,0,30,0.45)'); sh.addColorStop(0.18, 'rgba(60,0,30,0)');
    sh.addColorStop(0.82, 'rgba(60,0,30,0)'); sh.addColorStop(1, 'rgba(60,0,30,0.45)');
    ctx.fillStyle = sh;
    ctx.fillRect(R.x, R.y, R.w, R.h);
    const gx = R.x + ((t * 90 + r.i * 140) % (R.w * 3)) - R.w;
    const gl = ctx.createLinearGradient(gx, R.y, gx + 90, R.y + R.h);
    gl.addColorStop(0, 'rgba(255,255,255,0)'); gl.addColorStop(0.5, 'rgba(255,255,255,0.22)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gl;
    ctx.fillRect(R.x, R.y, R.w, R.h);
    ctx.restore();
  },

  drawBulbs(ctx, t, intensity = 1) {
    BULBS.forEach((b, i) => {
      let on;
      if (this.bulbMode === 'flash') on = Math.sin(t * 16) > 0 ? 1 : 0.25;
      else if (this.bulbMode === 'fast') on = ((Math.floor(t * 22) - i) % 4 + 4) % 4 === 0 ? 1 : 0.25;
      else on = ((Math.floor(t * 6) - i) % 3 + 3) % 3 === 0 ? 1 : 0.35;
      Glow.draw(ctx, '#fff1a0', b.x, b.y, 22 + on * 12, on * intensity * 0.9);
    });
  },

  draw(ctx, t, o = {}) {
    const sx = this.shake > 0 ? rand(-1, 1) * this.shake * 10 : 0;
    const sy = this.shake > 0 ? rand(-1, 1) * this.shake * 6 : 0;
    ctx.save();
    ctx.translate(sx, sy);
    Glow.draw(ctx, '#ff7de0', MB.x + MB.w * 0.5, MB.y + MB.h * 0.5, 620, 0.18);
    const art = Images.get(ART.machine);
    if (art) ctx.drawImage(art, MB.x, MB.y, MB.w, MB.h);
    this.reels.forEach(r => this.drawReel(ctx, r, t));
    const front = Images.get(ART.front);
    if (front) ctx.drawImage(front, FRONT.x, FRONT.y, FRONT.w, FRONT.h);
    this.drawBulbs(ctx, t, o.bulbs ?? 1);
    if (o.titles !== false) {
      const tt = Images.get(ART.toadTitle), mt = Images.get(ART.machineTitle);
      const bob = Math.sin(t * 2.2) * 3;
      if (tt) ctx.drawImage(tt, TOAD_TITLE.x, TOAD_TITLE.y + bob, TOAD_TITLE.w, TOAD_TITLE.h);
      if (mt) ctx.drawImage(mt, MACHINE_TITLE.x, MACHINE_TITLE.y, MACHINE_TITLE.w, MACHINE_TITLE.h);
    }
    ctx.restore();
  },

  drawCoinBox(ctx, glow) {
    const cf = Images.get(ART.coinFront);
    if (glow > 0) Glow.draw(ctx, '#ffe066', COINBOX.x + COINBOX.w / 2, COINBOX.y + COINBOX.h / 2, 150, glow * 0.8);
    if (cf) ctx.drawImage(cf, COINBOX.x, COINBOX.y, COINBOX.w, COINBOX.h);
  }
};

// ============================================================ LOADING
const LoadingScene = {
  enter() {
    this.progress = 0;
    const list = Object.values(ART);
    let n = 0;
    const total = list.length + 1;
    const loads = list.map(src => Images.load(src).then(() => { n++; this.progress = n / total; }));
    const fonts = Promise.race([
      Promise.all(['40px "SuperMario"', '700 40px "Fredoka"', '600 40px "Fredoka"', '500 40px "Fredoka"']
        .map(f => (document.fonts ? document.fonts.load(f) : null))),
      new Promise(r => setTimeout(r, 3000))
    ]).catch(() => {}).then(() => { n++; this.progress = n / total; });
    Promise.all([...loads, fonts]).then(() => Engine.go(TitleScene));
    Anims.get(ART.coin, 160);
    Anims.get(ART.toad, 360);
    CHARACTERS.forEach(c => Anims.get(c, 420));
  },
  draw(ctx) {
    const v = Engine.view();
    ctx.fillStyle = '#1a0833';
    ctx.fillRect(v.x, v.y, v.w, v.h);
    const coin = Images.get(ART.coin);
    const t = Engine.realTime;
    if (coin) {
      ctx.save();
      ctx.translate(640, 300 - Math.abs(Math.sin(t * 4)) * 60);
      ctx.scale(Math.cos(t * 6), 1);
      ctx.drawImage(coin, -50, -50, 100, 100);
      ctx.restore();
    }
    txt(ctx, 'LOADING', 640, 420, { size: 44, fill: '#ffd84a', stroke: '#5a1200' });
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    rr(ctx, 440, 470, 400, 22, 11); ctx.fill();
    ctx.fillStyle = '#ffd84a';
    rr(ctx, 440, 470, Math.max(22, 400 * this.progress), 22, 11); ctx.fill();
  }
};

// ============================================================ TITLE (attract mode)
const TitleScene = {
  enter() {
    this.t = 0;
    const prizes = PRIZE_PAIRS.flat().map(src => ({ src, name: '' }));
    prizes.forEach(p => Images.load(p.src));
    Machine.init(prizes);
    Machine.reels[0].v = 1.2;
    Machine.reels[1].v = -1.2;
    Machine.bulbMode = 'chase';
    this.toad = Anims.get(ART.toad, 360);
    this.logo = { s: 0 };
    Tween.to(this.logo, { s: 1 }, 0.7, { ease: Ease.outElastic, delay: 0.3 });
    this.start = new Button({ x: 1134, y: 590, w: 250, h: 96, label: 'START', size: 46, color: '#ffcf1f', textColor: '#fff', appear: 0, pulse: true, onClick: () => this.go() });
    Tween.to(this.start, { appear: 1 }, 0.5, { ease: Ease.outBack, delay: 0.8 });
    this.buttons = [this.start, ...cornerButtons()];
    this.coinT = 0;
    if (Sound.ctx) Sound.loop('music', 0.45);
  },
  go() {
    if (this.leaving) return;
    this.leaving = true;
    Sound.unlock();
    Sound.coin(4);
    coinBurst(1134, 590, 12);
    Engine.go(MenuScene, null, 1134, 590);
  },
  exit() { this.leaving = false; },
  isHot(x, y) { return this.buttons.some(b => b.hit(x, y)); },
  onDown(x, y) {
    Sound.unlock();
    Sound.loop('music', 0.45);
    for (const b of this.buttons) if (b.hit(x, y)) { b.press(); return; }
  },
  onKey(e) {
    Sound.loop('music', 0.45);
    commonKeys(e);
    if (e.key === 'Enter' || e.key === ' ') this.go();
  },
  update(dt, realDt) {
    this.t += dt;
    Machine.update(dt);
    this.buttons.forEach(b => { b.hover = b.hit(Engine.pointer.x, Engine.pointer.y); b.update(realDt, this.t); });
    this.coinT -= dt;
    if (this.coinT <= 0) {
      this.coinT = 0.35;
      const e = Anims.get(ART.coin, 160);
      Particles.spawn({
        x: rand(0, W), y: -40, vy: rand(160, 260), vx: rand(-20, 20), max: 5, size: rand(34, 50), shape: 'img', layer: 'ui',
        alpha: 0.9, phase: rand(0, 1), update: p => { p.img = Anims.frame(e, p.life + p.phase); }
      });
    }
  },
  draw(ctx) {
    const t = this.t;
    drawCasino(ctx, 0.15, t);
    Machine.draw(ctx, t);
    Machine.drawCoinBox(ctx, 0);
    Particles.draw(ctx, 'ui');
    drawSprite(ctx, this.toad, t, 130, 712, 250);
    // "Tap START" speech
    if (this.t > 1) {
      drawBubble(ctx, 150, 410, "Let's play!", { size: 28, border: '#e52521', scale: Math.min(1, (this.t - 1) * 4) });
    }
    this.buttons.forEach(b => b.draw(ctx));
  }
};

// ============================================================ MENU
const MenuScene = {
  enter() {
    this.t = 0;
    this.toad = Anims.get(ART.toad, 360);
    const keys = Object.keys(CATEGORY_ITEMS);
    this.tiles = keys.map((key, i) => {
      const col = i % 4, row = Math.floor(i / 4);
      const it = CATEGORY_ITEMS[key].items[0];
      Images.load(it.src);
      const tile = { key, x: 652 + (col - 1.5) * 208, y: 300 + row * 122, w: 196, h: 104, img: it.src, appear: 0, spring: new Spring(1, 380, 16), hover: false };
      Tween.to(tile, { appear: 1 }, 0.45, { ease: Ease.outBack, delay: 0.15 + i * 0.04 });
      return tile;
    });
    this.panel = { s: 0 };
    Tween.to(this.panel, { s: 1 }, 0.5, { ease: Ease.outBack });
    this.buttons = [backButton(() => Engine.go(TitleScene, null, 46, 44)), ...cornerButtons()];
    Sound.loop('music', 0.45);
  },
  exit() { this.leaving = false; },
  tileAt(x, y) { return this.tiles.find(t => t.appear > 0.5 && Math.abs(x - t.x) < t.w / 2 && Math.abs(y - t.y) < t.h / 2); },
  isHot(x, y) { return !!this.tileAt(x, y) || this.buttons.some(b => b.hit(x, y)); },
  onDown(x, y) {
    for (const b of this.buttons) if (b.hit(x, y)) { b.press(); return; }
    const tile = this.tileAt(x, y);
    if (tile && !this.leaving) {
      this.leaving = true;
      tile.spring.v = 0.8;
      Sound.coin(6);
      coinBurst(tile.x, tile.y, 10, 0.8);
      Game.cat = tile.key;
      Engine.go(LearnScene, null, tile.x, tile.y);
    }
  },
  onKey(e) { commonKeys(e); if (e.key === 'Escape') Engine.go(TitleScene); },
  update(dt, realDt) {
    this.t += dt;
    const p = Engine.pointer;
    const hot = this.tileAt(p.x, p.y);
    for (const tl of this.tiles) {
      if (tl === hot && !tl.hover) Sound.hover();
      tl.hover = tl === hot;
      tl.spring.target = tl.hover ? 1.08 : 1;
      tl.spring.update(dt);
    }
    this.buttons.forEach(b => { b.hover = b.hit(p.x, p.y); b.update(realDt, this.t); });
  },
  draw(ctx) {
    const t = this.t;
    drawCasino(ctx, 0.35, t);
    const s = this.panel.s;
    ctx.save();
    ctx.translate(652, 380);
    ctx.scale(s, s);
    drawGoldPanel(ctx, -450, -250, 900, 520);
    ctx.restore();
    drawRedBanner(ctx, 652, 170, 820 * Math.min(1, s), 84, 'CHOOSE YOUR CATEGORY', 44);
    for (const tl of this.tiles) this.drawTile(ctx, tl, t);
    // coins on the corners
    const coin = Anims.get(ART.coin, 160);
    [[225, 150], [1080, 150], [1075, 620]].forEach(([x, y], i) => {
      const fr = Anims.frame(coin, t + i * 0.3);
      if (fr) ctx.drawImage(fr, x - 32, y - 32 + Math.sin(t * 3 + i) * 6, 64, 64);
    });
    drawSprite(ctx, this.toad, t, 125, 715, 240);
    this.buttons.forEach(b => b.draw(ctx));
    Particles.draw(ctx, 'ui');
  },
  drawTile(ctx, tl, t) {
    if (tl.appear <= 0.01) return;
    const info = CATEGORY_INFO[tl.key];
    ctx.save();
    ctx.translate(tl.x, tl.y);
    ctx.rotate(tl.hover ? Math.sin(t * 10) * 0.03 : 0);
    const s = tl.spring.v * tl.appear;
    ctx.scale(s, s);
    const w = tl.w, h = tl.h;
    if (tl.hover) Glow.draw(ctx, '#ffe066', 0, 0, 150, 0.5);
    ctx.fillStyle = '#9a5a00';
    rr(ctx, -w / 2, -h / 2 + 6, w, h, 18); ctx.fill();
    const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    g.addColorStop(0, '#fff2a0'); g.addColorStop(0.5, '#ffd23a'); g.addColorStop(1, '#f0a500');
    ctx.fillStyle = g;
    rr(ctx, -w / 2, -h / 2, w, h, 18); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    rr(ctx, -w / 2 + 8, -h / 2 + 5, w - 16, h * 0.28, 10); ctx.fill();
    // round thumbnail
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = info.color;
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(-w / 2 + 44, 0, 32, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.save();
    ctx.beginPath(); ctx.arc(-w / 2 + 44, 0, 28, 0, TAU); ctx.clip();
    drawFit(ctx, Images.get(tl.img), -w / 2 + 44, tl.hover ? Math.sin(t * 9) * 3 : 0, 50, 50);
    ctx.restore();
    txt(ctx, info.label, 40, 2, { size: 24, font: FONT_ROUND, fill: '#5a2a00', maxW: 104, shadow: false });
    ctx.restore();
  }
};

// ============================================================ LEARN (vocabulary)
const LearnScene = {
  enter() {
    this.t = 0;
    this.key = Game.cat;
    this.items = CATEGORY_ITEMS[this.key].items;
    this.items.forEach(it => Images.load(it.src));
    const n = this.items.length;
    const cols = n <= 4 ? n : n <= 8 ? 4 : n <= 10 ? 5 : 6;
    const rows = Math.ceil(n / cols);
    const cw = n > 10 ? 188 : 200, ch = 214;
    this.cells = this.items.map((it, i) => {
      const r = Math.floor(i / cols), c = i % cols;
      const inRow = Math.min(cols, n - r * cols);
      const cell = {
        it, x: 640 + (c - (inRow - 1) / 2) * cw, y: 330 + (r - (rows - 1) / 2) * ch,
        r: 62, appear: 0, spring: new Spring(1, 400, 12), hover: false
      };
      Tween.to(cell, { appear: 1 }, 0.5, { ease: Ease.outBack, delay: 0.2 + i * 0.06, onStart: () => Sound.tick(i) });
      return cell;
    });
    this.next = new Button({ x: 1090, y: 660, w: 250, h: 76, label: 'NEXT', size: 36, color: '#ffcf1f', textColor: '#fff', pulse: true, onClick: () => Engine.go(PracticeScene, null, 1090, 660) });
    this.buttons = [backButton(() => Engine.go(MenuScene, null, 46, 44)), this.next, ...cornerButtons()];
    Sound.stopLoop('music', 0.8);
  },
  cellAt(x, y) { return this.cells.find(c => Math.hypot(x - c.x, y - c.y) < c.r + 10); },
  isHot(x, y) { return !!this.cellAt(x, y) || this.buttons.some(b => b.hit(x, y)); },
  onDown(x, y) {
    for (const b of this.buttons) if (b.hit(x, y)) { b.press(); return; }
    const c = this.cellAt(x, y);
    if (c) {
      c.spring.v = 1.35;
      Sound.blip(this.cells.indexOf(c) + 3);
      FX.sparkleBurst(c.x, c.y, 12);
    }
  },
  onKey(e) {
    commonKeys(e);
    if (e.key === 'Escape') Engine.go(MenuScene);
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') this.next.press();
  },
  update(dt, realDt) {
    this.t += dt;
    const p = Engine.pointer;
    const hot = this.cellAt(p.x, p.y);
    this.cells.forEach(c => {
      if (c === hot && !c.hover) Sound.hover();
      c.hover = c === hot;
      c.spring.target = c.hover ? 1.1 : 1;
      c.spring.update(dt);
    });
    this.buttons.forEach(b => { b.hover = b.hit(p.x, p.y); b.update(realDt, this.t); });
  },
  draw(ctx) {
    const t = this.t;
    drawCasino(ctx, 0.5, t);
    drawRedBanner(ctx, 640, 70, 520, 76, "LET'S LEARN!", 40);
    for (const c of this.cells) {
      if (c.appear <= 0.01) continue;
      const s = c.appear * c.spring.v;
      ctx.save();
      ctx.translate(c.x, c.y + Math.sin(t * 2 + c.x) * 3);
      ctx.scale(s, s);
      if (c.hover) Glow.draw(ctx, '#ffe066', 0, 0, c.r * 2, 0.5);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath(); ctx.arc(0, 7, c.r + 6, 0, TAU); ctx.fill();
      const g = ctx.createLinearGradient(0, -c.r, 0, c.r);
      g.addColorStop(0, '#ffe680'); g.addColorStop(1, '#d99100');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, c.r + 6, 0, TAU); ctx.fill();
      ctx.fillStyle = '#fffaf0';
      ctx.beginPath(); ctx.arc(0, 0, c.r, 0, TAU); ctx.fill();
      drawFit(ctx, Images.get(c.it.src), 0, 0, c.r * 1.5, c.r * 1.5);
      txt(ctx, c.it.name, 0, c.r + 30, { size: 26, font: FONT_ROUND, fill: '#fff', stroke: '#3a0a5a', lw: 6, maxW: 170 });
      txt(ctx, c.it.japanese, 0, c.r + 58, { size: 17, font: FONT_JP, weight: '700', fill: '#ffe680', stroke: '#3a0a5a', lw: 5, maxW: 170 });
      ctx.restore();
    }
    this.buttons.forEach(b => b.draw(ctx));
    Particles.draw(ctx, 'ui');
  }
};

// ============================================================ PRACTICE ("I like ...")
const PracticeScene = {
  enter() {
    this.t = 0;
    this.key = Game.cat;
    this.items = CATEGORY_ITEMS[this.key].items;
    this.idx = 0;
    this.card = { x: 640, rot: 0, s: 0, a: 1 };
    Tween.to(this.card, { s: 1 }, 0.5, { ease: Ease.outBack });
    this.toad = Anims.get(ART.toad, 360);
    this.prevBtn = new Button({ x: 330, y: 380, w: 84, circle: true, label: '◀', size: 34, color: '#7b3fc4', textColor: '#fff', font: FONT_ROUND, onClick: () => this.step(-1) });
    this.nextBtn = new Button({ x: 950, y: 380, w: 84, circle: true, label: '▶', size: 34, color: '#7b3fc4', textColor: '#fff', font: FONT_ROUND, onClick: () => this.step(1) });
    this.play = new Button({ x: 640, y: 662, w: 360, h: 84, label: 'START GAME', size: 38, color: '#e52521', textColor: '#fff', pulse: true, onClick: () => Engine.go(GameScene, null, 640, 662) });
    this.buttons = [backButton(() => Engine.go(LearnScene, null, 46, 44)), this.prevBtn, this.nextBtn, this.play, ...cornerButtons()];
  },
  step(d) {
    if (this.busy) return;
    this.busy = true;
    Sound.flip();
    Tween.to(this.card, { x: 640 - d * 700, rot: -d * 0.4, a: 0 }, 0.22, {
      ease: Ease.inQuad,
      onDone: () => {
        this.idx = (this.idx + d + this.items.length) % this.items.length;
        this.card.x = 640 + d * 700; this.card.rot = d * 0.4;
        Tween.to(this.card, { x: 640, rot: 0, a: 1 }, 0.35, { ease: Ease.outBack, onDone: () => { this.busy = false; } });
        Sound.blip(4);
      }
    });
  },
  isHot(x, y) { return this.buttons.some(b => b.hit(x, y)); },
  onDown(x, y) { for (const b of this.buttons) if (b.hit(x, y)) { b.press(); return; } },
  onKey(e) {
    commonKeys(e);
    if (e.key === 'ArrowRight') this.step(1);
    if (e.key === 'ArrowLeft') this.step(-1);
    if (e.key === 'Enter' || e.key === ' ') this.play.press();
    if (e.key === 'Escape') Engine.go(LearnScene);
  },
  update(dt, realDt) {
    this.t += dt;
    this.buttons.forEach(b => { b.hover = b.hit(Engine.pointer.x, Engine.pointer.y); b.update(realDt, this.t); });
  },
  draw(ctx) {
    const t = this.t;
    drawCasino(ctx, 0.5, t);
    txt(ctx, questionEn(this.key).toUpperCase(), 640, 64, { size: 44, fill: { grad: ['#fffbe0', '#ffd84a'] }, stroke: '#5a1200', lw: 9 });
    txt(ctx, questionJa(this.key), 640, 112, { size: 26, font: FONT_JP, weight: '700', fill: '#fff', stroke: '#3a0a5a', lw: 6 });
    const it = this.items[this.idx];
    const c = this.card;
    ctx.save();
    ctx.globalAlpha = clamp(c.a, 0, 1);
    ctx.translate(c.x, 385 + Math.sin(t * 2) * 4);
    ctx.rotate(c.rot);
    ctx.scale(c.s, c.s);
    drawSunburst(ctx, 0, -40, 380, 0.35, t);
    drawGoldPanel(ctx, -250, -240, 500, 470, 30);
    drawFit(ctx, Images.get(it.src), 0, -75, 300, 230);
    txt(ctx, sentenceEn(this.key, it), 0, 115, { size: 50, font: FONT_ROUND, fill: '#2a1050', shadow: false, maxW: 440 });
    txt(ctx, sentenceJa(this.key, it), 0, 172, { size: 28, font: FONT_JP, weight: '700', fill: '#c0392b', shadow: false, maxW: 440 });
    ctx.restore();
    txt(ctx, `${this.idx + 1} / ${this.items.length}`, 640 + (c.x - 640), 175, { size: 20, font: FONT_ROUND, fill: '#b58a2a', shadow: false });
    drawSprite(ctx, this.toad, t, 130, 712, 230);
    this.buttons.forEach(b => b.draw(ctx));
    Particles.draw(ctx, 'ui');
  }
};

// ============================================================ GAME
const GameScene = {
  enter() {
    this.t = 0;
    this.key = Game.cat;
    this.items = CATEGORY_ITEMS[this.key].items;
    this.items.forEach(it => Images.load(it.src));
    PRIZE_PAIRS.flat().forEach(src => Images.load(src));
    Machine.init(this.items);
    Machine.bulbMode = 'chase';
    this.prizeDeck = shuffle(PRIZE_PAIRS.map((p, i) => i));
    this.pairDeck = [];
    this.round = 0;
    this.coin = null;
    this.coinGlow = 0;
    this.hint = { a: 0 };
    this.bubble = { a: 0, text: '' };
    this.char = { entry: null, x: 120, y: 712, sy: 1, sx: 1, hop: 0 };
    this.nextBtn = new Button({ x: 1134, y: 604, w: 200, h: 84, label: 'NEXT', size: 38, color: '#35c759', textColor: '#fff', pulse: true, visible: false, appear: 0, onClick: () => this.nextRound() });
    this.againBtn = new Button({ x: 640, y: 560, w: 340, h: 90, label: 'PLAY AGAIN', size: 38, color: '#35c759', textColor: '#fff', pulse: true, visible: false, appear: 0, onClick: () => this.enter() });
    this.buttons = [backButton(() => Engine.go(MenuScene, null, 46, 44)), this.nextBtn, this.againBtn, ...cornerButtons()];
    this.finale = null;
    this.startRound();
  },

  show(b) { b.visible = true; Tween.kill(b); Tween.to(b, { appear: 1 }, 0.4, { ease: Ease.outBack }); },
  hide(b) { Tween.kill(b); Tween.to(b, { appear: 0 }, 0.15, { onDone: () => { b.visible = false; } }); },

  say(text) {
    this.bubble.text = text;
    this.bubble.a = 0;
    Tween.kill(this.bubble);
    Tween.to(this.bubble, { a: 1 }, 0.35, { ease: Ease.outBack });
  },

  hop() {
    const c = this.char;
    c.sy = 0.8; c.sx = 1.15;
    Tween.kill(c);
    Tween.to(c, { sy: 1, sx: 1 }, 0.5, { ease: Ease.outElastic });
    Tween.to(c, { hop: 40 }, 0.18, { ease: Ease.outQuad, onDone: () => Tween.to(c, { hop: 0 }, 0.22, { ease: Ease.outBounce }) });
  },

  startRound() {
    if (this.round >= PRIZE_PAIRS.length) { this.showFinale(); return; }
    this.round++;
    this.phase = 'insert';
    const pi = this.prizeDeck[this.round - 1];
    const pair = Math.random() < 0.5 ? PRIZE_PAIRS[pi] : [...PRIZE_PAIRS[pi]].reverse();
    this.prizes = pair;
    this.revealed = [false, false];
    this.char.entry = Anims.get(pick(CHARACTERS), 420);
    this.hop();
    Machine.reels.forEach(r => {
      if (r.show !== 'reel') {
        // tidy the previous prize away
        r.show = 'reel'; r.sun = 0; r.glow = 0;
      }
      r.flipScale = 1;
      r.targetK = -1;
    });
    Machine.bulbMode = 'chase';
    this.hide(this.nextBtn);
    Tween.to(this.hint, { a: 1 }, 0.4);
    this.say('Insert a coin!');
    this.roundBadge = 1.6;
  },

  // Distinct pair of items, cycling through all pairs before repeating
  drawPair() {
    if (!this.pairDeck.length) {
      const pairs = [];
      for (let a = 0; a < this.items.length; a++) for (let b = a + 1; b < this.items.length; b++) pairs.push([this.items[a], this.items[b]]);
      this.pairDeck = shuffle(pairs);
    }
    const p = this.pairDeck.pop();
    return Math.random() < 0.5 ? p : [p[1], p[0]];
  },

  insertCoin() {
    if (this.phase !== 'insert') return;
    this.phase = 'coin';
    Tween.to(this.hint, { a: 0 }, 0.2);
    Tween.to(this.bubble, { a: 0 }, 0.2);
    const e = Anims.get(ART.coin, 160);
    const coin = { x: SLIT.x + 60, y: 820, s: 1.4, sy: 1, rot: 0, e, a: 1 };
    this.coin = coin;
    Sound.whoosh(0.4);
    Tween.to(coin, { x: SLIT.x, y: SLIT.y - 40, s: 1 }, 0.5, { ease: Ease.outCubic });
    Tween.to(coin, { y: SLIT.y, sy: 0.12 }, 0.16, {
      delay: 0.55, ease: Ease.inQuad,
      onDone: () => {
        this.coin = null;
        Sound.coin(0);
        Sound.tone(1800, 0.08, { type: 'square', vol: 0.04, delay: 0.05 });
        FX.sparkleBurst(SLIT.x, SLIT.y, 14);
        FX.ring(SLIT.x, SLIT.y, '#ffe066', 10, 90, 0.35);
        Machine.shake = 0.8;
        Engine.addShake(0.2);
        this.coinGlow = 1;
        Tween.to(this, { coinGlow: 0 }, 0.6);
        Timers.after(0.15, () => this.spin());
      }
    });
    for (let i = 0; i < 8; i++) {
      Timers.after(i * 0.05, () => {
        if (!this.coin) return;
        Particles.spawn({ x: this.coin.x + rand(-10, 10), y: this.coin.y + 20, vy: 60, max: 0.4, size: 10, size1: 1, shape: 'star', color: '#ffe680', layer: 'ui' });
      });
    }
  },

  spin() {
    this.phase = 'spin';
    const [a, b] = this.drawPair();
    this.landed = [a, b];
    Machine.bulbMode = 'fast';
    this.stopSpin = Sound.playHandle('spin', { vol: 0.9 });
    Machine.reels.forEach((r, i) => {
      r.show = 'reel';
      r.v = 0;
      r.target = [a, b][i];
      r.targetK = -1;
      r.stopping = false;
      r.bounce.v = 0.9;
      Tween.to(r, { v: 24 }, 0.35, { ease: Ease.inQuad, delay: i * 0.08 });
    });
    this.stopReel(0, 1.7);
    this.stopReel(1, 2.5);
  },

  stopReel(i, at) {
    const r = Machine.reels[i];
    Timers.after(at, () => {
      const dist = 7;
      r.targetK = Math.floor(r.p) + dist;
      r.stopping = true;
      r.v = 0;
      Tween.to(r, { p: r.targetK }, 1.05, {
        ease: Ease.outBack,
        onDone: () => {
          r.p = r.targetK;
          r.show = 'item';
          r.flipScale = 1;
          r.bounce.v = 1.25;
          Sound.thud();
          Sound.tick(10);
          Machine.shake = 0.45;
          FX.ring(r.rect.cx, r.rect.cy, '#ffffff', 40, 200, 0.35, 'ui', 8);
          FX.sparkleBurst(r.rect.cx, r.rect.cy, 10, ['#ffffff', '#ffe680'], 'ui', 0.7);
          r.glow = 1;
          Tween.to(r, { glow: 0.25 }, 0.6);
          if (i === 1) this.landedBoth();
        }
      });
      // keep the visual speed continuous into the stop
      r.v = 0;
    });
  },

  landedBoth() {
    this.phase = 'choose';
    if (this.stopSpin) this.stopSpin(0.4);
    Machine.bulbMode = 'flash';
    Timers.after(0.8, () => { if (this.phase === 'choose') Machine.bulbMode = 'chase'; });
    Sound.chime();
    this.hop();
    this.say(questionEn(this.key));
    Engine.doFlash(0.12);
  },

  reveal(i) {
    if (this.phase !== 'choose' || this.revealed[i]) return;
    const r = Machine.reels[i];
    this.revealed[i] = true;
    r.prize = this.prizes[i];
    Sound.drumroll(0.55);
    r.wobble = 1;
    Tween.to(r, { wobble: 0 }, 0.55, { ease: Ease.linear });
    Tween.to(r, { flipScale: 0 }, 0.22, {
      delay: 0.55,
      ease: Ease.inQuad,
      onDone: () => {
        r.show = 'prize';
        Tween.to(r, { flipScale: 1 }, 0.45, { ease: Ease.outBack });
        r.bounce.v = 1.3;
        r.sun = 1;
        r.glow = 1;
        Tween.to(r, { glow: 0.3 }, 0.8);
        Engine.hitstop = 0.06;
        Engine.doFlash(0.3);
        Machine.shake = 0.6;
        Machine.bulbMode = 'flash';
        Sound.fanfare();
        Sound.sparkle();
        coinBurst(r.rect.cx, r.rect.y + 40, 14);
        FX.confettiCannon(r.rect.cx, r.rect.y + r.rect.h, i ? -0.4 : 0.4, 50);
        FX.sparkleBurst(r.rect.cx, r.rect.cy, 22);
        this.popText(pick(REVEAL_LINES), r.rect.cx, r.rect.y - 8);
        this.hop();
        if (this.revealed[0] && this.revealed[1]) {
          this.phase = 'done';
          Tween.to(this.bubble, { a: 0 }, 0.2);
          Timers.after(0.9, () => { this.show(this.nextBtn); Machine.bulbMode = 'chase'; });
        } else {
          Timers.after(0.9, () => { if (this.phase === 'choose') Machine.bulbMode = 'chase'; });
        }
      }
    });
  },

  popText(text, x, y) {
    const p = { text, x, y, s: 0, a: 1, rot: rand(-0.15, 0.15) };
    this.pops = this.pops || [];
    this.pops.push(p);
    Tween.to(p, { s: 1 }, 0.45, { ease: Ease.outBackBig });
    Tween.to(p, { y: y - 40, a: 0 }, 0.5, { delay: 1.2, onDone: () => { this.pops = this.pops.filter(q => q !== p); } });
  },

  nextRound() {
    if (this.phase !== 'done') return;
    Sound.blip(5);
    Machine.reels.forEach(r => {
      Tween.to(r, { flipScale: 0 }, 0.2, { ease: Ease.inQuad, onDone: () => { r.show = 'reel'; r.sun = 0; r.glow = 0; r.targetK = -1; Tween.to(r, { flipScale: 1 }, 0.25); } });
    });
    this.startRound();
  },

  showFinale() {
    this.phase = 'finale';
    this.finale = { a: 0, t: 0 };
    Tween.to(this.finale, { a: 1 }, 0.5);
    this.hide(this.nextBtn);
    Sound.fanfare();
    for (let i = 0; i < 5; i++) {
      Timers.after(i * 0.5, () => {
        FX.confettiCannon(-20, 740, 1, 60);
        FX.confettiCannon(W + 20, 740, -1, 60);
        coinBurst(rand(300, 980), 300, 10);
        Sound.pop();
      });
    }
    Timers.after(1, () => this.show(this.againBtn));
  },

  sideAt(x, y) {
    return Machine.reels.findIndex(r => x > r.rect.x && x < r.rect.x + r.rect.w && y > r.rect.y && y < r.rect.y + r.rect.h);
  },
  onCoinBox(x, y) {
    return x > COINBOX.x - 20 && x < COINBOX.x + COINBOX.w + 10 && y > COINBOX.y - 60 && y < COINBOX.y + COINBOX.h + 10;
  },
  isHot(x, y) {
    if (this.buttons.some(b => b.hit(x, y))) return true;
    if (this.phase === 'insert') return true;
    if (this.phase === 'choose') { const i = this.sideAt(x, y); return i >= 0 && !this.revealed[i]; }
    return false;
  },
  onDown(x, y) {
    for (let i = this.buttons.length - 1; i >= 0; i--) if (this.buttons[i].hit(x, y)) { this.buttons[i].press(); return; }
    if (this.phase === 'insert') { this.insertCoin(); return; }
    if (this.phase === 'choose') {
      const i = this.sideAt(x, y);
      if (i >= 0) this.reveal(i);
    }
  },
  onKey(e) {
    commonKeys(e);
    if (e.key === 'Escape') { Engine.go(MenuScene); return; }
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (this.phase === 'insert') this.insertCoin();
      else if (this.phase === 'done') this.nextBtn.press();
      else if (this.phase === 'finale' && this.againBtn.visible) this.againBtn.press();
    }
    if (e.key === 'ArrowLeft' || e.key === '1') this.reveal(0);
    if (e.key === 'ArrowRight' || e.key === '2') this.reveal(1);
  },

  update(dt, realDt) {
    this.t += dt;
    Machine.update(dt);
    const p = Engine.pointer;
    this.buttons.forEach(b => { b.hover = b.hit(p.x, p.y); b.update(realDt, this.t); });
    this.roundBadge = Math.max(1, (this.roundBadge || 1) - realDt * 2);
    if (this.finale) this.finale.t += dt;
    // hover lift on choosable reels
    if (this.phase === 'choose') {
      const i = this.sideAt(p.x, p.y);
      Machine.reels.forEach((r, k) => { r.bounce.target = k === i && !this.revealed[k] ? 1.06 : 1; });
    } else {
      Machine.reels.forEach(r => { r.bounce.target = 1; });
    }
  },

  draw(ctx) {
    const t = this.t;
    drawCasino(ctx, 0.12, t);
    Machine.draw(ctx, t);

    // coin flying in (behind the coin-box front plate once it reaches the slit)
    if (this.coin) {
      const c = this.coin;
      const fr = Anims.frame(c.e, t * 1.5);
      if (fr) {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.scale(c.s, c.s * c.sy);
        Glow.draw(ctx, '#ffe066', 0, 0, 60, 0.6);
        ctx.drawImage(fr, -36, -36, 72, 72);
        ctx.restore();
      }
    }
    Machine.drawCoinBox(ctx, Math.max(this.coinGlow, this.phase === 'insert' ? 0.4 + Math.sin(t * 6) * 0.3 : 0));

    // labels under landed items + TAP badges
    Machine.reels.forEach((r, i) => {
      if (r.show === 'item' && this.landed) {
        const R = r.rect;
        const it = this.landed[i];
        const lab = sentenceEn(this.key, it);
        ctx.save();
        ctx.globalAlpha = clamp(r.flipScale, 0, 1);
        ctx.fillStyle = 'rgba(40,5,60,0.8)';
        rr(ctx, R.x + 12, R.y + R.h - 76, R.w - 24, 62, 20); ctx.fill();
        txt(ctx, lab, R.cx, R.y + R.h - 54, { size: 26, font: FONT_ROUND, fill: '#fff', shadow: false, maxW: R.w - 40 });
        txt(ctx, sentenceJa(this.key, it), R.cx, R.y + R.h - 28, { size: 15, font: FONT_JP, weight: '700', fill: '#ffd84a', shadow: false, maxW: R.w - 40 });
        if (this.phase === 'choose' && !this.revealed[i]) {
          const s = 1 + Math.sin(t * 7 + i) * 0.08;
          ctx.translate(R.cx, R.y + 36);
          ctx.scale(s, s);
          ctx.fillStyle = '#9a5a00';
          rr(ctx, -52, -18, 104, 40, 20); ctx.fill();
          ctx.fillStyle = '#ffd23a';
          rr(ctx, -52, -22, 104, 40, 20); ctx.fill();
          txt(ctx, 'TAP!', 0, -1, { size: 24, fill: '#5a2a00', shadow: false });
        }
        ctx.restore();
      }
    });

    // insert-coin hint
    if (this.hint.a > 0.01) {
      ctx.save();
      ctx.globalAlpha = clamp(this.hint.a, 0, 1);
      const bob = Math.sin(t * 6) * 8;
      txt(ctx, 'INSERT', COINBOX.x + COINBOX.w / 2, COINBOX.y - 72 + bob, { size: 30, fill: { grad: ['#fffbe0', '#ffd84a'] }, stroke: '#5a1200', lw: 7 });
      txt(ctx, 'COIN!', COINBOX.x + COINBOX.w / 2, COINBOX.y - 38 + bob, { size: 30, fill: { grad: ['#fffbe0', '#ffd84a'] }, stroke: '#5a1200', lw: 7 });
      const tap = (t * 1.6) % 1;
      drawHand(ctx, COINBOX.x + COINBOX.w * 0.62, COINBOX.y + COINBOX.h * 0.72 - (tap < 0.25 ? tap * 40 : Math.max(0, 10 - (tap - 0.25) * 40)), 1);
      ctx.restore();
    }

    // character + speech bubble
    const c = this.char;
    drawSprite(ctx, c.entry, t, c.x, c.y - c.hop, 250, { sx: c.sx, sy: c.sy, maxW: 220 });
    if (this.bubble.a > 0.01) drawBubble(ctx, 150, 404, this.bubble.text, { size: 26, border: '#e52521', scale: this.bubble.a, maxW: 280 });

    // round badge
    ctx.save();
    ctx.translate(190, 44);
    const rb = this.roundBadge || 1;
    ctx.scale(rb, rb);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    rr(ctx, -95, -22, 190, 50, 25); ctx.fill();
    const g = ctx.createLinearGradient(0, -25, 0, 25);
    g.addColorStop(0, '#ff5a4f'); g.addColorStop(1, '#a8120f');
    ctx.fillStyle = g;
    rr(ctx, -95, -26, 190, 50, 25); ctx.fill();
    ctx.strokeStyle = '#ffd84a'; ctx.lineWidth = 3;
    rr(ctx, -95, -26, 190, 50, 25); ctx.stroke();
    txt(ctx, `ROUND ${this.round}/${PRIZE_PAIRS.length}`, 0, 1, { size: 22, fill: '#ffe680', shadow: false });
    ctx.restore();

    // pop words
    (this.pops || []).forEach(p => {
      ctx.save();
      ctx.globalAlpha = clamp(p.a, 0, 1);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(p.s, p.s);
      txt(ctx, p.text, 0, 0, { size: 58, fill: { grad: ['#ffffff', '#fff27a', '#ffb700'] }, stroke: '#7a1a00', lw: 12 });
      ctx.restore();
    });

    if (this.finale) this.drawFinale(ctx);
    this.buttons.forEach(b => b.draw(ctx));
    Particles.draw(ctx, 'ui');
  },

  drawFinale(ctx) {
    const f = this.finale;
    const v = Engine.view();
    ctx.save();
    ctx.globalAlpha = clamp(f.a, 0, 1);
    ctx.fillStyle = 'rgba(20,5,40,0.72)';
    ctx.fillRect(v.x, v.y, v.w, v.h);
    drawSunburst(ctx, 640, 300, 620, 0.5, Engine.realTime);
    const toad = Anims.get(ART.toad, 360);
    drawSprite(ctx, toad, f.t, 640, 380 + Math.sin(f.t * 4) * 6, 220);
    txt(ctx, 'ALL PRIZES OPENED!', 640, 440, { size: 60, fill: { grad: ['#fffbe0', '#ffd84a', '#ff9f1c'] }, stroke: '#5a1200', lw: 12 });
    ctx.restore();
  }
};

// ------------------------------------------------------------ boot
window.addEventListener('DOMContentLoaded', () => {
  Settings.load();
  Engine.transIcon = ART.coin;
  Engine.init(document.getElementById('game'));
  Engine.setScene(LoadingScene);
});
