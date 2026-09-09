import type { FocusEvent, MouseEvent, ReactNode } from "react";
import type { PolarisPropsType, TargetType } from "../../types/common";
import type { LegacyBoxPropsType, NativeBoxOverridesType } from "../Box/Box.types";

type NativeClickableProps = PolarisPropsType<"s-clickable">;
type SizeUnitsOrAuto = PolarisPropsType<"s-clickable">["inlineSize"];

export type ClickableButtonType = "button" | "submit" | "reset" | (string & {});

export type ClickablePropsType = Omit<
  NativeClickableProps,
  | keyof NativeBoxOverridesType
  | "target"
  | "type"
  | "onClick"
  | "slot"
  | "children"
  | "inlineSize"
> &
  NativeBoxOverridesType &
  LegacyBoxPropsType & {
    /** Target browsing context for navigation ('_blank' | '_self' | '_parent' | '_top'). */
    target?: TargetType;
    inlineSize?: "fill" | "auto" | SizeUnitsOrAuto;
    /** Convenience prop: opens link in a new tab with rel="noopener noreferrer". */
    external?: boolean;
    /** Button behavior type ('button' | 'submit' | 'reset'). */
    type?: ClickableButtonType;
    /** Callback fired on click. */
    onClick?: ((event: MouseEvent) => void) | null;
    /** Callback fired on blur. */
    onBlur?: ((event: FocusEvent) => void) | null;
    /** Callback fired on focus. */
    onFocus?: ((event: FocusEvent) => void) | null;
  };
