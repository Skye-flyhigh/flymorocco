"use client";

import { useEffect, useState, useRef } from "react";

export function useLazyScript(src: string) {
  const [loaded, setLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for visibility-based loading
  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !shouldLoad) {
          setShouldLoad(true);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }, // Load when 100px away
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [shouldLoad]);

  // Script loading effect
  useEffect(() => {
    if (!shouldLoad) return;

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) {
        // Script might already be removed
        console.error("❌ Lazy scripting error:", e);
      }
    };
  }, [src, shouldLoad]);

  return { loaded, elementRef };
}
