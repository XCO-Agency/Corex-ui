import {
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { BlockStack } from "../BlockStack";
import { Box } from "../Box";
import { Button } from "../Button";
import { Clickable } from "../Clickable";
import { Collapsible } from "../Collapsible";
import { Divider } from "../Divider";
import { FlexPopover } from "../FlexPopover";
import { Hoverable } from "../Hoverable";
import { Icon } from "../Icon";
import { InlineStack } from "../InlineStack";
import { Text } from "../Text";
import { Tooltip } from "../Tooltip";
import { TagsInput } from "./TagsInput";
import type {
  RepeaterMatchModeType,
  RepeaterMatchModePropsType,
  RepeaterOptionType,
  RepeaterKeyType,
  RepeaterOptionsPropsType,
  RepeaterPillPropsType,
  RepeaterPropsType,
} from "./Repeater.types";
import type { IconType } from "../../types/common";

/** How long a new row takes to grow in. */
export const REPEATER_MOTION_MS = 220;

const OPTIONS_SEARCH_INPUT_STYLE: CSSProperties = {
  flex: "1 1 60px",
  minWidth: "60px",
  height: "24px",
  padding: 0,
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: "13px",
  fontFamily: "inherit",
  color: "inherit",
};

// ─── Input tracking ────────────────────────────────────────────────────────────
//
// Mouse focus left on a pill after its menu closes is not a hover; keyboard
// focus is. Hoverable's `includeFocus` cannot tell the two apart, so the rows
// track the last input themselves, and where the pointer last was.
//
// Per document, not per page: the rows can render into another document than
// the one this module loaded in (an iframe preview, a portal into a frame).
// A single tracker on the global `document` never heard that frame's pointer,
// so its coordinates were stale ones from the outer page, the hit-test landed
// outside the row, and the row's hover was cancelled one frame after it
// started: the trash button flashed on every move into or across a row.

type PointerPointType = { x: number; y: number };

type InputStateType = {
  pointer: PointerPointType | null;
  modality: "pointer" | "keyboard";
};

const MODIFIER_KEYS = new Set(["Meta", "Control", "Alt", "Shift"]);

const inputStates = new WeakMap<Document, InputStateType>();

/** The input tracker for `doc`, installed on first use. */
export function inputStateFor(doc: Document): InputStateType {
  const existing = inputStates.get(doc);
  if (existing) return existing;
  const state: InputStateType = { pointer: null, modality: "pointer" };
  inputStates.set(doc, state);
  doc.addEventListener(
    "pointerdown",
    () => {
      state.modality = "pointer";
    },
    true,
  );
  doc.addEventListener(
    "pointermove",
    (event) => {
      state.pointer = { x: event.clientX, y: event.clientY };
    },
    true,
  );
  doc.addEventListener(
    "keydown",
    (event) => {
      if (MODIFIER_KEYS.has(event.key)) return;
      state.modality = "keyboard";
    },
    true,
  );
  return state;
}

/** Whether a focus that just landed in a row should show its trash button. */
export function focusShowsRowActions(modality: "pointer" | "keyboard"): boolean {
  return modality === "keyboard";
}

/** The trash button shows while the pointer is over the row or a key moved focus in. */
export function rowActionsVisible(
  pointerInside: boolean,
  keyboardFocus: boolean,
): boolean {
  return pointerInside || keyboardFocus;
}

/** `root` contains `target`, through open shadow roots too. */
function containsAcrossShadow(root: Node, target: Node | null): boolean {
  let current: Node | null = target;
  while (current) {
    if (current === root) return true;
    if (current.parentNode) {
      current = current.parentNode;
      continue;
    }
    // A node at the top of a shadow tree has the shadow root as its parent,
    // and the root has no parent of its own: carry on from its host.
    const host = (current as Partial<ShadowRoot>).host;
    if (host) {
      current = host;
      continue;
    }
    return false;
  }
  return false;
}

/** Whether any element under the pointer is inside the row. */
export function pointerStillInsideRow(root: Node, hits: readonly Node[]): boolean {
  return hits.some((hit) => containsAcrossShadow(root, hit));
}

/**
 * What is under `point` in `node`'s document. With no point yet, or none the
 * document can answer for, the row is taken to still hold the pointer:
 * cancelling a hover on a guess is what made the button flash.
 */
export function hitsAt(node: HTMLElement, point: PointerPointType | null): Node[] {
  if (!point) return [node];
  const doc = node.ownerDocument;
  if (typeof doc.elementsFromPoint === "function") {
    const hits = doc.elementsFromPoint(point.x, point.y);
    return hits.length > 0 ? hits : [node];
  }
  const hit = doc.elementFromPoint?.(point.x, point.y);
  return hit ? [hit] : [node];
}

// ─── Row hover ─────────────────────────────────────────────────────────────────
//
// Hoverable's root is `display: contents`, so it never hears a mouseout when a
// row shrinks off a still pointer (its value area goes away when the operator
// alone completes the condition). This frame re-checks what is under the
// pointer after every render and on pointer moves, and owns keyboard focus,
// which `s-box` does not bubble. It generates no box.

function RowHover({
  children,
  label,
}: {
  children: ReactNode;
  label?: string;
}): ReactElement {
  const frameRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef(false);
  const [pointer, setPointer] = useState(false);
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    pointerRef.current = pointer;
  }, [pointer]);

  useEffect(() => {
    const doc = frameRef.current?.ownerDocument;
    if (!doc) return;
    inputStateFor(doc);
    const clearKeyboard = () => setKeyboard(false);
    doc.addEventListener("pointerdown", clearKeyboard, true);
    return () => doc.removeEventListener("pointerdown", clearKeyboard, true);
  }, []);

  // A row that shrinks off a still pointer: re-check what is under the pointer
  // after a render, and on each move, from the move's own coordinates.
  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const state = inputStateFor(node.ownerDocument);
    const release = (point: PointerPointType | null) => {
      if (!pointerRef.current) return;
      if (pointerStillInsideRow(node, hitsAt(node, point))) return;
      node.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    };
    const frame = requestAnimationFrame(() => release(state.pointer));
    const onMove = (event: PointerEvent) =>
      release({ x: event.clientX, y: event.clientY });
    const view = node.ownerDocument.defaultView;
    view?.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      view?.removeEventListener("pointermove", onMove);
    };
  });

  return (
    <Hoverable
      includeFocus={false}
      hovered={rowActionsVisible(pointer, keyboard)}
      onHoverChange={setPointer}
    >
      <div
        ref={frameRef}
        role="listitem"
        aria-label={label}
        style={{ display: "contents" }}
        data-cx-repeater-row=""
        onFocus={() => {
          const doc = frameRef.current?.ownerDocument;
          if (doc && focusShowsRowActions(inputStateFor(doc).modality)) {
            setKeyboard(true);
          }
        }}
        onBlur={(event: FocusEvent<HTMLDivElement>) => {
          const next = event.relatedTarget;
          if (next instanceof Node && event.currentTarget.contains(next)) return;
          setKeyboard(false);
        }}
      >
        {children}
      </div>
    </Hoverable>
  );
}

