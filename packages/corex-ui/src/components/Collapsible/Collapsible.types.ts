import type { CSSProperties, ReactNode } from "react";

export type CollapsibleRenderPropsType = {
  /** Current expanded state. */
  expanded: boolean;
  /** Flips expanded to the opposite state. */
  toggle: () => void;
  /** Sets expanded to `true`. */
  expand: () => void;
  /** Sets expanded to `false`. */
  collapse: () => void;
};

export type CollapsiblePropsType = {
  /**
   * Controlled expanded state. Omit to let the component manage its own
   * state via `defaultExpanded`.
   */
  expanded?: boolean;

  /**
   * Whether to show a separator between the target and the content.
   * @default false
   */
  separator?: boolean;

  /**
   * Initial expanded state when uncontrolled.
   * @default false
   */
  defaultExpanded?: boolean;

  /**
   * Fired whenever the expanded state changes, whether controlled or
   * uncontrolled.
   */
  onExpandedChange?: (expanded: boolean) => void;

  /**
   * The always-visible target — a card grid, a row header, a trigger button.
   * Accepts a render function to read the current expanded state and its
   * `toggle`/`expand`/`collapse` helpers (e.g. to build a custom trigger).
   */
  children: ReactNode | ((props: CollapsibleRenderPropsType) => ReactNode);

  /**
   * Content revealed under an animated grow/shrink transition when expanded.
   * Stays mounted at all times so the height animation works for content of
   * any size and never has to remeasure the DOM.
   */
  content?: ReactNode | ((props: CollapsibleRenderPropsType) => ReactNode);

  /**
   * Frames the target and content together with a shared border/background
   * while expanded, so individual targets (e.g. cards) can drop their own
   * outline and read as one grouped surface.
   * @default true
   */
  framed?: boolean;

  /**
   * Expand/collapse transition duration, in milliseconds.
   * @default 240
   */
  duration?: number;

  /**
   * Transition timing function applied to the expand/collapse animation.
   * @default "cubic-bezier(0.2, 0, 0, 1)"
   */
  easing?: string;

  /** Accessible label for the root wrapper. */
  accessibilityLabel?: string;

  /** Id applied to the content region (and used to derive `aria-controls`). */
  id?: string;
};
