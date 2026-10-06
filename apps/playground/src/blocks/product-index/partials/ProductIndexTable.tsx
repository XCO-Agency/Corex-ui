import type { ReactNode } from "react";
import { Badge, IndexTable, InlineStack, Text, Thumbnail } from "@xco-agency/corex-ui";
import type { IndexTableHeadingType } from "@xco-agency/corex-ui";
import { formatDate, formatPrice } from "../utils";
import type {
  ProductIndexColumnKeyType,
  ProductIndexItemType,
  ProductIndexSortKeyType,
  ProductIndexStatusType,
  ProductIndexTablePropsType,
} from "../types";

const STATUS_TONES: Record<ProductIndexStatusType, "success" | "info" | "neutral"> = {
  active: "success",
  draft: "info",
  archived: "neutral",
};

const STATUS_LABELS: Record<ProductIndexStatusType, string> = {
  active: "Active",
  draft: "Draft",
  archived: "Archived",
};

/** Columns that sort the table when their heading is clicked. */
const SORT_KEY_BY_COLUMN: Partial<
  Record<ProductIndexColumnKeyType, ProductIndexSortKeyType>
> = {
  product: "title",
  inventory: "inventory",
  price: "price",
  updatedAt: "updatedAt",
};

/** Cell content per column key; the columns list only sets order and visibility. */
const renderCell: Record<
  ProductIndexColumnKeyType,
  (product: ProductIndexItemType) => ReactNode
> = {
  product: (product) => (
    <InlineStack gap="small-200" alignItems="center" wrap={false}>
      <Thumbnail
        source={product.imageUrl ?? undefined}
        alt={product.title}
        size="small"
      />
      <Text heading>{product.title}</Text>
    </InlineStack>
  ),
  status: (product) => (
    <Badge tone={STATUS_TONES[product.status]}>{STATUS_LABELS[product.status]}</Badge>
  ),
  inventory: (product) => (
    <Text tone={product.inventory === 0 ? "critical" : undefined} color="subdued">
      {product.inventory === 0
        ? "Out of stock"
        : `${product.inventory} in stock for ${product.variants} variant${product.variants === 1 ? "" : "s"}`}
    </Text>
  ),
  category: (product) => <Text>{product.category}</Text>,
  vendor: (product) => <Text>{product.vendor}</Text>,
  productType: (product) => <Text>{product.productType}</Text>,
  channels: (product) => <Text>{product.channels}</Text>,
  price: (product) => <Text>{formatPrice(product.price)}</Text>,
  updatedAt: (product) => <Text color="subdued">{formatDate(product.updatedAt)}</Text>,
};

/**
 * Products IndexTable: visible columns follow the IndexFilters column settings,
 * with selection, bulk actions, sortable headings and pagination.
 */
export function ProductIndexTable({
  products,
  totalCount,
  columns,
  selectedIds,
  allSelected,
  onSelectionChange,
  sort,
  onSortChange,
  page,
  pageCount,
  pageSize,
  onPageChange,
  onBulkStatusChange,
  onBulkDelete,
  onOpenProduct,
  emptyState,
  loading,
}: ProductIndexTablePropsType) {
  const visibleColumns = columns.filter((column) => column.visible !== false);

  const headings: IndexTableHeadingType[] = visibleColumns.map((column) => {
    const sortKey = SORT_KEY_BY_COLUMN[column.key];
    return {
      id: column.key,
      title: column.label,
      minWidth: column.minWidth,
      alignment: column.alignment,
      sortable: Boolean(sortKey),
      defaultSortDirection: sortKey === "title" ? "ascending" : "descending",
    };
  });

  const sortColumnIndex = visibleColumns.findIndex(
    (column) => SORT_KEY_BY_COLUMN[column.key] === sort.key,
  );

  const handleSort = (columnIndex: number, direction: "ascending" | "descending") => {
    const key = SORT_KEY_BY_COLUMN[visibleColumns[columnIndex]!.key];
    if (key) onSortChange({ key, direction });
  };

  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <IndexTable
      resourceName={{ singular: "product", plural: "products" }}
      // Pin the header under the page title bar while the page scrolls.
      stickyHeader={52}
      itemCount={totalCount}
      selectedItemsCount={allSelected ? "All" : selectedIds.length}
      onSelectionChange={onSelectionChange}
      headings={headings}
      sortColumnIndex={sortColumnIndex >= 0 ? sortColumnIndex : undefined}
      sortDirection={sort.direction}
      onSort={handleSort}
      loading={loading}
      emptyState={emptyState}
      promotedBulkActions={[
        { content: "Set as active", onAction: () => onBulkStatusChange("active") },
        { content: "Set as draft", onAction: () => onBulkStatusChange("draft") },
      ]}
      bulkActions={[
        { content: "Archive products", onAction: () => onBulkStatusChange("archived") },
        { content: "Delete products", destructive: true, onAction: onBulkDelete },
      ]}
      pagination={{
        floating: true,
        hasPrevious: page > 1,
        hasNext: page < pageCount,
        label: `${start}–${end} of ${totalCount}`,
        onPrevious: () => onPageChange(page - 1),
        onNext: () => onPageChange(page + 1),
      }}
    >
      {products.map((product) => (
        <IndexTable.Row
          key={product.id}
          id={product.id}
          selected={selectedIds.includes(product.id)}
          onClick={() => onOpenProduct(product)}
        >
          {visibleColumns.map((column) => (
            <IndexTable.Cell
              key={column.key}
              alignment={column.alignment}
              {...(column.sticky ? { sticky: column.sticky } : {})}
            >
              {renderCell[column.key](product)}
            </IndexTable.Cell>
          ))}
        </IndexTable.Row>
      ))}
    </IndexTable>
  );
}
