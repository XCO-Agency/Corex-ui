import * as React from "react";
import { Divider } from "../Divider";
import type { NavigationFooterPropsType } from "./Navigation.types";
import { Box } from "../Box";

export const NavigationFooter = React.forwardRef<
  HTMLDivElement,
  NavigationFooterPropsType
>(function NavigationFooter(
  { children, divider = false, className, style, ...rest },
  ref,
) {
  return (
    <>
      <Box paddingBlock="small">{divider && <Divider />}</Box>
      <div
        ref={ref}
        className={className}
        style={{
          marginTop: "auto",
          position: "sticky",
          bottom: 0,
          backgroundColor: "inherit",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          boxSizing: "border-box",
          width: "100%",
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    </>
  );
});
