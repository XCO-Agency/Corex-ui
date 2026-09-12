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
      <span style={{ flex: 1 }}></span>
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
        <Box paddingBlock="small-300">{divider && <Divider />}</Box>

        {children}
      </div>
    </>
  );
});
