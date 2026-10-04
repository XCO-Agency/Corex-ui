import { useCallback, useMemo, useState } from "react";
import type {
  IndexTableSelectionTypeType,
  UseIndexResourceStateOptionsType,
  UseIndexResourceStateResultType,
} from "./IndexTable.types";

/**
 * v12's companion hook for `IndexTable`: it owns the selection and hands back the
 * three things the table needs, plus the two helpers list pages use after a bulk
 * action.
 *
 * `page` and `all` are treated alike — selecting the page selects every resource
 * passed in, which is the set the table is rendering.
 */
export function useIndexResourceState<T extends { id?: string | number }>(
  resources: T[],
  {
    resourceIDResolver = (resource: T) => String(resource.id ?? ""),
    selectedResources: initial = [],
    subResourceIDs,
  }: UseIndexResourceStateOptionsType<T> = {},
): UseIndexResourceStateResultType {
  const [selectedResources, setSelectedResources] = useState<string[]>(initial);

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
      selection?: string,
    ) => {
      setSelectedResources((current) => {
        if (selectionType === "single") {
          if (!selection) return current;
          return toggleType
            ? [...new Set([...current, selection])]
            : current.filter((id) => id !== selection);
        }
        return toggleType ? allIds : [];
      });
    },
    [allIds],
  );

  const clearSelection = useCallback(() => setSelectedResources([]), []);

  const removeSelectedResources = useCallback((ids: string[]) => {
    const drop = new Set(ids);
    setSelectedResources((current) => current.filter((id) => !drop.has(id)));
  }, []);

  return {
    selectedResources,
    allResourcesSelected: allIds.length > 0 && selectedResources.length === allIds.length,
    handleSelectionChange,
    clearSelection,
    removeSelectedResources,
  };
}
