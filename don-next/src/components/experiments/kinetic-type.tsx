"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  font: string;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
};

const COLORS = ["#D8983E", "#f5d98a", "#ffffff", "#c8c8c8", "#888888"];
const PLAYFAIR = "Playfair Display, Georgia, serif";
const INTER = "Inter, system-ui, sans-serif";

export function KineticType() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const [fontMode, setFontMode] = useState<"playfair" | "inter">("playfair");
  const [mode, setMode] = useState<"scatter" | "orbit" | "float">("scatter");
  const [text, setText] = useState("");
  const [hint, setHint] = useState(true);

  const spawnChars = useCallback(
    (chars: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const font = fontMode === "playfair" ? PLAYFAIR : INTER;

      for (const char of chars) {
        if (char === " ") continue;
        const angle = Math.random() * Math.PI * 2;
        const speed =
          mode === "scatter"
            ? 2 + Math.random() * 4
            : mode === "orbit"
            ? 1 + Math.random() * 2
            : 0.3 + Math.random() * 1;

        particlesRef.current.push({
          x: cx + (Math.random() - 0.5) * 40,
          y: cy + (Math.random() - 0.5) * 40,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (mode === "float" ? 1.5 : 0),
          char,
          font,
          size: 24 + Math.random() * 32,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          opacity: 1,
          rotation: (Math.random() - 0.5) * 0.6,
          rotationSpeed: (Math.random() - 0.5) * 0.04,
          life: 0,
          maxLife: mode === "float" ? 80 + Math.random() * 60 : 120 + Math.random() * 80,
        });
      }
    },
    [fontMode, mode]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "rgba(13,13,13,0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const alive: Particle[] = [];
      for (const p of particlesRef.current) {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (mode === "orbit") {
          const cx = canvas.width / 2;
          const cy = canvas.height / 2;
          const dx = p.x - cx;
          const dy = p.y - cy;
          const angle = Math.atan2(dy, dx) + 0.015;
          const r = Math.sqrt(dx * dx + dy * dy);
          p.x = cx + Math.cos(angle) * r;
          p.y = cy + Math.sin(angle) * r;
          p.vx *= 0.98;
          p.vy *= 0.98;
        } else if (mode === "float") {
          p.vy -= 0.02;
          p.vx *= 0.99;
        } else {
          p.vx *= 0.99;
          p.vy *= 0.99;
        }

        const fadeStart = p.maxLife * 0.7;
        p.opacity = p.life > fadeStart ? 1 - (p.life - fadeStart) / (p.maxLife - fadeStart) : 1;

        if (p.life < p.maxLife && p.opacity > 0.01) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.font = `${p.size}px ${p.font}`;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fillText(p.char, 0, 0);
          ctx.restore();
          alive.push(p);
        }
      }
      particlesRef.current = alive;
      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [mode]);

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" || e.key.length !== 1) return;
    setHint(false);
    spawnChars(e.key);
    setText((t) => t + e.key);
  }

  function handleClear() {
    particlesRef.current = [];
    setText("");
    setHint(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Canvas */}
      <div className="relative flex-1 rounded-xl overflow-hidden bg-[#0d0d0d] min-h-[300px]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        {hint && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="font-playfair text-2xl text-white/20 italic">
              start typing…
            </p>
          </div>
        )}
      </div>

      {/* Input + controls */}
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={text}
          onKeyDown={handleKey}
          onChange={() => {}}
          placeholder="Type anything…"
          autoFocus
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-white placeholder:text-white/25 outline-none focus:border-[#D8983E]/50"
        />

        <div className="flex flex-wrap gap-3">
          {/* Font toggle */}
          <div className="flex gap-1.5">
            {(["playfair", "inter"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFontMode(f)}
                className={`rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-all ${
                  fontMode === f
                    ? "border-[#D8983E] bg-[#D8983E]/10 text-[#D8983E]"
                    : "border-white/10 text-white/40 hover:text-white/70"
                }`}
              >
                {f === "playfair" ? "Playfair" : "Inter"}
              </button>
            ))}
          </div>

          {/* Mode toggle */}
          <div className="flex gap-1.5">
            {(["scatter", "orbit", "float"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-all ${
                  mode === m
                    ? "border-[#D8983E] bg-[#D8983E]/10 text-[#D8983E]"
                    : "border-white/10 text-white/40 hover:text-white/70"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Clear */}
          <button
            onClick={handleClear}
            className="ml-auto rounded-lg border border-white/10 px-3 py-1.5 text-[12px] font-medium text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
