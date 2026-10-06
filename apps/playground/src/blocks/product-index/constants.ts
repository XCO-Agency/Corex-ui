import type {
  IndexFilterItemType,
  IndexFilterSortOptionType,
  TabItemType,
} from "@xco-agency/corex-ui";
import type {
  ProductIndexColumnType,
  ProductIndexItemType,
  ProductIndexSortType,
  ProductIndexStatusTabIdType,
} from "./types";
import productsJson from "./products.json";

export const PRODUCT_INDEX_PAGE_SIZE = 50;

/** 100 mock products; replace with your own data source. */
export const MOCK_PRODUCTS = productsJson as ProductIndexItemType[];

export const PRODUCT_INDEX_STATUS_TABS: TabItemType<ProductIndexStatusTabIdType>[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "draft", label: "Draft" },
  { id: "archived", label: "Archived" },
];

const OPERATORS = [
  { label: "Is", value: "is" },
  { label: "Is not", value: "is_not" },
];

const optionsFrom = (values: string[]) =>
  [...new Set(values)].sort().map((value) => ({ label: value, value }));

export const PRODUCT_INDEX_FILTERS: IndexFilterItemType[] = [
  {
    key: "status",
    label: "Status",
    allowMultiple: false,
    operators: OPERATORS,
    options: [
      { label: "Active", value: "active" },
      { label: "Draft", value: "draft" },
      { label: "Archived", value: "archived" },
    ],
  },
  {
    key: "vendor",
    label: "Vendor",
    operators: OPERATORS,
    options: optionsFrom(MOCK_PRODUCTS.map((product) => product.vendor)),
  },
  {
    key: "category",
    label: "Category",
    operators: OPERATORS,
    options: optionsFrom(MOCK_PRODUCTS.map((product) => product.category)),
  },
  {
    key: "tag",
    label: "Tag",
    operators: OPERATORS,
    options: optionsFrom(MOCK_PRODUCTS.flatMap((product) => product.tags)),
  },
];

export const PRODUCT_INDEX_SORT_OPTIONS: IndexFilterSortOptionType[] = [
  { label: "Updated", value: "updatedAt" },
  { label: "Product title", value: "title" },
  { label: "Inventory", value: "inventory" },
  { label: "Price", value: "price" },
];

export const DEFAULT_PRODUCT_INDEX_SORT: ProductIndexSortType = {
  key: "updatedAt",
  direction: "descending",
};

export const PRODUCT_INDEX_COLUMNS: ProductIndexColumnType[] = [
  // The product column stays first and can't be hidden.
  {
    key: "product",
    label: "Product",
    reorderable: false,
    hideable: false,
    minWidth: 260,
    sticky: "left",
  },
  { key: "status", label: "Status", minWidth: 110 },
  { key: "inventory", label: "Inventory", minWidth: 170 },
  { key: "category", label: "Category", minWidth: 130 },
  { key: "vendor", label: "Vendor", minWidth: 140 },
  { key: "productType", label: "Type", minWidth: 120, visible: false },
  { key: "channels", label: "Channels", minWidth: 100, alignment: "center" },
  { key: "price", label: "Price", minWidth: 100, alignment: "end" },
  { key: "updatedAt", label: "Updated", minWidth: 120, visible: false },
];
