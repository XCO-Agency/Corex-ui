import type { ReactNode } from "react";

/** The id a row is keyed and announced by. */
export type ConditionsRepeaterKeyType = string | number;

export type ConditionsRepeaterPropsType<ItemType> = {
  /** The rows, in order. */
  items: readonly ItemType[];
  /**
   * A stable id per row. Defaults to `item.id`, then the index. A stable id is
   * what lets a row added after the first render grow in while the rest stay.
   */
  getItemId?: (item: ItemType, index: number) => ConditionsRepeaterKeyType;
  /**
   * The row's top line: its field, operator, comparator... Usually
   * `ConditionsRepeater.Pill`s. Wraps when it runs out of room.
   */
  renderControls: (item: ItemType, index: number) => ReactNode;
  /**
   * What goes under the row's divider, edge to edge (a text field, a tag
   * input). Return `null` for a row whose choice is complete without one
   * (a yes/no or a date range picked from the operator).
   */
  renderValue?: (item: ItemType, index: number) => ReactNode;
  /**
   * Removes the row. Shown as a trash button that appears while the row is
   * hovered or holds keyboard focus. It is immediate: no confirmation and no
   * exit animation, so the list and anything that reads it change in the same
   * update. Without it there is no trash button.
   */
  onRemove?: (item: ItemType, index: number) => void;
  /** Accessible label for a row's trash button. @default "Remove condition" */
  removeAccessibilityLabel?: string | ((item: ItemType, index: number) => string);

  /** Label of the add button. @default "Add condition" */
  addLabel?: ReactNode;
  /**
   * Fires on the add button. With `addMenu` the button opens that menu
   * instead, and this still fires as it opens.
   */
  onAdd?: () => void;
  /**
   * A menu under the add button (a field picker). The button toggles it; it
   * closes on Escape and on a click outside.
   */
  addMenu?: ReactNode;
  /** Controlled open state of `addMenu`. */
  addMenuOpen?: boolean;
  /** Fires when `addMenu` wants to open or close. */
  onAddMenuOpenChange?: (open: boolean) => void;
  /** Hides the add button. @default false */
  hideAdd?: boolean;
  /**
   * The most rows allowed (a plan limit). At the limit the add button is
   * disabled and `limitNote` shows under the footer.
   */
  maxItems?: number;
  /** Why the add button is off at `maxItems`, with an upgrade action if any. */
  limitNote?: ReactNode;
  /** End of the footer row, opposite the add button. */
  footerEnd?: ReactNode;
  /**
   * Shown in place of the rows when there are none. Plain strings render as
   * critical text, as a form that cannot save without a condition says why.
   */
  emptyState?: ReactNode;
  /** Disables adding and removing. @default false */
  disabled?: boolean;
  /**
   * Grows a row in when it is added after the first render, and shows nothing
   * moving on the first render. @default true
   */
  animateNewItems?: boolean;
  /** Names the list for assistive technology. @default "Conditions" */
  accessibilityLabel?: string;
  id?: string;
};

export type ConditionsRepeaterPillPropsType = {
  /** The current choice, or a prompt when there is none. */
  label: ReactNode;
  /** Whether the pill's menu is open; sets `aria-expanded`. */
  open?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  /** Defaults to `label` when that is a string. */
  accessibilityLabel?: string;
  /**
   * A menu anchored under the pill. The pill toggles it through
   * `onOpenChange`; Escape and a click outside close it.
   */
  menu?: ReactNode;
  /** Fires when the pill's `menu` wants to open or close. */
  onOpenChange?: (open: boolean) => void;
};

export type ConditionsRepeaterOptionType = {
  label: string;
  value: string;
  /** A second, subdued line under the label. */
  detail?: string;
};

export type ConditionsRepeaterOptionsPropsType = {
  options: readonly ConditionsRepeaterOptionType[];
  /** The selected value, or values for a multi-pick menu. */
  selected?: string | readonly string[];
  onSelect: (value: string) => void;
};

/** How a row's values combine: every one must match, or any one. */
export type ConditionsMatchModeType = "all" | "any";

export type ConditionsRepeaterTagsInputPropsType = {
  /** The chosen values, in order. */
  values: readonly string[];
  /** The next list after a value is added or removed. */
  onChange: (values: string[]) => void;
  /**
   * How the values combine, shown as a badge between chips.
   * @default "any"
   */
  mode?: ConditionsMatchModeType;
  /** The badge text per mode. @default { all: "AND", any: "OR" } */
  joinLabels?: { all: string; any: string };
  /** Input placeholder and accessible name. @default "Add a value" */
  placeholder?: string;
  /** Values to offer while typing; ones already chosen are left out. */
  suggestions?: readonly string[];
  /**
   * Loads the suggestions the first time the list opens (a store's tags,
   * vendors...). Typing a value still works if it fails.
   */
  loadSuggestions?: () => Promise<readonly string[]>;
  /** Change it to load again (a row switched from tags to vendors). */
  suggestionsKey?: string | number;
  /** Keys that turn the typed text into a chip. @default ["Enter", ","] */
  commitKeys?: readonly string[];
  /** Accessible label of a chip's remove control. @default `Remove ${value}` */
  removeAccessibilityLabel?: (value: string) => string;
  disabled?: boolean;
};

export type ConditionsRepeaterMatchModePropsType = {
  value: ConditionsMatchModeType;
  onChange: (value: ConditionsMatchModeType) => void;
  /** The pill and menu labels. @default { all: "All", any: "Any" } */
  labels?: { all: string; any: string };
  /**
   * A sentence on what the current mode does, at the top of the menu and as
   * the pill's accessible label.
   */
  help?: string | ((mode: ConditionsMatchModeType) => string);
  /**
   * Fixes the mode (a product has one type, so several types only make sense
   * as "any"): the pill is disabled and `help` shows on hover.
   */
  locked?: boolean;
  /** Controlled menu state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};
