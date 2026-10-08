import type { ReactNode } from "react";

export type HoverableAnimationType = "fade" | "slide-up" | "slide-down" | "scale" | "none";

export type HoverableStateType = {
  /** `true` while the pointer is over the group (or focus is inside it). */
  hovered: boolean;
};

export type HoverablePropsType = {
  /**
   * Content of the hover group. Pass a function to read the hover state
   * directly, with or without `Hoverable.Show` / `Hoverable.Hide`.
   */
  children?: ReactNode | ((state: HoverableStateType) => ReactNode);
  /** Controlled hover state; overrides the pointer. */
  hovered?: boolean;
  /** Fires whenever the hover state changes. */
  onHoverChange?: (hovered: boolean) => void;
  /** Treats keyboard focus inside the group as hovering. @default true */
  includeFocus?: boolean;
  /** Freezes the group in its not-hovered state. @default false */
  disabled?: boolean;
  /** Delay in ms before the hovered state turns on. @default 0 */
  openDelay?: number;
  /** Delay in ms before the hovered state turns off. @default 0 */
  closeDelay?: number;
};

export type HoverableSlotPropsType = {
  children?: ReactNode;
  /** Enter/leave animation. @default "fade" */
  animation?: HoverableAnimationType;
  /** Animation length in ms. @default 150 */
  duration?: number;
  /**
   * Keeps the hidden content's space so nothing around it moves.
   * Set `false` to remove it from the layout while hidden (no leave animation).
   * @default true
   */
  keepSpace?: boolean;
};
