export type AddonItemType = {
  id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  enabled: boolean;
  preChecked: boolean;
  category: "protection" | "gift" | "warranty" | "accessory";
};

export type RewardTierType = {
  id: string;
  threshold: number;
  rewardTitle: string;
  unlockedLabel: string;
  icon: string;
};

export type UpsellPlacementType = "cart_drawer" | "cart_page" | "post_purchase";

export type UpsellRuleFormType = {
  title: string;
  enabled: boolean;
  placement: UpsellPlacementType;
  minCartSubtotal: number;
  milestoneRewardEnabled: boolean;
  rewardTiers: RewardTierType[];
  selectedAddonIds: string[];
  discountPercentage: number;
};
