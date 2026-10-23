import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { mergeRefs } from "../../core/mergeRefs";

/**
 * Dependency-free command menu primitive (the cmdk-style API Corex
 * exposes): filtering, grouped results, an empty state and keyboard selection.
 * Items render in source order; filtering only hides non-matching ones.
 */

export type CommandFilterType = (value: string, search: string, keywords?: string[]) => number;

const useClientLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Default ranking: `1` for a substring match (earlier is better), a smaller
 * score for an in-order subsequence ("stg" → "settings"), `0` for no match.
 */
export const defaultCommandFilter: CommandFilterType = (value, search, keywords) => {
  const query = search.trim().toLowerCase();
  if (!query) return 1;
  const haystack = [value, ...(keywords ?? [])].join(" ").toLowerCase();
  const index = haystack.indexOf(query);
  if (index !== -1) return 1 - Math.min(index, 50) / 100;
  let position = 0;
  for (const char of query) {
    if (char === " ") continue;
    position = haystack.indexOf(char, position);
    if (position === -1) return 0;
    position += 1;
  }
  return 0.1;
};

type RootContextType = {
  search: string;
  setSearch: (value: string) => void;
  matches: (value: string, keywords?: string[]) => boolean;
  selected: string | null;
  select: (value: string | null, options?: { scroll?: boolean }) => void;
  reportVisible: (id: string, visible: boolean) => void;
  visibleCount: number;
  listId: string;
  label?: string;
  pointerSelection: boolean;
};

const RootContext = createContext<RootContextType | null>(null);
const GroupContext = createContext<{ reportVisible: (id: string, visible: boolean) => void } | null>(
  null,
);

function useRoot(): RootContextType {
  const ctx = useContext(RootContext);
  if (!ctx) throw new Error("Command parts must be rendered inside <Command>.");
  return ctx;
}

/** Tracks which children are visible; `count` re-renders only when it changes. */
function useVisibilityRegistry() {
  const visible = useRef(new Set<string>());
  const [count, setCount] = useState(0);
  const report = useCallback((id: string, isVisible: boolean) => {
    const set = visible.current;
    const had = set.has(id);
    if (isVisible === had) return;
    if (isVisible) set.add(id);
    else set.delete(id);
    setCount(set.size);
  }, []);
  return { count, report };
}

const ITEM_SELECTOR = '[data-slot="command-item"]:not([data-disabled="true"])';

export type CommandPrimitiveRootPropsType = Omit<
  ComponentPropsWithoutRef<"div">,
  "onChange" | "defaultValue"
> & {
  /** Accessible label for the menu. */
  label?: string;
  /** Filter and hide items as the search changes. @default true */
  shouldFilter?: boolean;
  /** Custom score: `0` hides an item, higher is a better match. */
  filter?: CommandFilterType;
  /** Controlled highlighted item value. */
  value?: string;
  /** Initial highlighted item value. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Arrow keys wrap around the list ends. @default false */
  loop?: boolean;
  /** Ignore pointer movement for highlighting. @default false */
  disablePointerSelection?: boolean;
};

