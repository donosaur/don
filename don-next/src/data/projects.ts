export type ProjectStatus = "shipped" | "in progress" | "archived";

export type Project = {
  title: string;
  description: string;
  year: number;
  status: ProjectStatus;
  tags: string[];
  url?: string;
};

export const projects: Project[] = [
  {
    title: "Playground (this site)",
    description:
      "A companion to my portfolio — built in Next.js as a place to experiment with code, share taste, and ship things that don't fit a case study.",
    year: 2025,
    status: "in progress",
    tags: ["Next.js", "React", "Tailwind", "design+code"],
    url: "/",
  },
  {
    title: "Film Grain Lab",
    description:
      "Canvas-based film grain generator with export. Useful for designers who want a quick overlay without reaching for Photoshop.",
    year: 2025,
    status: "shipped",
    tags: ["canvas", "tool", "design"],
    url: "/play/film-grain",
  },
  {
    title: "Palette Pull",
    description:
      "Drop in an image, get back its dominant color palette as hex codes or CSS variables. No upload, no account.",
    year: 2025,
    status: "shipped",
    tags: ["tool", "color", "web"],
    url: "/play/palette-pull",
  },
  {
    title: "App Builder UI Concepts",
    description:
      "A set of slide-based UI explorations for a drag-and-drop app builder product — published as an HTML artifact.",
    year: 2024,
    status: "archived",
    tags: ["product design", "concept", "Figma"],
    url: "/app-builder.html",
  },
];
