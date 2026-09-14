import type * as React from "react";

export type OfferDiscountType = "percentage" | "fixed_amount" | "free_shipping";

export type OfferTriggerType = "all_orders" | "minimum_subtotal" | "specific_collections";

export type OfferProductItemType = {
  id: string;
  title: string;
  sku: string;
  price: string;
  imageUrl?: string;
  selected?: boolean;
};

export type OfferFormType = {
  title: string;
  internalName: string;
  bannerText: string;
  discountType: OfferDiscountType;
  discountValue: string;
  triggerType: OfferTriggerType;
  minimumSubtotal: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  hasEndDate: boolean;
  selectedProductIds: string[];
  limitPerCustomer: boolean;
};

export type OfferDetailsCardPropsType = {
  data: Pick<OfferFormType, "title" | "internalName" | "bannerText">;
  onChange: (field: "title" | "internalName" | "bannerText", val: string) => void;
};

export type OfferRulesCardPropsType = {
  discountType: OfferDiscountType;
  discountValue: string;
  triggerType: OfferTriggerType;
  minimumSubtotal: string;
  onDiscountTypeChange: (val: OfferDiscountType) => void;
  onDiscountValueChange: (val: string) => void;
  onTriggerTypeChange: (val: OfferTriggerType) => void;
  onMinimumSubtotalChange: (val: string) => void;
};

export type OfferTargetProductsCardPropsType = {
  selectedProducts: OfferProductItemType[];
  availableProducts: OfferProductItemType[];
  onAddProduct: (id: string) => void;
  onRemoveProduct: (id: string) => void;
};

export type OfferStatusSidebarCardPropsType = {
  isActive: boolean;
  startDate: string;
  endDate: string;
  hasEndDate: boolean;
  onIsActiveChange: (active: boolean) => void;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onHasEndDateChange: (val: boolean) => void;
};

export type OfferSummarySidebarCardPropsType = {
  form: OfferFormType;
  selectedCount: number;
};

export type OfferSaveBarPropsType = {
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
};
