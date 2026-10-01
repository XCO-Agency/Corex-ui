import { useState } from "react";
import { IndexFiltersMode } from "./IndexFilters.types";
import type {
  IndexFiltersModeType,
  UseSetIndexFiltersModeResultType,
} from "./IndexFilters.types";

/**
 * v12's hook for `IndexFilters`' default/filtering mode.
 *
 * Nothing in 2.x reads the mode — the filter toolbar has no separate filtering
 * state — but call sites destructure this at the top of a component and pass
 * `mode`/`setMode` down, so without it they cannot compile at all.
 */
export function useSetIndexFiltersMode(
  initial: IndexFiltersModeType | string = IndexFiltersMode.Default,
): UseSetIndexFiltersModeResultType {
  const [mode, setMode] = useState<IndexFiltersModeType | string>(initial);

  return { mode, setMode };
}
