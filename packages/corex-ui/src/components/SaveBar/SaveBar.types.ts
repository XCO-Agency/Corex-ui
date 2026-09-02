import type { ReactNode } from "react";

export interface SaveBarProps {
  /** Referenced by `useSaveBar().show(id)` / `.hide(id)` — see `docs/app-bridge.md`. */
  id: string;
  /**
   * Shopify's own examples nest plain `<button>` elements here, not
   * Polaris `Button`s, so this wrapper doesn't constrain `children`.
   */
  children?: ReactNode;
  className?: string;
}
