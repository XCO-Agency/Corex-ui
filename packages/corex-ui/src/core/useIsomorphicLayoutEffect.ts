import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` in the browser, `useEffect` on the server (where layout
 * effects never run and React warns about them). Work that must land on the
 * element before the browser paints, or before the custom element fires its
 * first event, belongs here.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