export const CommandPrimitiveRoot = forwardRef<HTMLDivElement, CommandPrimitiveRootPropsType>(
  function CommandPrimitiveRoot(
    {
      label,
      shouldFilter = true,
      filter = defaultCommandFilter,
      value: valueProp,
      defaultValue,
      onValueChange,
      loop = false,
      disablePointerSelection = false,
      onKeyDown,
      children,
      ...props
    },
    ref,
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMemo(() => mergeRefs(ref, rootRef), [ref]);
    const listId = `${useId().replace(/:/g, "")}-command-list`;
    const [search, setSearch] = useState("");
    const [internalSelected, setInternalSelected] = useState<string | null>(defaultValue ?? null);
    const controlled = valueProp !== undefined;
    const selected = controlled ? valueProp : internalSelected;
    const { count: visibleCount, report: reportVisible } = useVisibilityRegistry();
    const onValueChangeRef = useRef(onValueChange);
    onValueChangeRef.current = onValueChange;
    const selectedRef = useRef(selected);
    selectedRef.current = selected;

    const matches = useCallback(
      (value: string, keywords?: string[]) =>
        !shouldFilter || !search.trim() || filter(value, search, keywords) > 0,
      [shouldFilter, search, filter],
    );

    const items = useCallback(
      () => Array.from(rootRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []),
      [],
    );

    const select = useCallback(
      (value: string | null, options?: { scroll?: boolean }) => {
        if (value === selectedRef.current) return;
        if (!controlled) setInternalSelected(value);
        if (value !== null) onValueChangeRef.current?.(value);
        if (options?.scroll && value !== null) {
          const node = items().find((item) => item.dataset.value === value);
          if (node && typeof node.scrollIntoView === "function") node.scrollIntoView({ block: "nearest" });
        }
      },
      [controlled, items],
    );

    // Keep the highlight on a visible item: the first one after each search change.
    const lastSearch = useRef(search);
    useClientLayoutEffect(() => {
      const values = items().map((item) => item.dataset.value ?? "");
      const searchChanged = lastSearch.current !== search;
      lastSearch.current = search;
      if (values.length === 0) return;
      if (searchChanged || selectedRef.current === null || !values.includes(selectedRef.current)) {
        select(values[0]!);
      }
    }, [search, visibleCount, items, select]);

    const move = (direction: 1 | -1 | "first" | "last") => {
      const values = items().map((item) => item.dataset.value ?? "");
      if (values.length === 0) return;
      const index = selectedRef.current === null ? -1 : values.indexOf(selectedRef.current);
      let next: number;
      if (direction === "first") next = 0;
      else if (direction === "last") next = values.length - 1;
      else if (index === -1) next = direction === 1 ? 0 : values.length - 1;
      else {
        next = index + direction;
        if (next < 0) next = loop ? values.length - 1 : 0;
        if (next >= values.length) next = loop ? 0 : values.length - 1;
      }
      select(values[next]!, { scroll: true });
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || event.nativeEvent.isComposing) return;
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          move(1);
          break;
        case "ArrowUp":
          event.preventDefault();
          move(-1);
          break;
        case "Home":
          event.preventDefault();
          move("first");
          break;
        case "End":
          event.preventDefault();
          move("last");
          break;
        case "Enter": {
          const node = items().find((item) => item.dataset.value === selectedRef.current);
          if (node) {
            event.preventDefault();
            node.dispatchEvent(new CustomEvent("cx-command-select", { bubbles: false }));
          }
          break;
        }
        default:
      }
    };

    const contextValue = useMemo<RootContextType>(
      () => ({
        search,
        setSearch,
        matches,
        selected,
        select,
        reportVisible,
        visibleCount,
        listId,
        label,
        pointerSelection: !disablePointerSelection,
      }),
      [search, matches, selected, select, reportVisible, visibleCount, listId, label, disablePointerSelection],
    );

    return (
      <RootContext.Provider value={contextValue}>
        <div ref={mergedRef} aria-label={label} onKeyDown={handleKeyDown} {...props}>
          {children}
        </div>
      </RootContext.Provider>
    );
  },
);

export type CommandPrimitiveInputPropsType = Omit<
  ComponentPropsWithoutRef<"input">,
  "value" | "onChange" | "type"
> & {
  value?: string;
  onValueChange?: (search: string) => void;
};

export const CommandPrimitiveInput = forwardRef<HTMLInputElement, CommandPrimitiveInputPropsType>(
  function CommandPrimitiveInput({ value, onValueChange, ...props }, ref) {
    const root = useRoot();
    const current = value ?? root.search;
    const setSearch = root.setSearch;
    useEffect(() => {
      if (value !== undefined) setSearch(value);
    }, [value, setSearch]);

    return (
      <input
        ref={ref}
        type="text"
        role="combobox"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-autocomplete="list"
        aria-expanded
        aria-controls={root.listId}
        aria-activedescendant={
          root.selected !== null ? `${root.listId}-${encodeURIComponent(root.selected)}` : undefined
        }
        {...props}
        value={current}
        onChange={(event) => {
          if (value === undefined) root.setSearch(event.target.value);
          onValueChange?.(event.target.value);
        }}
      />
    );
  },
);

export type CommandPrimitiveListPropsType = ComponentPropsWithoutRef<"div"> & { label?: string };

export const CommandPrimitiveList = forwardRef<HTMLDivElement, CommandPrimitiveListPropsType>(
  function CommandPrimitiveList({ label, children, ...props }, ref) {
    const root = useRoot();
    return (
      <div
        ref={ref}
        id={root.listId}
        role="listbox"
        aria-label={label ?? root.label ?? "Suggestions"}
        tabIndex={-1}
        {...props}
      >
        {children}
      </div>
    );
  },
);

export type CommandPrimitiveEmptyPropsType = ComponentPropsWithoutRef<"div">;

/** Rendered only when no item is visible. */
export const CommandPrimitiveEmpty = forwardRef<HTMLDivElement, CommandPrimitiveEmptyPropsType>(
  function CommandPrimitiveEmpty(props, ref) {
    const root = useRoot();
    if (root.visibleCount > 0) return null;
    return <div ref={ref} role="presentation" {...props} />;
  },
);

