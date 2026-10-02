import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { Box } from "../Box";
import { BlockStack } from "../BlockStack";
import { InlineStack } from "../InlineStack";
import { Text } from "../Text";
import { Button } from "../Button";
import { Clickable } from "../Clickable";
import { Icon } from "../Icon";
import { Divider } from "../Divider";
import { IconTile } from "../IconTile";
import { ChoiceList } from "../ChoiceList";
import { TextField } from "../TextField";
import type {
  IndexAppliedFilterType,
  IndexFilterItemType,
  IndexFilterOperatorType,
  IndexFiltersSearchFieldPropsType,
} from "./IndexFilters.types";
import { Transition } from "../Transition";
import { Tooltip } from "../Tooltip";
import { FlexPopover } from "../FlexPopover";

/** Number of values shown inside a pill before collapsing into "+ n more". */
const MAX_VISIBLE_VALUES = 3;

const DEFAULT_OPERATORS: IndexFilterOperatorType[] = [
  { label: "Is", value: "is" },
  { label: "Is not", value: "is_not" },
];

/** Marks a filter pill; its value is the pill index in `appliedFilters`. */
const CHIP_ATTR = "data-corex-index-filters-chip";
const LEGACY_CHIP_ATTR = "data-corex-filters-chip";
/** Marks controls inside the field that must not move the caret on mouse down. */
const CONTROL_ATTR = "data-corex-index-filters-control";
const LEGACY_CONTROL_ATTR = "data-corex-filters-control";
/** Width (px) of the faded edges of the horizontally scrolling pills/text area. */
const SCROLL_FADE = 24;
const SCROLL_CLASS = "corex-index-filters-scroll corex-filters-scroll";

type ActivePopoverType =
  | { type: "categories" }
  | { type: "value"; key: string; fromCategories?: boolean }
  | { type: "operator"; key: string }
  | null;

const normalizeOperator = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

const toDomId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "_");

function resolveOperator(
  filterDef: IndexFilterItemType | undefined,
  applied: IndexAppliedFilterType,
): IndexFilterOperatorType {
  const operators = filterDef?.operators ?? DEFAULT_OPERATORS;
  const raw =
    applied.operator ?? filterDef?.defaultOperator ?? operators[0]?.value ?? "is";
  const normalized = normalizeOperator(raw);
  return (
    operators.find(
      (op) =>
        normalizeOperator(op.value) === normalized ||
        normalizeOperator(op.label) === normalized,
    ) ?? { label: raw, value: raw }
  );
}

function getAppliedValues(applied: IndexAppliedFilterType): string[] {
  if (Array.isArray(applied.value)) return applied.value;
  return applied.value ? [String(applied.value)] : [];
}

function formatAppliedValues(
  filterDef: IndexFilterItemType | undefined,
  applied: IndexAppliedFilterType,
): string {
  if (applied.label) return applied.label;

  const labels = getAppliedValues(applied).map(
    (value) => filterDef?.options?.find((opt) => opt.value === value)?.label ?? value,
  );
  if (labels.length === 0) return "Select...";

  const visible = labels.slice(0, MAX_VISIBLE_VALUES).join(", ");
  const hiddenCount = labels.length - MAX_VISIBLE_VALUES;
  return hiddenCount > 0 ? `${visible} + ${hiddenCount} more` : visible;
}

/**
 * Unified search + filter input (IndexFilters.SearchField).
 *
 * Behaves like a token field: applied filters render as pills
 * (`[Tag is not] [value, value + n more ×]`) followed by free-text keyword search.
 *
 * - While the field is focused (anywhere, including while typing keywords) the
 *   filters popover (P1) stays open. Picking a filter inserts a pill at the caret
 *   position (after the pills, or between two pills) and opens its value popover (P2).
 * - Clicking the grey half of a pill opens the operator popover (P3); clicking the
 *   blue half opens P2. The remove (×) button expands on hover or keyboard focus.
 * - Backspace/Delete remove text normally and remove a pill when the caret reaches it.
 *   Arrow keys move the caret across pills.
 * - Keyword text is emitted through `onQueryChange`, debounced by `debounceDelay`.
 */
