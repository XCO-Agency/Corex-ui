import { useState, type KeyboardEvent, type PointerEvent } from "react";

export type ActiveIndexPropsType = {
  tabIndex: number;
  onPointerMove: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent<SVGSVGElement>) => void;
};

/**
 * Hover and keyboard focus over a chart's points: the pointer picks the
 * nearest point, and with the chart focused the arrow keys (Home / End)
 * move between points, so every tooltip is reachable without a mouse.
 * Escape hides the tooltip.
 */
export function useActiveIndex(
  count: number,
  indexAt: (x: number) => number,
): { active: number | null; props: ActiveIndexPropsType } {
  const [active, setActive] = useState<number | null>(null);
  const clamp = (i: number) => Math.min(Math.max(i, 0), count - 1);

  return {
    active: active == null || count === 0 ? null : clamp(active),
    props: {
      tabIndex: count > 0 ? 0 : -1,
      onPointerMove: (event) => {
        const box = event.currentTarget.getBoundingClientRect();
        const scale =
          box.width > 0
            ? event.currentTarget.viewBox?.baseVal?.width / box.width || 1
            : 1;
        setActive(clamp(indexAt((event.clientX - box.left) * scale)));
      },
      onPointerLeave: () => setActive(null),
      onFocus: () => setActive((current) => current ?? count - 1),
      onBlur: () => setActive(null),
      onKeyDown: (event) => {
        const moves: Record<string, (i: number) => number> = {
          ArrowRight: (i) => i + 1,
          ArrowUp: (i) => i + 1,
          ArrowLeft: (i) => i - 1,
          ArrowDown: (i) => i - 1,
          Home: () => 0,
          End: () => count - 1,
        };
        const move = moves[event.key];
        if (move) {
          event.preventDefault();
          setActive((current) => clamp(move(current ?? count - 1)));
        } else if (event.key === "Escape") {
          setActive(null);
        }
      },
    },
  };
}
