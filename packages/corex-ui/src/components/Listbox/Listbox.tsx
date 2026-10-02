import { createContext, forwardRef, useContext, useRef } from "react";
import { useDomEvent } from "../../core/useDomEvent";
import { BlockStack } from "../BlockStack";
import { Clickable } from "../Clickable";
import { Divider } from "../Divider";
import { Spinner } from "../Spinner";
import { Text } from "../Text";
import { devWarning } from "../../utils/devWarning";
import { AutoSelection } from "./Listbox.types";
import type {
  ListboxActionPropsType,
  ListboxHeaderPropsType,
  ListboxLoadingPropsType,
  ListboxOptionPropsType,
  ListboxPropsType,
  ListboxSectionPropsType,
} from "./Listbox.types";

const ListboxContext = createContext<{ onSelect?: (value: string) => void }>({});

/**
 * One option.
 *
 * Selection happens on `mousedown`, not on click: the field above keeps focus, so
 * typing can continue straight after a pick. A click handler would fire after the
 * blur that closes the list. Keyboard selection is handled separately, since
 * `keydown` is the event a focused option gets — this is why there is no `onClick`
 * here at all, and why a pointer pick cannot fire twice.
 */
export const ListboxOption = forwardRef<HTMLElement, ListboxOptionPropsType>(
  function ListboxOption(
    { children, value, selected, disabled, accessibilityLabel },
    _ref,
  ) {
    const { onSelect } = useContext(ListboxContext);
    const nodeRef = useRef<HTMLElement>(null);

    const select = (event: Event) => {
      event.preventDefault();
      if (disabled) return;
      onSelect?.(value);
    };

    useDomEvent(nodeRef, "mousedown", select);
    useDomEvent(nodeRef, "keydown", (event) => {
      const key = (event as KeyboardEvent).key;
      if (key !== "Enter" && key !== " ") return;
      select(event);
    });

    return (
      <Clickable
        ref={nodeRef}
        role="option"
        aria-selected={Boolean(selected)}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        padding="small-100"
        borderRadius="base"
        inlineSize="fill"
        background={selected ? "subdued" : undefined}
      >
        {children}
      </Clickable>
    );
  },
);

/** A titled run of options, as a product/destination split uses. */
export function ListboxSection({ children, title, divider }: ListboxSectionPropsType) {
  return (
    <BlockStack
      gap="none"
      role="group"
      aria-label={typeof title === "string" ? title : undefined}
    >
      {divider ? <Divider /> : null}
      {title ? <ListboxHeader>{title}</ListboxHeader> : null}
      {children}
    </BlockStack>
  );
}

/** A heading inside the list. Not an option, and not announced as one. */
export function ListboxHeader({ children }: ListboxHeaderPropsType) {
  return (
    <Text color="subdued" variant="small" fontWeight="medium">
      {children}
    </Text>
  );
}

/** A trailing action, such as "Add this as a new tag". */
export function ListboxAction({ children, value, onAction }: ListboxActionPropsType) {
  const { onSelect } = useContext(ListboxContext);
  const nodeRef = useRef<HTMLElement>(null);

  useDomEvent(nodeRef, "mousedown", (event) => {
    event.preventDefault();
    if (onAction) {
      onAction();
      return;
    }
    if (value !== undefined) onSelect?.(value);
  });

  return (
    <Clickable ref={nodeRef} padding="small-100" borderRadius="base" inlineSize="fill">
      {children}
    </Clickable>
  );
}

/** The row shown while suggestions are still being fetched. */
export function ListboxLoading({ accessibilityLabel }: ListboxLoadingPropsType) {
  return (
    // The live region belongs on a wrapper: `Spinner` renders the element the
    // admin draws, and `s-spinner` takes no ARIA of its own.
    <BlockStack gap="none" role="status" aria-live="polite">
      <Spinner accessibilityLabel={accessibilityLabel ?? "Loading suggestions"} />
    </BlockStack>
  );
}

const ListboxRoot = forwardRef<HTMLDivElement, ListboxPropsType>(function Listbox(
  { children, onSelect, autoSelection, accessibilityLabel, ...rest },
  ref,
) {
  if (autoSelection && autoSelection !== AutoSelection.None) {
    devWarning(
      "Listbox",
      "Only `AutoSelection.None` is honoured; the list does not move focus into itself as the user types.",
    );
  }

  return (
    <ListboxContext.Provider value={{ onSelect }}>
      <BlockStack
        ref={ref}
        gap="none"
        role="listbox"
        aria-label={accessibilityLabel}
        {...rest}
      >
        {children}
      </BlockStack>
    </ListboxContext.Provider>
  );
});

export const Listbox = Object.assign(ListboxRoot, {
  Option: ListboxOption,
  Section: ListboxSection,
  Header: ListboxHeader,
  Action: ListboxAction,
  Loading: ListboxLoading,
});
