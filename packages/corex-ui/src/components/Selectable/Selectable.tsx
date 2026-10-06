import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type KeyboardEvent,
  type ReactElement,
  type RefAttributes,
} from "react";
import { mergeRefs } from "../../core/mergeRefs";
import { Icon } from "../Icon";
import type {
  SelectableGroupPropsType,
  SelectablePropsType,
  SelectableRadiusType,
  SelectableToneType,
} from "./Selectable.types";

/** Outline colours per tone; each can be themed with `--cx-selectable-<tone>`. */
const TONE_COLORS: Record<SelectableToneType, string> = {
  auto: "var(--cx-selectable-info, #0a0a0a)",
  info: "var(--cx-selectable-info, #005bd3)",
  success: "var(--cx-selectable-success, #aafb6a)",
  warning: "var(--cx-selectable-warning, #b98900)",
  caution: "var(--cx-selectable-warning, #b98900)",
  critical: "var(--cx-selectable-critical, #e22c38)",
  neutral: "var(--cx-selectable-neutral, #0a0a0a)",
};

const RADIUS: Record<SelectableRadiusType, string> = {
  none: "0px",
  small: "4px",
  base: "8px",
  large: "16px",
  "large-100": "16px",
};

const STYLE_ID = "cx-selectable-styles";

const SELECTABLE_CSS = `
.cx-selectable { position: relative; display: block; border-radius: var(--cx-sel-radius); outline: none; }
.cx-selectable--auto { display: inline-block; }
.cx-selectable--interactive { cursor: pointer; }
.cx-selectable--disabled { cursor: not-allowed; opacity: 0.5; }
.cx-selectable--shadow {
  box-shadow:
    0 0 12px 3px color-mix(
      in srgb,
      var(--cx-sel-color, #0a0a0a) 25%,
      transparent
    ),
    0 1px 6px color-mix(
      in srgb,
      var(--cx-sel-color, #0a0a0a) 20%,
      transparent
    );
}
.cx-selectable__ring {
  position: absolute;
  inset: calc(var(--cx-sel-offset) * -1);
  border-radius: calc(var(--cx-sel-radius) + var(--cx-sel-offset));
  box-shadow: 0 0 0 var(--cx-sel-width) var(--cx-sel-color);
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms ease;
}
.cx-selectable--selected > .cx-selectable__ring { opacity: 1; }
.cx-selectable--interactive:not(.cx-selectable--disabled):not(.cx-selectable--selected):hover > .cx-selectable__ring {
  opacity: 0.35;
}
.cx-selectable:focus-visible > .cx-selectable__ring {
  opacity: 1;
  box-shadow: 0 0 0 var(--cx-sel-width) var(--cx-sel-color), 0 0 0 calc(var(--cx-sel-width) + 2px) var(--cx-selectable-focus, #ffffff);
}
.cx-selectable__badge {
  position: absolute;
  inset-block-start: -8px;
  inset-inline-end: -8px;
  inline-size: 20px;
  block-size: 20px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cx-sel-color);
  transform: scale(0.4);
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms ease, transform 150ms ease;
}
.cx-selectable--selected > .cx-selectable__badge { transform: scale(1); opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  .cx-selectable__ring, .cx-selectable__badge { transition: none; }
}
`;

/**
 * Adds the shared stylesheet to the document the element actually lives in
 * (which differs from the global `document` inside iframes and portals), once.
 */
