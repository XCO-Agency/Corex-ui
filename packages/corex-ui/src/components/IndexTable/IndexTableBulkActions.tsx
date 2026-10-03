import type { ReactNode } from "react";
import { ActionList } from "../ActionList";
import type { ActionListItemType } from "../ActionList";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { Icon } from "../Icon";
import { InlineStack } from "../InlineStack";
import { Popover, usePopover } from "../Popover";
import { Switch } from "../Switch";
import { Text } from "../Text";
import type { IndexTableBulkActionType, IndexTablePropsType } from "./IndexTable.types";

/** An ActionList that closes the popover it sits in once an item runs. */
function PopoverActionList({ items }: { items: ActionListItemType[] }) {
  const { close } = usePopover();
  return (
    <ActionList
      items={items.map((item) => ({
        ...item,
        onAction: () => {
          close();
          item.onAction?.();
        },
      }))}
    />
  );
}

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

          <Popover>
            <Popover.Trigger>
              <Button variant="tertiary">
                <InlineStack alignItems="center" gap="small-400" wrap={false}>
                  <Text fontWeight="semibold">{selectedLabel}</Text>
                  <Icon type="chevron-down" />
                </InlineStack>
              </Button>
            </Popover.Trigger>
            <Popover.Content>
              <PopoverActionList
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
              />
            </Popover.Content>
          </Popover>

          {visiblePromoted.map((action, index) => (
            <Button
              key={action.id ?? index}
              variant="secondary"
              tone={action.destructive ? "critical" : undefined}
              disabled={action.disabled}
              onClick={action.onAction}
            >
              {action.content}
            </Button>
          ))}

          {menuActions.length > 0 && (
            <Popover>
              <Popover.Trigger>
                <Button
                  variant="secondary"
                  icon="menu-horizontal"
                  accessibilityLabel="More actions"
                />
              </Popover.Trigger>
              <Popover.Content>
                <PopoverActionList items={menuActions.map(toActionListItem)} />
              </Popover.Content>
            </Popover>
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
