"use client";

import { useCallback, useRef, useState } from "react";

type ColorEntry = { hex: string; pct: number };

function toHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(v).toString(16).padStart(2, "0"))
      .join("")
  );
}

function quantize(data: Uint8ClampedArray, buckets = 6): ColorEntry[] {
  const counts: Record<string, number> = {};
  const size = Math.floor(buckets);

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue; // skip transparent
    const r = Math.round(data[i] / size) * size;
    const g = Math.round(data[i + 1] / size) * size;
    const b = Math.round(data[i + 2] / size) * size;
    const key = `${r},${g},${b}`;
    counts[key] = (counts[key] || 0) + 1;
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([key, count]) => {
      const [r, g, b] = key.split(",").map(Number);
      return { hex: toHex(r, g, b), pct: Math.round((count / total) * 100) };
    });
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

export function PalettePull() {
  const [colors, setColors] = useState<ColorEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = useCallback((src: string) => {
    setLoading(true);
    setError("");
    setColors([]);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const scale = Math.min(1, 200 / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      setColors(quantize(data, 32));
      setLoading(false);
    };
    img.onerror = () => {
      setError("Couldn't load that image. Try uploading a file instead.");
      setLoading(false);
    };
    img.src = src;
  }, []);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImgSrc(src);
      processImage(src);
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  }

  function handleUrlSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const url = new FormData(e.currentTarget).get("url") as string;
    if (!url) return;
    setImgSrc(url);
    processImage(url);
  }

  function copyCSSVars() {
    const vars = colors
      .map((c, i) => `  --color-${i + 1}: ${c.hex};`)
      .join("\n");
    const css = `:root {\n${vars}\n}`;
    copyToClipboard(css);
    setCopied("css");
    setTimeout(() => setCopied(""), 1500);
  }

  function copyHexList() {
    copyToClipboard(colors.map((c) => c.hex).join(", "));
    setCopied("hex");
    setTimeout(() => setCopied(""), 1500);
  }

  return (
    <div className="flex flex-col gap-6">
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* Input */}
      <div className="flex flex-col gap-3">
        {/* URL input */}
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <input
            name="url"
            type="url"
            placeholder="Paste an image URL…"
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-[#D8983E]/50"
          />
          <button
            type="submit"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[13px] font-medium text-white/60 hover:border-[#D8983E]/40 hover:text-[#D8983E] transition-all"
          >
            Pull
          </button>
        </form>

        {/* File upload */}
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="rounded-xl border border-dashed border-white/15 py-5 text-center text-[13px] text-white/30 hover:border-white/30 hover:text-white/50 transition-all"
        >
          Or drop an image / <span className="underline underline-offset-2">browse</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-[13px] text-red-400/80">{error}</p>}

      {/* Loading */}
      {loading && (
        <div className="text-[13px] text-white/40 animate-pulse">Extracting palette…</div>
      )}

      {/* Result */}
      {colors.length > 0 && (
        <div className="flex flex-col gap-4">
          {/* Image preview */}
          {imgSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt="Source"
              className="rounded-xl max-h-40 object-cover w-full"
            />
          )}

          {/* Swatches */}
          <div className="flex gap-2">
            {colors.slice(0, 6).map((c) => (
              <button
                key={c.hex}
                title={c.hex}
                onClick={() => {
                  copyToClipboard(c.hex);
                  setCopied(c.hex);
                  setTimeout(() => setCopied(""), 1200);
                }}
                className="group relative flex-1 rounded-lg transition-transform hover:scale-105"
                style={{ backgroundColor: c.hex, height: 56 }}
              >
                <span className="absolute inset-x-0 bottom-0 rounded-b-lg bg-black/50 py-0.5 text-[9px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {copied === c.hex ? "copied!" : c.hex}
                </span>
              </button>
            ))}
          </div>

          {/* Hex list */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap gap-2">
              {colors.slice(0, 6).map((c) => (
                <span
                  key={c.hex}
                  className="font-mono text-[12px] text-white/50"
                >
                  {c.hex}
                </span>
              ))}
            </div>
          </div>

          {/* Copy actions */}
          <div className="flex gap-2">
            <button
              onClick={copyHexList}
              className="flex-1 rounded-xl border border-white/10 py-2.5 text-[12px] font-medium text-white/60 hover:border-[#D8983E]/40 hover:text-[#D8983E] transition-all"
            >
              {copied === "hex" ? "Copied!" : "Copy hex list"}
            </button>
            <button
              onClick={copyCSSVars}
              className="flex-1 rounded-xl border border-white/10 py-2.5 text-[12px] font-medium text-white/60 hover:border-[#D8983E]/40 hover:text-[#D8983E] transition-all"
            >
              {copied === "css" ? "Copied!" : "Copy CSS vars"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
