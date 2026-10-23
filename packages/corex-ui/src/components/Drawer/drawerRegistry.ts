import type { DrawerOpenChangeReasonType } from "./Drawer.types";

/**
 * In-memory registry of every mounted drawer, so code anywhere (another
 * component, a store, a fetch callback) can open or close them — by `id`, or
 * the topmost open one when no id is given. Module state, not `window`
 * events: it works the same inside iframes and on the server.
 */

type CommandType = { type: "open" | "close" | "toggle"; reason: DrawerOpenChangeReasonType };
type HandlerType = (command: CommandType) => void;
type EntryType = { key: string; id: string | undefined; handler: HandlerType; open: boolean };

const entries = new Map<string, EntryType>();
// Keys of open drawers, oldest first: the last one is the topmost.
const openStack: string[] = [];
const listeners = new Set<() => void>();
let version = 0;

function notify() {
  version += 1;
  for (const listener of listeners) listener();
}

function removeFromStack(key: string) {
  const index = openStack.lastIndexOf(key);
  if (index !== -1) openStack.splice(index, 1);
}

/**
 * Called by every mounted `<Drawer>` with a unique `key`; `id` is the public
 * one from props, if any. Returns the unregister function.
 */
export function registerDrawer(key: string, id: string | undefined, handler: HandlerType): () => void {
  entries.set(key, { key, id, handler, open: entries.get(key)?.open ?? false });
  notify();
  return () => {
    entries.delete(key);
    removeFromStack(key);
    notify();
  };
}

/** Called by a mounted `<Drawer>` whenever its open state changes. */
export function setDrawerOpenState(key: string, open: boolean) {
  const entry = entries.get(key);
  if (!entry || entry.open === open) return;
  entry.open = open;
  removeFromStack(key);
  if (open) openStack.push(key);
  notify();
}

function targets(id: string | undefined): EntryType[] {
  if (id !== undefined) return [...entries.values()].filter((entry) => entry.id === id);
  const top = openStack[openStack.length - 1];
  const entry = top !== undefined ? entries.get(top) : undefined;
  return entry ? [entry] : [];
}

function send(id: string | undefined, type: CommandType["type"]): boolean {
  const found = targets(id);
  for (const entry of found) entry.handler({ type, reason: "imperative" });
  return found.length > 0;
}

/** Opens the drawer rendered with `id`. Returns `false` when none is mounted. */
export function openDrawer(id: string): boolean {
  return send(id, "open");
}

/**
 * Closes the drawer rendered with `id`, or — without an id — the topmost open
 * drawer. Returns `false` when there was nothing to close.
 */
export function closeDrawer(id?: string): boolean {
  return send(id, "close");
}

/** Toggles the drawer rendered with `id`. Returns `false` when none is mounted. */
export function toggleDrawer(id: string): boolean {
  return send(id, "toggle");
}

/** Closes every open drawer, innermost first. */
export function closeAllDrawers() {
  for (const key of [...openStack].reverse()) {
    entries.get(key)?.handler({ type: "close", reason: "imperative" });
  }
}

/** Whether the drawer with `id` is open — or, without an id, whether any drawer is. */
export function isDrawerOpen(id?: string): boolean {
  if (id === undefined) return openStack.length > 0;
  return [...entries.values()].some((entry) => entry.id === id && entry.open);
}

export function subscribeDrawers(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Changes whenever any drawer registers, unregisters, opens or closes. */
export function getDrawersVersion(): number {
  return version;
}
