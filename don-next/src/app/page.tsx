"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { experiments } from "@/data/experiments";
import { taste } from "@/data/taste";
import { projects } from "@/data/projects";

/* ── Film grain canvas (ported from index.html) ─────────────────────── */
function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    function drawGrain() {
      if (!canvas || !ctx) return;
      const w = canvas.width, h = canvas.height;
      const img = ctx.createImageData(w, h);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      animId = requestAnimationFrame(drawGrain);
    }
    resize();
    drawGrain();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="grain-overlay"
      aria-hidden="true"
    />
  );
}

/* ── Magnetic bento card ─────────────────────────────────────────────── */
function BentoCard({
  href,
  label,
  headline,
  sub,
  delay,
  children,
}: {
  href: string;
  label: string;
  headline: string;
  sub: string;
  delay: string;
  children?: React.ReactNode;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  function onMouseMove(e: React.MouseEvent) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translate(${dx * 6}px, ${dy * 6}px)`;
  }

  function onMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "";
  }

  return (
    <Link
      ref={cardRef}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`group block rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 fade-up ${delay}`}
      style={{
        transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1), border-color 0.2s, background 0.2s",
        textDecoration: "none",
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/40">
          {label}
        </span>
        <span className="text-white/30 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
          ↗
        </span>
      </div>
      <h2 className="font-playfair text-2xl font-semibold text-white mb-2">
        {headline}
      </h2>
      <p className="text-[14px] leading-relaxed text-white/50">{sub}</p>
      {children && <div className="mt-5">{children}</div>}
    </Link>
  );
}

/* ── Experiment tag chips preview ────────────────────────────────────── */
function ExperimentPreview() {
  const tags = Array.from(new Set(experiments.flatMap((e) => e.tags))).slice(0, 5);
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <span
          key={t}
          className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium text-white/50"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

/* ── Taste swatches preview ──────────────────────────────────────────── */
function TastePreview() {
  const palettes = taste.films
    .filter((f) => f.palette)
    .slice(0, 3)
    .map((f) => f.palette!.slice(0, 4));
  return (
    <div className="flex flex-col gap-2">
      {palettes.map((p, i) => (
        <div key={i} className="flex gap-1.5">
          {p.map((hex) => (
            <div
              key={hex}
              className="h-4 w-full rounded-sm opacity-80"
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Projects count preview ──────────────────────────────────────────── */
function ProjectsPreview() {
  const shipped = projects.filter((p) => p.status === "shipped").length;
  const inProgress = projects.filter((p) => p.status === "in progress").length;
  return (
    <div className="flex gap-6">
      <div>
        <div className="text-2xl font-semibold text-white">{shipped}</div>
        <div className="text-[11px] text-white/40 mt-0.5">shipped</div>
      </div>
      <div>
        <div className="text-2xl font-semibold text-white">{inProgress}</div>
        <div className="text-[11px] text-white/40 mt-0.5">in progress</div>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────────── */
export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="relative min-h-screen bg-ink text-white overflow-hidden">
      <GrainOverlay />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(216,152,62,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen px-6 md:px-12 pt-28 pb-16 max-w-4xl mx-auto">
        {/* Hero headline */}
        <div className="mb-14">
          <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-white/35 mb-5 fade-up">
            Don Polistico · Playground
          </p>
          <h1 className="font-playfair text-5xl md:text-6xl font-semibold leading-[1.1] fade-up fade-up-delay-1">
            A place to{" "}
            <em className="shimmer not-italic">think out loud.</em>
          </h1>
          <p className="mt-6 text-[16px] leading-relaxed text-white/50 max-w-md fade-up fade-up-delay-2">
            Experiments, curation, and side projects — the work that doesn&apos;t
            fit a case study but shapes how I think.
          </p>
        </div>

        {/* Bento grid */}
        {mounted && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BentoCard
              href="/play"
              label={`${experiments.length} experiments`}
              headline="Play"
              sub="Interactive experiments in canvas, type, and tools."
              delay="fade-up-delay-2"
            >
              <ExperimentPreview />
            </BentoCard>

            <BentoCard
              href="/taste"
              label="Films · Albums · Design · Reads"
              headline="Taste"
              sub="Things I love, with one honest sentence about why."
              delay="fade-up-delay-3"
            >
              <TastePreview />
            </BentoCard>

            <BentoCard
              href="/projects"
              label="Side projects"
              headline="Projects"
              sub="Tools and ideas built outside the day job."
              delay="fade-up-delay-4"
            >
              <ProjectsPreview />
            </BentoCard>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-20">
          <a
            href="https://polisti.co"
            className="text-[13px] text-white/30 hover:text-white/60 transition-colors"
            style={{ textDecoration: "none" }}
          >
            ← portfolio
          </a>
        </div>
      </div>
    </main>
  );
}
