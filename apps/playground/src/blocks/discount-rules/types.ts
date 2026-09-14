export type DiscountType = "percentage" | "fixed_amount";

export type DiscountTierType = {
  id: string;
  minQuantity: number;
  discountValue: number;
  discountType: DiscountType;
  badgeLabel?: string;
  highlighted?: boolean;
};

export type DiscountMethodType = "automatic" | "code";

export type DiscountFormType = {
  title: string;
  code: string;
  method: DiscountMethodType;
  startsAt: string;
  endsAt?: string;
  combinesWithShipping: boolean;
  combinesWithProductDiscounts: boolean;
  tiers: DiscountTierType[];
  appliesTo: "all_products" | "specific_collections";
  selectedCollectionNames: string[];
};
