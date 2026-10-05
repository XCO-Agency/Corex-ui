import type { ReactNode } from "react";
import { ActionList } from "../ActionList";
import type { ActionListItemType } from "../ActionList";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { Icon } from "../Icon";
import { InlineStack } from "../InlineStack";
import { Switch } from "../Switch";

import type { IndexTableBulkActionType, IndexTablePropsType } from "./IndexTable.types";
import { Clickable } from "../Clickable";

function toActionListItem(action: IndexTableBulkActionType): ActionListItemType {
  return {
    content: action.content,
    destructive: action.destructive,
    disabled: action.disabled,
    // Bulk actions take any icon name; ActionList narrows it to the known set.
    icon: action.icon as ActionListItemType["icon"],
    onAction: action.onAction,
  };
}

export type IndexTableBulkActionsPropsType = {
  selectedLabel: ReactNode;
  itemCount: number;
  plural: string;
  allSelected: boolean;
  promotedBulkActions: IndexTableBulkActionType[];
  bulkActions: IndexTableBulkActionType[];
  onSelectionChange?: IndexTablePropsType["onSelectionChange"];
  showAllSelectedToggle: boolean;
  showSelectedOnly: boolean;
  onShowSelectedOnlyChange: (value: boolean) => void;
  /** Narrow container: promoted actions fold into the "more" menu. */
  compact: boolean;
};

/**
 * Replaces the header row while rows are selected: selection checkbox and
 * count menu, promoted actions, an overflow menu, and the "show all selected"
 * toggle — the layout of Shopify admin's resource index bulk bar.
 */
export function IndexTableBulkActions({
  selectedLabel,
  itemCount,
  plural,
  allSelected,
  promotedBulkActions,
  bulkActions,
  onSelectionChange,
  showAllSelectedToggle,
  showSelectedOnly,
  onShowSelectedOnlyChange,
  compact,
}: IndexTableBulkActionsPropsType) {
  const visiblePromoted = compact ? [] : promotedBulkActions;
  const menuActions = compact ? [...promotedBulkActions, ...bulkActions] : bulkActions;

  return (
    <div role="toolbar" aria-label="Bulk actions" className="cx-it__bulk">
      <InlineStack
        alignItems="center"
        justifyContent="space-between"
        gap="small-200"
        inlineSize="100%"
      >
        <InlineStack alignItems="center" gap="small-200" wrap={false}>
          {/* Any selection is shown as checked or indeterminate; clicking clears it. */}
          <Checkbox
            label="Deselect all"
            labelAccessibilityVisibility="exclusive"
            checked={allSelected}
            indeterminate={!allSelected}
            onChange={() => onSelectionChange?.("page", false)}
          />

          <ActionList
            items={[
              {
                content: `Select all ${itemCount} ${plural}`,
                onAction: () => onSelectionChange?.("all", true),
              },
              {
                content: "Select page",
                onAction: () => onSelectionChange?.("page", true),
              },
              {
                content: "Deselect all",
                onAction: () => onSelectionChange?.("page", false),
              },
            ]}
          >
            <Clickable background="strong" borderRadius="large-200" blockSize="28px">
              <InlineStack alignItems="center" gap="small-300">
                {selectedLabel}
                <Icon type="chevron-down" size="small" />
              </InlineStack>
            </Clickable>
          </ActionList>

          {visiblePromoted.map((action, index) => (
            <Button
              key={action.id ?? index}
              variant={action.destructive ? "primary" : "secondary"}
              tone={action.destructive ? "critical" : undefined}
              disabled={action.disabled}
              onClick={action.onAction}
            >
              {action.content}
            </Button>
          ))}

          {menuActions.length > 0 && (
            <ActionList items={menuActions.map(toActionListItem)} />
          )}
        </InlineStack>

        {showAllSelectedToggle && !compact && (
          <Switch
            label="Show all selected"
            checked={showSelectedOnly}
            onChange={onShowSelectedOnlyChange}
          />
        )}
      </InlineStack>
    </div>
  );
}
