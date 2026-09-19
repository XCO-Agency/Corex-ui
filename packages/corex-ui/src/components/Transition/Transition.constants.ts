import type { CSSProperties } from "react";
import type {
  TransitionDelayType,
  TransitionDurationType,
  TransitionEasingType,
  TransitionKeyframesType,
  TransitionVariantType,
} from "./Transition.types";

export const DEFAULT_TRANSITION_DURATION = {
  enter: 350,
  exit: 300,
};

export const DEFAULT_TRANSITION_EASING = {
  enter: "cubic-bezier(0.22, 1, 0.36, 1)",
  exit: "ease",
};

export const TRANSITION_PRESETS: Record<
  TransitionVariantType,
  Required<TransitionKeyframesType>
> = {
  fade: {
    enterFrom: { opacity: 0 },
    enterTo: { opacity: 1 },
    exitTo: { opacity: 0 },
  },
  "fade-up": {
    enterFrom: { opacity: 0, transform: "translateY(8px) scale(0.96)" },
    enterTo: { opacity: 1, transform: "translateY(0) scale(1)" },
    exitTo: { opacity: 0, transform: "translateY(-14px) scale(0.96)" },
  },
  "fade-down": {
    enterFrom: { opacity: 0, transform: "translateY(-8px) scale(0.96)" },
    enterTo: { opacity: 1, transform: "translateY(0) scale(1)" },
    exitTo: { opacity: 0, transform: "translateY(14px) scale(0.96)" },
  },
  "fade-left": {
    enterFrom: { opacity: 0, transform: "translateX(16px) scale(0.98)" },
    enterTo: { opacity: 1, transform: "translateX(0) scale(1)" },
    exitTo: { opacity: 0, transform: "translateX(-16px) scale(0.98)" },
  },
  "fade-right": {
    enterFrom: { opacity: 0, transform: "translateX(-16px) scale(0.98)" },
    enterTo: { opacity: 1, transform: "translateX(0) scale(1)" },
    exitTo: { opacity: 0, transform: "translateX(16px) scale(0.98)" },
  },
  scale: {
    enterFrom: { opacity: 0, transform: "scale(0.95)" },
    enterTo: { opacity: 1, transform: "scale(1)" },
    exitTo: { opacity: 0, transform: "scale(0.95)" },
  },
  "scale-up": {
    enterFrom: { opacity: 0, transform: "scale(0.92)" },
    enterTo: { opacity: 1, transform: "scale(1)" },
    exitTo: { opacity: 0, transform: "scale(1.06)" },
  },
  pop: {
    enterFrom: { opacity: 0, transform: "scale(0.85)" },
    enterTo: { opacity: 1, transform: "scale(1)" },
    exitTo: { opacity: 0, transform: "scale(0.85)" },
  },
  "slide-up": {
    enterFrom: { opacity: 0, transform: "translateY(100%)" },
    enterTo: { opacity: 1, transform: "translateY(0)" },
    exitTo: { opacity: 0, transform: "translateY(-100%)" },
  },
  "slide-down": {
    enterFrom: { opacity: 0, transform: "translateY(-100%)" },
    enterTo: { opacity: 1, transform: "translateY(0)" },
    exitTo: { opacity: 0, transform: "translateY(100%)" },
  },
  "slide-left": {
    enterFrom: { opacity: 0, transform: "translateX(100%)" },
    enterTo: { opacity: 1, transform: "translateX(0)" },
    exitTo: { opacity: 0, transform: "translateX(-100%)" },
  },
  "slide-right": {
    enterFrom: { opacity: 0, transform: "translateX(-100%)" },
    enterTo: { opacity: 1, transform: "translateX(0)" },
    exitTo: { opacity: 0, transform: "translateX(100%)" },
  },
  zoom: {
    enterFrom: { opacity: 0, transform: "scale(1.08)" },
    enterTo: { opacity: 1, transform: "scale(1)" },
    exitTo: { opacity: 0, transform: "scale(0.92)" },
  },
};

export function resolveKeyframes(
  animate: TransitionVariantType | TransitionKeyframesType | undefined,
): Required<TransitionKeyframesType> {
  if (!animate) {
    return TRANSITION_PRESETS["fade-up"];
  }

  if (typeof animate === "string") {
    return TRANSITION_PRESETS[animate] ?? TRANSITION_PRESETS["fade-up"];
  }

  const defaultPreset = TRANSITION_PRESETS["fade-up"];
  return {
    enterFrom: animate.enterFrom ?? defaultPreset.enterFrom,
    enterTo: animate.enterTo ?? defaultPreset.enterTo,
    exitTo: animate.exitTo ?? defaultPreset.exitTo,
  };
}

export function resolveDuration(
  duration: TransitionDurationType | undefined,
): { enter: number; exit: number } {
  if (typeof duration === "number") {
    return { enter: duration, exit: duration };
  }
  if (duration && typeof duration === "object") {
    return {
      enter: duration.enter ?? DEFAULT_TRANSITION_DURATION.enter,
      exit: duration.exit ?? DEFAULT_TRANSITION_DURATION.exit,
    };
  }
  return DEFAULT_TRANSITION_DURATION;
}

export function resolveDelay(
  delay: TransitionDelayType | undefined,
): { enter: number; exit: number } {
  if (typeof delay === "number") {
    return { enter: delay, exit: delay };
  }
  if (delay && typeof delay === "object") {
    return {
      enter: delay.enter ?? 0,
      exit: delay.exit ?? 0,
    };
  }
  return { enter: 0, exit: 0 };
}

export function resolveEasing(
  easing: TransitionEasingType | undefined,
): { enter: string; exit: string } {
  if (typeof easing === "string") {
    return { enter: easing, exit: easing };
  }
  if (easing && typeof easing === "object") {
    return {
      enter: easing.enter ?? DEFAULT_TRANSITION_EASING.enter,
      exit: easing.exit ?? DEFAULT_TRANSITION_EASING.exit,
    };
  }
  return DEFAULT_TRANSITION_EASING;
}
