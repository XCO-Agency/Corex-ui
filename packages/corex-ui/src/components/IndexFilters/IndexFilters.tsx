import { forwardRef, ReactNode } from "react";
import { InlineStack } from "../InlineStack";
import { Card } from "../Card";
import { IndexFiltersSearchField } from "./IndexFiltersSearchField";
import {
  IndexFiltersViewOptions,
  IndexFiltersViewOptionsColumns,
  IndexFiltersViewOptionsSort,
  IndexFiltersViewOptionsToggles,
} from "./IndexFiltersViewOptions";
import type { IndexFiltersSearchFieldPropsType } from "./IndexFilters.types";

export {
  IndexFiltersSearchField,
  IndexFiltersViewOptions,
  IndexFiltersViewOptionsColumns,
  IndexFiltersViewOptionsSort,
  IndexFiltersViewOptionsToggles,
};

/**
 * Right-side actions container.
 */
export function IndexFiltersActions({ children }: { children?: ReactNode }) {
  return (
    <InlineStack alignItems="center" paddingBlockEnd="small-400">
      {children}
    </InlineStack>
  );
}
IndexFiltersActions.displayName = "IndexFiltersActions";

/**
 * Props for the IndexFilters toolbar. Either compose it with `children`
 * (`<IndexFilters.SearchField />`, `<IndexFilters.Actions>`) or configure the
 * search field via props and pass right-side content through `actions`.
 */
type IndexFiltersPropsType = IndexFiltersSearchFieldPropsType & {
  /** Content on the right side, e.g. `<IndexFilters.ViewOptions>`. */
  actions?: ReactNode;
  /** Composable toolbar elements (e.g. <IndexFilters.SearchField />, <IndexFilters.Actions>). */
  children?: ReactNode;
};
/**
 * IndexFilters toolbar: unified search/filter field on the left, actions on the right.
 * Use it composably (<IndexFilters><IndexFilters.SearchField /><IndexFilters.Actions>...</IndexFilters.Actions></IndexFilters>)
 * or declaratively via props.
 */
const IndexFiltersRoot = forwardRef<HTMLDivElement, IndexFiltersPropsType>(
  function IndexFilters({ actions, children, id, ...searchFieldProps }, ref) {
    return (
      <Card padding="none">
        <InlineStack
          ref={ref}
          id={id}
          alignItems="center"
          justifyContent="space-between"
          gap="small-200"
          wrap={false}
          inlineSize="100%"
        >
          {children ?? (
            <>
              <IndexFiltersSearchField {...searchFieldProps} />
              {actions ? <IndexFiltersActions>{actions}</IndexFiltersActions> : null}
            </>
          )}
        </InlineStack>
      </Card>
    );
  },
);

export const IndexFilters = Object.assign(IndexFiltersRoot, {
  SearchField: IndexFiltersSearchField,
  Actions: IndexFiltersActions,
  ViewOptions: IndexFiltersViewOptions,
  ViewOptionsSort: IndexFiltersViewOptionsSort,
  ViewOptionsToggles: IndexFiltersViewOptionsToggles,
  ViewOptionsColumns: IndexFiltersViewOptionsColumns,
});

// Aliases for backwards compatibility
export const Filters = IndexFilters;
