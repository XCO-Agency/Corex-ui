import {
  forwardRef,
  useEffect,
  useState,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type ReactElement,
  type RefAttributes,
} from "react";
import {
  resolveDelay,
  resolveDuration,
  resolveEasing,
  resolveKeyframes,
} from "./Transition.constants";
import type { TransitionPropsType } from "./Transition.types";

/**
 * Lightweight, high-performance Transition component.
 *
 * Automatically handles bi-directional (in and out) animations with
 * variant presets ("fade-up", "scale", "pop", "slide-up", etc.).
 */
export const Transition: ForwardRefExoticComponent<
  TransitionPropsType & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, TransitionPropsType>(function Transition(
  {
    children,
    animate,
    variant,
    show: controlledShow,
    leaving,
    appear = true,
    duration,
    delay,
    easing,
    reverse = false,
    onEnter,
    onEntered,
    onExit,
    onExited,
    as: Component = "div",
    inlineSize,
    blockSize,
    display,
    alignItems,
    justifyContent,
    flexDirection,
    style,
    className,
    id,
    ...rest
  },
  ref,
): ReactElement {
  const isLeaving =
    leaving !== undefined
      ? leaving
      : controlledShow !== undefined
        ? !controlledShow
        : false;

  const currentVariant = variant ?? animate;

  const [prevLeaving, setPrevLeaving] = useState(isLeaving);
  const [prevVariant, setPrevVariant] = useState(currentVariant);
  const [entered, setEntered] = useState(!appear || isLeaving);
  const [isExited, setIsExited] = useState(isLeaving);

  // Synchronously adjust state during render when isLeaving or variant changes
  if (prevLeaving !== isLeaving || prevVariant !== currentVariant) {
    setPrevLeaving(isLeaving);
    setPrevVariant(currentVariant);

    if (isLeaving) {
      setIsExited(false);
    } else {
      setEntered(false);
      setIsExited(false);
    }
  }

  const preset = resolveKeyframes(currentVariant);
  const durations = resolveDuration(duration);
  const delays = resolveDelay(delay);
  const easings = resolveEasing(easing);

  // Handle animation triggers on mount and when toggling show/leaving/variant
  useEffect(() => {
    if (isLeaving) {
      onExit?.();
      const exitDuration =
        typeof duration === "number" ? duration : (duration?.exit ?? 300);
      const timer = setTimeout(() => {
        setIsExited(true);
        setEntered(false);
        onExited?.();
      }, exitDuration);
      return () => clearTimeout(timer);
    }

    if (!appear && !entered) {
      setEntered(true);
      return;
    }

    onEnter?.();
    let raf2: number | undefined;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setEntered(true);
        onEntered?.();
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [isLeaving, currentVariant]);

  const exitTarget = reverse ? preset.enterFrom : preset.exitTo;

  const activeStyles: CSSProperties = isLeaving
    ? {
        ...exitTarget,
        ...(isExited ? { pointerEvents: "none", display: "none" } : {}),
      }
    : entered
      ? preset.enterTo
      : preset.enterFrom;

  const activeDuration = isLeaving ? durations.exit : durations.enter;
  const activeEasing = isLeaving ? easings.exit : easings.enter;
  const activeDelay = isLeaving ? delays.exit : delays.enter;
  const delayStr = activeDelay > 0 ? ` ${activeDelay}ms` : "";

  const transitionCss = `opacity ${activeDuration}ms ${activeEasing}${delayStr}, transform ${activeDuration}ms ${activeEasing}${delayStr}`;

  const layoutStyles: CSSProperties = {};
  if (inlineSize !== undefined) layoutStyles.inlineSize = inlineSize;
  if (blockSize !== undefined) layoutStyles.blockSize = blockSize;
  if (display !== undefined && (!isExited || !isLeaving)) {
    layoutStyles.display = display;
  }
  if (alignItems !== undefined) layoutStyles.alignItems = alignItems;
  if (justifyContent !== undefined) layoutStyles.justifyContent = justifyContent;
  if (flexDirection !== undefined) layoutStyles.flexDirection = flexDirection;

  const combinedStyles: CSSProperties = {
    ...layoutStyles,
    ...activeStyles,
    transition: transitionCss,
    ...style,
  };

  return (
    <Component
      ref={ref as any}
      id={id}
      className={className}
      style={combinedStyles}
      {...rest}
    >
      {children}
    </Component>
  );
});
