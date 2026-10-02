import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { mergeRefs } from "../../core/mergeRefs";
import { BlockStack } from "../BlockStack";
import { Box } from "../Box";
import { Clickable } from "../Clickable";
import { FlexPopover } from "../FlexPopover";
import { Icon } from "../Icon";
import { InlineStack } from "../InlineStack";
import { Listbox } from "../Listbox";
import { Tag } from "../Tag";
import { Text } from "../Text";
import { TextField } from "../TextField";
import type {
  ComboboxComponentType,
  ComboboxContentPropsType,
  ComboboxContextType,
  ComboboxEmptyPropsType,
  ComboboxInputPropsType,
  ComboboxItemPropsType,
  ComboboxListPropsType,
  ComboboxPopoverPropsType,
  ComboboxPropsType,
} from "./Combobox.types";
const ComboboxContext = createContext<ComboboxContextType | null>(null);

export function useCombobox<T = any>(): ComboboxContextType<T> {
  const context = useContext(ComboboxContext);
  if (!context) {
    throw new Error("Combobox subcomponents must be used within <Combobox>.");
  }
  return context as ComboboxContextType<T>;
}

const ComboboxPopover = forwardRef<HTMLDivElement, ComboboxPopoverPropsType>(
  function ComboboxPopover({ children }, _ref) {
    return <>{children}</>;
  },
);
ComboboxPopover.displayName = "ComboboxPopover";

/**
 * Input field for search filtering in Combobox. Automatically renders selected tags when multiple is true.
 */
