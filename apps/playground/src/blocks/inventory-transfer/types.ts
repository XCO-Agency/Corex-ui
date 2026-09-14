export type LocationTypeType = "warehouse" | "retail_store" | "fulfillment_center";

export type TransferLocationType = {
  id: string;
  name: string;
  code: string;
  address: string;
  type: LocationTypeType;
  availableUnits: number;
};

export type TransferItemType = {
  id: string;
  name: string;
  sku: string;
  thumbnailSrc: string;
  originStock: number;
  destinationStock: number;
  transferQuantity: number;
  unitCost: number;
};

export type TransferShippingType = {
  carrier: string;
  trackingNumber: string;
  expectedDeliveryDate: string;
  shippingMethod: string;
};

export type TransferStatusType = "draft" | "pending_approval" | "in_transit" | "completed";

export type TransferFormType = {
  originLocationId: string;
  destinationLocationId: string;
  referenceNumber: string;
  notes: string;
  items: TransferItemType[];
  shipping: TransferShippingType;
  status: TransferStatusType;
};
