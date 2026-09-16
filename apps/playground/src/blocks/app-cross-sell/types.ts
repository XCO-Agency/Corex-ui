export type AppCrossSellItemType = {
  id: string;
  name: string;
  category?: string;
  installed: boolean;
  iconBg?: string;
  iconType?: string;
  logoUrl?: string;
  unlockDiscountText?: string;
  appUrl?: string;
  rating?: number;
  reviewsCount?: number;
  pricingBadge?: string;
  builtForShopify?: boolean;
};

export type DiscountTierType = {
  id: string;
  appsCount: number;
  discountPercent: number;
  label: string;
};

export type AppCrossSellPropsType = {
  title?: string;
  description?: string;
  tiers?: DiscountTierType[];
  apps?: AppCrossSellItemType[];
  onInstall?: (appId: string) => void;
  onDismiss?: () => void;
  installedCount?: number;
};