const ComboboxInput = forwardRef<HTMLElement, ComboboxInputPropsType>(
  function ComboboxInput(
    {
      placeholder = "Search...",
      value: propValue,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      showClear,
      onClear,
      disabled,
      readOnly,
      autoComplete = "off",
      autoCorrect = "off",
      autoCapitalize = "none",
      spellCheck = false,
      "aria-autocomplete": ariaAutocomplete = "list",
      label = "",
      helpText,
      prefix,
      suffix,
      error,
      id,
      className,
      style,
    },
    ref,
  ) {
    const {
      inputValue,
      setInputValue,
      open,
      setOpen,
      disabled: rootDisabled,
      readOnly: rootReadOnly,
      anchorRef,
      filteredItems,
      highlightedIndex,
      setHighlightedIndex,
      selectItem,
      multiple,
      value: rootValue,
      itemToString,
      clearValue,
      removeTag,
      comboboxId,
    } = useCombobox();

    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedInputRef = mergeRefs(inputRef, ref as any);

    const isEffectiveDisabled = Boolean(disabled ?? rootDisabled);
    const isEffectiveReadOnly = Boolean(readOnly ?? rootReadOnly);

    const isDisplayingSelection =
      !multiple && !open && rootValue !== undefined && rootValue !== null;
    const selectionString = isDisplayingSelection ? itemToString(rootValue) : "";

    const displayValue =
      propValue !== undefined
        ? propValue
        : isDisplayingSelection && !inputValue
          ? selectionString
          : inputValue;

    const handleInput = (nextVal: string, fieldId?: string) => {
      setInputValue(nextVal);
      onChange?.(nextVal, fieldId);
      if (!open && !isEffectiveDisabled && !isEffectiveReadOnly) {
        setOpen(true);
      }
    };

    const handleFocus = (event: any) => {
      setIsFocused(true);
      onFocus?.(event);
      if (!isEffectiveDisabled && !isEffectiveReadOnly) {
        setOpen(true);
      }
    };

    const handleBlur = (event: any) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    const handleClear = () => {
      setInputValue("");
      clearValue();
      onClear?.();
      onChange?.("", id);
      inputRef.current?.focus();
    };

    const handleChevronClick = (e: any) => {
      e.stopPropagation();
      if (!isEffectiveDisabled && !isEffectiveReadOnly) {
        if (!open) {
          inputRef.current?.focus();
        }
        setOpen(!open);
      }
    };

    const handleContainerClick = () => {
      if (!isEffectiveDisabled && !isEffectiveReadOnly) {
        inputRef.current?.focus();
        if (!open) {
          setOpen(true);
        }
      }
    };

    const tags: any[] = useMemo(() => {
      if (!multiple) return [];
      return Array.isArray(rootValue) ? rootValue : rootValue != null ? [rootValue] : [];
    }, [multiple, rootValue]);

    const handleKeyDown = (event: KeyboardEvent<any>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      const count = filteredItems.length;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!open) {
          setOpen(true);
        } else if (count > 0) {
          setHighlightedIndex((prev) => (prev < 0 ? 0 : (prev + 1) % count));
        }
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!open) {
          setOpen(true);
        } else if (count > 0) {
          setHighlightedIndex((prev) => (prev <= 0 ? count - 1 : prev - 1));
        }
      } else if (event.key === "Enter") {
        if (open && count > 0 && highlightedIndex >= 0 && highlightedIndex < count) {
          event.preventDefault();
          const target = filteredItems[highlightedIndex];
          if (target !== undefined) selectItem(target);
        }
      } else if (event.key === "Escape") {
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
      } else if (event.key === "Backspace" && !inputValue && tags.length > 0) {
        event.preventDefault();
        removeTag(tags[tags.length - 1]);
      }
    };

    const boxRef = useRef<HTMLElement>(null);
    const mergedAnchorRef = mergeRefs(anchorRef, boxRef);

    const shouldShowClear = Boolean(showClear && (displayValue || tags.length > 0));

    return (
      <BlockStack gap="small-100" inlineSize="100%">
        {label ? (
          <Text variant="small" fontWeight="medium">
            {label}
          </Text>
        ) : null}

        <Box
          ref={mergedAnchorRef}
          inlineSize="100%"
          background="base"
          border="base"
          borderColor={error ? "border-critical" : isFocused ? "border-focus" : "border"}
          borderRadius="large"
          paddingInline="small-300"
          paddingBlock="none"
          minBlockSize="32px"
          className={className}
          style={{
            boxShadow: isFocused
              ? "0 0 0 2px var(--p-color-border-focus, #4680ff42)"
              : undefined,
            outlineOffset: -1,
            outline: isFocused
              ? "1px solid var(--p-color-border-focus, #4680ff)"
              : undefined,
            borderRadius: 12,
            transition: "border-color 150ms ease, box-shadow 150ms ease",
            cursor: isEffectiveDisabled ? "default" : "text",
            opacity: isEffectiveDisabled ? 0.6 : 1,
            ...style,
          }}
          onClick={handleContainerClick}
        >
          <InlineStack
            alignItems="center"
            gap="small-200"
            minBlockSize="32px"
            inlineSize="fill"
          >
            {prefix ? (
              <InlineStack alignItems="center" shrink={false}>
                {prefix}
              </InlineStack>
            ) : null}

            {tags.length > 0 ? (
              <InlineStack gap="small-300" wrap alignItems="center" shrink={false}>
                {tags.map((tag) => (
                  <Tag
                    key={itemToString(tag)}
                    removable={!isEffectiveDisabled && !isEffectiveReadOnly}
                    onRemove={
                      isEffectiveDisabled || isEffectiveReadOnly
                        ? undefined
                        : () => removeTag(tag)
                    }
                    disabled={isEffectiveDisabled}
                  >
                    {itemToString(tag)}
                  </Tag>
                ))}
              </InlineStack>
            ) : null}

            <input
              ref={mergedInputRef}
              id={id}
              type="text"
              role="combobox"
              aria-autocomplete={ariaAutocomplete}
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-controls={open ? `${comboboxId}-listbox` : undefined}
              aria-activedescendant={
                open && highlightedIndex >= 0
                  ? `${comboboxId}-item-${highlightedIndex}`
                  : undefined
              }
              autoComplete={autoComplete}
              autoCorrect={autoCorrect}
              autoCapitalize={autoCapitalize}
              spellCheck={spellCheck}
              disabled={isEffectiveDisabled}
              readOnly={isEffectiveReadOnly}
              value={displayValue}
              placeholder={tags.length > 0 ? "" : placeholder}
              onChange={(e) => handleInput(e.target.value, id)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              style={{
                flex: "1 1 60px",
                minWidth: "60px",
                height: "24px",
                padding: "0 4px",
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "13px",
                fontFamily: "inherit",
                color: "inherit",
              }}
            />

            {suffix ? (
              <InlineStack alignItems="center" shrink={false}>
                {suffix}
              </InlineStack>
            ) : null}

            <InlineStack alignItems="center" shrink={false}>
              {shouldShowClear ? (
                <Clickable
                  accessibilityLabel="Clear selection"
                  disabled={isEffectiveDisabled || isEffectiveReadOnly}
                  onClick={(e: any) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  padding="small-500"
                  borderRadius="base"
                >
                  <Icon source="x" tone="neutral" />
                </Clickable>
              ) : (
                <Clickable
                  accessibilityLabel={open ? "Close suggestions" : "Open suggestions"}
                  disabled={isEffectiveDisabled || isEffectiveReadOnly}
                  onClick={handleChevronClick}
                  padding="small-500"
                  borderRadius="base"
                >
                  <Icon source="chevron-down" tone="neutral" />
                </Clickable>
              )}
            </InlineStack>
          </InlineStack>
        </Box>

        {error || helpText ? (
          <Text variant="small" color={error ? "critical" : "subdued"}>
            {error || helpText}
          </Text>
        ) : null}
      </BlockStack>
    );
  },
);
ComboboxInput.displayName = "ComboboxInput";

