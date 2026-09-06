import * as React from "react";
import { Box } from "../Box";
import { useNavigationContext } from "./Navigation.context";
import type { NavigationSearchPropsType } from "./Navigation.types";
import type { CallbackEvent } from "../../types/polaris";

export const NavigationSearch = React.forwardRef<HTMLElement, NavigationSearchPropsType>(
  function NavigationSearch(
    { value, onChange, placeholder = "Search (Ctrl + Shift + F)", ...rest },
    ref,
  ) {
    const context = useNavigationContext();

    const handleChange = (e: CallbackEvent<"s-search-field">) => {
      const val = e.currentTarget.value;
      onChange?.(val);
      context?.setSearch?.(val);
    };

    return (
      <Box paddingBlockEnd="small">
        <s-search-field
          ref={ref as React.Ref<any>}
          value={value ?? context?.search ?? ""}
          labelAccessibilityVisibility="exclusive"
          placeholder={placeholder}
          autocomplete="additional-name"
          onChange={handleChange}
          {...rest}
        />
      </Box>
    );
  },
);