export function IndexFiltersSearchField({
  queryValue = "",
  queryPlaceholder = "search by keywords",
  onQueryChange,
  onQueryClear,
  onQueryBlur,
  onQueryFocus,
  debounceDelay = 300,
  tabs,
  filters = [],
  appliedFilters = [],
  onAddFilter,
  onFilterSelect,
  onOperatorChange,
  onClearAll,
  disabled = false,
  id,
}: IndexFiltersSearchFieldPropsType) {
  const [activePopover, setActivePopover] = useState<ActivePopoverType>(null);
  const [isFocused, setIsFocused] = useState(false);
  /** Gap between pills holding the caret (before pill `caretIndex`); null = text input. */
  const [caretIndex, setCaretIndex] = useState<number | null>(null);
  /** Text typed while the caret sits between pills; narrows the filters list. */
  const [gapQuery, setGapQuery] = useState("");
  /** Keyboard-highlighted row in P1; -1 = none (Enter then submits the keyword search). */
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [localQuery, setLocalQuery] = useState(queryValue);
  const [customValueInput, setCustomValueInput] = useState("");
  /** Pills whose remove (×) button is revealed by hover or keyboard focus. */
  const [hoveredChipKey, setHoveredChipKey] = useState<string | null>(null);
  const [focusedChipKey, setFocusedChipKey] = useState<string | null>(null);

  const baseId = useId().replace(/:/g, "");
  const inputId = `corex-index-filters-input-${baseId}`;
  const gapInputId = `corex-index-filters-gap-${baseId}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const gapInputRef = useRef<HTMLInputElement>(null);

  const chipCount = appliedFilters.length;
  const hasApplied = chipCount > 0;
  const hasQuery = localQuery.length > 0;
  const isCategoriesOpen = activePopover?.type === "categories";

  /* ---------------------------------------------------------------- query */

  const onQueryChangeRef = useRef(onQueryChange);
  onQueryChangeRef.current = onQueryChange;
  const lastEmittedQueryRef = useRef(queryValue);
  const queryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Adopt external query changes (e.g. "Clear all" in the parent) without
  // clobbering text the user is still typing.
  useEffect(() => {
    if (queryValue !== lastEmittedQueryRef.current) {
      lastEmittedQueryRef.current = queryValue;
      setLocalQuery(queryValue);
    }
  }, [queryValue]);

  useEffect(
    () => () => {
      if (queryTimerRef.current) clearTimeout(queryTimerRef.current);
    },
    [],
  );

  const emitQuery = useCallback(
    (next: string, immediate = false) => {
      if (queryTimerRef.current) {
        clearTimeout(queryTimerRef.current);
        queryTimerRef.current = null;
      }
      const fire = () => {
        queryTimerRef.current = null;
        lastEmittedQueryRef.current = next;
        onQueryChangeRef.current?.(next);
      };
      if (immediate || debounceDelay <= 0) {
        fire();
      } else {
        queryTimerRef.current = setTimeout(fire, debounceDelay);
      }
    },
    [debounceDelay],
  );

  /* -------------------------------------------------------- filters list */

  const appliedKeys = new Set(appliedFilters.map((f) => f.key));
  const categorySearch = caretIndex !== null ? gapQuery.trim().toLowerCase() : "";
  const availableFilters = filters.filter(
    (filter) =>
      !appliedKeys.has(filter.key) &&
      (!categorySearch || filter.label.toLowerCase().includes(categorySearch)),
  );
  const selectableFilters = availableFilters.filter((filter) => !filter.disabled);
  const highlightedKey =
    highlightIndex >= 0 && selectableFilters.length > 0
      ? selectableFilters[Math.min(highlightIndex, selectableFilters.length - 1)]?.key
      : undefined;

  // Typing between pills pre-selects the first match so Enter adds it.
  useEffect(() => {
    if (isCategoriesOpen) setHighlightIndex(categorySearch ? 0 : -1);
  }, [isCategoriesOpen, categorySearch]);

  /* ------------------------------------------------------------- scroll */

  const [scrollEdges, setScrollEdges] = useState({ start: false, end: false });

  const updateScrollEdges = useCallback(() => {
    const region = regionRef.current;
    if (!region) return;
    const start = region.scrollLeft > 1;
    const end = region.scrollLeft + region.clientWidth < region.scrollWidth - 1;
    setScrollEdges((prev) =>
      prev.start === start && prev.end === end ? prev : { start, end },
    );
  }, []);

  // Content (pills, text) changes the scroll width without resizing the region.
  useLayoutEffect(updateScrollEdges);

  useEffect(() => {
    const region = regionRef.current;
    if (!region) return;

    // Vertical wheel scrolls the pills horizontally while there is room to move.
    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const before = region.scrollLeft;
      region.scrollLeft += event.deltaY;
      if (region.scrollLeft !== before) event.preventDefault();
    };
    region.addEventListener("wheel", handleWheel, { passive: false });

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateScrollEdges)
        : null;
    observer?.observe(region);

    return () => {
      region.removeEventListener("wheel", handleWheel);
      observer?.disconnect();
    };
  }, [updateScrollEdges]);

  /** Scrolls the region just enough to bring `element` clear of the faded edges. */
  const revealInRegion = (element: Element | null) => {
    const region = regionRef.current;
    if (!region || !element || region.scrollWidth <= region.clientWidth) return;
    const regionRect = region.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    if (rect.left < regionRect.left + SCROLL_FADE) {
      region.scrollLeft -= regionRect.left + SCROLL_FADE - rect.left;
    } else if (rect.right > regionRect.right - SCROLL_FADE) {
      region.scrollLeft += rect.right - (regionRect.right - SCROLL_FADE);
    }
  };

  function getValueTriggerId(key: string) {
    return `corex-filter-val-trig-${toDomId(key)}-${baseId}`;
  }

  // Keep the pill whose popover is open (e.g. one just added from P1) in view.
  const activePillKey =
    activePopover && "key" in activePopover ? activePopover.key : null;
  useEffect(() => {
    if (!activePillKey) return;
    const trigger = regionRef.current?.ownerDocument.getElementById(
      getValueTriggerId(activePillKey),
    );
    revealInRegion(
      trigger?.closest(`[${CHIP_ATTR}], [${LEGACY_CHIP_ATTR}]`) ?? null,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePillKey, chipCount]);

  /* ------------------------------------------------------ popover helpers */

  const openCategories = () => {
    if (disabled || filters.length === 0) return;
    setActivePopover((prev) =>
      prev?.type === "categories" ? prev : { type: "categories" },
    );
  };

  const closePopovers = () => {
    setActivePopover(null);
    setCaretIndex(null);
    setGapQuery("");
    setCustomValueInput("");
  };

  const focusTail = (position: "start" | "end") => {
    const input = inputRef.current;
    if (!input) return;
    setCaretIndex(null);
    setGapQuery("");
    input.focus({ preventScroll: true });
    const pos = position === "start" ? 0 : input.value.length;
    input.setSelectionRange(pos, pos);
    revealInRegion(input);
    openCategories();
  };

  const placeCaretAtGap = (index: number) => {
    if (index >= chipCount) {
      focusTail("start");
      return;
    }
    setCaretIndex(Math.max(0, index));
    setGapQuery("");
    openCategories();
  };

  // Keep DOM focus on the gap input as it moves between pills, and hand the
  // caret back to the text input once it passes the last pill.
  useEffect(() => {
    if (caretIndex === null) return;
    if (caretIndex >= chipCount) {
      focusTail("start");
      return;
    }
    const gapInput = gapInputRef.current;
    if (gapInput && gapInput.ownerDocument.activeElement !== gapInput) {
      gapInput.focus({ preventScroll: true });
      revealInRegion(gapInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caretIndex, chipCount]);

  const isCaretInput = (node: EventTarget | null) =>
    node !== null && (node === inputRef.current || node === gapInputRef.current);

  const removeChipAt = (index: number) => {
    const applied = appliedFilters[index];
    if (!applied) return;
    applied.onRemove(applied.key);
    setActivePopover((prev) =>
      prev && "key" in prev && prev.key === applied.key ? null : prev,
    );
  };

  /* ------------------------------------------------------------- actions */

  const selectCategory = (filter: IndexFilterItemType) => {
    const insertIndex = Math.min(caretIndex ?? chipCount, chipCount);
    setCaretIndex(null);
    setGapQuery("");
    setCustomValueInput("");
    inputRef.current?.blur();
    gapInputRef.current?.blur();

    if (onAddFilter) {
      onAddFilter(filter.key, insertIndex);
    } else {
      const defaultOp = filter.defaultOperator ?? filter.operators?.[0]?.value ?? "is";
      onFilterSelect?.(filter.key, filter.allowMultiple !== false ? [] : "", defaultOp);
    }

    // The value popover renders with its pill, so it opens as soon as the
    // parent adds the pill to `appliedFilters`.
    setActivePopover({ type: "value", key: filter.key, fromCategories: true });
  };

  const selectValue = (
    applied: IndexAppliedFilterType,
    value: string | string[],
    operator: string,
  ) => {
    onFilterSelect?.(applied.key, value, operator);
  };

  const selectOperator = (
    filterDef: IndexFilterItemType | undefined,
    applied: IndexAppliedFilterType,
    operator: string,
  ) => {
    if (onOperatorChange) {
      onOperatorChange(applied.key, operator);
    } else {
      onFilterSelect?.(
        applied.key,
        applied.value ?? (filterDef?.allowMultiple !== false ? [] : ""),
        operator,
      );
    }
  };

  const handleClear = () => {
    setLocalQuery("");
    emitQuery("", true);
    if (hasQuery) onQueryClear?.();
    if (hasApplied) onClearAll?.();
    closePopovers();
  };

  /* ------------------------------------------------------------ keyboard */

  /** Arrow/Enter navigation inside P1. Returns true when the key was handled. */
  const handleCategoriesKeys = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isCategoriesOpen || selectableFilters.length === 0) return false;
    const count = selectableFilters.length;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((i) => (i + 1) % count);
      return true;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((i) => (i < 0 ? count - 1 : (i - 1 + count) % count));
      return true;
    }
    if (event.key === "Enter") {
      const filter = selectableFilters.find((f) => f.key === highlightedKey);
      if (filter) {
        event.preventDefault();
        selectCategory(filter);
        return true;
      }
    }
    return false;
  };

  const handleTailKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const atStart = input.selectionStart === 0 && input.selectionEnd === 0;

    if (handleCategoriesKeys(event)) return;

    switch (event.key) {
      case "Backspace":
        if (atStart && chipCount > 0) {
          event.preventDefault();
          removeChipAt(chipCount - 1);
          openCategories();
        }
        break;
      case "ArrowLeft":
        if (atStart && chipCount > 0) {
          event.preventDefault();
          placeCaretAtGap(chipCount - 1);
        }
        break;
      case "Home":
        if (atStart && chipCount > 0) {
          event.preventDefault();
          placeCaretAtGap(0);
        }
        break;
      case "Enter":
        event.preventDefault();
        emitQuery(input.value, true);
        break;
      case "Escape":
        closePopovers();
        break;
      default:
        break;
    }
  };

  const handleGapKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (caretIndex === null) return;
    const input = event.currentTarget;
    const atStart = input.selectionStart === 0 && input.selectionEnd === 0;
    const atEnd = input.selectionStart === input.value.length;

    if (handleCategoriesKeys(event)) return;

    switch (event.key) {
      case "Backspace":
        if (atStart) {
          event.preventDefault();
          if (caretIndex > 0) {
            removeChipAt(caretIndex - 1);
            setGapQuery("");
            setCaretIndex(caretIndex - 1);
          }
        }
        break;
      case "Delete":
        if (atEnd) {
          event.preventDefault();
          // The caret effect hands focus back to the text input if this was the last pill.
          removeChipAt(caretIndex);
        }
        break;
      case "ArrowLeft":
        if (atStart && caretIndex > 0) {
          event.preventDefault();
          setGapQuery("");
          setCaretIndex(caretIndex - 1);
        }
        break;
      case "ArrowRight":
        if (atEnd) {
          event.preventDefault();
          if (caretIndex + 1 >= chipCount) {
            focusTail("start");
          } else {
            setGapQuery("");
            setCaretIndex(caretIndex + 1);
          }
        }
        break;
      case "Home":
        event.preventDefault();
        setGapQuery("");
        setCaretIndex(0);
        break;
      case "End":
        event.preventDefault();
        focusTail("end");
        break;
      case "Escape":
        closePopovers();
        break;
      default:
        break;
    }
  };

  /* --------------------------------------------------------------- mouse */

  /** Maps a point inside the field to the pill gap closest to it (same row only). */
  const resolveGapFromPoint = (x: number, y: number) => {
    const region = regionRef.current;
    if (!region) return chipCount;
    let gap = chipCount;
    const chips = region.querySelectorAll<HTMLElement>(
      `[${CHIP_ATTR}], [${LEGACY_CHIP_ATTR}]`,
    );
    for (const chip of Array.from(chips)) {
      const rect = chip.getBoundingClientRect();
      if (y < rect.top - 4 || y > rect.bottom + 4) continue;
      const index = Number(
        chip.getAttribute(CHIP_ATTR) ?? chip.getAttribute(LEGACY_CHIP_ATTR),
      );
      if (x < rect.left + rect.width / 2) return index;
      gap = index + 1;
    }
    return gap;
  };

  const handleRegionMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return;
    const target = event.target as HTMLElement;
    // React bubbles events through portals: ignore clicks inside pill popovers.
    if (!event.currentTarget.contains(target)) return;
    if (target === inputRef.current || target === gapInputRef.current) return;
    if (
      target.closest(
        `[${CHIP_ATTR}], [${LEGACY_CHIP_ATTR}], [${CONTROL_ATTR}], [${LEGACY_CONTROL_ATTR}]`,
      )
    )
      return;

    event.preventDefault();
    const gap = resolveGapFromPoint(event.clientX, event.clientY);
    if (gap < chipCount) {
      placeCaretAtGap(gap);
      return;
    }
    const inputLeft = inputRef.current?.getBoundingClientRect().left ?? 0;
    focusTail(event.clientX < inputLeft ? "start" : "end");
  };

  /* -------------------------------------------------------------- render */

  const renderOperatorList = (
    filterDef: IndexFilterItemType | undefined,
    applied: IndexAppliedFilterType,
    currentOperator: IndexFilterOperatorType,
    onPicked?: () => void,
  ) => (
    <Box background="base">
      {(filterDef?.operators ?? DEFAULT_OPERATORS).map((op) => {
        const isChecked =
          normalizeOperator(op.value) === normalizeOperator(currentOperator.value);
        return (
          <Clickable
            key={op.value}
            background="transparent"
            paddingInline="small-200"
            blockSize="28px"
            borderRadius="base"
            inlineSize="fill"
            accessibilityLabel={op.label}
            onClick={() => {
              selectOperator(filterDef, applied, op.value);
              onPicked?.();
            }}
          >
            <InlineStack alignItems="center" gap="small-200" blockSize="fill">
              <Box minInlineSize="16px">{isChecked ? <Icon type="check" /> : null}</Box>
              <Text variant="small" heading={isChecked}>
                {op.label}
              </Text>
            </InlineStack>
          </Clickable>
        );
      })}
    </Box>
  );

  const renderValueControls = (
    filterDef: IndexFilterItemType | undefined,
    applied: IndexAppliedFilterType,
    fieldLabel: string,
    currentOperator: IndexFilterOperatorType,
  ) => {
    const values = getAppliedValues(applied);
    const isMultiple = filterDef?.allowMultiple !== false;

    if (filterDef?.options && filterDef.options.length > 0) {
      return (
        <Box paddingInline="small-200">
          <ChoiceList
            name={`filter-choice-${applied.key}`}
            multiple={isMultiple}
            choices={filterDef.options.map((opt) => ({
              label: opt.label,
              value: opt.value,
            }))}
            selected={values}
            onChange={(next) =>
              selectValue(
                applied,
                isMultiple ? next : (next[0] ?? ""),
                currentOperator.value,
              )
            }
          />
        </Box>
      );
    }

    if (filterDef?.filter) {
      return <Box padding="small-200">{filterDef.filter}</Box>;
    }

    // Free-text values: typed entries accumulate as a checklist (multiple) or
    // replace the single value.
    const applyCustomValue = () => {
      const next = customValueInput.trim();
      if (!next) return;
      if (isMultiple) {
        if (!values.includes(next)) {
          selectValue(applied, [...values, next], currentOperator.value);
        }
      } else {
        selectValue(applied, next, currentOperator.value);
      }
      setCustomValueInput("");
    };

    return (
      <BlockStack gap="small-200">
        <InlineStack
          gap="small-200"
          alignItems="end"
          paddingInline="small-200"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              applyCustomValue();
            }
          }}
        >
          <Box inlineSize="100%">
            <TextField
              label={fieldLabel}
              labelAccessibilityVisibility="exclusive"
              placeholder={`Enter ${fieldLabel.toLowerCase()}...`}
              value={customValueInput}
              onChange={(next) => setCustomValueInput(next)}
            />
          </Box>
          <Button variant="secondary" onClick={applyCustomValue}>
            Add
          </Button>
        </InlineStack>
        {isMultiple && values.length > 0 ? (
          <Box paddingInline="small-200" paddingBlock="small-100">
            <ChoiceList
              name={`filter-custom-${applied.key}`}
              multiple
              choices={values.map((value) => ({ label: value, value }))}
              selected={values}
              onChange={(next) => selectValue(applied, next, currentOperator.value)}
            />
          </Box>
        ) : null}
      </BlockStack>
    );
  };

  const renderChip = (applied: IndexAppliedFilterType, index: number) => {
    const filterDef = filters.find((item) => item.key === applied.key);
    const fieldLabel = applied.field ?? filterDef?.label ?? applied.key;
    const currentOperator = resolveOperator(filterDef, applied);
    const valueDisplay = formatAppliedValues(filterDef, applied);

    const domKey = toDomId(applied.key);
    const opTriggerId = `corex-filter-op-trig-${domKey}-${baseId}`;
    const valTriggerId = getValueTriggerId(applied.key);
    const isOperatorOpen =
      activePopover?.type === "operator" && activePopover.key === applied.key;
    const isValueOpen =
      activePopover?.type === "value" && activePopover.key === applied.key;

    const togglePopover = (type: "value" | "operator") => {
      setCaretIndex(null);
      setGapQuery("");
      setActivePopover((prev) =>
        prev?.type === type && prev.key === applied.key
          ? null
          : { type, key: applied.key },
      );
    };
    const isRemoveRevealed =
      !disabled && (hoveredChipKey === applied.key || focusedChipKey === applied.key);
    const clearChipKey = (prev: string | null) => (prev === applied.key ? null : prev);

    const closeOwnPopover = (type: "value" | "operator") =>
      setActivePopover((prev) =>
        prev?.type === type && prev.key === applied.key ? null : prev,
      );

    const segmentStyle = {
      display: "inline-flex",
      alignItems: "center",
      whiteSpace: "nowrap",
      gap: "4px",
      padding: "3px 5px",
      cursor: disabled ? "default" : "pointer",
      userSelect: "none",
    } as const;

    return (
      <Transition key={applied.key} variant="scale-up">
        <InlineStack
          key={applied.key}
          {...{ [CHIP_ATTR]: String(index), [LEGACY_CHIP_ATTR]: String(index) }}
          alignItems="center"
          gap="small-500"
          wrap={false}
          shrink={false}
          onMouseEnter={(event) => {
            if (event.currentTarget.contains(event.target as Node)) {
              setHoveredChipKey(applied.key);
            }
          }}
          onMouseLeave={() => setHoveredChipKey(clearChipKey)}
          onFocus={(event) => {
            if (event.currentTarget.contains(event.target))
              setFocusedChipKey(applied.key);
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setFocusedChipKey(clearChipKey);
            }
          }}
        >
          {/* Grey segment: [ Field operator ] -> P3 */}
          <Clickable
            id={opTriggerId}
            disabled={disabled}
            background="transparent"
            padding="none"
            borderRadius="base"
            accessibilityLabel={`${fieldLabel} operator`}
            onClick={(event) => {
              event.stopPropagation();
              togglePopover("operator");
            }}
          >
            <IconTile
              tone="neutral"
              size="auto"
              style={{
                ...segmentStyle,
                borderRadius: "6px 0 0 6px",
              }}
            >
              <span style={{ fontWeight: "500", fontSize: "12px", lineHeight: "16px" }}>
                {fieldLabel}
                <b> {currentOperator.label.toLowerCase()}</b>
              </span>
            </IconTile>
          </Clickable>

          <InlineStack
            onMouseEnter={(event) => {
              if (event.currentTarget.contains(event.target as Node)) {
                setHoveredChipKey(applied.key);
              }
            }}
            onMouseLeave={() => setHoveredChipKey(clearChipKey)}
          >
            <Clickable
              id={valTriggerId}
              disabled={disabled}
              background="transparent"
              padding="none"
              borderRadius="base"
              accessibilityLabel={`${fieldLabel} value`}
              onClick={(event) => {
                togglePopover("value");
              }}
            >
              <IconTile
                tone="info"
                color={isRemoveRevealed ? "strong" : "base"}
                size="auto"
                style={{
                  ...segmentStyle,
                  borderRadius: "0 6px 6px 0",
                }}
              >
                <span style={{ fontWeight: "500", fontSize: "12px", lineHeight: "16px" }}>
                  {valueDisplay}
                </span>
                <svg
                  role="button"
                  aria-label={`Remove ${fieldLabel} filter`}
                  onClick={(event) => {
                    event.stopPropagation();
                    removeChipAt(index);
                  }}
                  style={{
                    maxWidth: isRemoveRevealed ? 32 : 0,
                    opacity: isRemoveRevealed ? 1 : 0,
                    transition: "max-width 160ms ease, opacity 160ms ease",
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </IconTile>
            </Clickable>
          </InlineStack>

          {/* P3: operator */}
          <FlexPopover
            boundaryRef={regionRef}
            anchorId={opTriggerId}
            isOpen={isOperatorOpen}
            onClose={() => closeOwnPopover("operator")}
            width="160px"
            noHeader
          >
            <Box paddingBlock="small-400">
              {renderOperatorList(filterDef, applied, currentOperator, () =>
                closeOwnPopover("operator"),
              )}
            </Box>
          </FlexPopover>

          {/* P2: values (+ operator) */}
          <FlexPopover
            boundaryRef={regionRef}
            anchorId={valTriggerId}
            isOpen={isValueOpen}
            onClose={() => {
              setCustomValueInput("");
              closeOwnPopover("value");
            }}
            width="260px"
            maxHeight="360px"
          >
            <BlockStack gap="small-300">
              {renderValueControls(filterDef, applied, fieldLabel, currentOperator)}
              <BlockStack position="sticky" style={{ bottom: 0 }}>
                <Divider />
                {renderOperatorList(filterDef, applied, currentOperator)}
              </BlockStack>
            </BlockStack>
          </FlexPopover>
        </InlineStack>
      </Transition>
    );
  };

  const gapInput =
    caretIndex !== null ? (
      <input
        key="corex-index-filters-gap"
        ref={gapInputRef}
        id={gapInputId}
        type="text"
        autoComplete="off"
        aria-label="Search filters"
        disabled={disabled}
        value={gapQuery}
        onFocus={openCategories}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setGapQuery(event.target.value);
          openCategories();
        }}
        onKeyDown={handleGapKeyDown}
        style={{
          width: gapQuery ? `${gapQuery.length + 1}ch` : "2px",
          minWidth: 2,
          height: 20,
          padding: 0,
          marginInline: -2,
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: 13,
          fontFamily: "inherit",
          color: "#202223",
        }}
      />
    ) : null;

  const chipNodes = appliedFilters.flatMap((applied, index) =>
    caretIndex === index
      ? [gapInput, renderChip(applied, index)]
      : [renderChip(applied, index)],
  );

  const hideAddButton =
    isFocused ||
    isCategoriesOpen ||
    (activePopover?.type === "value" && activePopover.fromCategories === true);
  const showFocusRing = isFocused || isCategoriesOpen;

  // Fade whichever edge has hidden content.
  const scrollMask =
    scrollEdges.start || scrollEdges.end
      ? `linear-gradient(to right, ${scrollEdges.start ? "transparent" : "#000"} 0, #000 ${
          scrollEdges.start ? SCROLL_FADE : 0
        }px, #000 calc(100% - ${scrollEdges.end ? SCROLL_FADE : 0}px), ${
          scrollEdges.end ? "transparent" : "#000"
        } 100%)`
      : undefined;

  return (
    <InlineStack
      ref={containerRef}
      id={id}
      alignItems="center"
      gap="small-200"
      wrap={false}
      flex="1 1 0%"
      minInlineSize="0"
      onMouseDown={(event) => {
        if (!disabled && event.target === event.currentTarget) {
          event.preventDefault();
          focusTail("end");
        }
      }}
      position="relative"
      minBlockSize="34px"
      style={{
        paddingInline: "4px 6px",
        borderRadius: 12,
        outlineOffset: 0,
        transition: "outline-color 150ms ease",
        cursor: disabled ? "default" : "text",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {tabs ? (
        <InlineStack alignItems="center" shrink={false}>
          {tabs}
        </InlineStack>
      ) : null}

      <InlineStack
        ref={regionRef}
        className={SCROLL_CLASS}
        alignItems="center"
        gap="small-300"
        wrap={false}
        flex="1 1 0%"
        minInlineSize="0"
        paddingBlock="small-500"
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          scrollbarWidth: "none",
          maskImage: scrollMask,
          WebkitMaskImage: scrollMask,
        }}
        onScroll={updateScrollEdges}
        onMouseDown={handleRegionMouseDown}
        // "Focused" means the caret is in the text input or between pills. Focus on
        // pills or the + button (e.g. on mouse down) must not count, or the + button
        // would unmount before its click fires.
        onFocus={(event) => {
          if (isCaretInput(event.target)) setIsFocused(true);
        }}
        onBlur={(event) => {
          if (isCaretInput(event.target) && !isCaretInput(event.relatedTarget)) {
            setIsFocused(false);
          }
        }}
      >
        {chipNodes}

        {filters.length > 0 && !hideAddButton ? (
          <InlineStack
            {...{ [CONTROL_ATTR]: "", [LEGACY_CONTROL_ATTR]: "" }}
            alignItems="center"
            shrink={false}
          >
            <Clickable
              disabled={disabled}
              background="transparent"
              padding="small-500"
              borderRadius="base"
              accessibilityLabel="Add filter"
              onClick={(event) => {
                event.stopPropagation();
                // Focusing the text input opens P1.
                focusTail("end");
              }}
            >
              <Tooltip content="Add filter">
                <Icon type="plus" tone="neutral" />
              </Tooltip>
            </Clickable>
          </InlineStack>
        ) : null}

        <input
          ref={inputRef}
          id={inputId}
          type="text"
          autoComplete="off"
          aria-label={queryPlaceholder}
          disabled={disabled}
          value={localQuery}
          placeholder={hasApplied ? "" : queryPlaceholder}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const next = event.target.value;
            setLocalQuery(next);
            emitQuery(next);
            openCategories();
          }}
          onFocus={(event) => {
            setCaretIndex(null);
            setGapQuery("");
            revealInRegion(event.currentTarget);
            openCategories();
            onQueryFocus?.();
          }}
          // Re-open after Escape or after a pill popover took over.
          onClick={openCategories}
          onBlur={() => onQueryBlur?.()}
          onKeyDown={handleTailKeyDown}
          style={{
            flex: "1 1 80px",
            minWidth: 80,
            height: 24,
            padding: "0 4px",
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 13,
            fontFamily: "inherit",
            color: "#202223",
          }}
        />
      </InlineStack>

      {hasQuery || hasApplied ? (
        <InlineStack alignItems="center" shrink={false}>
          <Clickable
            disabled={disabled}
            background="transparent"
            padding="small-500"
            borderRadius="base"
            accessibilityLabel="Clear search and filters"
            onClick={(event) => {
              event.stopPropagation();
              handleClear();
            }}
          >
            <Icon type="x-circle" tone="neutral" />
          </Clickable>
        </InlineStack>
      ) : null}

      {/* P1: filter categories, anchored at the caret (gap between pills or text input). */}
      {filters.length > 0 ? (
        <FlexPopover
          boundaryRef={regionRef}
          anchorId={caretIndex !== null ? gapInputId : inputId}
          isOpen={isCategoriesOpen}
          onClose={() => {
            setActivePopover((prev) => (prev?.type === "categories" ? null : prev));
            setCaretIndex(null);
            setGapQuery("");
          }}
          width="260px"
          maxHeight="360px"
        >
          {availableFilters.length > 0 ? (
            availableFilters.map((filter) => (
              <Clickable
                key={filter.key}
                disabled={filter.disabled}
                background={filter.key === highlightedKey ? "subdued" : "transparent"}
                paddingInline="small-200"
                paddingBlock="small-200"
                borderRadius="base"
                inlineSize="fill"
                accessibilityLabel={filter.label}
                onClick={(event) => {
                  event.stopPropagation();
                  selectCategory(filter);
                }}
              >
                <InlineStack alignItems="center" blockSize="fill">
                  <Text variant="small">{filter.label}</Text>
                </InlineStack>
              </Clickable>
            ))
          ) : (
            <Box padding="small-300">
              <Text variant="small" color="subdued">
                {categorySearch ? "No matching filters" : "All filters applied"}
              </Text>
            </Box>
          )}
        </FlexPopover>
      ) : null}

      <style>{`.corex-index-filters-scroll::-webkit-scrollbar, .corex-filters-scroll::-webkit-scrollbar { display: none; }`}</style>
    </InlineStack>
  );
}
IndexFiltersSearchField.displayName = "IndexFiltersSearchField";

export const FiltersSearchField = IndexFiltersSearchField;
