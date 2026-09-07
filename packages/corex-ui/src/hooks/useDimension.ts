import { useState, useEffect, useRef, useCallback } from "react";

export type BreakpointType = "xs" | "sm" | "md" | "lg";

export type ResponsivePropType<T> =
  | T
  | {
      xs?: T;
      sm?: T;
      md?: T;
      lg?: T;
    };

export type DimensionType = {
  width: number;
  height: number;
};

export type UseDimensionOptionsType = {
  /**
   * Debounce delay in milliseconds for resize events. Default is 0 (immediate).
   */
  debounceMs?: number;
  /**
   * Fallback dimension for SSR or before mount. Default is { width: 1040, height: 800 }.
   */
  initialDimension?: DimensionType;
};

export type UseDimensionResultType = {
  width: number;
  height: number;
  breakpoint: BreakpointType;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  ref: (node: HTMLElement | null) => void;
};

export const BREAKPOINT_WIDTHS: Record<BreakpointType, number> = {
  xs: 0,
  sm: 490,
  md: 768,
  lg: 1040,
};

export function getBreakpointFromWidth(width: number): BreakpointType {
  if (width >= BREAKPOINT_WIDTHS.lg) {
    return "lg";
  }
  if (width >= BREAKPOINT_WIDTHS.md) {
    return "md";
  }
  if (width >= BREAKPOINT_WIDTHS.sm) {
    return "sm";
  }
  return "xs";
}

/**
 * Resolves a responsive prop value based on the current active breakpoint.
 * Uses mobile-first / fallback cascade: lg -> md -> sm -> xs.
 */
export function resolveResponsiveValue<T>(
  value: ResponsivePropType<T> | undefined,
  currentBreakpoint: BreakpointType,
  fallback?: T,
): T | undefined {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    return value as T;
  }

  const responsiveObj = value as { xs?: T; sm?: T; md?: T; lg?: T };

  if (currentBreakpoint === "lg") {
    if (responsiveObj.lg !== undefined) return responsiveObj.lg;
    if (responsiveObj.md !== undefined) return responsiveObj.md;
    if (responsiveObj.sm !== undefined) return responsiveObj.sm;
    if (responsiveObj.xs !== undefined) return responsiveObj.xs;
  } else if (currentBreakpoint === "md") {
    if (responsiveObj.md !== undefined) return responsiveObj.md;
    if (responsiveObj.sm !== undefined) return responsiveObj.sm;
    if (responsiveObj.xs !== undefined) return responsiveObj.xs;
  } else if (currentBreakpoint === "sm") {
    if (responsiveObj.sm !== undefined) return responsiveObj.sm;
    if (responsiveObj.xs !== undefined) return responsiveObj.xs;
  } else {
    if (responsiveObj.xs !== undefined) return responsiveObj.xs;
  }

  return fallback ?? responsiveObj.xs ?? responsiveObj.sm ?? responsiveObj.md ?? responsiveObj.lg;
}

/**
 * Hook to measure dimensions and responsive breakpoints (xs, sm, md, lg).
 * Compatible with Shopify embedded iframe apps, standalone browser contexts, and playground device viewports.
 * Uses ResizeObserver on the attached DOM node and tracks window/iframe resize events.
 */
export function useDimension(
  options: UseDimensionOptionsType = {},
): UseDimensionResultType {
  const { debounceMs = 0, initialDimension = { width: 1040, height: 800 } } = options;

  const [dimension, setDimension] = useState<DimensionType>(() => {
    if (typeof window !== "undefined") {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return initialDimension;
  });

  const [elementNode, setElementNode] = useState<HTMLElement | null>(null);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateDimension = useCallback(
    (width: number, height: number) => {
      if (width <= 0 && height <= 0) return;
      if (debounceMs > 0) {
        if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = setTimeout(() => {
          setDimension((prev) =>
            prev.width === width && prev.height === height ? prev : { width, height },
          );
        }, debounceMs);
      } else {
        setDimension((prev) =>
          prev.width === width && prev.height === height ? prev : { width, height },
        );
      }
    },
    [debounceMs],
  );

  const attachRef = useCallback((node: HTMLElement | null) => {
    setElementNode(node);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let resizeObserver: ResizeObserver | null = null;
    const currentWin = elementNode?.ownerDocument?.defaultView ?? window;
    const ResizeObserverClass = currentWin.ResizeObserver ?? window.ResizeObserver;

    const measureElement = () => {
      if (elementNode) {
        const rect = elementNode.getBoundingClientRect();
        const width = rect.width > 0 ? rect.width : elementNode.offsetWidth;
        const height = rect.height > 0 ? rect.height : elementNode.offsetHeight;
        if (width > 0 || height > 0) {
          updateDimension(width, height);
          return;
        }
      }
      updateDimension(currentWin.innerWidth, currentWin.innerHeight);
    };

    if (elementNode && typeof ResizeObserverClass !== "undefined") {
      resizeObserver = new ResizeObserverClass((entries) => {
        for (const entry of entries) {
          const width =
            entry.contentRect.width ||
            entry.borderBoxSize?.[0]?.inlineSize ||
            (entry.target as HTMLElement).offsetWidth ||
            entry.target.getBoundingClientRect().width;
          const height =
            entry.contentRect.height ||
            entry.borderBoxSize?.[0]?.blockSize ||
            (entry.target as HTMLElement).offsetHeight ||
            entry.target.getBoundingClientRect().height;

          if (width > 0 || height > 0) {
            updateDimension(width, height);
          }
        }
      });

      resizeObserver.observe(elementNode);
      if (elementNode.parentElement) {
        resizeObserver.observe(elementNode.parentElement);
      }
    }

    currentWin.addEventListener("resize", measureElement, { passive: true });

    // Measure initially and on next animation frame
    measureElement();
    const frameId = requestAnimationFrame(measureElement);

    return () => {
      currentWin.removeEventListener("resize", measureElement);
      cancelAnimationFrame(frameId);
      if (resizeObserver) resizeObserver.disconnect();
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, [elementNode, updateDimension]);

  const breakpoint = getBreakpointFromWidth(dimension.width);

  return {
    width: dimension.width,
    height: dimension.height,
    breakpoint,
    isXs: breakpoint === "xs",
    isSm: breakpoint === "sm",
    isMd: breakpoint === "md",
    isLg: breakpoint === "lg",
    ref: attachRef,
  };
}