// ─── Motion ────────────────────────────────────────────────────────────────────

/** Corex's Collapsible grows and fades its content; here, a row growing in. */
function GrowIn({
  appear,
  children,
}: {
  appear: boolean;
  children: ReactNode;
}): ReactElement {
  const [expanded, setExpanded] = useState(!appear);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setExpanded(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Collapsible
      expanded={expanded}
      framed={false}
      duration={REPEATER_MOTION_MS}
      easing="ease-in-out"
      content={children}
    >
      {null}
    </Collapsible>
  );
}

// ─── Menu anchors ──────────────────────────────────────────────────────────────

/**
 * Drops the activator's focus ring after a pointer click. The ring is the
 * inner shadow button's `:focus-visible`, which page CSS cannot reach, and a
 * row's mousedown `preventDefault` makes a click's focus count as keyboard
 * focus, so the ring stayed on while the menu was open. Keyboard activation
 * (`detail === 0`) keeps its focus, so Tab still shows the ring.
 */
export function releasePointerFocus(event: {
  detail?: number;
  target: EventTarget | null;
}): void {
  if (!event.detail) return;
  const target = event.target as {
    closest?: (selector: string) => { blur?: () => void } | null;
  } | null;
  target?.closest?.("s-clickable, s-button")?.blur?.();
}

const ANCHOR_STYLE = {
  display: "inline-grid",
  width: "max-content",
  maxWidth: "100%",
  verticalAlign: "top",
} as const;

// ─── Pill ──────────────────────────────────────────────────────────────────────

