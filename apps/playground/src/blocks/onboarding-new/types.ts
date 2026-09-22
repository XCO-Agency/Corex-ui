import type { ReactNode } from "react";

export type CartPresetIdType = "minimal" | "bold" | "rounded" | "editorial";

export type CartPresetOptionType = {
  id: CartPresetIdType;
  label: string;
};

export type RevenueToolOptionType = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  default: boolean;
  badge?: string;
};

export type ChoiceOptionItemType = {
  label: string;
  value: string;
  helpText?: string;
  disabled?: boolean;
};

export type StageIdType = "volume" | "brand" | "cartStyle" | "addons";

export type FlowStageConfigType = {
  id: StageIdType;
  type: "questions";
  required?: boolean;
};

export type BrandColorsType = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  source?: "default" | "scan" | "manual" | string;
};

export type OnboardingNewAnswersType = {
  volume?: string;
  brand?: BrandColorsType;
  cartStyle?: CartPresetIdType;
  addons?: Set<string>;
  [key: string]: unknown;
};

export type OnboardingNewPropsType = {
  onGoToDashboard?: () => void;
  onRestart?: () => void;
  initialAnswers?: Partial<OnboardingNewAnswersType>;
  initialCompletedStages?: StageIdType[];
  onSaveStage?: (stageId: StageIdType, answer: unknown) => Promise<void> | void;
};

export type StageTransitionPropsType = {
  children: ReactNode;
  leaving?: boolean;
};

