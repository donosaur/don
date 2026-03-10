"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "don_playground_unlocked";
const FALLBACK_URL = "/"; // update to full portfolio URL when deployed separately

export function KonamiGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const unlocked = localStorage.getItem(STORAGE_KEY) === "1";
    if (!unlocked) {
      window.location.href = FALLBACK_URL;
    }
  }, [router]);

  // Render nothing until the check passes (avoids flash of content)
  if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) !== "1") {
    return null;
  }

  return <>{children}</>;
}