// `s-button` has one height and no radius. `s-clickable` paints padding and
// radius from its own scale: large-200 (1rem) is the largest radius that
// paints, and at small-300 block / small-100 inline padding the control is
// 32px tall, so that radius is a capsule.
function Pill({
  label,
  open = false,
  onClick,
  disabled = false,
  accessibilityLabel,
  menu,
  onOpenChange,
}: RepeaterPillPropsType): ReactElement {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const pill = (
    <Clickable
      type="button"
      background="subdued"
      borderRadius="large-200"
      paddingBlock="small-300"
      paddingInline="small-100"
      disabled={disabled}
      accessibilityLabel={
        accessibilityLabel ?? (typeof label === "string" ? label : undefined)
      }
      aria-expanded={menu !== undefined || onOpenChange ? open : undefined}
      onClick={() => {
        if (disabled) return;
        onClick?.();
        onOpenChange?.(!open);
      }}
    >
      <InlineStack gap="small-300" blockAlign="center" wrap={false}>
        <Text as="span" variant="bodySm" fontWeight="regular">
          {label}
        </Text>
        <Icon type="select" size="small" />
      </InlineStack>
    </Clickable>
  );

  if (menu === undefined) return pill;

  // The anchor is a real box: Polaris hosts are `display: contents`, have no
  // rect, and a panel measured off one opens at the top-left of the page.
  return (
    <span ref={anchorRef} style={ANCHOR_STYLE} onClick={releasePointerFocus}>
      {pill}
      <FlexPopover
        anchorRef={anchorRef}
        isOpen={open}
        onClose={() => onOpenChange?.(false)}
        noHeader
      >
        {menu}
      </FlexPopover>
    </span>
  );
}
Pill.displayName = "Repeater.Pill";

// ─── Options ───────────────────────────────────────────────────────────────────

/** Only catches the arrow keys of the search and the rows; adds no box. */
const OPTIONS_ROOT_STYLE: CSSProperties = { display: "contents" };

/** Options whose label or detail contains `query`, ignoring case. */
export function filterRepeaterOptions(
  options: readonly RepeaterOptionType[],
  query: string,
): RepeaterOptionType[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [...options];
  return options.filter(
    (option) =>
      option.label.toLowerCase().includes(needle) ||
      (option.detail ?? "").toLowerCase().includes(needle),
  );
}

/** Whether `Options` shows its search field. */
export function optionsSearchShown(
  count: number,
  searchable: boolean | undefined,
  threshold: number,
): boolean {
  return searchable ?? count > threshold;
}

/**
 * The menu rows the pills open: a check on the selected one. Past
 * `searchThreshold` options a search field sits on top and stays there while
 * the options scroll under it.
 */
