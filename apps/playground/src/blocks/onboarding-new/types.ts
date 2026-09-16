import type { ReactNode } from "react";

export type CartPresetIdType = "minimal" | "bold" | "rounded" | "editorial";

export type CartPresetStyleType = {
  container?: Record<string, unknown>;
  header?: Record<string, unknown>;
  title?: Record<string, unknown>;
  item?: Record<string, unknown>;
  thumb?: Record<string, unknown>;
  price?: Record<string, unknown>;
  qty?: Record<string, unknown>;
  cta?: Record<string, unknown>;
};

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

export type QuestionSingleChoiceType = {
  id: string;
  type: "single" | "multi" | "input";
  question: string;
  subtitle?: string;
  options?: string[];
  prefix?: string;
  placeholder?: string;
};

export type StageKindType = "choice" | "toggle-grid" | "style-preset" | "brand-color";

export type StageProcessingType = {
  type: "processing";
  texts: string[];
};

export type StageChoiceQuestionsType = {
  type: "questions";
  kind: "choice";
  title: string;
  questions: QuestionSingleChoiceType[];
};

export type StageToggleGridType = {
  type: "questions";
  kind: "toggle-grid";
  id: string;
  title: string;
  subtitle: string;
  options: RevenueToolOptionType[];
};

export type StageStylePresetType = {
  type: "questions";
  kind: "style-preset";
  id: string;
  title: string;
  subtitle: string;
  default: CartPresetIdType;
  options: CartPresetOptionType[];
};

export type StageBrandColorType = {
  type: "questions";
  kind: "brand-color";
  id: string;
  title: string;
  subtitle: string;
};

export type StageCompleteType = {
  type: "complete";
};

export type FlowStageType =
  | StageProcessingType
  | StageChoiceQuestionsType
  | StageToggleGridType
  | StageStylePresetType
  | StageBrandColorType
  | StageCompleteType;

export type BrandColorsType = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  source?: "default" | "scan" | "manual" | string;
};

export type OnboardingNewAnswersType = {
  volume?: string;
  addons?: Set<string>;
  cartStyle?: CartPresetIdType;
  brand?: BrandColorsType;
  [key: string]: unknown;
};

export type OnboardingNewPropsType = {
  onGoToDashboard?: () => void;
  onRestart?: () => void;
  initialAnswers?: Partial<OnboardingNewAnswersType>;
};

export type StageTransitionPropsType = {
  children: ReactNode;
  leaving?: boolean;
};
