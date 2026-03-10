export type TasteEntry = {
  title: string;
  creator: string;
  year: number;
  take: string; // Don's one-sentence opinion
  palette?: string[]; // optional hex color swatches
  url?: string;
};

export type TasteData = {
  films: TasteEntry[];
  albums: TasteEntry[];
  design: TasteEntry[];
  reads: TasteEntry[];
};

export const taste: TasteData = {
  films: [
    {
      title: "Blade Runner 2049",
      creator: "Denis Villeneuve",
      year: 2017,
      take: "The definitive proof that a sequel can surpass the original — and that silence is the most powerful sound design choice.",
      palette: ["#c8a96e", "#1a1a2e", "#e8d5b7", "#4a3728", "#8c7355"],
    },
    {
      title: "2001: A Space Odyssey",
      creator: "Stanley Kubrick",
      year: 1968,
      take: "Every frame is a UI decision. The most influential product designer who never called himself one.",
      palette: ["#000000", "#ffffff", "#c8a96e", "#1c1c3a", "#e8e0d0"],
    },
    {
      title: "Perfect Blue",
      creator: "Satoshi Kon",
      year: 1997,
      take: "Taught me that the best interfaces blur the line between observer and participant.",
      palette: ["#1a3a5c", "#e8c4a0", "#2d1b69", "#f0e8d8", "#c84b4b"],
    },
    {
      title: "Her",
      creator: "Spike Jonze",
      year: 2013,
      take: "The best film ever made about product design — every interaction in that world is intentional, warm, and just slightly wrong in ways that matter.",
      palette: ["#f5c842", "#e8b4a0", "#d4654a", "#c8a96e", "#f0e8d8"],
    },
    {
      title: "Yi Yi",
      creator: "Edward Yang",
      year: 2000,
      take: "Three hours that feel like a week of living — proof that slowness is its own kind of intensity.",
      palette: ["#8a9ab0", "#c4b8a8", "#3a3a4a", "#d8c8b8", "#6a7a8a"],
    },
  ],
  albums: [
    {
      title: "In Rainbows",
      creator: "Radiohead",
      year: 2007,
      take: "The album that proved the format itself can be the statement — they released it before anyone knew what that meant.",
    },
    {
      title: "Illinois",
      creator: "Sufjan Stevens",
      year: 2005,
      take: "Maximalism done right: every extra layer earns its place. The opposite of how most product teams think about scope.",
    },
    {
      title: "Dummy",
      creator: "Portishead",
      year: 1994,
      take: "Trip-hop was the original dark mode. Nobody has matched this record's sense of texture.",
    },
    {
      title: "Vespertine",
      creator: "Björk",
      year: 2001,
      take: "The most micro-interaction-forward album ever made — you feel every single sound decision.",
    },
    {
      title: "Since I Left You",
      creator: "The Avalanches",
      year: 2000,
      take: "3,500 samples stitched together so seamlessly it sounds inevitable. What collage looks like at its absolute best.",
    },
  ],
  design: [
    {
      title: "The Humane Interface",
      creator: "Jef Raskin",
      year: 2000,
      take: "Raskin was right about almost everything and wrong about nothing that mattered. The book the industry keeps re-learning.",
    },
    {
      title: "Dieter Rams: As Little Design as Possible",
      creator: "Sophie Lovell",
      year: 2011,
      take: "Ten principles that haven't aged a day, from a man who designed objects that haven't either.",
    },
    {
      title: "Boxee Box remote",
      creator: "Human Interface Group",
      year: 2010,
      take: "Two-sided remote: QWERTY on the back, D-pad on the front. Still the most elegant 10-foot UI input device ever made.",
    },
    {
      title: "Vimeo.com (circa 2012–2015)",
      creator: "Vimeo Design Team",
      year: 2013,
      take: "The era when Vimeo's brand voice and visual design were in perfect sync — every pixel felt like it cared about the filmmaker.",
    },
  ],
  reads: [
    {
      title: "The Elements of Typographic Style",
      creator: "Robert Bringhurst",
      year: 1992,
      take: "Read it once to learn typography, read it again to understand that craft is a form of ethics.",
    },
    {
      title: "A Pattern Language",
      creator: "Christopher Alexander",
      year: 1977,
      take: "The original component library. Every design system team should read this before naming their first token.",
    },
    {
      title: "Hackers & Painters",
      creator: "Paul Graham",
      year: 2004,
      take: "The essay 'Taste for Makers' alone is worth the whole book — taste as a trainable skill, not a personality trait.",
    },
    {
      title: "The Making of the Atomic Bomb",
      creator: "Richard Rhodes",
      year: 1986,
      take: "The best book about building a product team under impossible constraints, told through the most consequential project in human history.",
    },
  ],
};
