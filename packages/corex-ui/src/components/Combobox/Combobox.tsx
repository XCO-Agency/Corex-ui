import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { mergeRefs } from "../../core/mergeRefs";
import { BlockStack } from "../BlockStack";
import { Box } from "../Box";
import { Listbox } from "../Listbox";
import { FlexPopover } from "../FlexPopover";
import { TextField } from "../TextField";
import type {
  ComboboxComponentType,
  ComboboxPopoverPropsType,
  ComboboxPropsType,
} from "./Combobox.types";

/**
 * Subcomponent for explicitly enclosing Popover content inside a Combobox.
 */
export const ComboboxPopover = forwardRef<HTMLDivElement, ComboboxPopoverPropsType>(
  function ComboboxPopover({ children }, _ref) {
    return <>{children}</>;
  },
);
ComboboxPopover.displayName = "ComboboxPopover";

function isListbox(child: any): boolean {
  if (!isValidElement(child)) return false;
  return (
    child.type === Listbox ||
    (child.type as any)?.displayName === "Listbox" ||
    (child.props as any)?.role === "listbox" ||
    (typeof child.type === "string" && child.type === "listbox")
  );
}

function isPopoverChild(child: any): boolean {
  if (!isValidElement(child)) return false;
  return (
    child.type === ComboboxPopover ||
    (child.type as any)?.displayName === "ComboboxPopover" ||
    isListbox(child)
  );
}

function extractPopoverChildren(children: ReactNode[]): ReactNode[] {
  const result: ReactNode[] = [];
  for (let idx = 0; idx < children.length; idx++) {
    const child = children[idx];
    if (!child) continue;
    if (
      isValidElement(child) &&
      (child.type === ComboboxPopover ||
        (child.type as any)?.displayName === "ComboboxPopover")
    ) {
      Children.forEach((child.props as any).children, (nested, nestedIdx) => {
        if (!nested) return;
        if (isValidElement(nested)) {
          result.push(
            cloneElement(nested as ReactElement<any>, {
              key: nested.key ?? `popover-extracted-${idx}-${nestedIdx}`,
            }),
          );
        } else {
          result.push(nested);
        }
      });
    } else if (isValidElement(child)) {
      result.push(
        cloneElement(child as ReactElement<any>, {
          key: child.key ?? `popover-child-${idx}`,
        }),
      );
    } else {
      result.push(child);
    }
  }
  return result;
}

/**
 * A field with its suggestions displayed in a floating Popover beneath it.
 */
const ComboboxRoot = forwardRef<HTMLDivElement, ComboboxPropsType>(function Combobox(
  {
    activator,
    children,
    allowMultiple,
    open,
    active,
    onClose,
    preferredPosition = "below",
    willLoadMoreOptions,
    onScrolledToBottom,
    id,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const comboboxId = id ?? `corex-combobox-${generatedId.replace(/:/g, "")}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const anchorContainerRef = useRef<HTMLElement>(null);
  const mergedContainerRef = mergeRefs(containerRef, ref);

  const [uncontrolledActive, setUncontrolledActive] = useState(false);
  const isControlled = active !== undefined || open !== undefined;
  const controlledActive = Boolean(active ?? open);

  const childArray = Children.toArray(children).filter(Boolean);
  const hasExplicitPopoverChild = childArray.some(isPopoverChild);

  const rawPopoverChildren: ReactNode[] = [];
  const inFlowChildren: ReactNode[] = [];

  if (hasExplicitPopoverChild) {
    for (const child of childArray) {
      if (isPopoverChild(child)) {
        rawPopoverChildren.push(child);
      } else {
        inFlowChildren.push(child);
      }
    }
  } else {
    // If no explicit popover child or listbox was detected, all children are popover suggestions
    rawPopoverChildren.push(...childArray);
  }

  const popoverChildren = extractPopoverChildren(rawPopoverChildren);
  const hasPopoverContent = popoverChildren.length > 0;
  const effectiveActive = isControlled
    ? controlledActive
    : uncontrolledActive && hasPopoverContent;

  const handleClose = useCallback(() => {
    setUncontrolledActive(false);
    onClose?.();
  }, [onClose]);

  const handleActivatorInteraction = useCallback(() => {
    setUncontrolledActive(true);
  }, []);

  const enhancedActivator = isValidElement(activator)
    ? cloneElement(activator as ReactElement<any>, {
        onFocus: (e: any) => {
          (activator as any).props?.onFocus?.(e);
          handleActivatorInteraction();
        },
        onClick: (e: any) => {
          (activator as any).props?.onClick?.(e);
          handleActivatorInteraction();
        },
        onChange: (val: any, fieldId: any) => {
          (activator as any).props?.onChange?.(val, fieldId);
          handleActivatorInteraction();
        },
        onInput: (e: any) => {
          (activator as any).props?.onInput?.(e);
          handleActivatorInteraction();
        },
      })
    : activator;

  const wrapListbox = (child: ReactNode, keyPrefix: string | number): ReactNode => {
    if (!isValidElement(child)) return child;

    const resolvedKey = child.key ?? keyPrefix;

    if (isListbox(child)) {
      const originalOnSelect = (child.props as any)?.onSelect;
      return cloneElement(child as ReactElement<any>, {
        key: resolvedKey,
        onSelect: (value: string) => {
          originalOnSelect?.(value);
          if (!allowMultiple) {
            handleClose();
          }
        },
      });
    }

    if ((child.props as any)?.children) {
      return cloneElement(child as ReactElement<any>, {
        key: resolvedKey,
        children: Children.map((child.props as any).children, (nested, i) =>
          wrapListbox(nested, `${keyPrefix}-${i}`),
        ),
      });
    }

    return cloneElement(child as ReactElement<any>, { key: resolvedKey });
  };

  const wrappedPopoverChildren = popoverChildren.map((child, idx) =>
    wrapListbox(child, idx),
  );

  return (
    <BlockStack ref={mergedContainerRef} gap="small-200" {...rest}>
      <Box ref={anchorContainerRef} id={comboboxId} width="100%">
        {enhancedActivator}
      </Box>
      <FlexPopover
        anchorId={comboboxId}
        anchorRef={anchorContainerRef}
        boundaryRef={containerRef}
        isOpen={effectiveActive}
        onClose={handleClose}
        matchAnchorWidth
        maxHeight="320px"
      >
        <Box padding="small-100" maxBlockSize="320px" overflowY="auto">
          {wrappedPopoverChildren}
        </Box>
      </FlexPopover>
      {inFlowChildren.length > 0 ? (
        <BlockStack gap="small-200">{inFlowChildren}</BlockStack>
      ) : null}
    </BlockStack>
  );
});

export const Combobox = Object.assign(ComboboxRoot, {
  TextField,
  Popover: ComboboxPopover,
}) as unknown as ComboboxComponentType;
