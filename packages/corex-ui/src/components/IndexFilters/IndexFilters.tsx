import { forwardRef, ReactNode, useId } from "react";
import { Box } from "../Box";
import { BlockStack } from "../BlockStack";
import { InlineStack } from "../InlineStack";
import { Text } from "../Text";
import { Clickable } from "../Clickable";
import { Icon } from "../Icon";
import { Divider } from "../Divider";
import { Switch } from "../Switch";
import { Select } from "../Select";
import { Popover } from "../Popover";
import { IndexFiltersSearchField } from "./IndexFiltersSearchField";
import type {
  IndexFilterColumnItemType,
  IndexFilterSortOptionType,
  IndexFiltersSearchFieldPropsType,
} from "./IndexFilters.types";
import { Card } from "../Card";
import { Button } from "../Button";

export { IndexFiltersSearchField };

/**
 * Props for the Columns & Sort popover subcomponent.
 */
type IndexFiltersColumnsPopoverPropsType = {
  sortOptions?: IndexFilterSortOptionType[];
  sortValue?: string;
  onSortChange?: (value: string) => void;
  hideArchived?: boolean;
  onHideArchivedChange?: (checked: boolean) => void;
  columns?: IndexFilterColumnItemType[];
  onColumnToggle?: (columnKey: string, visible: boolean) => void;
  disabled?: boolean;
  id?: string;
};

/**
 * Columns visibility & sort settings popover matching Polaris index filters.
 */
function IndexFiltersColumnsPopover({
  sortOptions,
  sortValue,
  onSortChange,
  hideArchived,
  onHideArchivedChange,
  columns,
  onColumnToggle,
  disabled = false,
  id,
}: IndexFiltersColumnsPopoverPropsType) {
  const generatedId = useId();
  const popoverId = id ?? `corex-index-filters-cols-${generatedId.replace(/:/g, "")}`;

  const hasSort = Boolean(sortOptions && sortOptions.length > 0);
  const hasHideArchived = hideArchived !== undefined;
  const hasColumns = Boolean(columns && columns.length > 0);

  return (
    <Popover id={popoverId}>
      <Popover.Trigger>
        <Button
          disabled={disabled}
          icon="layout-columns-3"
          variant="tertiary"
          accessibilityLabel="Columns and sort settings"
        />
      </Popover.Trigger>
      <Popover.Content>
        <Box padding="small-300" minInlineSize="240px">
          <BlockStack gap="small-300">
            {hasSort && sortOptions ? (
              <InlineStack alignItems="center" justifyContent="space-between" gap="base">
                <InlineStack alignItems="center" gap="small-200">
                  <Icon type="sort" tone="neutral" />
                  <Text variant="small" tone="neutral">
                    Sort by
                  </Text>
                </InlineStack>
                <Box minInlineSize="110px">
                  <Select
                    label="Sort by"
                    labelAccessibilityVisibility="exclusive"
                    options={sortOptions}
                    value={sortValue}
                    onChange={(val) => onSortChange?.(val)}
                  />
                </Box>
              </InlineStack>
            ) : null}

            {hasHideArchived ? (
              <InlineStack alignItems="center" justifyContent="space-between" gap="base">
                <InlineStack alignItems="center" gap="small-200">
                  <Icon type="archive" tone="neutral" />
                  <Text variant="small" tone="neutral">
                    Hide archived
                  </Text>
                </InlineStack>
                <Switch
                  checked={hideArchived}
                  accessibilityLabel="Hide archived"
                  onChange={(checked) => onHideArchivedChange?.(checked)}
                />
              </InlineStack>
            ) : null}

            {hasColumns && (hasSort || hasHideArchived) ? <Divider /> : null}

            {hasColumns && columns ? (
              <BlockStack gap="small-300">
                <Text variant="small" tone="neutral">
                  Columns
                </Text>
                <BlockStack gap="small-500">
                  {columns.map((col) => {
                    const isVisible = col.visible !== false;

                    return (
                      <InlineStack
                        key={col.key}
                        alignItems="center"
                        justifyContent="space-between"
                        gap="small-200"
                      >
                        <InlineStack alignItems="center" gap="small-200">
                          <Icon type="drag-handle" tone="neutral" />
                          <Text variant="small" tone="neutral">
                            {col.label}
                          </Text>
                        </InlineStack>

                        <Clickable
                          disabled={col.disabled}
                          background="transparent"
                          padding="small-500"
                          borderRadius="base"
                          accessibilityLabel={`Toggle ${col.label} column visibility`}
                          onClick={() => onColumnToggle?.(col.key, !isVisible)}
                        >
                          <Icon type={isVisible ? "view" : "hide"} tone="neutral" />
                        </Clickable>
                      </InlineStack>
                    );
                  })}
                </BlockStack>
              </BlockStack>
            ) : null}
          </BlockStack>
        </Box>
      </Popover.Content>
    </Popover>
  );
}
IndexFiltersColumnsPopover.displayName = "IndexFiltersColumnsPopover";

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
 * (`<IndexFilters.SearchField />`, `<IndexFilters.Actions>`) or configure it via props.
 */
type IndexFiltersPropsType = IndexFiltersSearchFieldPropsType &
  Omit<IndexFiltersColumnsPopoverPropsType, "id"> & {
    /** Custom actions on the right side (replaces the default columns popover). */
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
  function IndexFilters(
    {
      sortOptions,
      sortValue,
      onSortChange,
      columns,
      onColumnToggle,
      hideArchived,
      onHideArchivedChange,
      actions,
      children,
      id,
      ...searchFieldProps
    },
    ref,
  ) {
    const hasColumnsPopover =
      Boolean(columns?.length) ||
      Boolean(sortOptions?.length) ||
      hideArchived !== undefined;

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
              {actions ??
                (hasColumnsPopover ? (
                  <IndexFiltersActions>
                    <IndexFiltersColumnsPopover
                      sortOptions={sortOptions}
                      sortValue={sortValue}
                      onSortChange={onSortChange}
                      columns={columns}
                      onColumnToggle={onColumnToggle}
                      hideArchived={hideArchived}
                      onHideArchivedChange={onHideArchivedChange}
                      disabled={searchFieldProps.disabled}
                    />
                  </IndexFiltersActions>
                ) : null)}
            </>
          )}
        </InlineStack>
      </Card>
    );
  },
);

export const IndexFilters = Object.assign(IndexFiltersRoot, {
  SearchField: IndexFiltersSearchField,
  Columns: IndexFiltersColumnsPopover,
  Actions: IndexFiltersActions,
});

// Aliases for backwards compatibility
export const Filters = IndexFilters;
