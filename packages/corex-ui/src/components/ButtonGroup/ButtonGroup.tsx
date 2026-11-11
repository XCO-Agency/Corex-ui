import { Children, cloneElement, forwardRef, isValidElement, Fragment } from "react";
import type { ReactElement, ReactNode } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { devWarning } from "../../utils/devWarning";
import type { ButtonGroupPropsType } from "./ButtonGroup.types";

const SButtonGroup = createWebComponent<HTMLElement>("s-button-group", {
  domProps: ["gap"],
});

const PRIMARY_SLOT = "primary-action";
const SECONDARY_SLOT = "secondary-actions";

type ButtonSlotProps = {
  slot?: string;
  variant?: string;
  primary?: boolean;
  children?: ReactNode;
};

type SlotState = {
  primaryAssigned: boolean;
  warnedExtraPrimary: boolean;
  warnedGapNone: boolean;
};

function isPrimaryButton(props: ButtonSlotProps) {
  return props.variant === "primary" || props.primary === true;
}

/** `secondary-actions` only accepts `secondary` or `auto`. Anything else is dropped. */
function secondarySlotProps(props: ButtonSlotProps): ButtonSlotProps {
  const variant = props.variant;
  const accepted = variant == null || variant === "secondary" || variant === "auto";
  if (accepted && props.primary !== true) return { slot: SECONDARY_SLOT };
  return { slot: SECONDARY_SLOT, variant: "secondary" };
}

/**
 * `s-button-group` only displays buttons assigned to its slots.
 * A primary button goes to `primary-action` (one, and not when `gap="none"`).
 * Every other button goes to `secondary-actions`. An explicit `slot` is kept.
 */
function assignButtonSlots(
  children: ReactNode,
  allowPrimary: boolean,
  state: SlotState,
): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;

    if (child.type === Fragment) {
      const fragmentProps = child.props as ButtonSlotProps;
      return cloneElement(
        child,
        undefined,
        assignButtonSlots(fragmentProps.children, allowPrimary, state),
      );
    }

    const props = child.props as ButtonSlotProps;
    if (props.slot) {
      if (props.slot === PRIMARY_SLOT) state.primaryAssigned = true;
      return child;
    }

    const element = child as ReactElement<ButtonSlotProps>;
    const primary = isPrimaryButton(props);

    if (primary && allowPrimary && !state.primaryAssigned) {
      state.primaryAssigned = true;
      return cloneElement(element, { slot: PRIMARY_SLOT });
    }

    if (primary && !allowPrimary && !state.warnedGapNone) {
      state.warnedGapNone = true;
      devWarning(
        "ButtonGroup",
        'slot="primary-action" cannot be used when gap is "none". That button is placed in secondary-actions.',
      );
    } else if (primary && state.primaryAssigned && !state.warnedExtraPrimary) {
      state.warnedExtraPrimary = true;
      devWarning(
        "ButtonGroup",
        'Only one button can use slot="primary-action". Extra primary buttons are placed in secondary-actions.',
      );
    }

    return cloneElement(element, secondarySlotProps(props));
  });
}

/** `s-button-group`: children are placed in `primary-action` / `secondary-actions`. */
export const ButtonGroup = forwardRef<HTMLElement, ButtonGroupPropsType>(
  function ButtonGroup(
    { children, fullWidth: _fullWidth, variant, gap, accessibilityLabel, ...rest },
    ref,
  ) {
    const resolvedGap = gap ?? (variant === "segmented" ? "none" : undefined);
    const slottedChildren = assignButtonSlots(children, resolvedGap !== "none", {
      primaryAssigned: false,
      warnedExtraPrimary: false,
      warnedGapNone: false,
    });

    return (
      <SButtonGroup
        ref={ref}
        gap={resolvedGap}
        accessibilityLabel={accessibilityLabel || "Actions"}
        {...rest}
      >
        {slottedChildren}
      </SButtonGroup>
    );
  },
);
