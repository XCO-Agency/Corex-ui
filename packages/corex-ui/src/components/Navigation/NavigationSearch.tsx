import * as React from "react";
import { Box } from "../Box";
import { SearchField } from "../SearchField";
import { useNavigationContext } from "./Navigation.context";
import type { NavigationSearchPropsType } from "./Navigation.types";

export const NavigationSearch = React.forwardRef<HTMLElement, NavigationSearchPropsType>(
  function NavigationSearch(
    {
      value,
      onChange,
      onDebouncedChange,
      debounceDelay = 300,
      placeholder = "Search (Ctrl + K)",
      label = "Search",
      labelAccessibilityVisibility = "exclusive",
      autoComplete = "additional-name",
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

    const handleDebouncedChange = React.useCallback(
      (debouncedVal: string) => {
        context?.setSearch?.(debouncedVal);
        onDebouncedChange?.(debouncedVal);
      },
      [context, onDebouncedChange],
    );

    const handleChange = (val: string, id?: string) => {
      setSearchTerm(val);
      onChange?.(val, id);
    };

    return (
      <Box paddingBlockEnd="small">
        <SearchField
          ref={ref}
          value={searchTerm}
          label={label}
          labelAccessibilityVisibility={labelAccessibilityVisibility}
          placeholder={placeholder}
          autoComplete={autoComplete}
          debounceDelay={debounceDelay}
          onChange={handleChange}
          onDebouncedChange={handleDebouncedChange}
          {...rest}
        />
      </Box>
    );
  },
);