function Options({
  options,
  selected,
  onSelect,
  searchable,
  searchThreshold = 10,
  searchPlaceholder = "Search",
  noResultsText = "No results",
  listMaxBlockSize = "232px",
}: RepeaterOptionsPropsType): ReactElement {
  const picked = new Set(
    selected === undefined ? [] : typeof selected === "string" ? [selected] : selected,
  );
  const withSearch = optionsSearchShown(options.length, searchable, searchThreshold);
  // The menu unmounts when it closes, so each opening starts with no query.
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const shown = withSearch ? filterRepeaterOptions(options, query) : options;
  // The list keeps its opening height while filtering, so a menu placed
  // above its anchor does not move the search under the caret.
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState<number | null>(null);
  useEffect(() => {
    if (!withSearch) return;
    // Measured once the popover has laid its rows out.
    const frame = requestAnimationFrame(() => {
      // offsetHeight: the popover may still be scaling in.
      const height = scrollerRef.current?.offsetHeight ?? 0;
      if (height > 0) setListHeight(height);
    });
    return () => cancelAnimationFrame(frame);
  }, [withSearch]);

  // Focus the search as the menu opens (after the popover has placed itself).
  useEffect(() => {
    if (!withSearch) return;
    const node = searchRef.current;
    const frame = requestAnimationFrame(() => node?.focus());
    return () => cancelAnimationFrame(frame);
  }, [withSearch]);

  const rowsOf = () =>
    Array.from(rootRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
    const inSearch = Boolean(
      searchRef.current &&
      (event.target === searchRef.current ||
        searchRef.current.contains(event.target as Node)),
    );
    if (inSearch && event.key === "Enter") {
      // Enter in the search picks the first match.
      const first = shown[0];
      if (first) {
        event.preventDefault();
        onSelect(first.value);
      }
      return;
    }
    if (!keys.includes(event.key)) return;
    const rows = rowsOf();
    if (rows.length === 0) return;
    const doc = rootRef.current?.ownerDocument;
    const current = rows.findIndex(
      (row) => row === doc?.activeElement || row.contains(doc?.activeElement ?? null),
    );
    let next: number | "search";
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = rows.length - 1;
    else if (event.key === "ArrowDown")
      next = current < 0 ? 0 : Math.min(current + 1, rows.length - 1);
    else next = current <= 0 ? (withSearch ? "search" : 0) : current - 1;
    if (inSearch && (event.key === "Home" || event.key === "End")) return;
    event.preventDefault();
    if (next === "search") searchRef.current?.focus();
    else rows[next]?.focus();
  };

  const list =
    shown.length === 0 ? (
      <Box paddingInline="small-100" paddingBlock="base">
        <Text as="p" color="subdued">
          {noResultsText}
        </Text>
      </Box>
    ) : (
      <BlockStack gap="none" role="listbox">
        {shown.map((option) => {
          const isSelected = picked.has(option.value);
          return (
            <Clickable
              key={option.value}
              role="option"
              aria-selected={isSelected}
              inlineSize="fill"
              paddingBlock="small-400"
              paddingInline="small-300"
              borderRadius="large"
              minBlockSize="28px"
              background={isSelected ? "subdued" : undefined}
              accessibilityLabel={
                option.detail ? `${option.label}. ${option.detail}` : option.label
              }
              onClick={() => onSelect(option.value)}
            >
              <InlineStack
                gap="small-200"
                alignItems={option.detail ? "start" : "center"}
                justifyContent="space-between"
                wrap={false}
                inlineSize="fill"
              >
                <InlineStack
                  gap="small-200"
                  alignItems={option.detail ? "start" : "center"}
                  wrap={false}
                >
                  {option.icon ? (
                    <Icon type={option.icon as IconType} color="subdued" />
                  ) : null}
                  <BlockStack gap="small-500">
                    <Text as="span">{option.label}</Text>
                    {option.detail ? (
                      <Text as="span" variant="xs" color="subdued">
                        {option.detail}
                      </Text>
                    ) : null}
                  </BlockStack>
                </InlineStack>
                {isSelected ? <Icon type="check" /> : null}
              </InlineStack>
            </Clickable>
          );
        })}
      </BlockStack>
    );

  return (
    <div ref={rootRef} style={OPTIONS_ROOT_STYLE} onKeyDown={onKeyDown}>
      {withSearch ? (
        <BlockStack gap="none">
          {/* Outside the scrolling list, so it stays at the top. */}

          <InlineStack
            alignItems="center"
            gap="small-300"
            minBlockSize="36px"
            paddingInline="small-200"
            inlineSize="fill"
          >
            <Icon type="search" color="subdued" />
            <input
              ref={searchRef}
              data-slot="repeater-options-search"
              type="text"
              role="searchbox"
              aria-label={searchPlaceholder}
              placeholder={searchPlaceholder}
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              style={OPTIONS_SEARCH_INPUT_STYLE}
            />
          </InlineStack>
          <Divider color="strong" />
          <BlockStack
            ref={scrollerRef}
            maxBlockSize={listMaxBlockSize}
            minBlockSize={listHeight === null ? undefined : `${listHeight}px`}
            overflow="auto"
            gap="none"
            padding="small-300"
          >
            {list}
          </BlockStack>
        </BlockStack>
      ) : (
        <Box padding="base">{list}</Box>
      )}
    </div>
  );
}
Options.displayName = "Repeater.Options";

// ─── Match mode ────────────────────────────────────────────────────────────────

/** Fixed width for the short All/Any explanation, so it wraps to a few lines. */
const MATCH_HELP_WIDTH = "180px";

/**
 * The All / Any pill of a multi-value row: whether every value must match or
 * any one. Its menu leads with what the current mode does. Locked, the pill
 * is disabled and that sentence shows on hover instead.
 */
