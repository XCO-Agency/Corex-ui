import type { CSSProperties, ReactNode } from "react";
import type {
  BoxPaddingType,
  ButtonVariantType,
  IconType,
  PaddingKeywordType,
  TargetType,
  ToneType,
} from "../../types/common";
import type { BoxPropsType } from "../Box";

/**
 * Action descriptor for buttons rendered inside EmptyState.
 */
export type EmptyStateActionType = {
  /** Text content displayed inside the button */
  content: string;
  /** Callback fired when the action button is clicked */
  onAction?: () => void;
  /** URL to navigate to if action behaves as a link */
  url?: string;
  /** Target window/tab for links (e.g. "_blank") */
  target?: TargetType;
  /** Whether the action button is disabled */
  disabled?: boolean;
  /** Whether the action button is in a loading state */
  loading?: boolean;
  /** Visual tone (e.g. "critical") */
  tone?: ToneType;
  /** Visual variant (e.g. "primary", "secondary", "tertiary", "plain") */
  variant?: ButtonVariantType;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Unique ID for the action element */
  id?: string;
  [key: string]: unknown;
};

/**
 * Props for the EmptyState component.
 */
export type EmptyStatePropsType = {
  /**
   * The heading title for the empty state.
   */
  heading?: ReactNode;
  /**
   * Legacy Polaris alias for `heading`.
   */
  title?: ReactNode;
  /**
   * Primary action button descriptor or custom React node.
   */
  action?: EmptyStateActionType | ReactNode;
  /**
   * Secondary action button descriptor or custom React node.
   */
  secondaryAction?: EmptyStateActionType | ReactNode;
  /**
   * Primary illustration / image: URL string or custom ReactNode (SVG, Image component).
   */
  image?: string | ReactNode;
  /**
   * Larger image alternative URL or ReactNode for wider screens.
   */
  largeImage?: string | ReactNode;
  /**
   * Whether the image should be constrained within a contained width.
   */
  imageContained?: boolean;
  /**
   * Alternative text for the image illustration.
   */
  imageAlt?: string;
  /**
   * Polaris icon name or icon component when an icon is used instead of an image.
   */
  icon?: IconType | ReactNode;
  /**
   * Additional footer content displayed below the action buttons (e.g. help link).
   */
  footerContent?: ReactNode;
  /**
   * Whether the empty state should span full container width instead of bounded max width.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Main description or additional content of the empty state.
   */
  children?: ReactNode;
  /**
   * Padding using Polaris spacing tokens.
   * @default "large-200"
   */
  padding?: BoxPaddingType;
  /**
   * Custom CSS class name.
   */
  className?: string;
  /**
   * Unique element ID.
   */
  id?: string;
  /**
   * Inline styles with Polaris CSS custom properties.
   */
  style?: CSSProperties;
};

export type EmptyStateComponentType = React.ForwardRefExoticComponent<
  EmptyStatePropsType & React.RefAttributes<HTMLDivElement>
>;
