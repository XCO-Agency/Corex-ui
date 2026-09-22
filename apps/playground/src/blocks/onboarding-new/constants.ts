import type {
  BrandColorsType,
  FlowStageConfigType,
  OnboardingNewAnswersType,
  StageIdType,
} from "./types";

export const DEFAULT_BRAND_COLORS: BrandColorsType = {
  primary: "#008060",
  secondary: "#1A1A1A",
  accent: "#E8B84B",
  background: "#F6F6F7",
  source: "default",
};

export const INITIAL_LOADING_TEXTS: string[] = [
  "Initializing your workspace...",
  "Connecting your store...",
  "Getting things ready...",
];

export const FLOW_STAGES: FlowStageConfigType[] = [
  { id: "volume", type: "questions", required: true },
  { id: "brand", type: "questions", required: false },
  { id: "cartStyle", type: "questions", required: false },
  { id: "addons", type: "questions", required: false },
];

export function getStageProcessingTexts(
  stageId: StageIdType,
  answers: OnboardingNewAnswersType,
): string[] {
  switch (stageId) {
    case "volume": {
      const vol = answers.volume;
      const volLabel =
        vol === "under-100"
          ? "under 100 orders"
          : vol === "100-500"
            ? "100–500 orders"
            : vol === "500-2000"
              ? "500–2,000 orders"
              : vol === "2000-plus"
                ? "2,000+ orders"
                : "order volume";
      return [
        `Saving ${volLabel} volume configuration...`,
        "Tuning performance parameters for your store scale...",
      ];
    }
    case "brand": {
      const brand = answers.brand || DEFAULT_BRAND_COLORS;
      return [
        `Applying brand palette (${brand.primary})...`,
        "Compiling custom theme tokens...",
      ];
    }
    case "cartStyle": {
      const style = answers.cartStyle || "minimal";
      const styleLabel = style.charAt(0).toUpperCase() + style.slice(1);
      return [
        `Configuring ${styleLabel} cart drawer layout...`,
        "Integrating brand styles with drawer elements...",
      ];
    }
    case "addons": {
      const count = answers.addons instanceof Set ? answers.addons.size : 0;
      return [
        `Activating ${count} selected revenue tool${count === 1 ? "" : "s"}...`,
        "Finalizing your storefront setup...",
      ];
    }
    default:
      return ["Saving your preferences...", "Getting things ready..."];
  }
}