/**
 * Floating popover container holding Combobox suggestions, powered by FlexPopover.
 */
const ComboboxContent = forwardRef<HTMLDivElement, ComboboxContentPropsType>(
  function ComboboxContent(
    {
      children,
      maxHeight = "320px",
      matchAnchorWidth = true,
      offset = 8,
      className,
      style,
    },
    _ref,
  ) {
    const { open, setOpen, anchorRef, comboboxId } = useCombobox();

    return (
      <FlexPopover
        anchorId={comboboxId}
        anchorRef={anchorRef}
        isOpen={open}
        onClose={() => setOpen(false)}
        matchAnchorWidth={matchAnchorWidth}
        maxHeight={typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight}
        offset={offset}
        noHeader
        className={className}
        style={style}
      >
        {children}
      </FlexPopover>
    );
  },
);
ComboboxContent.displayName = "ComboboxContent";

/**
 * Suggestion list container. Supports normal children or a mapping function `(item, index) => ReactNode`.
 */
const ComboboxList = forwardRef<HTMLDivElement, ComboboxListPropsType>(
  function ComboboxList({ children, className, style, "aria-label": ariaLabel }, ref) {
    const { filteredItems, comboboxId } = useCombobox();

    const content =
      typeof children === "function"
        ? filteredItems.map((item, index) => children(item, index))
        : children;

    return (
      <BlockStack
        ref={ref}
        id={`${comboboxId}-listbox`}
        gap="small-500"
        role="listbox"
        aria-label={ariaLabel ?? "Suggestions"}
        className={className}
        style={style}
      >
        {content}
      </BlockStack>
    );
  },
);
ComboboxList.displayName = "ComboboxList";

/**
 * Individual selectable item in Combobox.
 */
const ComboboxItem = forwardRef<HTMLElement, ComboboxItemPropsType>(function ComboboxItem(
  { value, disabled, children, onSelect, className, style, ...rest },
  ref,
) {
  const {
    isSelected,
    selectItem,
    itemToString,
    highlightedIndex,
    setHighlightedIndex,
    filteredItems,
    comboboxId,
  } = useCombobox();

  const selected = isSelected(value);
  const itemLabel = typeof children === "string" ? children : itemToString(value);
  const currentIndex = filteredItems.findIndex(
    (item) => item === value || itemToString(item) === itemToString(value),
  );
  const isHighlighted = currentIndex >= 0 && currentIndex === highlightedIndex;

  const handleSelect = (e?: any) => {
    if (disabled) return;
    e?.preventDefault?.();
    selectItem(value);
    onSelect?.();
  };

  const handleMouseEnter = () => {
    if (!disabled && currentIndex >= 0) {
      setHighlightedIndex(currentIndex);
    }
  };

  return (
    <Box
      inlineSize="100%"
      className={className}
      style={style}
      onMouseEnter={handleMouseEnter}
    >
      <Clickable
        ref={ref}
        id={currentIndex >= 0 ? `${comboboxId}-item-${currentIndex}` : undefined}
        role="option"
        aria-selected={selected}
        disabled={disabled}
        padding="small-300"
        borderRadius="large"
        inlineSize="fill"
        background={selected || isHighlighted ? "subdued" : undefined}
        onClick={handleSelect}

        {...rest}
      >
        <InlineStack alignItems="center" justifyContent="space-between" inlineSize="fill">
          <Box inlineSize="100%">
            {typeof children === "string" ? (
              <Text fontWeight={selected ? "bold" : "regular"}>{children}</Text>
            ) : (
              (children ?? (
                <Text fontWeight={selected ? "bold" : "regular"}>{itemLabel}</Text>
              ))
            )}
          </Box>
          {selected ? <Icon source="check" /> : null}
        </InlineStack>
      </Clickable>
    </Box>
  );
});
ComboboxItem.displayName = "ComboboxItem";

