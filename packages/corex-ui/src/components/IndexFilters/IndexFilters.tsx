import { forwardRef } from "react";
import { childrenText } from "../../core/childrenText";
import { devWarning } from "../../utils/devWarning";
import { Filters } from "../Filters";
import { Tabs } from "../Tabs";
import type { IndexFiltersPropsType } from "./IndexFilters.types";

/**
 * v12's search-and-filter bar, as an adapter over [`Filters`](../Filters).
 *
 * `Filters` already is the admin's filter toolbar — the token pills, the filter
 * popovers, the sort and columns popover. This maps v12's prop names onto it
 * rather than building a second toolbar that would drift from the first.
 *
 * What does not carry over: v12's saved views and the mode state machine behind
 * them (`canCreateNewView`, the default/filtering/editing-columns modes and their
 * cancel and save actions). Those props are accepted so call sites compile, and
 * `useSetIndexFiltersMode` still holds the state.
 */
export const IndexFilters = forwardRef<HTMLDivElement, IndexFiltersPropsType>(
  function IndexFilters(
    {
      tabs = [],
      selected = 0,
      onSelect,
      queryValue = "",
      queryPlaceholder,
      onQueryChange,
      onQueryClear,
      filters = [],
      appliedFilters = [],
      onClearAll,
      sortOptions = [],
      sortSelected = [],
      onSort,
      disabled,
      loading,
      hideFilters,
      hideQueryField,
      trailing,
      mode,
      setMode,
      canCreateNewView,
      cancelAction,
      primaryAction,
      ...rest
    },
    ref,
  ) {
    if (canCreateNewView) {
      devWarning(
        "IndexFilters",
        "Saved views have no 2.x equivalent; `canCreateNewView` and the mode actions are ignored.",
      );
    }
    if (hideQueryField) {
      devWarning(
        "IndexFilters",
        "`hideQueryField` is ignored; the search field is part of the Filters toolbar.",
      );
    }

    return (
      <Filters
        ref={ref}
        tabs={
          tabs.length > 0 ? (
            <Tabs
              compact
              selected={selected}
              tabs={tabs.map((tab) => ({
                id: tab.id,
                label: childrenText(tab.content),
                disabled: tab.isLocked,
              }))}
              onSelect={((index: number) => {
                // v12 tabs could carry their own action as well as the parent's
                // handler, and call sites use both.
                tabs[index]?.onAction?.();
                onSelect?.(index);
              }) as (index: number) => void}
            />
          ) : undefined
        }
        queryValue={queryValue}
        queryPlaceholder={queryPlaceholder}
        onQueryChange={onQueryChange}
        onQueryClear={onQueryClear}
        filters={
          hideFilters
            ? []
            : filters.map((filter) => ({
                key: filter.key,
                label: childrenText(filter.label) || filter.key,
                filter: filter.filter,
                disabled: filter.disabled,
              }))
        }
        appliedFilters={appliedFilters.map((filter) => ({
          key: filter.key,
          label: childrenText(filter.label) || filter.key,
          onRemove: (key: string) => filter.onRemove?.(key),
        }))}
        onClearAll={onClearAll}
        sortOptions={sortOptions.map((option) => ({
          label: option.directionLabel ?? option.label ?? option.value,
          value: option.value,
        }))}
        sortValue={sortSelected[0]}
        onSortChange={(value: string) => onSort?.([value])}
        disabled={disabled || loading}
        actions={trailing}
        {...rest}
      />
    );
  },
);
