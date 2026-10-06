import { createContext, useContext } from "react";
import type { IndexAppliedFilterType } from "./IndexFilters.types";

/** Search field state reported to the `IndexFilters` root. */
export type IndexFiltersFieldStateType = {
  query: string;
  appliedFilters: IndexAppliedFilterType[];
};

export type IndexFiltersContextType = {
  /** Whether a search query or a filter with a value is applied. */
  active: boolean;
  /** Called by the search field whenever its query or applied filters change. */
  reportFieldState: (state: IndexFiltersFieldStateType) => void;
  /** Whether the built-in save action is enabled. */
  saveEnabled: boolean;
  /** Whether the built-in save action is rendered but disabled. */
  saveDisabled: boolean;
  /** Label of the built-in save button. */
  saveLabel: string;
  /** Opens the "save view" modal. */
  openSaveModal: () => void;
  /** Registers an `IndexFilters.Actions` container; returns the unregister function. */
  registerActions: (id: string) => () => void;
  /** Registers an explicitly placed `IndexFilters.SaveAction`; returns the unregister function. */
  registerSaveAction: (id: string) => () => void;
  /** Id of the `IndexFilters.Actions` that renders the built-in save action, if any. */
  autoSaveOwnerId: string | null;
};

export const IndexFiltersContext = createContext<IndexFiltersContextType | null>(null);

export function useIndexFiltersContext() {
  return useContext(IndexFiltersContext);
}

/** A filter with a non-empty value, or a non-blank query, makes the toolbar active. */
export function isFieldStateActive({ query, appliedFilters }: IndexFiltersFieldStateType) {
  if (query.trim().length > 0) return true;
  return appliedFilters.some(({ value }) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value),
  );
}
