import { Button, IndexFilters, Tabs } from "@xco-agency/corex-ui";
import type { IndexAppliedFilterType } from "@xco-agency/corex-ui";
import { toOperator } from "../utils";
import type {
  ProductIndexFilterKeyType,
  ProductIndexFilterValueType,
  ProductIndexFiltersPropsType,
  ProductIndexSortKeyType,
} from "../types";

/**
 * IndexFilters toolbar: view tabs, search with filter pills, view options
 * (sort, hide archived, columns) and actions. "Save" is built into
 * IndexFilters; Export expands next to it only while filters are active.
 */
export function ProductIndexFilters({
  tabs,
  selectedTab,
  onSelectTab,
  query,
  onQueryChange,
  filterDefinitions,
  appliedFilters,
  onAppliedFiltersChange,
  onClearAll,
  sortOptions,
  sort,
  onSortChange,
  hideArchived,
  onHideArchivedChange,
  columns,
  onColumnsChange,
  existingViewNames,
  onSaveView,
  onDeleteView,
  onExport,
  onRefresh,
  refreshing,
}: ProductIndexFiltersPropsType) {
  const removeFilter = (key: string) =>
    onAppliedFiltersChange(appliedFilters.filter((filter) => filter.key !== key));

  const pills: IndexAppliedFilterType[] = appliedFilters.map((filter) => ({
    key: filter.key,
    field: filterDefinitions.find((def) => def.key === filter.key)?.label,
    operator: filter.operator,
    value: filter.value,
    onRemove: removeFilter,
  }));

  const handleAddFilter = (key: string, index: number) => {
    if (appliedFilters.some((filter) => filter.key === key)) return;
    const def = filterDefinitions.find((item) => item.key === key);
    const next = [...appliedFilters];
    // Insert the pill where the caret was when the filter was picked.
    next.splice(index, 0, {
      key: key as ProductIndexFilterKeyType,
      operator: toOperator(def?.defaultOperator),
      value: def?.allowMultiple === false ? "" : [],
    });
    onAppliedFiltersChange(next);
  };

  const handleFilterSelect = (
    key: string,
    value: string | string[],
    operator?: string,
  ) => {
    const isEmpty = Array.isArray(value) ? value.length === 0 : !value;
    if (isEmpty) {
      removeFilter(key);
      return;
    }
    const updated: ProductIndexFilterValueType = {
      key: key as ProductIndexFilterKeyType,
      operator: toOperator(operator),
      value,
    };
    const exists = appliedFilters.some((filter) => filter.key === key);
    onAppliedFiltersChange(
      exists
        ? appliedFilters.map((filter) => (filter.key === key ? updated : filter))
        : [...appliedFilters, updated],
    );
  };

  const handleOperatorChange = (key: string, operator: string) =>
    onAppliedFiltersChange(
      appliedFilters.map((filter) =>
        filter.key === key ? { ...filter, operator: toOperator(operator) } : filter,
      ),
    );

  const handleSortKeyChange = (key: string) =>
    onSortChange({
      key: key as ProductIndexSortKeyType,
      direction: key === "title" ? "ascending" : "descending",
    });

  return (
    <IndexFilters
      onSaveView={onSaveView}
      saveAction={{
        modalTitle: "Save as new view",
        namePlaceholder: "e.g. Low stock clothing",
        validateName: (name) =>
          existingViewNames.some(
            (existing) => existing.toLowerCase() === name.toLowerCase(),
          )
            ? "A view with this name already exists"
            : undefined,
      }}
    >
      <IndexFilters.SearchField
        tabs={
          <Tabs
            tabs={tabs}
            selected={selectedTab}
            onSelect={(tabId: string | number) => onSelectTab(String(tabId))}
            compact
          />
        }
        queryValue={query}
        queryPlaceholder="Search products, vendors, tags"
        onQueryChange={onQueryChange}
        onQueryClear={() => onQueryChange("")}
        filters={filterDefinitions}
        appliedFilters={pills}
        onAddFilter={handleAddFilter}
        onFilterSelect={handleFilterSelect}
        onOperatorChange={handleOperatorChange}
        onClearAll={onClearAll}
      />

      <IndexFilters.Actions>
        {/* Delete is only relevant while a saved view is selected. */}
        <IndexFilters.ViewVisibleActiveFilter visible={Boolean(onDeleteView)}>
          <Button variant="tertiary" tone="critical" onClick={onDeleteView}>
            Delete view
          </Button>
        </IndexFilters.ViewVisibleActiveFilter>

        {/* Shown only while a search or filter is active. */}
        <IndexFilters.ViewVisibleActiveFilter>
          <Button variant="tertiary" icon="export" onClick={onExport}>
            Export
          </Button>
        </IndexFilters.ViewVisibleActiveFilter>

        <IndexFilters.ViewOptions>
          <IndexFilters.ViewOptionsSort
            options={sortOptions}
            value={sort.key}
            onChange={handleSortKeyChange}
          />
          <IndexFilters.ViewOptionsToggles
            items={[
              {
                key: "hideArchived",
                label: "Hide archived",
                icon: "archive",
                checked: hideArchived,
                onChange: onHideArchivedChange,
              },
            ]}
          />
          <IndexFilters.ViewOptionsColumns columns={columns} onChange={onColumnsChange} />
        </IndexFilters.ViewOptions>

        <Button
          variant="tertiary"
          icon="refresh"
          accessibilityLabel="Refresh products"
          loading={refreshing}
          onClick={onRefresh}
        />
      </IndexFilters.Actions>
    </IndexFilters>
  );
}
