import * as React from "react";
import { Box } from "../Box";
import { useNavigationContext } from "./Navigation.context";
import type { NavigationSearchPropsType } from "./Navigation.types";
import type { CallbackEvent } from "../../types/polaris";
import { useDebounce } from "../../hooks/useDebounce";

export const NavigationSearch = React.forwardRef<HTMLElement, NavigationSearchPropsType>(
  function NavigationSearch(
    {
      value,
      onChange,
      onDebouncedChange,
      debounceDelay = 300,
      placeholder = "Search (Ctrl + K)",
      ...rest
    },
    ref,
  ) {
    const context = useNavigationContext();
    const [searchTerm, setSearchTerm] = React.useState(value ?? context?.search ?? "");

    React.useEffect(() => {
      if (value !== undefined) {
        setSearchTerm(value);
      }
    }, [value]);

    const debouncedSearch = useDebounce(searchTerm, debounceDelay);

    React.useEffect(() => {
      context?.setSearch?.(debouncedSearch);
      onDebouncedChange?.(debouncedSearch);
    }, [debouncedSearch, context, onDebouncedChange]);

    const handleChange = (e: CallbackEvent<"s-search-field">) => {
      const val = e.currentTarget.value;
      setSearchTerm(val);
      onChange?.(val);
    };

    return (
      <Box paddingBlockEnd="small">
        <s-search-field
          ref={ref as React.Ref<any>}
          value={searchTerm}
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
