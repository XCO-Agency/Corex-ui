import type { FocusEvent, MouseEvent, ReactNode } from "react";
import type { BoxPropsType } from "../Box/Box.types";
import type { TargetType } from "../../types/common";

export type ClickableTargetType = TargetType;

export type ClickableButtonType =
  | "button"
  | "submit"
  | "reset"
  | (string & {});

/**
 * ClickableBoxPropsType reuses the shared BoxPropsType directly
 * avoiding any duplicated property declarations.
 */
export type ClickableBoxPropsType = BoxPropsType;

/**
 * Clickable specific base props matching Polaris <s-clickable>.
 */
export type ClickableBasePropsType = {
  /** Disables the clickable interaction. */
  disabled?: boolean;
  /** Displays a loading state on the clickable action. */
  loading?: boolean;
  /** The target browsing context for navigation ('_blank' | '_self' | '_parent' | '_top'). */
  target?: TargetType;
  /** The URL to navigate to when clicked. */
  href?: string;
  /** Convenience React alias for `href`. */
  url?: string;
  /** Convenience prop: opens link in a new tab with rel="noopener noreferrer". */
  external?: boolean;
  /** Prompts the user to save the linked URL instead of navigating. */
  download?: boolean | string;
  /** Button behavior type ('button' | 'submit' | 'reset'). */
  type?: ClickableButtonType;
  /** The Invoker Commands declarative trigger pattern (e.g. `command="--show"`). */
  command?: string;
  /** The `id` of the target element `command` acts on. */
  commandFor?: string;
  /** Popover interest trigger target ID. */
  interestFor?: string;
  /** Language attribute for internationalization. */
  lang?: string;
  /** Callback fired on click (React convention). */
  onClick?: ((event: MouseEvent) => void) | null;
  /** Callback fired on click (web component attribute convention). */
  onclick?: ((event: MouseEvent) => void) | null;
  /** Callback fired on blur (React convention). */
  onBlur?: ((event: FocusEvent) => void) | null;
  /** Callback fired on blur (web component attribute convention). */
  onblur?: ((event: FocusEvent) => void) | null;
  /** Callback fired on focus (React convention). */
  onFocus?: ((event: FocusEvent) => void) | null;
  /** Callback fired on focus (web component attribute convention). */
  onfocus?: ((event: FocusEvent) => void) | null;
};

/**
 * ClickablePropsType combines BoxPropsType with ClickableBasePropsType,
 * ensuring complete property parity with Polaris <s-clickable> without any duplication.
 */
export type ClickablePropsType = BoxPropsType &
  ClickableBasePropsType & {
    /** Alias for `children` (`<Clickable content="Action" />`). */
    content?: ReactNode;
  };

export type ClickableProps = ClickablePropsType;
export type ClickableActionPropsType = ClickablePropsType;
export type ClickableActionProps = ClickablePropsType;
