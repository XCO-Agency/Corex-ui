import type { CardItemDataType } from "./types";

export const MINIMALIST_CARD_ITEMS: CardItemDataType[] = [
  {
    id: "mini-1",
    title: "Store Speed Optimization",
    description:
      "Compress storefront assets and defer third-party scripts to achieve a sub-second Time to Interactive across all mobile devices.",
    badge: {
      text: "Recommended",
      tone: "success",
    },
    metaText: "Est. +14% mobile conversion",
  },
  {
    id: "mini-2",
    title: "Automated Checkout Upsell",
    description:
      "Recommend complementary high-margin accessories directly inside the Shopify checkout drawer based on customer cart contents.",
    badge: {
      text: "High Impact",
      tone: "info",
    },
    metaText: "Est. +$8.40 Average Order Value",
  },
  {
    id: "mini-3",
    title: "Dynamic Free Shipping Bar",
    description:
      "Display real-time tier thresholds to incentivize customers to add more items to their cart before proceeding to final payment.",
    badge: {
      text: "Quick Setup",
      tone: "neutral",
    },
    metaText: "2 min configuration",
  },
];

export const MEDIA_CARD_ITEMS: CardItemDataType[] = [
  {
    id: "media-1",
    title: "Omnichannel Retargeting Campaign",
    description:
      "Synchronize your customer segments across Meta, Google, and TikTok to deliver personalized dynamic product remarketing ads.",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Marketing data analytics and campaign metrics dashboard",
    badge: {
      text: "Marketing",
      tone: "info",
    },
    metaText: "Updated 2 hours ago",
  },
  {
    id: "media-2",
    title: "Live Social Proof Feeds",
    description:
      "Stream genuine customer UGC and verified review badges directly on your high-traffic product detail and collection pages.",
    imageUrl:
      "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Retail customer shopping in a modern storefront",
    badge: {
      text: "Social Proof",
      tone: "success",
    },
    metaText: "4,200+ impressions today",
  },
  {
    id: "media-3",
    title: "AI-Powered Customer Reviews",
    description:
      "Summarize sentiment from verified buyer reviews and highlight top product attributes directly in the storefront search bar.",
    imageUrl:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Digital customer support and AI chat interaction",
    badge: {
      text: "AI Feature",
      tone: "neutral",
    },
    metaText: "98% accuracy score",
  },
];

export const MEDIA_ACTION_CARD_ITEMS: CardItemDataType[] = [
  {
    id: "action-1",
    title: "Seasonal Flash Sale Campaign",
    description:
      "Launch a limited-time sitewide discount banner with sticky countdown timer and automated inventory countdown reservation.",
    imageUrl:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Online shopping sale banner with discounts and gifts",
    badge: {
      text: "Campaign",
      tone: "warning",
    },
    metaText: "Starts in 3 days",
    primaryAction: {
      content: "Activate campaign",
    },
    secondaryAction: {
      content: "Customize rules",
    },
  },
  {
    id: "action-2",
    title: "Abandoned Cart Recovery Flow",
    description:
      "Send intelligent multi-channel SMS and email reminder sequences with dynamic one-click discount codes to recapture lost checkouts.",
    imageUrl:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Digital payment and shopping cart checkout process",
    badge: {
      text: "Automation",
      tone: "success",
    },
    metaText: "Recovers 22% of carts",
    primaryAction: {
      content: "Enable sequence",
    },
    secondaryAction: {
      content: "Edit template",
    },
  },
  {
    id: "action-3",
    title: "VIP Tier Loyalty Rewards",
    description:
      "Reward repeat spenders with exclusive perks, early product drops, and automated points redemption right on the cart drawer.",
    imageUrl:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Loyalty rewards card and VIP customer benefits",
    badge: {
      text: "Retention",
      tone: "info",
    },
    metaText: "1,450 active VIPs",
    primaryAction: {
      content: "Configure perks",
    },
    secondaryAction: {
      content: "View members",
    },
  },
];

export const SHOWCASE_CARD_ITEMS: CardItemDataType[] = [
  {
    id: "template-minimalist",
    title: "Minimalist Streamlined",
    description: "Ultra-fast text-first layout with instant cart loading.",
    imageUrl:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Minimalist modern storefront layout",
  },
  {
    id: "template-media",
    title: "Visual Editorial",
    description: "Rich photography showcase for apparel and lifestyle brands.",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Visual editorial apparel storefront",
  },
  {
    id: "template-actions",
    title: "High-Converting Promo",
    description: "Dynamic countdowns, automated upsells, and instant checkout CTAs.",
    imageUrl:
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Interactive online checkout and transaction terminal",
  },
];
