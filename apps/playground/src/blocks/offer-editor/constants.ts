import type { OfferFormType, OfferProductItemType } from "./types";

export const INITIAL_OFFER_FORM: OfferFormType = {
  title: "Flash Autumn 15% Off Upsell",
  internalName: "AUTUMN-UPSELL-2026",
  bannerText: "Add any featured item to your cart and unlock 15% off instantly!",
  discountType: "percentage",
  discountValue: "15",
  triggerType: "minimum_subtotal",
  minimumSubtotal: "50.00",
  isActive: true,
  startDate: "2026-09-15",
  endDate: "2026-10-15",
  hasEndDate: true,
  selectedProductIds: ["offer-prod-1", "offer-prod-2"],
  limitPerCustomer: true,
};

export const AVAILABLE_OFFER_PRODUCTS: OfferProductItemType[] = [
  {
    id: "offer-prod-1",
    title: "Hand-Crafted Ceramic Espresso Cup",
    sku: "CER-CUP-01",
    price: "$24.00",
    imageUrl:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&h=100&fit=crop",
  },
  {
    id: "offer-prod-2",
    title: "Organic Cotton Kitchen Towel Set",
    sku: "COT-TWL-08",
    price: "$18.00",
    imageUrl:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&h=100&fit=crop",
  },
  {
    id: "offer-prod-3",
    title: "Titanium Precision Pocket Pen",
    sku: "TIT-PEN-04",
    price: "$38.00",
    imageUrl:
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=100&h=100&fit=crop",
  },
  {
    id: "offer-prod-4",
    title: "Aromatic Cedar & Citrus Candle",
    sku: "CND-CED-12",
    price: "$28.00",
    imageUrl:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=100&h=100&fit=crop",
  },
];
