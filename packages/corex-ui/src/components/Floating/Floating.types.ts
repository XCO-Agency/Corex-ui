import type { CSSProperties, ReactNode } from "react";

export type FloatingPositionType =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left"
  | "bottom-center"
  | "top-center"
  | "middle-left"
  | "middle-right"
  | "center";

export type FloatingStrategyType = "fixed" | "absolute";

export type FloatingOffsetDetailsType = {
  x?: number | string;
  y?: number | string;
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
};

export type FloatingOffsetType = number | string | FloatingOffsetDetailsType;

export type FloatingRenderPropsType = {
  collapsed: boolean;
  toggleCollapse: () => void;
  expand: () => void;
  collapse: () => void;
};

export type FloatingPropsType = {
  /**
   * Children rendered when floating UI is expanded (or always if not collapsible).
   * Supports standard ReactNode or a render function receiving collapse state controls.
   */
  children?: ReactNode | ((props: FloatingRenderPropsType) => ReactNode);

  /**
   * Position anchor on screen or relative parent container.
   * @default "bottom-right"
   */
  position?: FloatingPositionType;

  /**
   * CSS positioning mode.
   * @default "fixed"
   */
  strategy?: FloatingStrategyType;

  /**
   * Edge offset distance from the viewport or container boundaries.
   * Can be a number (pixels), string (e.g. "16px", "2rem"), or object with directional offsets.
   * @default 20
   */
  offset?: FloatingOffsetType;

  /**
   * Z-index layer for the floating container.
   * @default 500
   */
  zIndex?: number | string;

  /**
   * Whether the container background is transparent and allows click-through on empty regions.
   * @default true
   */
  transparent?: boolean;

  /**
   * Whether the floating UI can be collapsed.
   * @default false
   */
  collapsible?: boolean;

  /**
   * Controlled collapsed state.
   */
  collapsed?: boolean;

  /**
   * Default collapsed state when uncontrolled.
   * @default false
   */
  defaultCollapsed?: boolean;

  /**
   * Callback fired when collapsed state changes.
   */
  onToggleCollapse?: (collapsed: boolean) => void;

  /**
   * Callback fired when collapsed state changes (alias).
   */
  onCollapsedChange?: (collapsed: boolean) => void;

  /**
   * Node to render when collapsed (e.g. floating action button or icon trigger).
   * Supports standard ReactNode or a render function with an expand helper.
   */
  collapsedContent?: ReactNode | ((props: { expand: () => void }) => ReactNode);

  /**
   * Optional custom collapse trigger node.
   */
  collapseTrigger?: ReactNode;

  /**
   * Accessible label for the floating region or trigger.
   */
  accessibilityLabel?: string;

  /**
   * Additional CSS class name for the root floating container.
   */
  className?: string;

  /**
   * Additional inline styles for the root floating container.
   */
  style?: CSSProperties;

  /**
   * Unique ID for the floating element.
   */
  id?: string;
};
