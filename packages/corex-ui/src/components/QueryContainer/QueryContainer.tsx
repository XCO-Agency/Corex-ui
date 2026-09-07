import { forwardRef } from "react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { QueryContainerPropsType } from "./QueryContainer.types";

const SQueryContainer = createWebComponent<HTMLElement>("s-query-container", {
  domProps: ["containerName"],
});

/**
 * QueryContainer component wrapping Polaris `<s-query-container>`.
 * Establishes a container query context for responsive design.
 */
export const QueryContainer: ForwardRefExoticComponent<
  QueryContainerPropsType & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, QueryContainerPropsType>(function QueryContainer(
  { children, style, ...rest },
  ref,
) {
  return (
    <SQueryContainer
      ref={ref}
      style={{ display: "block", width: "100%", containerType: "inline-size", ...style }}
      {...rest}
    >
      {children}
    </SQueryContainer>
  );
});
