import type { CSSProperties, ElementType, ReactNode } from "react";

export type TransitionVariantType =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale"
  | "scale-up"
  | "pop"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "zoom";

export type TransitionKeyframesType = {
  /** Starting styles when entering. */
  enterFrom?: CSSProperties;
  /** Active resting styles once entered. */
  enterTo?: CSSProperties;
  /** Destination styles when exiting. */
  exitTo?: CSSProperties;
};

export type TransitionDurationType =
  | number
  | {
      enter?: number;
      exit?: number;
    };

export type TransitionDelayType =
  | number
  | {
      enter?: number;
      exit?: number;
    };

export type TransitionEasingType =
  | string
  | {
      enter?: string;
      exit?: string;
    };

export type TransitionPropsType = {
  /**
   * The content to animate. Supports either standard React nodes or a render
   * function receiving current animation phase information.
   */
  children?: ReactNode;

  /**
   * Animation preset variant name or custom keyframes definition.
   * @default "fade-up"
   */
  animate?: TransitionVariantType | TransitionKeyframesType;

  /**
   * Alias for `animate` to follow Polaris / design-system prop conventions.
   */
  variant?: TransitionVariantType | TransitionKeyframesType;

  /**
   * Whether the element is currently visible / active.
   * If not provided, defaults to `true` (animates in when mounted).
   */
  show?: boolean;

  /**
   * Inverse alias for `show` — convenient for wizard and stage workflows.
   * When `leaving={true}`, the component automatically transitions out.
   */
  leaving?: boolean;

  /**
   * Whether to animate into view when the component first mounts.
   * @default true
   */
  appear?: boolean;

  /**
   * Transition duration in milliseconds, or separate enter and exit durations.
   * @default 300
   */
  duration?: TransitionDurationType;

  /**
   * Transition delay in milliseconds, or separate enter and exit delays.
   * @default 0
   */
  delay?: TransitionDelayType;

  /**
   * CSS transition timing function, or separate enter and exit timing functions.
   * @default { enter: "cubic-bezier(0.22, 1, 0.36, 1)", exit: "ease" }
   */
  easing?: TransitionEasingType;

  /**
   * When `true`, exiting returns strictly back to the `enterFrom` position
   * (pure reverse motion) rather than the forward `exitTo` position.
   * @default false
   */
  reverse?: boolean;

  /** Called when the enter transition begins. */
  onEnter?: () => void;

  /** Called when the enter transition completes. */
  onEntered?: () => void;

  /** Called when the exit transition begins. */
  onExit?: () => void;

  /** Called when the exit transition completes. */
  onExited?: () => void;

  /** HTML element type used for the outer wrapper. @default "div" */
  as?: ElementType;

  /** Width / inline size of the wrapper. */
  inlineSize?: string | number;

  /** Height / block size of the wrapper. */
  blockSize?: string | number;

  /** CSS display property. */
  display?: CSSProperties["display"];

  /** CSS align-items property. */
  alignItems?: CSSProperties["alignItems"];

  /** CSS justify-content property. */
  justifyContent?: CSSProperties["justifyContent"];

  /** CSS flex-direction property. */
  flexDirection?: CSSProperties["flexDirection"];

  /** Additional custom inline styles. */
  style?: CSSProperties;

  /** Additional class name. */
  className?: string;

  /** HTML element ID. */
  id?: string;
};