function MatchMode({
  value,
  onChange,
  labels = { all: "All", any: "Any" },
  help,
  locked = false,
  open,
  onOpenChange,
}: RepeaterMatchModePropsType): ReactElement {
  const [openState, setOpenState] = useState(false);
  const isOpen = open ?? openState;
  const setOpen = (next: boolean) => {
    if (open === undefined) setOpenState(next);
    onOpenChange?.(next);
  };
  const helpText = typeof help === "function" ? help(value) : help;
  const label = value === "all" ? labels.all : labels.any;

  if (locked) {
    const pill = <Pill label={label} disabled accessibilityLabel={helpText ?? label} />;
    if (!helpText) return pill;
    return (
      <Tooltip
        content={
          <Box
            inlineSize={MATCH_HELP_WIDTH}
            maxInlineSize={MATCH_HELP_WIDTH}
            padding="none"
          >
            {helpText}
          </Box>
        }
      >
        {pill}
      </Tooltip>
    );
  }

  return (
    <Pill
      label={label}
      open={isOpen}
      onOpenChange={setOpen}
      accessibilityLabel={helpText ?? label}
      menu={
        <Box
          inlineSize={MATCH_HELP_WIDTH}
          maxInlineSize={MATCH_HELP_WIDTH}
          padding="none"
        >
          <BlockStack gap="none">
            {helpText ? (
              <Box paddingInline="small-100" paddingBlock="small-200">
                <Text as="p" color="subdued">
                  {helpText}
                </Text>
              </Box>
            ) : null}
            <Options
              options={[
                { label: labels.all, value: "all" },
                { label: labels.any, value: "any" },
              ]}
              selected={value}
              onSelect={(next) => {
                onChange(next as RepeaterMatchModeType);
                setOpen(false);
              }}
            />
          </BlockStack>
        </Box>
      }
    />
  );
}
MatchMode.displayName = "Repeater.MatchMode";

// ─── Repeater ──────────────────────────────────────────────────────────────────

function defaultItemId(item: unknown, index: number): RepeaterKeyType {
  const id = (item as { id?: unknown } | null)?.id;
  return typeof id === "string" || typeof id === "number" ? id : index;
}

/** Whether the add button is off: disabled, or at the plan's limit. */
export function repeaterAtLimit(count: number, maxItems: number | undefined): boolean {
  return typeof maxItems === "number" && count >= maxItems;
}

