import type {
  CSSProperties,
  ForwardRefExoticComponent,
  MouseEvent,
  ReactElement,
  ReactNode,
  RefAttributes,
} from "react";
import type { SelectableIndicatorType, SelectableToneType } from "../Selectable";
import type { DropZonePropsType } from "../DropZone";
import type { TransitionVariantType } from "../Transition";

export type MediaViewType = "grid" | "list";

export type MediaPreviewFitType = "cover" | "contain";

export type MediaContextType = {
  view: MediaViewType;
  setView: (view: MediaViewType) => void;
  toggleView: () => void;
  selectedValues: string[];
  selectedCount: number;
  multiple: boolean;
  disabled: boolean;
  tone: SelectableToneType;
  detailValue: string | null;
  setDetailValue: (value: string | null) => void;
  clearSelection: () => void;
  previewFit: MediaPreviewFitType;
};

export type MediaItemContextType = {
  value: string;
  selected: boolean;
};

export type MediaPropsType = {
  children?: ReactNode;
  /** Controlled selected item ids. */
  value?: string[];
  /** Uncontrolled initial selection. */
  defaultValue?: string[];
  /** Fires with the full list of selected ids. */
  onChange?: (value: string[]) => void;
  /** Allow selecting several items. @default false */
  multiple?: boolean;
  /** Controlled browse layout. */
  view?: MediaViewType;
  /** Uncontrolled initial browse layout. @default "grid" */
  defaultView?: MediaViewType;
  /** Fires when grid/list view changes. */
  onViewChange?: (view: MediaViewType) => void;
  /**
   * Controlled id of the item shown in `Media.Detail`.
   * Pass `null` to hide the detail panel.
   */
  detailValue?: string | null;
  /** Uncontrolled initial detail id. */
  defaultDetailValue?: string | null;
  /** Fires when the detail panel target changes. */
  onDetailChange?: (value: string | null) => void;
  /** Default Selectable tone for items. @default "neutral" */
  tone?: SelectableToneType;
  disabled?: boolean;
  /** Accessible name for the selection group. */
  accessibilityLabel?: string;
  /** Minimum column width for the auto-fill grid. @default "9.5rem" */
  gridMinInlineSize?: string;
  /**
   * Fixed column count for the grid. When set, overrides `gridMinInlineSize`
   * auto-fill sizing.
   */
  columns?: number;
  /** Max height of `Media.Content` (enables independent scrolling). */
  contentMaxBlockSize?: string;
  /** Default image fit inside item previews. @default "cover" */
  previewFit?: MediaPreviewFitType;
  id?: string;
  className?: string;
  style?: CSSProperties;
};

export type MediaToolbarPropsType = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

export type MediaFiltersPropsType = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

export type MediaBodyPropsType = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

