export type OnboardingStepIdType =
  | "initializing"
  | "revenue-foundation"
  | "default-configuration"
  | "add-tools"
  | "shopify-validation"
  | "celebration";

export type StepBadgeIconType = "settings" | "cart" | "adjust" | "apps" | "code" | "star";

export type StepConfigItemType = {
  id: OnboardingStepIdType;
  label: string;
  icon: StepBadgeIconType;
};

export type SyncTaskIdType =
  "connect" | "catalog" | "currency" | "provision" | "finalize";

export type SyncTaskItemType = {
  id: SyncTaskIdType;
  label: string;
  status: "pending" | "done";
};

export type CoreToolIdType = "cart-drawer" | "fbt" | "analytics";

export type CoreToolType = {
  id: CoreToolIdType;
  name: string;
  description: string;
};

export type OptionalToolIdType =
  "volume-discounts" | "post-purchase-upsell" | "product-addons" | "checkout-bumps";

export type ToolPresetType = {
  id: string;
  label: string;
  description: string;
};

export type OptionalToolType = {
  id: OptionalToolIdType;
  name: string;
  description: string;
  /** Illustrative benchmark copy shown with a footnote — not a live metric. */
  impact: string;
  selected: boolean;
  configured: boolean;
  deferred: boolean;
  presets: ToolPresetType[];
  selectedPresetId: string | null;
};

export type EmbedStatusType = "idle" | "checking" | "active";

export type OnboardingStateType = {
  currentStep: OnboardingStepIdType;
  direction: 1 | -1;
  storeName: string;
  storeCurrency: string;
  syncTasks: SyncTaskItemType[];
  syncComplete: boolean;
  coreTools: CoreToolType[];
  freeShippingThreshold: number;
  thresholdSaved: boolean;
  optionalTools: OptionalToolType[];
  embedStatus: EmbedStatusType;
  onboardingCompleted: boolean;
};

export type OnboardingActionType =
  | { type: "ADVANCE_SYNC_TASK" }
  | { type: "FORCE_SYNC_COMPLETE" }
  | { type: "GO_NEXT" }
  | { type: "GO_BACK" }
  | { type: "GO_TO_STEP"; step: OnboardingStepIdType }
  | { type: "SET_THRESHOLD"; amount: number }
  | { type: "SET_CURRENCY"; currency: string }
  | { type: "CONFIRM_THRESHOLD" }
  | { type: "TOGGLE_OPTIONAL_TOOL"; id: OptionalToolIdType }
  | { type: "SELECT_PRESET"; id: OptionalToolIdType; presetId: string }
  | { type: "CONFIRM_TOOL_CONFIG"; id: OptionalToolIdType }
  | { type: "DEFER_TOOL_CONFIG"; id: OptionalToolIdType }
  | { type: "SET_EMBED_STATUS"; status: EmbedStatusType }
  | { type: "COMPLETE_ONBOARDING" };
