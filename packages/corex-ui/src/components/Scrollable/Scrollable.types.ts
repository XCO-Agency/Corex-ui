import type { CSSProperties, ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeScrollBoxProps = PolarisPropsType<"s-scroll-box">;

export type ScrollablePropsType = Omit<
  NativeScrollBoxProps,
  "children" | "overflow"
> & {
  children?: ReactNode;
  /**
   * `s-scroll-box`'s overflow, as one keyword or the two-value block/inline
   * shorthand. Typed as a string because the element's own union of every
   * shorthand pair is too large for the compiler to serialize into our `.d.ts`.
   */
  overflow?: string;
  /** @deprecated v12 drew shadows at the scroll edges; `s-scroll-box` does not. */
  shadow?: boolean;
  /** Makes the pane focusable, so a keyboard user can scroll it. */
  focusable?: boolean;
  /** v12 scrolled one axis at a time. Both default to the element's `auto`. */
  horizontal?: boolean;
  vertical?: boolean;
  /** @deprecated v12 nudged the pane to hint that it scrolls; not reproduced. */
  hint?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
};
