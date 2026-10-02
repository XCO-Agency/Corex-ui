import { Children, forwardRef } from "react";
import { BlockStack } from "../BlockStack";
import { Box } from "../Box";
import { InlineGrid } from "../InlineGrid";
import { Text } from "../Text";
import type {
  FormLayoutGroupPropsType,
  FormLayoutPropsType,
} from "./FormLayout.types";

/**
 * Fields in a row with equal sizing across the available space.
 * Automatically stacks on mobile and supports optional group title and help text.
 */
export const FormLayoutGroup = forwardRef<HTMLDivElement, FormLayoutGroupPropsType>(
  function FormLayoutGroup(
    { children, condensed, title, helpText, columns, id, className, style, ...rest },
    ref,
  ) {
    const validChildren = Children.toArray(children).filter(Boolean);
    const count = Math.max(1, validChildren.length);
    const resolvedColumns =
      columns ?? (count === 1 ? 1 : { xs: 1, sm: count });
    const gap = condensed ? "small-200" : "base";

    const grid = (
      <InlineGrid columns={resolvedColumns} gap={gap}>
        {children}
      </InlineGrid>
    );

    if (!title && !helpText) {
      return (
        <Box
          ref={ref as any}
          id={id}
          className={className}
          style={style}
          inlineSize="100%"
          {...rest}
        >
          {grid}
        </Box>
      );
    }

    return (
      <BlockStack
        ref={ref}
        id={id}
        className={className}
        style={style}
        gap="small-200"
        inlineSize="100%"
        {...rest}
      >
        {title &&
          (typeof title === "string" ? (
            <Text as="h3" variant="bodyMd" fontWeight="semibold">
              {title}
            </Text>
          ) : (
            title
          ))}
        {grid}
        {helpText &&
          (typeof helpText === "string" ? (
            <Text as="p" variant="bodySm" tone="neutral">
              {helpText}
            </Text>
          ) : (
            helpText
          ))}
      </BlockStack>
    );
  },
);

const FormLayoutRoot = forwardRef<HTMLDivElement, FormLayoutPropsType>(
  function FormLayout({ children, gap = "base", inlineSize = "100%", ...rest }, ref) {
    return (
      <BlockStack ref={ref} gap={gap} inlineSize={inlineSize} {...rest}>
        {children}
      </BlockStack>
    );
  },
);

export const FormLayout = Object.assign(FormLayoutRoot, { Group: FormLayoutGroup });