function RepeaterRoot<ItemType>({
  items,
  getItemId = defaultItemId,
  renderControls,
  renderValue,
  onRemove,
  removeAccessibilityLabel = "Remove condition",
  removeTooltip,
  addLabel = "Add condition",
  onAdd,
  addMenu,
  addMenuOpen,
  onAddMenuOpenChange,
  hideAdd = false,
  maxItems,
  limitNote,
  footerEnd,
  emptyState,
  disabled = false,
  animateNewItems = true,
  accessibilityLabel = "Conditions",
  id,
}: RepeaterPropsType<ItemType>): ReactElement {
  // Rows present on the first render show without moving; later ones grow in.
  const initialIds = useRef<Set<RepeaterKeyType> | null>(null);
  if (initialIds.current === null) {
    initialIds.current = new Set(items.map((item, index) => getItemId(item, index)));
  }

  const [menuOpenState, setMenuOpenState] = useState(false);
  const menuOpen = addMenuOpen ?? menuOpenState;
  const setMenuOpen = (open: boolean) => {
    if (addMenuOpen === undefined) setMenuOpenState(open);
    onAddMenuOpenChange?.(open);
  };
  const addAnchorRef = useRef<HTMLSpanElement>(null);

  const atLimit = repeaterAtLimit(items.length, maxItems);
  const addDisabled = disabled || atLimit;

  const addButton = (
    <Button
      icon="plus"
      variant="secondary"
      disabled={addDisabled}
      aria-expanded={addMenu !== undefined ? menuOpen : undefined}
      onClick={() => {
        onAdd?.();
        if (addMenu !== undefined) setMenuOpen(!menuOpen);
      }}
    >
      {addLabel}
    </Button>
  );

  const showFooter = !hideAdd || footerEnd !== undefined;

  return (
    <BlockStack gap="small-100" id={id}>
      {items.length > 0 ? (
        <BlockStack gap="small-100" role="list" aria-label={accessibilityLabel}>
          {items.map((item, index) => {
            const key = getItemId(item, index);
            const valueControl = renderValue?.(item, index) ?? null;
            const removeLabel =
              typeof removeAccessibilityLabel === "function"
                ? removeAccessibilityLabel(item, index)
                : removeAccessibilityLabel;
            const tip =
              removeTooltip === false
                ? null
                : removeTooltip === undefined
                  ? removeLabel
                  : typeof removeTooltip === "function"
                    ? removeTooltip(item, index)
                    : removeTooltip;
            const trash = onRemove ? (
              <Button
                icon="delete"
                variant="tertiary"
                disabled={disabled}
                accessibilityLabel={removeLabel}
                // Gone on the click, with no exit animation holding the row
                // (and the old list) open.
                onClick={() => onRemove(item, index)}
              />
            ) : null;

            return (
              <GrowIn key={key} appear={animateNewItems && !initialIds.current?.has(key)}>
                <RowHover>
                  <Box
                    borderWidth="base"
                    borderColor="border"
                    borderRadius="large-200"
                    overflow="hidden"
                  >
                    <Box padding="small-200">
                      <InlineStack
                        align="space-between"
                        blockAlign="start"
                        gap="small-300"
                        wrap={false}
                      >
                        <InlineStack
                          gap="small-300"
                          blockAlign="center"
                          wrap
                          minInlineSize="0"
                          grow
                          onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
                            // A field's blur can re-render the row before the
                            // click lands, so the press never opens the menu.
                            // Keep focus where it is when a pill is pressed.
                            const target = event.target as HTMLElement | null;
                            if (target?.closest?.("s-clickable")) event.preventDefault();
                          }}
                        >
                          {renderControls(item, index)}
                        </InlineStack>

                        {onRemove ? (
                          <InlineStack flex="none" blockAlign="start">
                            {/* Space kept: the button fades in place, so the
                                pills never reflow under the pointer as it
                                shows and hides. */}
                            <Hoverable.Show animation="fade">
                              {/* Inside the slot: the tooltip hides with the
                                  button, and its popover sits in the top
                                  layer, so the fade and the row's hover are
                                  untouched. */}
                              {tip === null || tip === undefined || tip === "" ? (
                                trash
                              ) : (
                                <Tooltip content={tip}>{trash}</Tooltip>
                              )}
                            </Hoverable.Show>
                          </InlineStack>
                        ) : null}
                      </InlineStack>
                    </Box>
                    {valueControl !== null && valueControl !== false ? (
                      <>
                        <Divider />
                        <Box background="base" padding="none" overflow="hidden">
                          {valueControl}
                        </Box>
                      </>
                    ) : null}
                  </Box>
                </RowHover>
              </GrowIn>
            );
          })}
        </BlockStack>
      ) : emptyState === undefined || emptyState === null ? null : isValidElement(
          emptyState,
        ) ? (
        emptyState
      ) : (
        <Text as="p" tone="critical">
          {emptyState}
        </Text>
      )}

      {showFooter ? (
        <InlineStack
          align="space-between"
          blockAlign="center"
          gap="small-200"
          wrap={false}
        >
          <InlineStack flex="none" gap="small-200" blockAlign="center">
            {hideAdd ? null : addMenu === undefined ? (
              addButton
            ) : (
              <span ref={addAnchorRef} style={ANCHOR_STYLE} onClick={releasePointerFocus}>
                {addButton}
                <FlexPopover
                  anchorRef={addAnchorRef}
                  isOpen={menuOpen && !addDisabled}
                  onClose={() => setMenuOpen(false)}
                  noHeader
                >
                  {addMenu}
                </FlexPopover>
              </span>
            )}
          </InlineStack>
          {footerEnd}
        </InlineStack>
      ) : null}

      {atLimit && limitNote ? limitNote : null}
    </BlockStack>
  );
}

/**
 * A list of condition rows, as in a smart collection's rules: each row is a
 * rounded card with its controls on top (`Repeater.Pill`s), an
 * optional value area under a divider, and a trash button that shows on hover
 * or keyboard focus and removes the row at once. An add button (optionally
 * opening a menu) and an end slot sit under the rows; a `maxItems` limit turns
 * the add button off and shows `limitNote`.
 *
 * ```tsx
 * <Repeater
 *   items={rules}
 *   renderControls={(rule) => (
 *     <>
 *       <Repeater.Pill label={rule.fieldLabel} menu={fieldMenu} … />
 *       <Repeater.Pill label={rule.operatorLabel} … />
 *     </>
 *   )}
 *   renderValue={(rule) => <Box padding="small-200"><TextField … /></Box>}
 *   onRemove={(rule) => remove(rule.id)}
 *   onAdd={addRule}
 * />
 * ```
 */
export const Repeater = Object.assign(RepeaterRoot, {
  Pill,
  Options,
  MatchMode,
  TagsInput,
});