function ensureStyles(node: HTMLElement | null) {
  const doc = node?.ownerDocument;
  if (!doc || doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = SELECTABLE_CSS;
  doc.head.appendChild(style);
}

type GroupContextType = {
  selectedValues: string[];
  multiple: boolean;
  disabled: boolean;
  tone?: SelectableToneType;
  toggle: (value: string) => void;
};

const SelectableGroupContext = createContext<GroupContextType | null>(null);

/**
 * Wraps any element or card and draws a toned outline around it while it is
 * selected, so a choice reads clearly. Standalone it toggles on click or
 * Space/Enter; inside `Selectable.Group` the group owns the selection.
 */
const SelectableRoot: ForwardRefExoticComponent<
  SelectablePropsType & RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, SelectablePropsType>(function Selectable(
  {
    children,
    selected: controlledSelected,
    defaultSelected = false,
    onSelectedChange,
    value,
    tone,
    interactive = true,
    disabled,
    shadow,
    indicator = false,
    outlineWidth = 2,
    outlineOffset = 0,
    borderRadius = "base",
    inlineSize = "fill",
    accessibilityLabel,
    id,
    className,
    style,
  },
  ref,
): ReactElement {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => ensureStyles(nodeRef.current), []);
  const group = useContext(SelectableGroupContext);
  const inGroup = group !== null && value !== undefined;

  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const isSelected = inGroup
    ? group.selectedValues.includes(value)
    : (controlledSelected ?? internalSelected);
  const isDisabled = Boolean(disabled || group?.disabled);
  const isInteractive = interactive && !isDisabled;
  const resolvedTone = tone ?? group?.tone ?? "neutral";

  const toggle = () => {
    if (!isInteractive) return;
    if (inGroup) {
      group.toggle(value);
      return;
    }
    const next = !isSelected;
    if (controlledSelected === undefined) setInternalSelected(next);
    onSelectedChange?.(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      toggle();
    }
  };

  const classes = [
    "cx-selectable",
    inlineSize === "auto" && "cx-selectable--auto",
    isSelected && "cx-selectable--selected",
    interactive && !isDisabled && "cx-selectable--interactive",
    isDisabled && "cx-selectable--disabled",
    shadow && isSelected && "cx-selectable--shadow",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const cssVars = {
    "--cx-sel-color": TONE_COLORS[resolvedTone],
    "--cx-sel-radius": RADIUS[borderRadius],
    "--cx-sel-width": `${outlineWidth}px`,
    "--cx-sel-offset": `${outlineOffset}px`,
    ...style,
  } as CSSProperties;

  const role = !interactive
    ? undefined
    : inGroup && !group.multiple
      ? "radio"
      : "checkbox";

  return (
    <div
      ref={mergeRefs(nodeRef, ref)}
      id={id}
      className={classes}
      style={cssVars}
      role={role}
      aria-checked={role ? isSelected : undefined}
      aria-disabled={isDisabled || undefined}
      aria-label={accessibilityLabel}
      aria-current={!interactive && isSelected ? true : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? toggle : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
    >
      {children}
      <span className="cx-selectable__ring" aria-hidden="true" />
      {indicator ? (
        <span className="cx-selectable__badge" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3.75 9.5L6.5 12.25L12.248 4.75"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
    </div>
  );
});

/** Manages the selection of several `Selectable` items: radio-like, or `multiple`. */
function SelectableGroup({
  children,
  multiple = false,
  value: controlledValue,
  defaultValue = [],
  onChange,
  tone,
  disabled = false,
  accessibilityLabel,
  id,
}: SelectableGroupPropsType): ReactElement {
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const selectedValues = controlledValue ?? internalValue;

  const toggle = useCallback(
    (itemValue: string) => {
      const isSelected = selectedValues.includes(itemValue);
      let next: string[];
      if (multiple) {
        next = isSelected
          ? selectedValues.filter((item) => item !== itemValue)
          : [...selectedValues, itemValue];
      } else {
        // Radio behaviour: picking the chosen item again keeps it chosen.
        next = [itemValue];
      }
      if (controlledValue === undefined) setInternalValue(next);
      onChange?.(next);
    },
    [selectedValues, multiple, controlledValue, onChange],
  );

  const context = useMemo<GroupContextType>(
    () => ({ selectedValues, multiple, disabled, tone, toggle }),
    [selectedValues, multiple, disabled, tone, toggle],
  );

  return (
    <SelectableGroupContext.Provider value={context}>
      <div
        id={id}
        role={multiple ? "group" : "radiogroup"}
        aria-label={accessibilityLabel}
      >
        {children}
      </div>
    </SelectableGroupContext.Provider>
  );
}

SelectableRoot.displayName = "Selectable";

export const Selectable = Object.assign(SelectableRoot, { Group: SelectableGroup });
