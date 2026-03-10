export type Experiment = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  thumb?: string; // optional static thumbnail
};

export const experiments: Experiment[] = [
  {
    slug: "film-grain",
    title: "Film Grain Lab",
    description:
      "Dial in your grain — 35mm, 16mm, or digital noise. Adjust opacity, speed, and tint. Export as PNG.",
    tags: ["canvas", "generative", "tool"],
    date: "2025-03",
  },
  {
    slug: "palette-pull",
    title: "Palette Pull",
    description:
      "Drop in any image and extract its dominant color palette as hex codes or CSS variables. Instant, no upload required.",
    tags: ["tool", "video", "color"],
    date: "2025-03",
  },
  {
    slug: "kinetic-type",
    title: "Type in Motion",
    description:
      "Start typing. Watch your words come alive with physics — split, scatter, orbit. Click to reset.",
    tags: ["type", "interactive", "canvas"],
    date: "2025-03",
  },
];
