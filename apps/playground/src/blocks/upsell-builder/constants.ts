import type { AddonItemType, RewardTierType, UpsellRuleFormType } from "./types";

export const MOCK_AVAILABLE_ADDONS: AddonItemType[] = [
  {
    id: "addon-1",
    name: "Priority Shipping Protection",
    sku: "ADDON-PROT-01",
    price: 3.99,
    image: "https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png",
    badge: "Most Popular",
    enabled: true,
    preChecked: true,
    category: "protection",
  },
  {
    id: "addon-2",
    name: "Luxury Gift Packaging & Message Card",
    sku: "ADDON-GIFT-02",
    price: 5.5,
    originalPrice: 8.0,
    image: "https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png",
    enabled: true,
    preChecked: false,
    category: "gift",
  },
  {
    id: "addon-3",
    name: "2-Year Extended Hardware Warranty",
    sku: "ADDON-WARR-03",
    price: 14.99,
    originalPrice: 19.99,
    image: "https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png",
    badge: "High Margin",
    enabled: true,
    preChecked: false,
    category: "warranty",
  },
  {
    id: "addon-4",
    name: "Microfiber Cleaning & Care Kit",
    sku: "ADDON-CARE-04",
    price: 7.0,
    image: "https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png",
    enabled: false,
    preChecked: false,
    category: "accessory",
  },
];

export const DEFAULT_REWARD_TIERS: RewardTierType[] = [
  {
    id: "tier-1",
    threshold: 50,
    rewardTitle: "Free Express Shipping",
    unlockedLabel: "Free Shipping Unlocked! 🎉",
    icon: "delivery",
  },
  {
    id: "tier-2",
    threshold: 100,
    rewardTitle: "Complimentary Travel Pouch",
    unlockedLabel: "Free Travel Pouch Added!",
    icon: "gift",
  },
  {
    id: "tier-3",
    threshold: 150,
    rewardTitle: "15% Off Your Next Order",
    unlockedLabel: "VIP 15% Voucher Earned!",
    icon: "discount",
  },
];

export const INITIAL_UPSELL_FORM: UpsellRuleFormType = {
  title: "Cart Drawer Holiday Upsell & Milestones",
  enabled: true,
  placement: "cart_drawer",
  minCartSubtotal: 25,
  milestoneRewardEnabled: true,
  rewardTiers: DEFAULT_REWARD_TIERS,
  selectedAddonIds: ["addon-1", "addon-2"],
  discountPercentage: 10,
};
