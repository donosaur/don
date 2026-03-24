// ─────────────────────────────────────────────────────────────────
// Boxee Cloud DVR — Case Study Section
// Adds 5 slides to: hjeiP59jcTeDnOchimVJh1 / Presentation v2
// Matches existing file layout; replaces all serifs with Lexend Deca
// ─────────────────────────────────────────────────────────────────

// ── TOKENS ────────────────────────────────────────────────────────
const W = 1440, H = 810;
const SLIDE_GAP = 200; // gap between slides (existing file uses 1010 stride = 810+200)

// Accent — amber/orange to differentiate from Vimeo (cyan) & LKG (violet)
const ACCENT = { r: 0.976, g: 0.573, b: 0.086 }; // #f9924  (#f97316 orange-500)

const BG_DARK  = { r: 0.059, g: 0.067, b: 0.082 }; // #0f1115
const BG_LIGHT = { r: 0.961, g: 0.941, b: 0.918 }; // #f5f0ea off-white warm
const WHITE     = { r: 1, g: 1, b: 1 };
const DARK_TEXT = { r: 0.067, g: 0.067, b: 0.067 }; // #111 for light slides
const MID_TEXT  = { r: 0.302, g: 0.302, b: 0.302 }; // #4d4d4d body on light

const FONT = "Lexend Deca";

// ── FONT LOADER ───────────────────────────────────────────────────
const loaded = new Set();
async function lf(style = "Regular") {
  const key = `${FONT}:${style}`;
  if (loaded.has(key)) return;
  await figma.loadFontAsync({ family: FONT, style });
  loaded.add(key);
}

// ── SOLID FILL ────────────────────────────────────────────────────
function solid(c, a = 1) {
  return [{ type: "SOLID", color: { r: c.r, g: c.g, b: c.b }, opacity: a }];
}

// ── MAKE FRAME ────────────────────────────────────────────────────
function mkFrame(name, w, h, bg, bgA = 1) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(w, h);
  f.fills = solid(bg, bgA);
  f.clipsContent = true;
  return f;
}

// ── MAKE RECT ─────────────────────────────────────────────────────
function mkRect(w, h, fill, fillA = 1, opts = {}) {
  const r = figma.createRectangle();
  r.resize(w, h);
  r.fills = solid(fill, fillA);
  if (opts.x !== undefined) r.x = opts.x;
  if (opts.y !== undefined) r.y = opts.y;
  if (opts.radius) r.cornerRadius = opts.radius;
  return r;
}

// ── MAKE TEXT ─────────────────────────────────────────────────────
async function mkText(chars, opts = {}) {
  const {
    style = "Regular",
    size = 20,
    color = WHITE,
    colorA = 1,
    align = "LEFT",
    lineHeightPx = null,
    letterSpacing = 0,    // in px
    textCase = "ORIGINAL",
    fixedW = null,        // if set, resize to this width with HEIGHT auto
    x = 0, y = 0,
  } = opts;

  await lf(style);
  const t = figma.createText();
  t.fontName = { family: FONT, style };
  t.fontSize = size;
  t.fills = solid(color, colorA);
  t.textAlignHorizontal = align;
  t.letterSpacing = { unit: "PIXELS", value: letterSpacing };
  if (textCase !== "ORIGINAL") t.textCase = textCase;
  if (lineHeightPx) t.lineHeight = { unit: "PIXELS", value: lineHeightPx };
  if (fixedW) {
    t.textAutoResize = "HEIGHT";
    t.resize(fixedW, 100);
  } else {
    t.textAutoResize = "WIDTH_AND_HEIGHT";
  }
  t.characters = chars;
  t.x = x;
  t.y = y;
  return t;
}

// ── VERTICAL DIVIDER (left col border-r) ──────────────────────────
function mkDivider(parent) {
  const d = mkRect(1, H, WHITE, 0.07);
  d.x = 979;
  d.y = 0;
  parent.appendChild(d);
}

// ── OVERLINE ──────────────────────────────────────────────────────
async function mkOverline(text, parent, x, y, colorOverride = null) {
  const t = await mkText(text, {
    style: "SemiBold",
    size: 20,
    color: colorOverride || WHITE,
    colorA: colorOverride ? 1 : 0.5,
    letterSpacing: 3.06,
    textCase: "LOWERCASE",
    x, y,
  });
  parent.appendChild(t);
  return t;
}

