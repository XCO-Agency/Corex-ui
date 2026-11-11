import type { ReactNode } from "react";
import type { IconType, PolarisPropsType } from "../../types/common";
import type { ButtonPropsType } from "../Button";

type NativePageProps = PolarisPropsType<"s-page">;

/**
 * Valid inline sizes for the `s-page` web component.
 */
export type PageInlineSizeType = NonNullable<NativePageProps["inlineSize"]>;

/**
 * `s-button` props that a page action can carry.
 *
 * Matches the button web component: `accessibilityLabel`, `command`,
 * `commandFor`, `disabled`, `download`, `href`, `icon`, `inlineSize`,
 * `interestFor`, `loading`, `target`, `tone`, `type`, plus click, focus,
 * and blur. Legacy `url`, `external`, `destructive`, and `submit` still map
 * through `Button`.
 *
 * https://shopify.dev/docs/api/app-home/latest/web-components/actions/button
 */
type PageActionButtonProps = Omit<ButtonPropsType, "slot" | "variant" | "children">;

/**
 * Shared fields for a page action descriptor.
 * `content` is the legacy label; `children` is the button slot of the same name.
 * `onAction` is the legacy click callback; `onClick` is the button event.
 */
export type PageActionDescriptorType = PageActionButtonProps & {
  /** Label shown inside the button. Alias for the button `children`. */
  content?: ReactNode;
  /** Button label. Used when `content` is omitted. */
  children?: ReactNode;
  /** @deprecated Use `onClick`. Fired when the action button is activated. */
  onAction?: () => void;
  /**
   * Present on every action so callers can narrow it per slot.
   * Primary only accepts `"primary"`; secondary accepts `"secondary"` or `"auto"`.
   */
  variant?: "primary" | "secondary" | "auto";
};

/**
 * Primary page action.
 * The `primary-action` slot only accepts one button with `variant="primary"`.
 * Passing `variant` is optional; the slot always renders `primary`.
 *
 * https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page
 */
export type PagePrimaryActionType = PageActionDescriptorType & {
  /** Fixed by the primary-action slot. Any other value is ignored. */
  variant?: "primary";
};

/**
 * Secondary page action.
 * The `secondary-actions` slot only accepts buttons with `variant` `secondary`
 * or `auto`.
 *
 * https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/page
 */
export type PageMenuActionDescriptorType = PageActionDescriptorType & {
  /**
   * Visual emphasis. The slot rejects every other variant.
   * @default 'auto'
   */
  variant?: "auto" | "secondary";
};

/**
 * Group of secondary actions (legacy Polaris).
 */
export type PageMenuGroupDescriptorType = {
  /** Group title */
  title: string;
  /** Actions contained within this group */
  actions: PageMenuActionDescriptorType[];
  /** Optional icon */
  icon?: IconType;
  /** Optional details */
  details?: ReactNode;
  [key: string]: unknown;
};

/**
 * Action descriptor for back navigation link.
 */
export type PageBackActionType = {
  /** Text label for the back button */
  content?: string;
  /** URL to navigate back to */
  url?: string;
  /** Callback when back button is clicked */
  onAction?: () => void;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Unique ID */
  id?: string;
  [key: string]: unknown;
};

/**
 * Props for the `Page` component.
 * Combines native `s-page` web component attributes/slots with backward-compatible legacy Polaris props.
 */
export type PagePropsType = {
  /**
   * The main content of the page.
   */
  children?: ReactNode;

  /**
   * The main page heading (native `s-page` prop).
   */
  heading?: string;

  /**
   * The inline size of the page (native `s-page` prop).
   * - `base`: default inline size
   * - `large`: full width with whitespace
   * - `small`: narrow / single-column layout
   * @default 'base'
   */
  inlineSize?: PageInlineSizeType;

  /**
   * A unique identifier for the element.
   */
  id?: string;

  /**
   * Additional CSS classes.
   */
  className?: string;

  /**
   * Supplementary content displayed in a sidebar alongside the main content (slot="aside").
   * Only rendered when `inlineSize` is set to `base`.
   */
  aside?: ReactNode;

  /**
   * Additional contextual information about the page (slot="accessory").
   */
  accessory?: ReactNode;

  /**
   * Navigation links to navigate back to parent pages (slot="breadcrumb-actions").
   * Typically displays as a back arrow or breadcrumb trail in the page header.
   */
  breadcrumbActions?: ReactNode;

  /**
   * Primary page-level action.
   * Can be an action descriptor object or a React element.
   * Rendered in `slot="primary-action"` with variant="primary".
   */
  primaryAction?: PagePrimaryActionType | ReactNode;

  /**
   * Collection of secondary page-level actions.
   * Can be an array of action descriptors or React nodes, or a single React node.
   * Rendered in `slot="secondary-actions"`.
   */
  secondaryActions?: (PageMenuActionDescriptorType | ReactNode)[] | ReactNode;

  /* =========================================================================
   * Deprecated Legacy Polaris Props (Kept for backwards compatibility)
   * ========================================================================= */

  /**
   * @deprecated Use `heading` instead. Page title, in large type.
   */
  title?: string;

  /**
   * @deprecated not exist on new UI.
   */
  subtitle?: string;

  /**
   * @deprecated Use `inlineSize="large"` instead. Remove the normal max-width on the page.
   */
  fullWidth?: boolean;

  /**
   * @deprecated Use `inlineSize="small"` instead. Decreases the maximum layout width. Intended for single-column layouts.
   */
  narrowWidth?: boolean;

  /**
   * @deprecated Use `breadcrumbActions` instead. A back action link.
   */
  backAction?: PageBackActionType;

  /**
   * @deprecated Visually hiding the title is not directly supported on `s-page`.
   */
  titleHidden?: boolean;

  /**
   * @deprecated Accessibility labels are handled differently in web components.
   */
  pageReadyAccessibilityLabel?: string;

  /**
   * @deprecated Filtering action list items is not supported on `s-page`.
   */
  filterActions?: boolean;

  /**
   * @deprecated Action groups are not directly supported on `s-page`. Provide individual actions in `secondaryActions`.
   */
  actionGroups?: PageMenuGroupDescriptorType[];

  /**
   * @deprecated Use `accessory` or place status information inside the page body.
   */
  titleMetadata?: ReactNode;

  /**
   * @deprecated Use `accessory` or place metadata inside the page body.
   */
  additionalMetadata?: ReactNode | string;

  /**
   * @deprecated Spacing between heading and subheading is managed automatically by `s-page`.
   */
  compactTitle?: boolean;

  /**
   * @deprecated Subtitle max-width is managed automatically by `s-page`.
   */
  hasSubtitleMaxWidth?: boolean;

  /**
   * @deprecated Action rollup is managed automatically by `s-page`.
   */
  onActionRollup?(hasRolledUp: boolean): void;
};