export type MediaContentPropsType = {
  children?: ReactNode;
  /** Override the root `contentMaxBlockSize` for this region. */
  maxBlockSize?: string;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

export type MediaItemPropsType = {
  children?: ReactNode;
  /** Stable id used for selection and detail. */
  value: string;
  /** Accessible name for the selectable control. */
  accessibilityLabel?: string;
  /**
   * Selection mark. Defaults to checkbox (multi) or radio (single) from the root.
   * Pass `false` to hide the mark.
   */
  indicator?: SelectableIndicatorType;
  /** Called on double-click / Activate — also opens detail by default. */
  onActivate?: (value: string) => void;
  /**
   * When true (default), activating an item sets `detailValue`.
   * @default true
   */
  openDetailOnActivate?: boolean;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

export type MediaPreviewPropsType = {
  children?: ReactNode;
  /** Image URL rendered as an `<img>` alongside any `children` (e.g. actions). */
  src?: string;
  alt?: string;
  /** Object-fit for the image. Falls back to the root `previewFit`. */
  fit?: MediaPreviewFitType;
  /** Override the default square aspect ratio (grid) or size. */
  aspectRatio?: string | number;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

export type MediaMetaPropsType = {
  children?: ReactNode;
  /** Primary label, usually the file name. */
  name?: ReactNode;
  /** File extension / MIME short label (e.g. `"JPG"`). */
  type?: ReactNode;
  /** List-view orientation label (e.g. `"Square"`). */
  orientation?: ReactNode;
  /** List-view date label (e.g. `"15 Oct"`). */
  date?: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

export type MediaActionsPropsType = {
  children?: ReactNode;
  /**
   * Hover reveal animation. Pass `false` to always show actions.
   * @default "fade"
   */
  animation?: false | "fade" | "slide-up" | "slide-down" | "scale" | "none";
  /** Animation duration in ms. @default 150 */
  duration?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

export type MediaUploadPropsType = {
  children?: ReactNode;
  /**
   * Visual treatment of the upload region.
   * - `dashed`: bordered drop strip (default)
   * - `plain`: no chrome — compose your own surface
   * @default "dashed"
   */
  variant?: "dashed" | "plain";
  /** Forwarded to an internal `DropZone` when truthy. */
  dropZone?: boolean | DropZonePropsType;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

export type MediaDetailPropsType = {
  children?: ReactNode;
  /** Panel heading shown above the body (e.g. `"Preview"`). */
  heading?: ReactNode;
  /** Shows a close control that clears `detailValue`. @default true when heading is set */
  closable?: boolean;
  /** Accessible label for the close control. @default "Close preview" */
  closeAccessibilityLabel?: string;
  /**
   * When true (default), the panel only mounts while `detailValue` is set.
   * @default true
   */
  gated?: boolean;
  /** Enter/exit animation. @default "fade-left" */
  animate?: TransitionVariantType;
  /** Animation duration in ms. @default 220 */
  duration?: number;
  /** Inline size of the panel. @default "18rem" */
  inlineSize?: string;
  /** Max inline size of the panel. @default "22rem" */
  maxInlineSize?: string;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

export type MediaEmptyPropsType = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

export type MediaTriggerVariantType = "default" | "preview";

export type MediaTriggerPropsType = {
  children?: ReactNode;
  /**
   * `preview` renders the blue eye chip used in the media library mock when
   * no `children` are passed.
   * @default "default"
   */
  variant?: MediaTriggerVariantType;
  /** Accessible name for the preview chip. @default "Preview" */
  accessibilityLabel?: string;
  /**
   * When used inside `Media.Item`, clicking opens that item in `Media.Detail`
   * (and does not toggle selection). Outside an item, only `onClick` runs.
   */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

export type MediaViewTogglePropsType = {
  /** Accessible labels for each mode. */
  gridLabel?: string;
  listLabel?: string;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

export type MediaComponentType = ForwardRefExoticComponent<
  MediaPropsType & RefAttributes<HTMLDivElement>
> & {
  Toolbar: ForwardRefExoticComponent<MediaToolbarPropsType & RefAttributes<HTMLDivElement>>;
  Filters: ForwardRefExoticComponent<MediaFiltersPropsType & RefAttributes<HTMLDivElement>>;
  Body: ForwardRefExoticComponent<MediaBodyPropsType & RefAttributes<HTMLDivElement>>;
  Content: ForwardRefExoticComponent<MediaContentPropsType & RefAttributes<HTMLDivElement>>;
  Item: ForwardRefExoticComponent<MediaItemPropsType & RefAttributes<HTMLDivElement>>;
  Preview: ForwardRefExoticComponent<MediaPreviewPropsType & RefAttributes<HTMLDivElement>>;
  Meta: ForwardRefExoticComponent<MediaMetaPropsType & RefAttributes<HTMLDivElement>>;
  Actions: ForwardRefExoticComponent<MediaActionsPropsType & RefAttributes<HTMLDivElement>>;
  Upload: ForwardRefExoticComponent<MediaUploadPropsType & RefAttributes<HTMLDivElement>>;
  Detail: ForwardRefExoticComponent<MediaDetailPropsType & RefAttributes<HTMLDivElement>>;
  Empty: ForwardRefExoticComponent<MediaEmptyPropsType & RefAttributes<HTMLDivElement>>;
  Trigger: ForwardRefExoticComponent<MediaTriggerPropsType & RefAttributes<HTMLElement>>;
  ViewToggle: ForwardRefExoticComponent<MediaViewTogglePropsType & RefAttributes<HTMLButtonElement>>;
};
