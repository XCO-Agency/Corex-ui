import type { NotificationTemplateFormType, VariableTagType } from "./types";

export const TEMPLATE_VARIABLE_TAGS: VariableTagType[] = [
  {
    key: "{{ customer.first_name }}",
    label: "Customer First Name",
    category: "customer",
    sampleValue: "Elena",
  },
  {
    key: "{{ order.name }}",
    label: "Order Number",
    category: "order",
    sampleValue: "#1084",
  },
  {
    key: "{{ order.total_price }}",
    label: "Order Total ($)",
    category: "order",
    sampleValue: "$124.50",
  },
  {
    key: "{{ tracking.number }}",
    label: "Tracking Number",
    category: "order",
    sampleValue: "USPS-940011189956",
  },
  {
    key: "{{ tracking.url }}",
    label: "Tracking Link",
    category: "order",
    sampleValue: "https://track.shop.com/1084",
  },
  {
    key: "{{ shop.name }}",
    label: "Store Name",
    category: "shop",
    sampleValue: "Aura Outfitters",
  },
];

export const INITIAL_TEMPLATE_FORM: NotificationTemplateFormType = {
  name: "Order Out for Delivery Alert",
  channel: "sms",
  subject: "Your order is out for delivery today! 🚚",
  bodyText:
    "Hi {{ customer.first_name }}! Great news: your {{ shop.name }} order {{ order.name }} is out for delivery today with tracking {{ tracking.number }}. Track package: {{ tracking.url }}",
  senderName: "Aura Outfitters",
  enabled: true,
};