/**
 * Displayed when no matching suggestion items exist.
 */
const ComboboxEmpty = forwardRef<HTMLDivElement, ComboboxEmptyPropsType>(
  function ComboboxEmpty({ children, className, style }, ref) {
    const { filteredItems } = useCombobox();

    if (filteredItems.length > 0) return null;

    return (
      <Box
        ref={ref}
        padding="base"
        inlineSize="100%"
        className={className}
        style={{ textAlign: "center", ...style }}
      >
        <Text color="subdued" variant="small">
          {children ?? "No items found."}
        </Text>
      </Box>
    );
  },
);
ComboboxEmpty.displayName = "ComboboxEmpty";

/**
 * Combobox autocomplete component.
 */
const ComboboxRoot = forwardRef<HTMLDivElement, ComboboxPropsType>(function Combobox(
  {
    items,
    itemToStringValue,
    value: controlledValue,
    defaultValue,
    onValueChange,
    multiple,
    allowMultiple,
    open: controlledOpen,
    active: controlledActive,
    defaultOpen = false,
    onOpenChange,
    onClose,
    inputValue: controlledInputValue,
    onInputValueChange,
    filter,
    autoHighlight = true,
    disabled = false,
    readOnly = false,
    activator,
    preferredPosition = "below",
    willLoadMoreOptions,
    onScrolledToBottom,
    id,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const comboboxId = id ?? `corex-combobox-${generatedId.replace(/:/g, "")}`;
  const anchorContainerRef = useRef<HTMLElement | null>(null);

  const isMultiple = Boolean(multiple ?? allowMultiple);

  // Open state
  const isControlledOpen = controlledOpen !== undefined || controlledActive !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = isControlledOpen
    ? Boolean(controlledOpen ?? controlledActive)
    : uncontrolledOpen;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlledOpen) setUncontrolledOpen(nextOpen);
      onOpenChange?.(nextOpen);
      if (!nextOpen) onClose?.();
    },
    [isControlledOpen, onOpenChange, onClose],
  );

  // Value state
  const isControlledValue = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() => {
    if (defaultValue !== undefined) return defaultValue;
    return isMultiple ? [] : undefined;
  });
  const currentValue = isControlledValue ? controlledValue : uncontrolledValue;

  // Search input query
  const isControlledInput = controlledInputValue !== undefined;
  const [uncontrolledInputValue, setUncontrolledInputValue] = useState("");
  const currentInputValue = isControlledInput
    ? controlledInputValue
    : uncontrolledInputValue;

  const setInputValue = useCallback(
    (nextVal: string) => {
      if (!isControlledInput) setUncontrolledInputValue(nextVal);
      onInputValueChange?.(nextVal);
    },
    [isControlledInput, onInputValueChange],
  );

  const itemToString = useCallback(
    (item: any): string => {
      if (item === null || item === undefined) return "";
      if (itemToStringValue) return itemToStringValue(item);
      if (typeof item === "string") return item;
      if (typeof item === "object") {
        if ("label" in item && typeof item.label === "string") return item.label;
        if ("name" in item && typeof item.name === "string") return item.name;
        if ("value" in item) return String(item.value);
      }
      return String(item);
    },
    [itemToStringValue],
  );

  // Filtering
  const filteredItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    if (filter === false || filter === null) return items;

    const query = currentInputValue.trim().toLowerCase();
    if (!query) return items;

    const filterFn =
      typeof filter === "function"
        ? filter
        : (item: any, q: string) => itemToString(item).toLowerCase().includes(q);

    return items.filter((item) => filterFn(item, query));
  }, [items, filter, currentInputValue, itemToString]);

  // Keyboard highlighted index (-1 means no item highlighted)
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
      return;
    }

    const query = currentInputValue.trim();
    if (query && autoHighlight && filteredItems.length > 0) {
      setHighlightedIndex(0);
    } else if (!query) {
      if (!isMultiple && currentValue !== undefined && currentValue !== null) {
        const selectedIdx = filteredItems.findIndex(
          (it) => it === currentValue || itemToString(it) === itemToString(currentValue),
        );
        setHighlightedIndex(selectedIdx);
      } else {
        setHighlightedIndex(-1);
      }
    }
  }, [
    isOpen,
    filteredItems,
    currentInputValue,
    autoHighlight,
    isMultiple,
    currentValue,
    itemToString,
  ]);

  const isSelected = useCallback(
    (target: any): boolean => {
      if (target === undefined || target === null) return false;
      if (currentValue === undefined || currentValue === null) return false;
      if (isMultiple) {
        if (!Array.isArray(currentValue)) return false;
        return currentValue.some(
          (entry) => entry === target || itemToString(entry) === itemToString(target),
        );
      }
      return (
        currentValue === target || itemToString(currentValue) === itemToString(target)
      );
    },
    [isMultiple, currentValue, itemToString],
  );

  const selectItem = useCallback(
    (target: any) => {
      if (disabled || readOnly) return;

      if (isMultiple) {
        const arrayVal = Array.isArray(currentValue) ? [...currentValue] : [];
        const exists = arrayVal.some(
          (entry) => entry === target || itemToString(entry) === itemToString(target),
        );
        const next = exists
          ? arrayVal.filter(
              (entry) => entry !== target && itemToString(entry) !== itemToString(target),
            )
          : [...arrayVal, target];

        if (!isControlledValue) setUncontrolledValue(next);
        onValueChange?.(next);
        setInputValue("");
      } else {
        if (!isControlledValue) setUncontrolledValue(target);
        onValueChange?.(target);
        setInputValue(itemToString(target));
        setOpen(false);
      }
    },
    [
      disabled,
      readOnly,
      isMultiple,
      currentValue,
      isControlledValue,
      onValueChange,
      setInputValue,
      itemToString,
      setOpen,
    ],
  );

  const removeTag = useCallback(
    (target: any) => {
      if (disabled || readOnly) return;
      if (isMultiple) {
        const arrayVal = Array.isArray(currentValue) ? [...currentValue] : [];
        const next = arrayVal.filter(
          (entry) => entry !== target && itemToString(entry) !== itemToString(target),
        );
        if (!isControlledValue) setUncontrolledValue(next);
        onValueChange?.(next);
      } else {
        if (!isControlledValue) setUncontrolledValue(undefined);
        onValueChange?.(undefined);
      }
    },
    [
      disabled,
      readOnly,
      isMultiple,
      currentValue,
      isControlledValue,
      onValueChange,
      itemToString,
    ],
  );

  const clearValue = useCallback(() => {
    if (disabled || readOnly) return;
    const next = isMultiple ? [] : undefined;
    if (!isControlledValue) setUncontrolledValue(next);
    onValueChange?.(next);
    setInputValue("");
  }, [disabled, readOnly, isMultiple, isControlledValue, onValueChange, setInputValue]);

  // Legacy Polaris mode (used by Autocomplete and legacy activator usage)
  const childArray = Children.toArray(children).filter(Boolean);
  const isListboxOrPopover = (c: any): boolean => {
    if (!isValidElement(c)) return false;
    return (
      c.type === ComboboxPopover ||
      c.type === Listbox ||
      (c.type as any)?.displayName === "Listbox" ||
      (childArray.length === 1 && Boolean((c.props as any)?.role === "listbox"))
    );
  };

  const hasLegacyContent = Boolean(
    activator && !childArray.some((c: any) => c?.type === ComboboxContent),
  );

  const legacyPopoverChildren: ReactNode[] = [];
  const legacyInFlowChildren: ReactNode[] = [];

  if (hasLegacyContent) {
    for (const child of childArray) {
      if (
        isValidElement(child) &&
        (child.type === ComboboxPopover ||
          (child.type as any)?.displayName === "ComboboxPopover")
      ) {
        legacyPopoverChildren.push(...Children.toArray((child.props as any)?.children));
      } else if (isListboxOrPopover(child)) {
        legacyPopoverChildren.push(child);
      } else {
        legacyInFlowChildren.push(child);
      }
    }
  }

  const wrapLegacyListbox = (child: ReactNode, keyPrefix: string | number): ReactNode => {
    if (!isValidElement(child)) return child;
    const resolvedKey = child.key ?? keyPrefix;

    if (
      child.type === Listbox ||
      (child.type as any)?.displayName === "Listbox" ||
      (child.props as any)?.role === "listbox"
    ) {
      const originalOnSelect = (child.props as any)?.onSelect;
      return cloneElement(child as ReactElement<any>, {
        key: resolvedKey,
        onSelect: (val: string) => {
          originalOnSelect?.(val);
          selectItem(val);
          if (!isMultiple) setOpen(false);
        },
      });
    }

    if ((child.props as any)?.children) {
      return cloneElement(child as ReactElement<any>, {
        key: resolvedKey,
        children: Children.map((child.props as any).children, (nested, i) =>
          wrapLegacyListbox(nested, `${keyPrefix}-${i}`),
        ),
      });
    }

    return cloneElement(child as ReactElement<any>, { key: resolvedKey });
  };

  const contextValue: ComboboxContextType = useMemo(
    () => ({
      items,
      itemToString,
      value: currentValue,
      isSelected,
      selectItem,
      removeTag,
      clearValue,
      open: isOpen,
      setOpen,
      inputValue: currentInputValue,
      setInputValue,
      filteredItems,
      highlightedIndex,
      setHighlightedIndex,
      multiple: isMultiple,
      disabled,
      readOnly,
      comboboxId,
      anchorRef: anchorContainerRef,
    }),
    [
      items,
      itemToString,
      currentValue,
      isSelected,
      selectItem,
      removeTag,
      clearValue,
      isOpen,
      setOpen,
      currentInputValue,
      setInputValue,
      filteredItems,
      highlightedIndex,
      isMultiple,
      disabled,
      readOnly,
      comboboxId,
    ],
  );

  return (
    <ComboboxContext.Provider value={contextValue}>
      <BlockStack
        ref={ref}
        gap="small-200"
        id={comboboxId}
        className={className}
        style={style}
        {...rest}
      >
        {activator ? (
          <Box
            ref={anchorContainerRef}
            inlineSize="100%"
            onClick={() => setOpen(true)}
            onFocus={() => setOpen(true)}
          >
            {activator}
          </Box>
        ) : null}

        {hasLegacyContent ? (
          <>
            {legacyInFlowChildren}
            {legacyPopoverChildren.length > 0 ? (
              <FlexPopover
                anchorId={comboboxId}
                anchorRef={anchorContainerRef}
                isOpen={isOpen}
                onClose={() => setOpen(false)}
                matchAnchorWidth
                maxHeight="320px"
                noHeader
              >
                {legacyPopoverChildren.map((child, idx) => wrapLegacyListbox(child, idx))}
              </FlexPopover>
            ) : null}
          </>
        ) : (
          children
        )}
      </BlockStack>
    </ComboboxContext.Provider>
  );
});

export const Combobox = Object.assign(ComboboxRoot, {
  Input: ComboboxInput,
  Content: ComboboxContent,
  List: ComboboxList,
  Item: ComboboxItem,
  Empty: ComboboxEmpty,
  TextField,
  Popover: ComboboxPopover,
}) as unknown as ComboboxComponentType;
