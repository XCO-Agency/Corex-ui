export type ReviewSentimentType = "positive" | "neutral" | "negative";

export type ReviewStatusType = "published" | "pending" | "flagged" | "hidden";

export type ReviewReplyType = {
  text: string;
  repliedAt: string;
  author: string;
};

export type ReviewItemType = {
  id: string;
  authorName: string;
  authorEmail: string;
  verifiedBuyer: boolean;
  productTitle: string;
  productThumbnailSrc: string;
  rating: number;
  title: string;
  body: string;
  photos: string[];
  createdAt: string;
  status: ReviewStatusType;
  sentiment: ReviewSentimentType;
  reply?: ReviewReplyType;
};

export type StarCountType = {
  stars: number;
  count: number;
  percentage: number;
};

export type ReviewRatingStatsType = {
  averageRating: number;
  totalReviews: number;
  recommendedPercentage: number;
  starDistribution: StarCountType[];
};

export type ReviewFilterFormType = {
  status: "all" | ReviewStatusType;
  rating: string;
  hasPhotosOnly: boolean;
  searchQuery: string;
};
