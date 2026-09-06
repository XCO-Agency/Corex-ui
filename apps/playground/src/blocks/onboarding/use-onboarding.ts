import { useMemo, useReducer } from "react";
import type {
  OnboardingActionType,
  OnboardingStateType,
  OnboardingStepIdType,
} from "./onboarding.types";
import {
  CORE_TOOLS,
  DEFAULT_FREE_SHIPPING_THRESHOLD,
  INITIAL_OPTIONAL_TOOLS,
  INITIAL_SYNC_TASKS,
  STEP_ORDER,
} from "./constants";

const initialState: OnboardingStateType = {
  currentStep: "initializing",
  direction: 1,
  storeName: "",
  storeCurrency: "USD",
  syncTasks: INITIAL_SYNC_TASKS,
  syncComplete: false,
  coreTools: CORE_TOOLS,
  freeShippingThreshold: DEFAULT_FREE_SHIPPING_THRESHOLD,
  thresholdSaved: false,
  optionalTools: INITIAL_OPTIONAL_TOOLS,
  embedStatus: "idle",
  onboardingCompleted: false,
};

function selectedTools(state: OnboardingStateType) {
  return state.optionalTools.filter((tool) => tool.selected);
}

function stepAfter(step: OnboardingStepIdType): OnboardingStepIdType {
  const idx = STEP_ORDER.indexOf(step);
  return STEP_ORDER[Math.min(idx + 1, STEP_ORDER.length - 1)];
}

function stepBefore(step: OnboardingStepIdType): OnboardingStepIdType {
  const idx = STEP_ORDER.indexOf(step);
  return STEP_ORDER[Math.max(idx - 1, 0)];
}

function reducer(
  state: OnboardingStateType,
  action: OnboardingActionType,
): OnboardingStateType {
  switch (action.type) {
    case "ADVANCE_SYNC_TASK": {
      const idx = state.syncTasks.findIndex((task) => task.status !== "done");
      if (idx === -1) return state;
      const syncTasks = state.syncTasks.map((task, i) =>
        i === idx ? { ...task, status: "done" as const } : task,
      );
      return {
        ...state,
        syncTasks,
        syncComplete: syncTasks.every((t) => t.status === "done"),
      };
    }

    case "FORCE_SYNC_COMPLETE":
      return {
        ...state,
        syncTasks: state.syncTasks.map((task) => ({ ...task, status: "done" as const })),
        syncComplete: true,
      };

    case "GO_NEXT": {
      const next = stepAfter(state.currentStep);
      return {
        ...state,
        direction: 1,
        currentStep: next,
      };
    }

    case "GO_BACK": {
      return { ...state, direction: -1, currentStep: stepBefore(state.currentStep) };
    }

    case "GO_TO_STEP":
      return {
        ...state,
        direction:
          STEP_ORDER.indexOf(action.step) >= STEP_ORDER.indexOf(state.currentStep)
            ? 1
            : -1,
        currentStep: action.step,
      };

    case "SET_THRESHOLD":
      return { ...state, freeShippingThreshold: action.amount, thresholdSaved: false };

    case "SET_CURRENCY":
      return { ...state, storeCurrency: action.currency, thresholdSaved: false };

    case "CONFIRM_THRESHOLD":
      return { ...state, thresholdSaved: true };

    case "TOGGLE_OPTIONAL_TOOL":
      return {
        ...state,
        optionalTools: state.optionalTools.map((tool) =>
          tool.id === action.id ? { ...tool, selected: !tool.selected } : tool,
        ),
      };

    case "SELECT_PRESET":
      return {
        ...state,
        optionalTools: state.optionalTools.map((tool) =>
          tool.id === action.id ? { ...tool, selectedPresetId: action.presetId } : tool,
        ),
      };

    case "CONFIRM_TOOL_CONFIG":
      return {
        ...state,
        optionalTools: state.optionalTools.map((tool) =>
          tool.id === action.id ? { ...tool, configured: true, deferred: false } : tool,
        ),
      };

    case "DEFER_TOOL_CONFIG":
      return {
        ...state,
        optionalTools: state.optionalTools.map((tool) =>
          tool.id === action.id ? { ...tool, deferred: true } : tool,
        ),
      };

    case "SET_EMBED_STATUS":
      return { ...state, embedStatus: action.status };

    case "COMPLETE_ONBOARDING":
      return { ...state, onboardingCompleted: true };

    default:
      return state;
  }
}

export function useOnboarding() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const helpers = useMemo(
    () => ({
      selectedOptionalTools: selectedTools(state),
      stepIndex: STEP_ORDER.indexOf(state.currentStep),
      totalSteps: STEP_ORDER.length,
    }),
    [state],
  );

  return { state, dispatch, ...helpers };
}
