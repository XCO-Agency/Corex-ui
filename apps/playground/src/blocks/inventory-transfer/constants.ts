import type { TransferItemType, TransferLocationType } from "./types";

export const MOCK_LOCATIONS: TransferLocationType[] = [
  {
    id: "loc-1",
    name: "Main Distribution Center",
    code: "SLC-01",
    address: "1420 Logistics Blvd, Salt Lake City, UT",
    type: "warehouse",
    availableUnits: 14850,
  },
  {
    id: "loc-2",
    name: "West Coast Fulfillment Hub",
    code: "LAX-02",
    address: "880 Airport Way, Los Angeles, CA",
    type: "fulfillment_center",
    availableUnits: 8200,
  },
  {
    id: "loc-3",
    name: "SoHo Flagship Store",
    code: "NYC-01",
    address: "524 Broadway, New York, NY",
    type: "retail_store",
    availableUnits: 1240,
  },
  {
    id: "loc-4",
    name: "Chicago Central Depot",
    code: "ORD-01",
    address: "3100 Industrial Pkwy, Chicago, IL",
    type: "warehouse",
    availableUnits: 6500,
  },
];

export const MOCK_TRANSFER_ITEMS: TransferItemType[] = [
  {
    id: "item-1",
    name: "Ultra-Light Merino Wool Hoodie",
    sku: "HOOD-MRN-BLK-M",
    thumbnailSrc: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=100&auto=format&fit=crop&q=60",
    originStock: 185,
    destinationStock: 12,
    transferQuantity: 45,
    unitCost: 68.0,
  },
  {
    id: "item-2",
    name: "Ceramic Matte Pour-Over Dripper",
    sku: "DRP-CRM-MAT-01",
    thumbnailSrc: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&auto=format&fit=crop&q=60",
    originStock: 320,
    destinationStock: 8,
    transferQuantity: 60,
    unitCost: 24.5,
  },
  {
    id: "item-3",
    name: "Insulated Double-Wall Tumbler 16oz",
    sku: "TMB-INS-16-SLV",
    thumbnailSrc: "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=100&auto=format&fit=crop&q=60",
    originStock: 94,
    destinationStock: 18,
    transferQuantity: 30,
    unitCost: 16.0,
  },
  {
    id: "item-4",
    name: "Japanese Stainless Precision Kettle",
    sku: "KTL-STN-08-JAP",
    thumbnailSrc: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&auto=format&fit=crop&q=60",
    originStock: 62,
    destinationStock: 4,
    transferQuantity: 20,
    unitCost: 52.0,
  },
];

export const MOCK_CARRIERS = [
  { label: "FedEx Freight Commercial", value: "fedex_freight" },
  { label: "UPS Ground Freight", value: "ups_ground" },
  { label: "DHL Express Logistics", value: "dhl_express" },
  { label: "Dedicated Fleet Courier", value: "dedicated_fleet" },
];

export const MOCK_SHIPPING_METHODS = [
  { label: "Standard 3-5 Business Days", value: "ground_standard" },
  { label: "Expedited 2-Day Air", value: "expedited_air" },
  { label: "Priority Next-Flight Out", value: "priority_overnight" },
];
