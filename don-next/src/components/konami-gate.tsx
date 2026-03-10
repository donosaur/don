"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "don_playground_unlocked";
const FALLBACK_URL = "/"; // update to full portfolio URL when deployed separately

export function KonamiGate({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip gate on localhost so dev isn't blocked by infinite redirects
    const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const unlocked = localStorage.getItem(STORAGE_KEY) === "1";

    if (isDev || unlocked) {
      setAllowed(true);
    } else {
      window.location.href = FALLBACK_URL;
    }
  }, []);

  if (!allowed) return null;

  return <>{children}</>;
}