// ── OVERLINE ON LIGHT BG ──────────────────────────────────────────
async function mkOverlineLight(text, parent, x, y) {
  const t = await mkText(text, {
    style: "SemiBold",
    size: 14,
    color: ACCENT,
    colorA: 1,
    letterSpacing: 2.5,
    textCase: "LOWERCASE",
    x, y,
  });
  parent.appendChild(t);
  return t;
}

// ── STAT BLOCK (right column item) ────────────────────────────────
async function mkStat(parent, value, label, yOffset, accentColor = null) {
  // divider top
  const div = mkRect(328, 1, WHITE, 0.07, { x: 0, y: yOffset });
  parent.appendChild(div);

  const valT = await mkText(value, {
    style: "SemiBold",
    size: 52,
    color: accentColor || WHITE,
    colorA: accentColor ? 1 : 1,
    lineHeightPx: 52,
    x: 0, y: yOffset + 40,
  });
  parent.appendChild(valT);

  const lblT = await mkText(label, {
    style: "Medium",
    size: 16,
    color: WHITE,
    colorA: 0.3,
    letterSpacing: 0.96,
    textCase: "UPPER",
    x: 0, y: yOffset + 105,
  });
  parent.appendChild(lblT);
}

// ── CARD (light slide constraint card) ────────────────────────────
function mkCard(parent, x, y, w, h, borderColor = null) {
  const card = figma.createFrame();
  card.resize(w, h);
  card.x = x; card.y = y;
  card.fills = solid(WHITE, 0.0);
  card.strokes = borderColor
    ? solid(borderColor, 1)
    : [{ type: "SOLID", color: DARK_TEXT, opacity: 0.12 }];
  card.strokeWeight = 1;
  card.cornerRadius = 4;
  card.clipsContent = false;
  parent.appendChild(card);
  return card;
}

// ── DARK CARD ─────────────────────────────────────────────────────
function mkDarkCard(parent, x, y, w, h) {
  const card = figma.createFrame();
  card.resize(w, h);
  card.x = x; card.y = y;
  card.fills = solid(WHITE, 0.04);
  card.strokes = [{ type: "SOLID", color: WHITE, opacity: 0.08 }];
  card.strokeWeight = 1;
  card.cornerRadius = 4;
  card.clipsContent = false;
  parent.appendChild(card);
  return card;
}

