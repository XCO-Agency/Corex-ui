import type { DiscountTierType } from "./types";

/** Highest tier unlocked by `installedCount` apps, or `null` before the first. */
export const getReachedTier = (tiers: DiscountTierType[], installedCount: number) =>
  [...tiers].reverse().find((tier) => installedCount >= tier.appsCount) ?? null;

/** Next tier still to unlock, or `null` once the top tier is reached. */
export const getNextTier = (tiers: DiscountTierType[], installedCount: number) =>
  tiers.find((tier) => installedCount < tier.appsCount) ?? null;

/** Biggest discount on offer, for headlines such as "save up to 30%". */
export const getMaxDiscount = (tiers: DiscountTierType[]) =>
  Math.max(0, ...tiers.map((tier) => tier.discountPercent));

export const pluralizeApps = (count: number) => `${count} app${count === 1 ? "" : "s"}`;
