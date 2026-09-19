import type {
  BrandColorsType,
  CartPresetIdType,
  CartPresetStyleType,
  FlowStageType,
} from "./types";

export const DEFAULT_BRAND_COLORS: BrandColorsType = {
  primary: "#008060",
  secondary: "#1A1A1A",
  accent: "#E8B84B",
  background: "#F6F6F7",
  source: "default",
};

export const CART_PRESET_STYLES: Record<CartPresetIdType, CartPresetStyleType> = {
  minimal: {
    container: {},
    header: {},
    title: {},
    item: {},
    thumb: {},
    price: {},
    qty: {},
    cta: {},
  },
  bold: {
    container: {},
    header: {},
    title: {},
    item: {},
    thumb: {},
    price: {},
    qty: {},
    cta: {},
  },
  rounded: {
    container: {},
    header: {},
    title: {},
    item: {},
    thumb: {},
    price: {},
    qty: {},
    cta: {},
  },
  editorial: {
    container: {},
    header: {},
    title: {},
    item: {},
    thumb: {},
    price: {},
    qty: {},
    cta: {},
  },
};

export const FLOW: FlowStageType[] = [
  {
    type: "processing",
    texts: ["Initializing your workspace...", "Getting things ready..."],
  },
  {
    type: "questions",
    kind: "choice",
    title: "Tell us about your store",
    questions: [
      {
        id: "volume",
        type: "single",
        question: "What's your average monthly order volume?",
        subtitle: "This helps us tailor performance settings to your store size.",
        options: [
          {
            label: "Under 100 orders",
            helpText: "Helper text to explain more about this option",
            value: "under-100",
          },
          {
            label: "100–500 orders",
            helpText: "Helper text to explain more about this option",
            value: "100-500",
          },
          {
            label: "500–2,000 orders",
            helpText: "Helper text to explain more about this option",
            value: "500-2000",
          },
          {
            label: "2,000+ orders",
            helpText: "Helper text to explain more about this option",
            value: "2000-plus",
          },
        ],
      },
    ],
  },
  {
    type: "processing",
    texts: ["Validate your preferences...", "Analyzing your store data..."],
  },
  {
    type: "questions",
    kind: "toggle-grid",
    id: "addons",
    title: "Add revenue tools to your cart",
    subtitle: "Turn these on now, or add them anytime from your dashboard.",
    options: [
      {
        id: "shipping-protection",
        icon: "📦",
        title: "Shipping protection",
        desc: "Let customers insure their order against loss or damage.",
        default: false,
      },
      {
        id: "warranty",
        icon: "🛡️",
        title: "Product warranty",
        desc: "Offer extended warranty coverage at checkout.",
        default: false,
      },
      {
        id: "gift-wrap",
        icon: "🎁",
        title: "Gift wrapping",
        desc: "Let customers add gift wrap for a small fee.",
        default: false,
      },
      {
        id: "cart-upsells",
        icon: "🛒",
        title: "Cart drawer upsells",
        desc: "Show smart product recommendations in the cart.",
        default: true,
        badge: "Recommended for Journeva",
      },
    ],
  },
  {
    type: "processing",
    texts: ["Configuring your revenue tools...", "Applying your preferences..."],
  },
  {
    type: "questions",
    kind: "style-preset",
    id: "cartStyle",
    title: "Pick a cart drawer style",
    subtitle:
      "A live preview of how your cart drawer will look — you can fine-tune it later.",
    default: "minimal",
    options: [
      { id: "minimal", label: "Minimal" },
      { id: "bold", label: "Bold" },
      { id: "rounded", label: "Rounded" },
      { id: "editorial", label: "Editorial" },
    ],
  },
  {
    type: "processing",
    texts: ["Initializing your cart branding...", "Personalizing your storefront..."],
  },
  {
    type: "questions",
    kind: "brand-color",
    id: "brand",
    title: "Add your brand colors",
    subtitle: "We'll use these across your cart and upsell widgets.",
  },
  { type: "processing", texts: ["Finalizing your setup...", "Wrapping up..."] },
  { type: "complete" },
];
