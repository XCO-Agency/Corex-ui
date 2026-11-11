import {
  isValidElement,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
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
import type {
  ConditionsRepeaterKeyType,
  ConditionsRepeaterOptionsPropsType,
  ConditionsRepeaterPillPropsType,
  ConditionsRepeaterPropsType,
} from "./ConditionsRepeater.types";

/** How long a new row takes to grow in. */
export const CONDITIONS_REPEATER_MOTION_MS = 220;

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
        data-cx-conditions-row=""
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
      duration={CONDITIONS_REPEATER_MOTION_MS}
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
}: ConditionsRepeaterPillPropsType): ReactElement {
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
Pill.displayName = "ConditionsRepeater.Pill";

// ─── Options ───────────────────────────────────────────────────────────────────

/** The menu rows the pills open: a check on the selected one. */
function Options({
  options,
  selected,
  onSelect,
}: ConditionsRepeaterOptionsPropsType): ReactElement {
  const picked = new Set(
    selected === undefined ? [] : typeof selected === "string" ? [selected] : selected,
  );
  return (
    <BlockStack gap="none" role="listbox">
      {options.map((option) => {
        const isSelected = picked.has(option.value);
        return (
          <Clickable
            key={option.value}
            role="option"
            aria-selected={isSelected}
            inlineSize="fill"
            paddingBlock="small-200"
            paddingInline="small-100"
            borderRadius="large"
            minBlockSize="36px"
            background={isSelected ? "subdued" : undefined}
            accessibilityLabel={
              option.detail ? `${option.label}. ${option.detail}` : option.label
            }
            onClick={() => onSelect(option.value)}
          >
            <InlineStack
              gap="small-200"
              blockAlign={option.detail ? "start" : "center"}
              wrap={false}
            >
              {isSelected ? <Icon type="check" /> : null}
              <BlockStack gap="small-300">
                <Text as="span">{option.label}</Text>
                {option.detail ? (
                  <Text as="span" variant="bodySm" color="subdued">
                    {option.detail}
                  </Text>
                ) : null}
              </BlockStack>
            </InlineStack>
          </Clickable>
        );
      })}
    </BlockStack>
  );
}
Options.displayName = "ConditionsRepeater.Options";

// ─── Repeater ──────────────────────────────────────────────────────────────────

function defaultItemId(item: unknown, index: number): ConditionsRepeaterKeyType {
  const id = (item as { id?: unknown } | null)?.id;
  return typeof id === "string" || typeof id === "number" ? id : index;
}

/** Whether the add button is off: disabled, or at the plan's limit. */
export function conditionsAtLimit(count: number, maxItems: number | undefined): boolean {
  return typeof maxItems === "number" && count >= maxItems;
}

function ConditionsRepeaterRoot<ItemType>({
  items,
  getItemId = defaultItemId,
  renderControls,
  renderValue,
  onRemove,
  removeAccessibilityLabel = "Remove condition",
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
}: ConditionsRepeaterPropsType<ItemType>): ReactElement {
  // Rows present on the first render show without moving; later ones grow in.
  const initialIds = useRef<Set<ConditionsRepeaterKeyType> | null>(null);
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

  const atLimit = conditionsAtLimit(items.length, maxItems);
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
                              <Button
                                icon="delete"
                                variant="tertiary"
                                disabled={disabled}
                                accessibilityLabel={removeLabel}
                                // Gone on the click, with no exit animation
                                // holding the row (and the old list) open.
                                onClick={() => onRemove(item, index)}
                              />
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
 * rounded card with its controls on top (`ConditionsRepeater.Pill`s), an
 * optional value area under a divider, and a trash button that shows on hover
 * or keyboard focus and removes the row at once. An add button (optionally
 * opening a menu) and an end slot sit under the rows; a `maxItems` limit turns
 * the add button off and shows `limitNote`.
 *
 * ```tsx
 * <ConditionsRepeater
 *   items={rules}
 *   renderControls={(rule) => (
 *     <>
 *       <ConditionsRepeater.Pill label={rule.fieldLabel} menu={fieldMenu} … />
 *       <ConditionsRepeater.Pill label={rule.operatorLabel} … />
 *     </>
 *   )}
 *   renderValue={(rule) => <Box padding="small-200"><TextField … /></Box>}
 *   onRemove={(rule) => remove(rule.id)}
 *   onAdd={addRule}
 * />
 * ```
 */
export const ConditionsRepeater = Object.assign(ConditionsRepeaterRoot, {
  Pill,
  Options,
});
