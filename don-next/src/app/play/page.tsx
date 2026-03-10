import Link from "next/link";
import { experiments } from "@/data/experiments";

const tagColors: Record<string, string> = {
  canvas: "bg-amber-500/10 text-amber-400/80 border-amber-500/20",
  type: "bg-blue-500/10 text-blue-400/80 border-blue-500/20",
  video: "bg-red-500/10 text-red-400/80 border-red-500/20",
  generative: "bg-purple-500/10 text-purple-400/80 border-purple-500/20",
  tool: "bg-green-500/10 text-green-400/80 border-green-500/20",
  color: "bg-pink-500/10 text-pink-400/80 border-pink-500/20",
  interactive: "bg-cyan-500/10 text-cyan-400/80 border-cyan-500/20",
};

function tagClass(tag: string) {
  return tagColors[tag] ?? "bg-white/5 text-white/50 border-white/10";
}

export default function PlayPage() {
  return (
    <main className="min-h-screen bg-ink text-white">
      {/* Header */}
      <div className="pt-28 pb-12 px-6 md:px-12 max-w-5xl mx-auto border-b border-white/10">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/30 mb-4 fade-up">
          Experiments
        </p>
        <h1 className="font-playfair text-4xl md:text-5xl font-semibold fade-up fade-up-delay-1">
          Play
        </h1>
        <p className="mt-4 text-[15px] text-white/50 max-w-sm fade-up fade-up-delay-2">
          Interactive toys, tools, and creative experiments. Some useful, all
          intentional.
        </p>
      </div>

      {/* Grid */}
      <div className="px-6 md:px-12 max-w-5xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {experiments.map((exp, i) => (
            <Link
              key={exp.slug}
              href={`/play/${exp.slug}`}
              className={`group block rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 transition-all duration-250 overflow-hidden fade-up`}
              style={{
                animationDelay: `${i * 0.08}s`,
                textDecoration: "none",
              }}
            >
              {/* Preview area */}
              <div className="aspect-video bg-white/5 relative overflow-hidden flex items-center justify-center">
                <span className="font-playfair text-5xl text-white/10 select-none">
                  {exp.title.charAt(0)}
                </span>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ink/60" />
              </div>

              {/* Card body */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="font-semibold text-[15px] text-white group-hover:text-white/90">
                    {exp.title}
                  </h2>
                  <span className="text-white/25 group-hover:text-white/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-sm ml-2 flex-shrink-0">
                    ↗
                  </span>
                </div>
                <p className="text-[13px] text-white/45 leading-relaxed mb-4">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${tagClass(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
