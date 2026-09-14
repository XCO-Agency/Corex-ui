import * as React from "react";
import { Table, Checkbox, Box } from "@xco-agency/corex-ui";
import { ResourceTableRow } from "./ResourceTableRow";
import type { ResourceTablePropsType } from "../types";

export function ResourceTable({
  items,
  selectedIds,
  allSelected,
  indeterminate: _indeterminate,
  onToggleSelectAll,
  onToggleSelectItem,
  onDeleteItem,
  onStatusChange,
}: ResourceTablePropsType) {
  return (
    <Table variant="auto">
      <Table.HeaderRow>
        {/* Master Select All Checkbox */}
        <Table.Header>
          <Box paddingBlock="none">
            <Checkbox
              label=""
              checked={allSelected}
              onChange={onToggleSelectAll}
            />
          </Box>
        </Table.Header>
        <Table.Header listSlot="primary">Resource</Table.Header>
        <Table.Header listSlot="inline">Status</Table.Header>
        <Table.Header format="numeric">Inventory</Table.Header>
        <Table.Header format="currency">Price</Table.Header>
        <Table.Header>Category</Table.Header>
        <Table.Header>Updated</Table.Header>
        <Table.Header>
          <span style={{ display: "block", textAlign: "right" }}>Actions</span>
        </Table.Header>
      </Table.HeaderRow>

      <Table.Body>
        {items.map((item) => (
          <ResourceTableRow
            key={item.id}
            item={item}
            isSelected={selectedIds.has(item.id)}
            onToggleSelect={() => onToggleSelectItem(item.id)}
            onDelete={onDeleteItem ? () => onDeleteItem(item.id) : undefined}
            onStatusChange={
              onStatusChange
                ? (status) => onStatusChange(item.id, status)
                : undefined
            }
          />
        ))}
      </Table.Body>
    </Table>
  );
}
