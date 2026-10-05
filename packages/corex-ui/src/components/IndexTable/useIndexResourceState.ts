import { useCallback, useMemo, useState } from "react";
import type {
  IndexTableSelectionTypeType,
  UseIndexResourceStateOptionsType,
  UseIndexResourceStateResultType,
} from "./IndexTable.types";

type SelectionType = {
  ids: string[];
  /** Set by "Select all": every resource, including ones not passed in. */
  all: boolean;
};

/**
 * v12's companion hook for `IndexTable`: it owns the selection and hands back the
 * three things the table needs, plus the two helpers list pages use after a bulk
 * action.
 *
 * - `single` toggles one id.
 * - `page` toggles the ids the table is showing (its `pageIds` argument) and
 *   keeps selections made on other pages. Called without `pageIds`, it falls
 *   back to every resource passed in.
 * - `all` selects every resource across every page, or clears everything.
 *
 * `allResourcesSelected` stays true after "Select all" even when the resources
 * passed in are only the current page (server-side pagination), so the table
 * can show "All N selected"; any deselection turns it off.
 */
export function useIndexResourceState<T extends { id?: string | number }>(
  resources: T[],
  {
    resourceIDResolver = (resource: T) => String(resource.id ?? ""),
    selectedResources: initial = [],
    subResourceIDs,
  }: UseIndexResourceStateOptionsType<T> = {},
): UseIndexResourceStateResultType {
  const [selection, setSelection] = useState<SelectionType>({ ids: initial, all: false });

  const allIds = useMemo(
    () =>
      resources.flatMap((resource) => [
        resourceIDResolver(resource),
        ...(subResourceIDs?.(resource) ?? []),
      ]),
    // The resolver is usually an inline arrow, so depending on it would rebuild
    // this on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resources],
  );

  const handleSelectionChange = useCallback(
    (
      selectionType: IndexTableSelectionTypeType,
      toggleType: boolean,
      id?: string,
      pageIds?: string[],
    ) => {
      setSelection((current) => {
        if (selectionType === "all") {
          return toggleType ? { ids: allIds, all: true } : { ids: [], all: false };
        }

        const changed =
          selectionType === "single" ? (id ? [id] : []) : (pageIds ?? allIds);
        if (changed.length === 0) return current;

        if (toggleType) {
          return { ids: [...new Set([...current.ids, ...changed])], all: current.all };
        }
        const drop = new Set(changed);
        return { ids: current.ids.filter((selected) => !drop.has(selected)), all: false };
      });
    },
    [allIds],
  );

  const clearSelection = useCallback(() => setSelection({ ids: [], all: false }), []);

  const removeSelectedResources = useCallback((ids: string[]) => {
    const drop = new Set(ids);
    setSelection((current) => ({
      ids: current.ids.filter((id) => !drop.has(id)),
      all: false,
    }));
  }, []);

  const allResourcesSelected = useMemo(() => {
    if (selection.all) return true;
    const selected = new Set(selection.ids);
    return allIds.length > 0 && allIds.every((id) => selected.has(id));
  }, [selection, allIds]);

  return {
    selectedResources: selection.ids,
    allResourcesSelected,
    handleSelectionChange,
    clearSelection,
    removeSelectedResources,
  };
}
