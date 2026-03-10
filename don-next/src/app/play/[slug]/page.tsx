import { notFound } from "next/navigation";
import Link from "next/link";
import { experiments } from "@/data/experiments";
import { FilmGrainLab } from "@/components/experiments/film-grain";
import { PalettePull } from "@/components/experiments/palette-pull";
import { KineticType } from "@/components/experiments/kinetic-type";

export function generateStaticParams() {
  return experiments.map((e) => ({ slug: e.slug }));
}

function ExperimentComponent({ slug }: { slug: string }) {
  switch (slug) {
    case "film-grain":
      return <FilmGrainLab />;
    case "palette-pull":
      return <PalettePull />;
    case "kinetic-type":
      return <KineticType />;
    default:
      return (
        <div className="flex items-center justify-center h-full text-white/30 text-sm">
          Experiment coming soon.
        </div>
      );
  }
}

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exp = experiments.find((e) => e.slug === slug);
  if (!exp) notFound();

  return (
    <main className="min-h-screen bg-ink text-white flex flex-col">
      {/* Minimal top bar */}
      <div className="flex items-center gap-4 px-6 md:px-10 pt-20 pb-6 border-b border-white/10">
        <Link
          href="/play"
          className="text-[13px] text-white/40 hover:text-white/70 transition-colors"
          style={{ textDecoration: "none" }}
        >
          ← Play
        </Link>
        <span className="text-white/15">·</span>
        <h1 className="font-semibold text-[15px] text-white">{exp.title}</h1>
        <p className="text-[13px] text-white/35 hidden md:block">
          {exp.description}
        </p>
        <div className="ml-auto flex gap-1.5">
          {exp.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-white/35"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Experiment area */}
      <div className="flex-1 p-6 md:p-10">
        <ExperimentComponent slug={slug} />
      </div>
    </main>
  );
}
