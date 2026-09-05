import type { ReactNode } from "react";
import type { IconType, PolarisPropsType } from "../../types/common";

type NativePageProps = PolarisPropsType<"s-page">;

/**
 * Valid inline sizes for the `s-page` web component.
 */
export type PageInlineSizeType = NonNullable<NativePageProps["inlineSize"]>;

/**
 * Action descriptor for the primary action button.
 */
export type PagePrimaryActionType = {
  /** Text content or React node displayed inside the button */
  content?: ReactNode;
  /** Callback fired when the action is triggered */
  onAction?: () => void;
  /** Whether the action button is disabled */
  disabled?: boolean;
  /** Whether the action button is in a loading state */
  loading?: boolean;
  /** Destructive styling (red/critical) */
  destructive?: boolean;
  /** URL to navigate to if the action behaves as a link */
  url?: string;
  /** Whether to open the link in a new tab */
  external?: boolean;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Unique ID for the action element */
  id?: string;
  [key: string]: unknown;
};

/**
 * Action descriptor for secondary page actions.
 */
export type PageMenuActionDescriptorType = {
  /** Text content or React node displayed inside the button */
  content?: ReactNode;
  /** Callback fired when the action is triggered */
  onAction?: () => void;
  /** Whether the action button is disabled */
  disabled?: boolean;
  /** Whether the action button is in a loading state */
  loading?: boolean;
  /** Destructive styling (red/critical) */
  destructive?: boolean;
  /** URL to navigate to if the action behaves as a link */
  url?: string;
  /** Whether to open the link in a new tab */
  external?: boolean;
  /** Optional icon identifier */
  icon?: IconType;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Unique ID for the action element */
  id?: string;
  [key: string]: unknown;
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
 * Page pagination properties (legacy Polaris).
 */
export type PagePaginationPropsType = {
  /** Tooltip for next page button */
  nextTooltip?: string;
  /** Tooltip for previous page button */
  previousTooltip?: string;
  /** URL for next page */
  nextURL?: string;
  /** URL for previous page */
  previousURL?: string;
  /** Whether a next page exists */
  hasNext?: boolean;
  /** Whether a previous page exists */
  hasPrevious?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Callback for next page */
  onNext?: () => void;
  /** Callback for previous page */
  onPrevious?: () => void;
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
   * The text to be used as subtitle (native `s-page` prop).
   */
  subheading?: string;

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
   * @deprecated Use `subheading` instead. Page subtitle, in regular type.
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
   * @deprecated Page-level pagination is not directly supported on `s-page`. Render pagination inside the page body.
   */
  pagination?: PagePaginationPropsType;

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
