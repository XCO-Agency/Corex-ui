import * as React from "react";
import { Text } from "../Text";
import type { NavigationLabelPropsType } from "./Navigation.types";
import { Button } from "../Button";
import { InlineStack } from "../InlineStack";

export const NavigationLabel = React.forwardRef<HTMLDivElement, NavigationLabelPropsType>(
  function NavigationLabel({ children, action, ...rest }, ref) {
    if (!children && !action) return null;

    const renderAction = () => {
      if (!action) return null;
      if (React.isValidElement(action)) {
        return action;
      }
      if (typeof action === "object" && "onClick" in action) {
        return (
          <Button
            variant="tertiary"
            onClick={action.onClick}
            aria-label={action.accessibilityLabel}
            icon={action.icon}
          />
        );
      }
      return null;
    };

    return (
      <InlineStack
        ref={ref}
        alignItems="center"
        justifyContent="space-between"
        paddingBlockStart="small"
        paddingBlockEnd="small-400"
        paddingInline="small-200"
        {...rest}
      >
        {typeof children === "string" ? (
          <Text color="subdued" as="span" heading variant="xs">
            {children}
          </Text>
        ) : (
          children
        )}
        {action && <div>{renderAction()}</div>}
      </InlineStack>
    );
  },
);
