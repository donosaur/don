"use client";

import { useState } from "react";
import { taste, TasteEntry } from "@/data/taste";
import { cn } from "@/lib/utils";

type Category = "films" | "albums" | "design" | "reads";

const categories: { key: Category; label: string; emoji: string }[] = [
  { key: "films", label: "Films", emoji: "◎" },
  { key: "albums", label: "Albums", emoji: "◉" },
  { key: "design", label: "Design", emoji: "◈" },
  { key: "reads", label: "Reads", emoji: "◇" },
];

function ColorPalette({ palette }: { palette: string[] }) {
  return (
    <div className="flex gap-1 mt-3">
      {palette.map((hex) => (
        <div
          key={hex}
          className="h-2 flex-1 rounded-sm"
          style={{ backgroundColor: hex }}
          title={hex}
        />
      ))}
    </div>
  );
}

function EntryCard({ entry, index }: { entry: TasteEntry; index: number }) {
  return (
    <div
      className={cn(
        "border-b border-[var(--line)] py-7 fade-up",
        "first:pt-0"
      )}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="flex items-start justify-between gap-4 mb-1">
        <div>
          <h3 className="font-playfair text-[18px] font-semibold text-ink">
            {entry.title}
          </h3>
          <p className="text-[13px] text-ink-3 mt-0.5">
            {entry.creator} · {entry.year}
          </p>
        </div>
        {entry.url && (
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-ink-3 hover:text-ink transition-colors flex-shrink-0"
            style={{ textDecoration: "none" }}
          >
            ↗
          </a>
        )}
      </div>
      <p className="text-[14px] leading-relaxed text-ink-2 italic mt-3">
        &ldquo;{entry.take}&rdquo;
      </p>
      {entry.palette && <ColorPalette palette={entry.palette} />}
    </div>
  );
}

export default function TastePage() {
  const [active, setActive] = useState<Category>("films");
  const entries: TasteEntry[] = taste[active];

  return (
    <main className="min-h-screen bg-bg text-ink">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="md:w-56 md:min-h-screen border-r border-[var(--line)] pt-28 pb-12 px-6 md:px-8 flex-shrink-0">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-ink-3 mb-6 fade-up">
            Taste
          </p>
          <h1 className="font-playfair text-3xl font-semibold text-ink mb-8 fade-up fade-up-delay-1">
            Things I love.
          </h1>
          <nav className="flex flex-col gap-1">
            {categories.map(({ key, label, emoji }, i) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[14px] font-medium text-left transition-all fade-up",
                  active === key
                    ? "bg-ink text-white"
                    : "text-ink-2 hover:bg-ink/5 hover:text-ink"
                )}
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              >
                <span className="text-[16px] opacity-60">{emoji}</span>
                {label}
                <span className="ml-auto text-[12px] opacity-40">
                  {taste[key].length}
                </span>
              </button>
            ))}
          </nav>

          <p className="mt-10 text-[12px] leading-relaxed text-ink-3">
            One sentence. No hedging. These are the things that shaped how I
            think.
          </p>
        </aside>

        {/* Content */}
        <div className="flex-1 pt-28 pb-12 px-6 md:px-10">
          <div className="max-w-xl">
            {entries.map((entry, i) => (
              <EntryCard key={entry.title} entry={entry} index={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
