import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * `false` on the server and during hydration, `true` from the render right
 * after (and on every client-only render). Gate anything the server can't
 * reproduce — the current date, the viewport — behind it so the hydrating
 * render matches the server HTML.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