export type CommandPrimitiveGroupPropsType = Omit<ComponentPropsWithoutRef<"div">, "heading"> & {
  heading?: ReactNode;
  /** Keep the group visible even when none of its items match. */
  forceMount?: boolean;
};

export const CommandPrimitiveGroup = forwardRef<HTMLDivElement, CommandPrimitiveGroupPropsType>(
  function CommandPrimitiveGroup({ heading, forceMount, children, style, ...props }, ref) {
    const headingId = `${useId().replace(/:/g, "")}-heading`;
    const { count, report } = useVisibilityRegistry();
    const groupContext = useMemo(() => ({ reportVisible: report }), [report]);
    const hidden = !forceMount && count === 0;
    return (
      <GroupContext.Provider value={groupContext}>
        <div
          ref={ref}
          role="presentation"
          hidden={hidden || undefined}
          style={hidden ? { ...style, display: "none" } : style}
          {...props}
        >
          {heading != null ? (
            <div data-slot="command-group-heading" id={headingId} aria-hidden="true">
              {heading}
            </div>
          ) : null}
          <div data-slot="command-group-items" role="group" aria-labelledby={heading != null ? headingId : undefined}>
            {children}
          </div>
        </div>
      </GroupContext.Provider>
    );
  },
);

export type CommandPrimitiveItemPropsType = Omit<ComponentPropsWithoutRef<"div">, "onSelect"> & {
  /** Value used for filtering and `onSelect`. Defaults to the item's text. */
  value?: string;
  /** Extra search terms. */
  keywords?: string[];
  disabled?: boolean;
  /** Always render, ignoring the filter. */
  forceMount?: boolean;
  onSelect?: (value: string) => void;
};

export const CommandPrimitiveItem = forwardRef<HTMLDivElement, CommandPrimitiveItemPropsType>(
  function CommandPrimitiveItem(
    { value: valueProp, keywords, disabled = false, forceMount, onSelect, onClick, onPointerMove, children, ...props },
    ref,
  ) {
    const root = useRoot();
    const group = useContext(GroupContext);
    const id = useId();
    const nodeRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMemo(() => mergeRefs(ref, nodeRef), [ref]);
    const [textValue, setTextValue] = useState("");
    const value = (valueProp ?? textValue).trim();

    useClientLayoutEffect(() => {
      if (valueProp === undefined) setTextValue(nodeRef.current?.textContent ?? "");
    });

    // Until the text is measured, a value-less item stays visible so it can be read.
    const visible =
      Boolean(forceMount) || (valueProp === undefined && !textValue) || root.matches(value, keywords);
    const { reportVisible } = root;
    const groupReport = group?.reportVisible;
    useClientLayoutEffect(() => {
      reportVisible(id, visible);
      groupReport?.(id, visible);
    }, [id, visible, reportVisible, groupReport]);
    useEffect(
      () => () => {
        reportVisible(id, false);
        groupReport?.(id, false);
      },
      [id, reportVisible, groupReport],
    );

    const onSelectRef = useRef(onSelect);
    onSelectRef.current = onSelect;
    // Enter on the input reaches the highlighted item through this event.
    useEffect(() => {
      const node = nodeRef.current;
      if (!node) return undefined;
      const handle = () => {
        if (!disabled) onSelectRef.current?.(value);
      };
      node.addEventListener("cx-command-select", handle);
      return () => node.removeEventListener("cx-command-select", handle);
    }, [disabled, value, visible]);

    if (!visible) return null;
    const isSelected = root.selected === value;

    return (
      <div
        ref={mergedRef}
        id={`${root.listId}-${encodeURIComponent(value)}`}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled || undefined}
        data-value={value}
        data-selected={isSelected ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
        {...props}
        onPointerMove={(event) => {
          onPointerMove?.(event);
          if (!disabled && root.pointerSelection && !isSelected) root.select(value);
        }}
        onClick={(event) => {
          onClick?.(event);
          if (disabled || event.defaultPrevented) return;
          root.select(value);
          onSelect?.(value);
        }}
      >
        {children}
      </div>
    );
  },
);

export type CommandPrimitiveSeparatorPropsType = ComponentPropsWithoutRef<"div"> & {
  /** Keep showing while searching. @default false */
  alwaysRender?: boolean;
};

export const CommandPrimitiveSeparator = forwardRef<HTMLDivElement, CommandPrimitiveSeparatorPropsType>(
  function CommandPrimitiveSeparator({ alwaysRender = false, ...props }, ref) {
    const root = useRoot();
    if (!alwaysRender && root.search.trim()) return null;
    return <div ref={ref} role="separator" {...props} />;
  },
);
