import {
  forwardRef,
  useState,
  useCallback,
  useMemo,
  type CSSProperties,
  type ReactElement,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import type {
  FloatingPropsType,
  FloatingPositionType,
  FloatingOffsetType,
} from "./Floating.types";

function formatOffsetValue(val?: number | string): string | undefined {
  if (val === undefined || val === null) return undefined;
  return typeof val === "number" ? `${val}px` : val;
}

function resolvePositionStyles(
  position: FloatingPositionType,
  offset: FloatingOffsetType,
): CSSProperties {
  let topOffset: string | undefined;
  let bottomOffset: string | undefined;
  let leftOffset: string | undefined;
  let rightOffset: string | undefined;

  if (typeof offset === "number" || typeof offset === "string") {
    const formatted = formatOffsetValue(offset);
    topOffset = formatted;
    bottomOffset = formatted;
    leftOffset = formatted;
    rightOffset = formatted;
  } else if (typeof offset === "object") {
    topOffset = formatOffsetValue(offset.top ?? offset.y);
    bottomOffset = formatOffsetValue(offset.bottom ?? offset.y);
    leftOffset = formatOffsetValue(offset.left ?? offset.x);
    rightOffset = formatOffsetValue(offset.right ?? offset.x);
  }

  const defaultEdge = "20px";

  switch (position) {
    case "bottom-left":
      return {
        bottom: bottomOffset ?? defaultEdge,
        left: leftOffset ?? defaultEdge,
        alignItems: "flex-start",
      };
    case "top-right":
      return {
        top: topOffset ?? defaultEdge,
        right: rightOffset ?? defaultEdge,
        alignItems: "flex-end",
      };
    case "top-left":
      return {
        top: topOffset ?? defaultEdge,
        left: leftOffset ?? defaultEdge,
        alignItems: "flex-start",
      };
    case "bottom-center":
      return {
        bottom: bottomOffset ?? defaultEdge,
        left: "50%",
        transform: "translateX(-50%)",
        alignItems: "center",
      };
    case "top-center":
      return {
        top: topOffset ?? defaultEdge,
        left: "50%",
        transform: "translateX(-50%)",
        alignItems: "center",
      };
    case "middle-left":
      return {
        top: "50%",
        left: leftOffset ?? defaultEdge,
        transform: "translateY(-50%)",
        alignItems: "flex-start",
      };
    case "middle-right":
      return {
        top: "50%",
        right: rightOffset ?? defaultEdge,
        transform: "translateY(-50%)",
        alignItems: "flex-end",
      };
    case "center":
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        alignItems: "center",
      };
    case "bottom-right":
    default:
      return {
        bottom: bottomOffset ?? defaultEdge,
        right: rightOffset ?? defaultEdge,
        alignItems: "flex-end",
      };
  }
}

/**
 * Floating UI component for placing floating actions, widgets, quick menus,
 * or persistent status panels anchored to viewport or container edges.
 *
 * Defaults to bottom-right position with customizable edge offsets, transparent backdrop,
 * and collapsible state support.
 */
export const Floating: ForwardRefExoticComponent<
  FloatingPropsType & RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, FloatingPropsType>(function Floating(
  {
    children,
    position = "bottom-right",
    strategy = "fixed",
    offset = 20,
    zIndex = "var(--p-z-index-layer-popover, 500)",
    transparent = true,
    collapsible = false,
    collapsed: controlledCollapsed,
    defaultCollapsed = false,
    onToggleCollapse,
    onCollapsedChange,
    collapsedContent,
    collapseTrigger,
    accessibilityLabel = "Floating action container",
    className,
    style,
    id,
  },
  ref,
): ReactElement {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

  const isControlled = controlledCollapsed !== undefined;
  const isCollapsed = isControlled ? controlledCollapsed : internalCollapsed;

  const setCollapsedState = useCallback(
    (nextState: boolean) => {
      if (!isControlled) {
        setInternalCollapsed(nextState);
      }
      onToggleCollapse?.(nextState);
      onCollapsedChange?.(nextState);
    },
    [isControlled, onToggleCollapse, onCollapsedChange],
  );

  const toggleCollapse = useCallback(() => {
    setCollapsedState(!isCollapsed);
  }, [isCollapsed, setCollapsedState]);

  const expand = useCallback(() => {
    setCollapsedState(false);
  }, [setCollapsedState]);

  const collapse = useCallback(() => {
    setCollapsedState(true);
  }, [setCollapsedState]);

  const positionStyles = useMemo(
    () => resolvePositionStyles(position, offset),
    [position, offset],
  );

  const rootStyles: CSSProperties = {
    position: strategy,
    zIndex,
    display: "flex",
    flexDirection: "column",
    pointerEvents: "none",
    background: transparent ? "transparent" : undefined,
    maxWidth: "calc(100vw - 32px)",
    maxHeight: "calc(100vh - 32px)",
    boxSizing: "border-box",
    ...positionStyles,
    ...style,
  };

  const contentStyles: CSSProperties = {
    pointerEvents: "auto",
    display: "inline-flex",
    flexDirection: "column",
    transition:
      "transform 200ms cubic-bezier(0.2, 0, 0, 1), opacity 200ms cubic-bezier(0.2, 0, 0, 1)",
    transformOrigin: position.includes("top")
      ? position.includes("left")
        ? "top left"
        : position.includes("right")
          ? "top right"
          : "top center"
      : position.includes("left")
        ? "bottom left"
        : position.includes("right")
          ? "bottom right"
          : "bottom center",
  };

  const renderExpandedContent = () => {
    if (typeof children === "function") {
      return children({
        collapsed: isCollapsed,
        toggleCollapse,
        expand,
        collapse,
      });
    }
    return children;
  };

  const renderCollapsedContent = () => {
    if (typeof collapsedContent === "function") {
      return collapsedContent({ expand });
    }
    if (collapsedContent) {
      return (
        <div
          role="button"
          tabIndex={0}
          aria-expanded={false}
          aria-label={accessibilityLabel}
          onClick={expand}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              expand();
            }
          }}
          style={{
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
          }}
        >
          {collapsedContent}
        </div>
      );
    }
    if (collapseTrigger) {
      return collapseTrigger;
    }
    return null;
  };

  return (
    <div
      ref={ref}
      id={id}
      aria-label={accessibilityLabel}
      aria-expanded={collapsible ? !isCollapsed : undefined}
      className={className}
      style={rootStyles}
    >
      <div style={contentStyles}>
        {collapsible && isCollapsed
          ? renderCollapsedContent()
          : renderExpandedContent()}
      </div>
    </div>
  );
});
