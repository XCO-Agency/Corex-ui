import type { ReviewItemType, ReviewRatingStatsType } from "./types";

export const MOCK_REVIEW_STATS: ReviewRatingStatsType = {
  averageRating: 4.8,
  totalReviews: 348,
  recommendedPercentage: 96,
  starDistribution: [
    { stars: 5, count: 280, percentage: 80 },
    { stars: 4, count: 45, percentage: 13 },
    { stars: 3, count: 15, percentage: 4 },
    { stars: 2, count: 5, percentage: 2 },
    { stars: 1, count: 3, percentage: 1 },
  ],
};

export const MOCK_REVIEWS: ReviewItemType[] = [
  {
    id: "rev-1",
    authorName: "Elena Rostova",
    authorEmail: "elena.r@lifestylemag.com",
    verifiedBuyer: true,
    productTitle: "Ceramic Matte Pour-Over Dripper",
    productThumbnailSrc:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&auto=format&fit=crop&q=60",
    rating: 5,
    title: "Best morning ritual investment I have ever made!",
    body: "The flow rate is exceptionally steady and forgiving. Even with coarser grinds, the extraction comes through sweet and aromatic. The matte sandstone texture feels truly artisanal in hands.",
    photos: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=200&auto=format&fit=crop&q=60",
    ],
    createdAt: "Sep 12, 2026",
    status: "published",
    sentiment: "positive",
    reply: {
      text: "Thank you so much Elena! We put months into calibrating the internal rib geometry for that exact steady drawdown. Enjoy your brews!",
      repliedAt: "Sep 12, 2026",
      author: "Store Support",
    },
  },
  {
    id: "rev-2",
    authorName: "Marcus Vance",
    authorEmail: "m.vance@sounddesign.io",
    verifiedBuyer: true,
    productTitle: "Ultra-Light Merino Wool Hoodie",
    productThumbnailSrc:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=100&auto=format&fit=crop&q=60",
    rating: 5,
    title: "Unmatched thermoregulation on mountain trails",
    body: "Wore this for a 14-mile backcountry trek through varying 45° to 70° temps. Never overheated, zero odor buildup, and the fitted hood seals drafts out perfectly. Sizing is spot on.",
    photos: [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=200&auto=format&fit=crop&q=60",
    ],
    createdAt: "Sep 10, 2026",
    status: "published",
    sentiment: "positive",
  },
  {
    id: "rev-3",
    authorName: "Chloe Davenport",
    authorEmail: "chloe.davenport@gmail.com",
    verifiedBuyer: true,
    productTitle: "Japanese Stainless Precision Kettle",
    productThumbnailSrc:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&auto=format&fit=crop&q=60",
    rating: 4,
    title: "Incredible balance, small scratch on handle",
    body: "The pour stream is laser-accurate and flow control is effortless. Giving 4 stars only because there was a tiny hairline scuff on the black silicone base upon unboxing.",
    photos: [],
    createdAt: "Sep 08, 2026",
    status: "pending",
    sentiment: "neutral",
  },
  {
    id: "rev-4",
    authorName: "Devon Reed",
    authorEmail: "devon.reed@outlook.com",
    verifiedBuyer: false,
    productTitle: "Insulated Double-Wall Tumbler 16oz",
    productThumbnailSrc:
      "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=100&auto=format&fit=crop&q=60",
    rating: 2,
    title: "Lid seal loosened after dishwasher cycle",
    body: "Kept hot coffee steaming all morning, but after running through the top rack of my dishwasher the gasket started leaking when tilted. Would appreciate a replacement seal.",
    photos: [],
    createdAt: "Sep 05, 2026",
    status: "flagged",
    sentiment: "negative",
  },
];

export const CANNED_REPLIES = [
  {
    id: "reply-thanks",
    label: "Express Gratitude",
    text: "Thank you so much for taking the time to share your feedback! We are thrilled to hear that the product is exceeding your expectations. Happy brewing/wearing!",
  },
  {
    id: "reply-replacement",
    label: "Offer Warranty Replacement",
    text: "We sincerely apologize for the inconvenience with your item! We stand 100% behind our craftsmanship. Please reply with your order number and our concierge team will dispatch a brand-new replacement immediately at no cost.",
  },
  {
    id: "reply-support",
    label: "Product Care Tips",
    text: "Thanks for bringing this to our attention! While the body is high-grade steel, we advise hand-washing the silicone seal to extend gasket longevity. We've sent a complimentary replacement seal kit to your shipping address on file.",
  },
];
