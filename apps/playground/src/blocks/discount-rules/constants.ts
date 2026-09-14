import type { DiscountFormType, DiscountTierType } from "./types";

export const DEFAULT_DISCOUNT_TIERS: DiscountTierType[] = [
  {
    id: "tier-1",
    minQuantity: 2,
    discountValue: 10,
    discountType: "percentage",
    badgeLabel: "Save 10%",
  },
  {
    id: "tier-2",
    minQuantity: 3,
    discountValue: 15,
    discountType: "percentage",
    badgeLabel: "Popular",
    highlighted: true,
  },
  {
    id: "tier-3",
    minQuantity: 5,
    discountValue: 25,
    discountType: "percentage",
    badgeLabel: "Best Value",
  },
];

export const INITIAL_DISCOUNT_FORM: DiscountFormType = {
  title: "Tiered Volume Bundle Discount",
  code: "VOLUMEBUNDLE",
  method: "automatic",
  startsAt: "2026-09-01",
  endsAt: "2026-12-31",
  combinesWithShipping: true,
  combinesWithProductDiscounts: false,
  tiers: DEFAULT_DISCOUNT_TIERS,
  appliesTo: "specific_collections",
  selectedCollectionNames: ["Autumn Apparel", "Accessories", "Footwear"],
};
