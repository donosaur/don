import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "don polistico",
  description: "Product Designer · Brooklyn, NY",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-bg text-ink scroll-smooth">
        <svg style={{ display: "none" }} aria-hidden="true">
          <defs>
            <filter id="hero-goo" x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -7" result="goo" />
            </filter>
            <filter id="hero-goo-stroke" x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 20 -7" result="outer" />
              <feColorMatrix in="blur" mode="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 20 -8" result="inner" />
              <feComposite in="outer" in2="inner" operator="out" />
            </filter>
          </defs>
        </svg>
        <Nav />
        {children}
      </body>
    </html>
  );
}