// ── BOTTOM NOTE BAR (light slides) ────────────────────────────────
async function mkNoteBar(parent, label, text, y, color = ACCENT) {
  const bar = figma.createFrame();
  bar.resize(W - 160, 80);
  bar.x = 80; bar.y = y;
  bar.fills = solid(color, 0.08);
  bar.strokes = solid(color, 0.4);
  bar.strokeWeight = 1;
  bar.cornerRadius = 4;
  bar.clipsContent = false;
  parent.appendChild(bar);

  const lbl = await mkText(label, {
    style: "SemiBold", size: 13, color, colorA: 1,
    letterSpacing: 2, textCase: "UPPER", x: 24, y: 24,
  });
  bar.appendChild(lbl);

  const txt = await mkText(text, {
    style: "Regular", size: 15, color: DARK_TEXT, colorA: 0.7,
    fixedW: W - 160 - lbl.width - 48 - 16,
    lineHeightPx: 24,
    x: 24 + lbl.width + 16, y: 22,
  });
  bar.appendChild(txt);
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 1 — Opener (dark, left text + right stats)
// Pattern: vimeo 01 / LKG 01
// ═══════════════════════════════════════════════════════════════════
async function makeBoxee01() {
  const slide = mkFrame("boxee 01", W, H, BG_DARK);

  // ── LEFT COLUMN ─────────────────────────────────────────────────
  const left = mkFrame("left", 980, H, BG_DARK);
  left.x = 0; left.y = 0;
  left.clipsContent = false;
  slide.appendChild(left);
  mkDivider(slide); // divider at x=979

  await mkOverline("boxee cloud dvr", left, 80, 80, null);

  // Heading line 1 — white
  await lf("Regular"); await lf("SemiBold");
  const h1 = await mkText("Pioneering the living room.", {
    style: "Regular", size: 80, color: WHITE, lineHeightPx: 88,
    letterSpacing: -2.28, fixedW: 724, x: 80, y: 152,
  });
  left.appendChild(h1);

  // Heading line 2 — accent (replacing italic)
  const h2 = await mkText("Before Netflix arrived.", {
    style: "SemiBold", size: 80, color: ACCENT, lineHeightPx: 88,
    letterSpacing: -2.28, fixedW: 724, x: 80, y: 152 + 88,
  });
  left.appendChild(h2);

  // Body
  const body = await mkText(
    "Boxee was one of the first companies to put a serious streaming experience in the living room. I designed the UX for their Cloud DVR product — building interaction models from scratch for a platform that had no existing playbook.",
    {
      style: "Regular", size: 20, color: WHITE, colorA: 0.7,
      lineHeightPx: 40, fixedW: 612, x: 80, y: 152 + 88 + 88 + 32,
    }
  );
  left.appendChild(body);

  // ── RIGHT COLUMN ────────────────────────────────────────────────
  const right = mkFrame("right", 460, H, BG_DARK);
  right.x = 980; right.y = 0;
  right.clipsContent = false;
  slide.appendChild(right);

  const statsX = 60;
  const statsW = 328;
  const statsH = H - 88 - 80; // usable height
  const itemH = statsH / 4;

  const stats = [
    { val: "2009",     label: "Founded",          accent: null },
    { val: "Samsung",  label: "Acquired by",       accent: ACCENT },
    { val: "2013",     label: "Acquisition year",  accent: null },
    { val: "TV + Web", label: "Core platforms",    accent: null },
  ];

  // Create right column inner container positioned at offset
  const rInner = figma.createFrame();
  rInner.name = "stats";
  rInner.resize(statsW, statsH);
  rInner.x = statsX; rInner.y = 88;
  rInner.fills = solid(BG_DARK, 0);
  rInner.clipsContent = false;
  right.appendChild(rInner);

  for (let i = 0; i < stats.length; i++) {
    const s = stats[i];
    // divider line
    const div = mkRect(statsW, 1, WHITE, 0.07, { x: 0, y: i * itemH });
    rInner.appendChild(div);
    // value
    const v = await mkText(s.val, {
      style: "SemiBold", size: 52, color: s.accent || WHITE,
      lineHeightPx: 52, x: 0, y: i * itemH + 40,
    });
    rInner.appendChild(v);
    // label
    const l = await mkText(s.label, {
      style: "Medium", size: 16, color: WHITE, colorA: 0.3,
      letterSpacing: 0.96, textCase: "UPPER",
      x: 0, y: i * itemH + 105,
    });
    rInner.appendChild(l);
  }
  // bottom divider
  const lastDiv = mkRect(statsW, 1, WHITE, 0.07, { x: statsX, y: 88 + statsH });
  right.appendChild(lastDiv);

  return slide;
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 2 — Problem Space (light bg, two constraint cards)
// Pattern: vimeo 02 / LKG 02
// ═══════════════════════════════════════════════════════════════════
async function makeBoxee02() {
  const slide = mkFrame("boxee 02", W, H, BG_LIGHT);

  // Top-left overline
  await mkOverlineLight("the challenge", slide, 80, 70);

  // Heading
  const h1 = await mkText("Designing TV UX", {
    style: "Bold", size: 72, color: DARK_TEXT,
    lineHeightPx: 80, letterSpacing: -2, fixedW: 760, x: 80, y: 112,
  });
  slide.appendChild(h1);

  const h2 = await mkText("before the playbook existed.", {
    style: "Bold", size: 72, color: ACCENT,
    lineHeightPx: 80, letterSpacing: -2, fixedW: 900, x: 80, y: 112 + 80,
  });
  slide.appendChild(h2);

  // Sub-intro
  const intro = await mkText("the technical and human constraints I had to design around", {
    style: "Regular", size: 15, color: DARK_TEXT, colorA: 0.45,
    letterSpacing: 0.5, x: 80, y: 112 + 80 + 80 + 16,
  });
  slide.appendChild(intro);

  // ── 3 constraint cards on the right ────────────────────────────
  const cardX = 560;
  const cardW = 820;
  const cardH = 170;
  const cardGap = 16;
  const cardsY = 70;

  const constraints = [
    {
      label: "no interaction standard",
      title: "Remote-control UX was undefined",
      body: "There were no established d-pad nav patterns for streaming apps. We had to invent, test, and validate everything from directional focus to scroll depth on a 10-foot interface.",
      color: ACCENT,
    },
    {
      label: "hardware + software in parallel",
      title: "The box and the UI shipped together",
      body: "I designed the software UI while the hardware team built the physical Boxee Box — tight coordination was required so that packaging, device states, and onboarding felt like one cohesive product.",
      color: null,
    },
    {
      label: "consumer audience, zero tolerance",
      title: "Living room users aren't power users",
      body: "Every edge case — lost remote, slow network, failed recording — had to be handled gracefully. The error states were as important as the success states.",
      color: null,
    },
  ];

  for (let i = 0; i < constraints.length; i++) {
    const c = constraints[i];
    const cy = cardsY + i * (cardH + cardGap);
    const card = mkCard(slide, cardX, cy, cardW, cardH, c.color ? c.color : null);

    const lbl = await mkText(c.label, {
      style: "SemiBold", size: 13, color: c.color || DARK_TEXT,
      colorA: c.color ? 1 : 0.4,
      letterSpacing: 2, textCase: "LOWER",
      x: 24, y: 20,
    });
    card.appendChild(lbl);

    const title = await mkText(c.title, {
      style: "SemiBold", size: 18, color: DARK_TEXT, fixedW: cardW - 48,
      x: 24, y: 46,
    });
    card.appendChild(title);

    const bodyT = await mkText(c.body, {
      style: "Regular", size: 15, color: DARK_TEXT, colorA: 0.55,
      fixedW: cardW - 48, lineHeightPx: 24,
      x: 24, y: 46 + title.height + 8,
    });
    card.appendChild(bodyT);
  }

  // Bottom note bar
  await mkNoteBar(
    slide,
    "core tension",
    "Every screen had to work for a viewer sitting 10 feet away with a remote — while also making sense to an engineer setting up their first home media server.",
    H - 100
  );

  return slide;
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 3 — Explorations (dark, two comparison panels)
// Pattern: vimeo 03 / LKG 03
// ═══════════════════════════════════════════════════════════════════
async function makeBoxee03() {
  const slide = mkFrame("boxee 03", W, H, BG_DARK);

  await mkOverline("explorations — remote navigation & DVR flow", slide, 80, 50, ACCENT);

  const h1 = await mkText("Two paradigms.", {
    style: "Regular", size: 72, color: WHITE,
    lineHeightPx: 80, letterSpacing: -2, fixedW: 900, x: 80, y: 100,
  });
  slide.appendChild(h1);

  const h2 = await mkText("One had to earn the living room.", {
    style: "SemiBold", size: 72, color: ACCENT,
    lineHeightPx: 80, letterSpacing: -2, fixedW: 900, x: 80, y: 100 + 80,
  });
  slide.appendChild(h2);

  // Two panels
  const panelY = 220;
  const panelH = H - panelY - 40;
  const panelW = (W - 200) / 2; // 80 outer + 40 gap + 80 outer
  const panel1X = 80;
  const panel2X = 80 + panelW + 40;

  const panels = [
    {
      name: "exploration a",
      title: "Social & discovery-first",
      quote: '"Make TV a shared experience"',
      bullets: [
        "Friends activity feed in the main nav",
        "Collaborative watchlists and rating flows",
        "Content discovery driven by social graph",
        "Optimized for engagement over utility",
      ],
      outcome: "REJECTED — AUDIENCE MISMATCH",
      outcomeBody: "Our core users were cord-cutters replacing cable — not social networkers. The social layer added cognitive overhead without solving their primary need: watching what they want, reliably.",
      outcomeColor: { r: 0.86, g: 0.2, b: 0.2 }, // red
    },
    {
      name: "shipped solution",
      title: "Reliability & depth-first",
      quote: '"Make the DVR smarter than cable"',
      bullets: [
        "Instant recording from any screen or voice",
        "Intelligent scheduling conflict resolution",
        "Smart resume across devices and sessions",
        "Series tracking with episode metadata",
      ],
      outcome: "SHIPPED — ACQUISITION DRIVER",
      outcomeBody: "Users validated this direction overwhelmingly in testing. The reliability of Cloud DVR — no storage limits, no missed recordings — became Boxee's defining value prop and the foundation of the Samsung acquisition.",
      outcomeColor: { r: 0.22, g: 0.65, b: 0.15 }, // green
    },
  ];

  for (let i = 0; i < 2; i++) {
    const p = panels[i];
    const px = i === 0 ? panel1X : panel2X;
    const panel = mkDarkCard(slide, px, panelY, panelW, panelH);

    const plbl = await mkText(p.name, {
      style: "SemiBold", size: 13,
      color: i === 0 ? WHITE : ACCENT,
      colorA: i === 0 ? 0.4 : 1,
      letterSpacing: 2, textCase: "LOWER",
      x: 24, y: 24,
    });
    panel.appendChild(plbl);

    const ptitle = await mkText(p.title, {
      style: "SemiBold", size: 28, color: WHITE, lineHeightPx: 36,
      fixedW: panelW - 48, x: 24, y: 56,
    });
    panel.appendChild(ptitle);

    const pquote = await mkText(p.quote, {
      style: "Regular", size: 16, color: WHITE, colorA: 0.45,
      fixedW: panelW - 48, lineHeightPx: 24,
      x: 24, y: 56 + ptitle.height + 8,
    });
    panel.appendChild(pquote);

    // Bullet list
    let bulletY = 56 + ptitle.height + 8 + pquote.height + 24;
    for (const bullet of p.bullets) {
      const dot = mkRect(6, 6, WHITE, 0.3, { radius: 3, x: 24, y: bulletY + 9 });
      panel.appendChild(dot);
      const bt = await mkText(bullet, {
        style: "Regular", size: 16, color: WHITE, colorA: 0.65,
        fixedW: panelW - 68, lineHeightPx: 24,
        x: 42, y: bulletY,
      });
      panel.appendChild(bt);
      bulletY += bt.height + 8;
    }

    // Outcome footer
    const footerH = 120;
    const footer = figma.createFrame();
    footer.resize(panelW, footerH);
    footer.x = 0; footer.y = panelH - footerH;
    footer.fills = solid(p.outcomeColor, 0.12);
    footer.strokes = solid(p.outcomeColor, 0.35);
    footer.strokeWeight = 1;
    footer.cornerRadius = 4;
    footer.clipsContent = false;
    panel.appendChild(footer);

    const flbl = await mkText(p.outcome, {
      style: "SemiBold", size: 12,
      color: p.outcomeColor, colorA: 1,
      letterSpacing: 1.5, textCase: "UPPER",
      x: 20, y: 16,
    });
    footer.appendChild(flbl);

    const fbody = await mkText(p.outcomeBody, {
      style: "Regular", size: 14, color: WHITE, colorA: 0.6,
      fixedW: panelW - 40, lineHeightPx: 22,
      x: 20, y: 36,
    });
    footer.appendChild(fbody);
  }

  return slide;
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 4 — Results (dark, two-panel split)
// Pattern: LKG 05
// ═══════════════════════════════════════════════════════════════════
async function makeBoxee04() {
  const slide = mkFrame("boxee 04", W, H, BG_DARK);

  // Vertical divider splitting two panels
  mkDivider(slide);

  // ── LEFT PANEL — Results ────────────────────────────────────────
  const left = mkFrame("left", 979, H, BG_DARK);
  left.x = 0; left.y = 0;
  left.clipsContent = false;
  slide.appendChild(left);

  await mkOverline("results", left, 80, 80, ACCENT);

  const h1 = await mkText("What shipped.", {
    style: "Regular", size: 72, color: WHITE,
    lineHeightPx: 80, letterSpacing: -2, fixedW: 700, x: 80, y: 140,
  });
  left.appendChild(h1);
  const h2 = await mkText("What I learned.", {
    style: "SemiBold", size: 72, color: ACCENT,
    lineHeightPx: 80, letterSpacing: -2, fixedW: 700, x: 80, y: 140 + 80,
  });
  left.appendChild(h2);

  const resultItems = [
    { label: "Samsung", head: "Acquisition by Samsung in 2013", body: "The Cloud DVR experience — intuitive recording, smart scheduling, reliable playback — was the key product differentiator that made Boxee an acquisition target." },
    { label: "↑ 2×", head: "Second acquired company in my career", body: "Staying through the acquisition gave me firsthand experience scaling product work into a large enterprise and navigating product continuity under new ownership." },
    { label: "TV-first", head: "Remote-nav patterns are now industry standard", body: "The d-pad navigation patterns we validated became the foundation for many of the streaming UI conventions that are now taken for granted across Roku, Fire TV, and Apple TV." },
  ];

  const itemH2 = 130;
  for (let i = 0; i < resultItems.length; i++) {
    const item = resultItems[i];
    const iy = 340 + i * itemH2;

    // divider
    const d = mkRect(799, 1, WHITE, 0.07, { x: 80, y: iy });
    left.appendChild(d);

    const lbl = await mkText(item.label, {
      style: "SemiBold", size: 40, color: ACCENT,
      lineHeightPx: 48, x: 80, y: iy + 20,
    });
    left.appendChild(lbl);

    const ihead = await mkText(item.head, {
      style: "SemiBold", size: 17, color: WHITE,
      fixedW: 560, x: 200, y: iy + 22,
    });
    left.appendChild(ihead);

    const ibody = await mkText(item.body, {
      style: "Regular", size: 15, color: WHITE, colorA: 0.5,
      fixedW: 560, lineHeightPx: 24,
      x: 200, y: iy + 22 + ihead.height + 6,
    });
    left.appendChild(ibody);
  }

  // ── RIGHT PANEL — Retrospective ─────────────────────────────────
  const right = mkFrame("right", 461, H, BG_DARK);
  right.x = 979; right.y = 0;
  right.clipsContent = false;
  slide.appendChild(right);

  await mkOverline("retrospective", right, 60, 80, null);

  const rh = await mkText("What designing for hardware taught me.", {
    style: "Regular", size: 48, color: WHITE,
    lineHeightPx: 56, letterSpacing: -1, fixedW: 340, x: 60, y: 140,
  });
  right.appendChild(rh);

  const retros = [
    { icon: "↑", head: "Physical failure modes are UX problems", body: "A dropped signal, a slow RF handshake, a firmware update mid-use — hardware adds a whole new class of edge case that purely digital products never encounter." },
    { icon: "→", head: "Ship packaging alongside the screen", body: "The first impression is the box, not the app. Designing the unboxing and hardware setup as part of the UX made onboarding significantly smoother." },
    { icon: "→", head: "Earn simplicity — don't assume it", body: "The remote interface looked simple, but getting there required hundreds of micro-decisions about focus, scrolling, and depth that invisible work is never credited for." },
  ];

  let retY = 140 + rh.height + 40;
  for (const r of retros) {
    const icon = await mkText(r.icon, {
      style: "SemiBold", size: 20, color: ACCENT,
      x: 60, y: retY + 2,
    });
    right.appendChild(icon);

    const rhead = await mkText(r.head, {
      style: "SemiBold", size: 16, color: WHITE,
      fixedW: 300, x: 92, y: retY,
    });
    right.appendChild(rhead);

    const rbody = await mkText(r.body, {
      style: "Regular", size: 14, color: WHITE, colorA: 0.5,
      fixedW: 300, lineHeightPx: 22,
      x: 92, y: retY + rhead.height + 6,
    });
    right.appendChild(rbody);

    retY += rhead.height + rbody.height + 32;
  }

  return slide;
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE 5 — Boxee Closing / Bridge slide (dark)
// Connects to the "End" section
// ═══════════════════════════════════════════════════════════════════
async function makeBoxee05() {
  const slide = mkFrame("boxee 05", W, H, BG_DARK);

  mkDivider(slide);

  // LEFT
  const left = mkFrame("left", 979, H, BG_DARK);
  left.x = 0; left.y = 0;
  left.clipsContent = false;
  slide.appendChild(left);

  await mkOverline("15 years · 3 companies · 1 throughline", left, 80, 80, null);

  const h1 = await mkText("Complexity is the problem.", {
    style: "Regular", size: 72, color: WHITE,
    lineHeightPx: 80, letterSpacing: -2, fixedW: 760, x: 80, y: 150,
  });
  left.appendChild(h1);

  const h2 = await mkText("Clarity is the job.", {
    style: "SemiBold", size: 72, color: ACCENT,
    lineHeightPx: 80, letterSpacing: -2, fixedW: 760, x: 80, y: 150 + 80,
  });
  left.appendChild(h2);

  const body = await mkText(
    "From Boxee's living-room DVR to Vimeo's global creator platform to Looking Glass's frontier spatial AI — the work has always been the same: take something technically complex and make it feel effortless to the person holding the remote, the phone, or the keyboard.",
    {
      style: "Regular", size: 20, color: WHITE, colorA: 0.7,
      lineHeightPx: 40, fixedW: 760, x: 80, y: 150 + 80 + 80 + 40,
    }
  );
  left.appendChild(body);

  // RIGHT — three career stats
  const right = mkFrame("right", 461, H, BG_DARK);
  right.x = 979; right.y = 0;
  right.clipsContent = false;
  slide.appendChild(right);

  const rInner = figma.createFrame();
  rInner.resize(328, H - 88 - 80);
  rInner.x = 60; rInner.y = 88;
  rInner.fills = solid(BG_DARK, 0);
  rInner.clipsContent = false;
  right.appendChild(rInner);

  const careerStats = [
    { val: "15",        label: "Years shipping video products", accent: null },
    { val: "2×",        label: "Companies acquired",            accent: ACCENT },
    { val: "Millions+", label: "Daily active users designed for", accent: null },
    { val: "11",        label: "Platforms — web, TV, mobile",   accent: null },
  ];

  const iH = (H - 88 - 80) / 4;
  for (let i = 0; i < careerStats.length; i++) {
    const s = careerStats[i];
    const yPos = i * iH;

    const div = mkRect(328, 1, WHITE, 0.07, { x: 0, y: yPos });
    rInner.appendChild(div);

    const v = await mkText(s.val, {
      style: "SemiBold", size: 52, color: s.accent || WHITE,
      lineHeightPx: 52, x: 0, y: yPos + 36,
    });
    rInner.appendChild(v);

    const l = await mkText(s.label, {
      style: "Medium", size: 15, color: WHITE, colorA: 0.3,
      letterSpacing: 0.8, textCase: "UPPER", fixedW: 328,
      x: 0, y: yPos + 98,
    });
    rInner.appendChild(l);
  }
  const lastDiv = mkRect(328, 1, WHITE, 0.07, { x: 0, y: H - 88 - 80 });
  rInner.appendChild(lastDiv);

  return slide;
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════
async function main() {
  // Pre-load all font weights we'll use
  await Promise.all([
    lf("Regular"), lf("Medium"), lf("SemiBold"), lf("Bold"),
  ]);

  figma.notify("Building Boxee slides…", { timeout: 60000 });

  const builders = [makeBoxee01, makeBoxee02, makeBoxee03, makeBoxee04, makeBoxee05];
  const SLIDE_STRIDE = H + SLIDE_GAP; // 810 + 200 = 1010

  // Build slides
  const slides = [];
  for (let i = 0; i < builders.length; i++) {
    figma.notify(`Building slide ${i + 1} of ${builders.length}…`, { timeout: 3000 });
    const s = await builders[i]();
    s.x = 0;
    s.y = i * SLIDE_STRIDE;
    slides.push(s);
  }

  // Find the canvas (page) — node id 224:8916 is the canvas
  const page = figma.currentPage;

  // Find the "End" section to position Boxee after it
  // Existing layout: Don Polistico x=-2927, Vimeo x=-1087, LKG x=753, End x=2593
  // End section width=1440, so Boxee goes at x = 2593 + 1440 + 400 = 4433
  const SECTION_X = 4433;
  const SECTION_Y = 0;

  // Create a Figma SECTION node to group the slides
  let section;
  try {
    section = figma.createSection();
    section.name = "Boxee Cloud DVR";
  } catch (e) {
    // If createSection isn't available, use a frame as container
    section = figma.createFrame();
    section.name = "Boxee Cloud DVR";
    section.fills = [];
  }

  section.x = SECTION_X;
  section.y = SECTION_Y;

  page.appendChild(section);

  // Append slides to section and resize section to fit
  const totalH = builders.length * SLIDE_STRIDE - SLIDE_GAP;
  for (const s of slides) {
    section.appendChild(s);
  }

  // Resize section to wrap slides
  if (section.type === "SECTION") {
    section.resizeWithoutConstraints(W, totalH);
  } else {
    section.resize(W, totalH);
    section.clipsContent = false;
  }

  // Zoom to the new section
  figma.viewport.scrollAndZoomIntoView(slides);

  figma.notify("✅ Boxee Cloud DVR — 5 slides created!", { timeout: 5000 });
  figma.closePlugin();
}

main().catch(err => {
  figma.notify("❌ " + err.message, { timeout: 8000 });
  console.error(err);
  figma.closePlugin();
});
