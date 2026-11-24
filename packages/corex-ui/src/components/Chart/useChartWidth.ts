import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * The width of the element a chart draws in, kept current with a
 * ResizeObserver. Server render and the first client render use
 * `fallback`, so the markup matches; the real width follows on mount.
 */
export function useChartWidth<T extends HTMLElement>(
  fallback = 640,
): [RefObject<T>, number] {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const update = () => {
      const next = Math.round(element.getBoundingClientRect().width);
      if (next > 0) setWidth(next);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}
