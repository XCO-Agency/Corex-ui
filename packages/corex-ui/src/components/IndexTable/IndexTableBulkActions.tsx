import type { ReactNode } from "react";
import { ActionList } from "../ActionList";
import type { ActionListItemType } from "../ActionList";
import { Checkbox } from "../Checkbox";
import { Icon } from "../Icon";
import { InlineStack } from "../InlineStack";
import { Switch } from "../Switch";

import type { IndexTableBulkActionType } from "./IndexTable.types";
import type { SelectionStateType } from "./indexTableSelection";
import { Clickable } from "../Clickable";
import { Text } from "../Text";
import { IconTile } from "../IconTile";

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
  /** Every resource across every page is selected. */
  allSelected: boolean;
  /** How much of the rows on screen is selected. */
  pageSelectionState: SelectionStateType;
  /** Selects the rows on screen, keeping selections made on other pages. */
  onSelectPage: () => void;
  /** Selects every resource across every page. */
  onSelectAll: () => void;
  /** Clears the whole selection, on every page. */
  onDeselectAll: () => void;
  promotedBulkActions: IndexTableBulkActionType[];
  bulkActions: IndexTableBulkActionType[];
  showAllSelectedToggle: boolean;
  showSelectedOnly: boolean;
  onShowSelectedOnlyChange: (value: boolean) => void;
  /** Narrow container: promoted actions fold into the "more" menu. */
  compact: boolean;
};

const ActionButton = ({
  children,
  onAction,
  iconOnly,
  ...rest
}: { children: ReactNode; iconOnly?: boolean } & Omit<
  IndexTableBulkActionType,
  "content" | "icon"
>) => {
  return (
    <Clickable
      background="strong"
      borderRadius="large-200"
      paddingInline={iconOnly ? "small-400" : "small-300"}
      blockSize="24px"
      inlineSize={iconOnly ? "24px" : undefined}
      onClick={onAction}
      {...rest}
    >
      {children}
    </Clickable>
  );
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
  pageSelectionState,
  onSelectPage,
  onSelectAll,
  onDeselectAll,
  promotedBulkActions,
  bulkActions,
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
          {/* Checked when the whole page is selected, indeterminate otherwise;
              clicking always clears the selection. */}
          <Checkbox
            label="Deselect all"
            labelAccessibilityVisibility="exclusive"
            checked={pageSelectionState === "all"}
            indeterminate={pageSelectionState !== "all"}
            onChange={onDeselectAll}
          />

          <ActionList
            items={[
              {
                content: `Select all ${itemCount} ${plural}`,
                disabled: allSelected,
                onAction: onSelectAll,
              },
              {
                content: "Select page",
                disabled: pageSelectionState === "all",
                onAction: onSelectPage,
              },
              {
                content: "Deselect all",
                onAction: onDeselectAll,
              },
            ]}
          >
            <ActionButton>
              <InlineStack alignItems="center" gap="small-300">
                <Text variant="small" fontWeight="medium">
                  {selectedLabel}
                </Text>
                <Icon type="chevron-down" size="small" />
              </InlineStack>
            </ActionButton>
          </ActionList>

          {visiblePromoted.map((action, index) => (
            <ActionButton
              key={action.id ?? index}
              disabled={action.disabled}
              loading={action.loading}
              onAction={action.onAction}
            >
              <Text variant="small" fontWeight="medium">
                {action.content}
              </Text>
            </ActionButton>
            // <Button
            //   key={action.id ?? index}
            //   variant={action.destructive ? "primary" : "secondary"}
            //   tone={action.destructive ? "critical" : undefined}
            //   disabled={action.disabled}
            //   onClick={action.onAction}
            // >
            //   {action.content}
            // </Button>
          ))}

          {menuActions.length > 0 && (
            <ActionList items={menuActions.map(toActionListItem)}>
              <ActionButton iconOnly>
                <InlineStack alignItems="center" justifyContent="center" gap="small-300">
                  <Icon type="menu-horizontal" size="small" />
                </InlineStack>
              </ActionButton>
            </ActionList>
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
