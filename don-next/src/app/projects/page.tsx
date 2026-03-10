import Link from "next/link";
import { projects, Project, ProjectStatus } from "@/data/projects";

const statusConfig: Record<ProjectStatus, { label: string; color: string }> = {
  shipped: { label: "Shipped", color: "text-green-400/80 border-green-500/20 bg-green-500/10" },
  "in progress": { label: "In progress", color: "text-amber-400/80 border-amber-500/20 bg-amber-500/10" },
  archived: { label: "Archived", color: "text-white/30 border-white/10 bg-white/5" },
};

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const status = statusConfig[project.status];
  const isExternal = project.url?.startsWith("http");
  const className = `group flex flex-col sm:flex-row sm:items-start gap-4 py-7 border-b border-white/10 transition-colors hover:border-white/20 fade-up`;
  const style = { animationDelay: `${index * 0.07}s`, textDecoration: "none" as const };

  const inner = (
    <>
      <div className="text-[13px] text-white/25 sm:w-14 flex-shrink-0 sm:pt-0.5">
        {project.year}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h2 className="font-semibold text-[16px] text-white group-hover:text-white/90 transition-colors">
            {project.title}
          </h2>
          {project.url && (
            <span className="text-white/25 group-hover:text-white/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-sm flex-shrink-0">
              ↗
            </span>
          )}
        </div>
        <p className="text-[14px] text-white/45 leading-relaxed mb-3">
          {project.description}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${status.color}`}>
            {status.label}
          </span>
          {project.tags.map((tag) => (
            <span key={tag} className="text-[11px] text-white/30 font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  if (!project.url) {
    return <div className={className} style={style}>{inner}</div>;
  }
  if (isExternal) {
    return (
      <a href={project.url} target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={project.url} className={className} style={style}>
      {inner}
    </Link>
  );
}

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-ink text-white">
      {/* Header */}
      <div className="pt-28 pb-12 px-6 md:px-12 max-w-3xl mx-auto border-b border-white/10">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/30 mb-4 fade-up">
          Side projects
        </p>
        <h1 className="font-playfair text-4xl md:text-5xl font-semibold fade-up fade-up-delay-1">
          Projects
        </h1>
        <p className="mt-4 text-[15px] text-white/50 max-w-sm fade-up fade-up-delay-2">
          Things built outside the day job — tools, experiments, and ideas that
          earned a real URL.
        </p>
      </div>

      {/* List */}
      <div className="px-6 md:px-12 max-w-3xl mx-auto py-12">
        <div className="flex flex-col">
          {projects.map((project, i) => (
            <ProjectRow key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
