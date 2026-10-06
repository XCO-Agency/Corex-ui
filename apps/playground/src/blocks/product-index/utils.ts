import type { IndexSavedFilterType } from "@xco-agency/corex-ui";
import type {
  ProductIndexFilterKeyType,
  ProductIndexFilterValueType,
  ProductIndexItemType,
  ProductIndexOperatorType,
  ProductIndexSortType,
} from "./types";

const valuesOf = (value: string | string[]) =>
  (Array.isArray(value) ? value : [value]).filter(Boolean);

/** Product fields each filter key matches against. */
const fieldValues: Record<
  ProductIndexFilterKeyType,
  (product: ProductIndexItemType) => string[]
> = {
  status: (product) => [product.status],
  vendor: (product) => [product.vendor],
  category: (product) => [product.category],
  tag: (product) => product.tags,
};

/** Normalizes "is not" / "is_not" style operators coming from the search field. */
export const toOperator = (operator?: string): ProductIndexOperatorType =>
  operator
    ?.trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_") === "is_not"
    ? "is_not"
    : "is";

export function matchesFilters(
  product: ProductIndexItemType,
  query: string,
  filters: ProductIndexFilterValueType[],
) {
  const q = query.trim().toLowerCase();
  if (q) {
    const haystack = [
      product.title,
      product.vendor,
      product.productType,
      ...product.tags,
    ];
    if (!haystack.some((text) => text.toLowerCase().includes(q))) return false;
  }

  return filters.every((filter) => {
    const wanted = valuesOf(filter.value);
    // A pill without a value doesn't filter anything yet.
    if (wanted.length === 0) return true;
    const actual = fieldValues[filter.key](product);
    const matches = wanted.some((value) => actual.includes(value));
    return filter.operator === "is_not" ? !matches : matches;
  });
}

export function sortProducts(
  products: ProductIndexItemType[],
  sort: ProductIndexSortType,
) {
  const factor = sort.direction === "ascending" ? 1 : -1;
  return [...products].sort((a, b) => {
    const left = a[sort.key];
    const right = b[sort.key];
    const result =
      typeof left === "number" && typeof right === "number"
        ? left - right
        : String(left).localeCompare(String(right));
    return result * factor;
  });
}

/** Converts the snapshot from `onSaveView` back into filter state. */
export const fromSavedFilters = (
  filters: IndexSavedFilterType[],
): ProductIndexFilterValueType[] =>
  filters.map((filter) => ({
    key: filter.key as ProductIndexFilterKeyType,
    operator: toOperator(filter.operator),
    value: filter.value ?? [],
  }));

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
