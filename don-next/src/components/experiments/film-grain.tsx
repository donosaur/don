"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type GrainType = "35mm" | "16mm" | "digital";

const presets: Record<GrainType, { intensity: number; size: number; speed: number }> = {
  "35mm": { intensity: 0.55, size: 1, speed: 24 },
  "16mm": { intensity: 0.75, size: 1.5, speed: 18 },
  digital: { intensity: 0.3, size: 0.8, speed: 30 },
};

export function FilmGrainLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [type, setType] = useState<GrainType>("35mm");
  const [opacity, setOpacity] = useState(0.5);
  const [tint, setTint] = useState("#000000");
  const [speed, setSpeed] = useState(24);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width: w, height: h } = canvas;
    const preset = presets[type];

    // Base grain
    const imageData = ctx.createImageData(w, h);
    const tintR = parseInt(tint.slice(1, 3), 16);
    const tintG = parseInt(tint.slice(3, 5), 16);
    const tintB = parseInt(tint.slice(5, 7), 16);

    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      const blend = opacity;
      imageData.data[i] = v + (tintR - v) * blend * 0.4;
      imageData.data[i + 1] = v + (tintG - v) * blend * 0.4;
      imageData.data[i + 2] = v + (tintB - v) * blend * 0.4;
      imageData.data[i + 3] = (v * preset.intensity * opacity * 255) | 0;
    }
    ctx.putImageData(imageData, 0, 0);
  }, [type, opacity, tint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }, []);

  useEffect(() => {
    let frame = 0;
    const interval = Math.max(1, Math.round(60 / speed));
    function loop() {
      frame++;
      if (frame % interval === 0) drawFrame();
      animRef.current = requestAnimationFrame(loop);
    }
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [drawFrame, speed]);

  useEffect(() => {
    setSpeed(presets[type].speed);
  }, [type]);

  function exportPNG() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawFrame();
    const link = document.createElement("a");
    link.download = `grain-${type}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Canvas */}
      <div className="relative flex-1 rounded-xl overflow-hidden bg-zinc-900 min-h-[300px]">
        {/* Checkerboard background to show transparency */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-conic-gradient(#333 0% 25%, #444 0% 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ mixBlendMode: "normal" }}
        />
      </div>

      {/* Controls */}
      <div className="lg:w-60 flex flex-col gap-5">
        {/* Type */}
        <div>
          <label className="text-[11px] font-semibold tracking-widest uppercase text-white/40 block mb-2">
            Grain type
          </label>
          <div className="flex gap-2">
            {(["35mm", "16mm", "digital"] as GrainType[]).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 rounded-lg py-2 text-[12px] font-medium border transition-all ${
                  type === t
                    ? "bg-[#D8983E] border-[#D8983E] text-black"
                    : "border-white/10 text-white/50 hover:text-white hover:border-white/20"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Opacity */}
        <div>
          <label className="text-[11px] font-semibold tracking-widest uppercase text-white/40 block mb-2">
            Opacity · {Math.round(opacity * 100)}%
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-full accent-[#D8983E]"
          />
        </div>

        {/* Speed */}
        <div>
          <label className="text-[11px] font-semibold tracking-widest uppercase text-white/40 block mb-2">
            Speed · {speed} fps
          </label>
          <input
            type="range"
            min={1}
            max={60}
            step={1}
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-full accent-[#D8983E]"
          />
        </div>

        {/* Tint */}
        <div>
          <label className="text-[11px] font-semibold tracking-widest uppercase text-white/40 block mb-2">
            Tint
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={tint}
              onChange={(e) => setTint(e.target.value)}
              className="h-10 w-10 rounded-lg border border-white/10 bg-transparent p-0.5"
            />
            <span className="text-[13px] font-mono text-white/40">{tint}</span>
          </div>
        </div>

        {/* Export */}
        <button
          onClick={exportPNG}
          className="mt-auto rounded-xl border border-white/15 py-2.5 text-[13px] font-medium text-white/70 hover:border-[#D8983E] hover:text-[#D8983E] transition-all"
        >
          Export PNG
        </button>
      </div>
    </div>
  );
}
