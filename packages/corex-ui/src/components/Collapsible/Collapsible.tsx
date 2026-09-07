import {
  forwardRef,
  useCallback,
  useId,
  useState,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type ReactElement,
  type RefAttributes,
} from "react";
import { Box } from "../Box";
import type {
  CollapsiblePropsType,
  CollapsibleRenderPropsType,
} from "./Collapsible.types";

/**
 * Generic expand/collapse wrapper for "target + revealed content" layouts —
 * a tab-like metric row, an accordion item, an expandable table row, etc.
 *
 * `children` (the target) always renders as-is. `content` renders inside an
 * animated track that grows or shrinks its grid row on expand/collapse, so
 * it animates smoothly for any content height without measuring the DOM.
 */
export const Collapsible: ForwardRefExoticComponent<
  CollapsiblePropsType & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, CollapsiblePropsType>(function Collapsible(
  {
    expanded: controlledExpanded,
    defaultExpanded = false,
    onExpandedChange,
    children,
    content,
    framed = false,
    duration = 240,
    easing = "cubic-bezier(0.2, 0, 0, 1)",
    accessibilityLabel,
    id,
  },
  ref,
): ReactElement {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = controlledExpanded !== undefined;
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;

  const generatedId = useId();
  const contentId = id ?? generatedId;

  const setExpandedState = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalExpanded(next);
      onExpandedChange?.(next);
    },
    [isControlled, onExpandedChange],
  );

  const expand = useCallback(() => setExpandedState(true), [setExpandedState]);
  const collapse = useCallback(() => setExpandedState(false), [setExpandedState]);
  const toggle = useCallback(
    () => setExpandedState(!isExpanded),
    [isExpanded, setExpandedState],
  );

  const renderProps: CollapsibleRenderPropsType = {
    expanded: isExpanded,
    toggle,
    expand,
    collapse,
  };

  const resolvedTarget =
    typeof children === "function" ? children(renderProps) : children;
  const resolvedContent = typeof content === "function" ? content(renderProps) : content;

  const trackStyles: CSSProperties = {
    display: "grid",
    gridTemplateRows: isExpanded ? "1fr" : "0fr",
    opacity: isExpanded ? 1 : 0,
    transition: `grid-template-rows ${duration}ms ${easing}, opacity ${duration}ms ${easing}`,
  };

  return (
    <Box
      ref={ref}
      background={framed && isExpanded ? "base" : "transparent"}
      border={framed && isExpanded ? "base" : "none"}
      borderRadius={framed && isExpanded ? "large" : "none"}
      accessibilityLabel={accessibilityLabel}
    >
      {resolvedTarget}

      {content !== undefined && (
        <div id={contentId} style={trackStyles} aria-hidden={!isExpanded}>
          <div
            style={{
              overflow: "hidden",
              minHeight: 0,
              pointerEvents: isExpanded ? "auto" : "none",
            }}
          >
            {resolvedContent}
          </div>
        </div>
      )}
    </Box>
  );
});
