import * as React from "react";
import { NavigationContext } from "./Navigation.context";
import { NavigationItem } from "./NavigationItem";
import { NavigationLabel } from "./NavigationLabel";
import { NavigationSection } from "./NavigationSection";
import { NavigationSearch } from "./NavigationSearch";
import { NavigationFooter } from "./NavigationFooter";
import type { NavigationComponentType, NavigationPropsType } from "./Navigation.types";
import { Box } from "../Box";
import { BlockStack } from "../BlockStack";

function NavigationInner<TId extends string | number = string>(
  {
    sectionned,
    children,
    sticky,
    selected,
    defaultSelected,
    onChange,
    onSelect,
    onChanged,
    ...rest
  }: NavigationPropsType<TId>,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const [internalSelectedId, setInternalSelectedId] = React.useState<TId | undefined>(
    selected ?? defaultSelected,
  );
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (selected !== undefined) {
      setInternalSelectedId(selected);
    }
  }, [selected]);

  const handleSelect = React.useCallback(
    (id: TId) => {
      if (selected === undefined) {
        setInternalSelectedId(id);
      }
      onChange?.(id);
      onSelect?.(id);
      onChanged?.(id);
    },
    [selected, onChange, onSelect, onChanged],
  );

  const activeSelectedId = selected !== undefined ? selected : internalSelectedId;

  return (
    <NavigationContext.Provider
      value={{
        search,
        setSearch,
        selectedId: activeSelectedId,
        onSelect: handleSelect,
      }}
    >
      <Box
        ref={ref}
        {...rest}
        background={sectionned ? "base" : rest.background}
        inlineSize={rest.inlineSize || "100%"}
        blockSize={rest.blockSize || "100%"}
        borderRadius={sectionned ? "large" : rest.borderRadius}
        border={sectionned ? "base" : rest.border}
        padding={sectionned ? "small-200" : rest.padding}
      >
        <BlockStack blockSize="100%">{children}</BlockStack>
      </Box>
    </NavigationContext.Provider>
  );
}

const NavigationBase = React.forwardRef(NavigationInner);

export const Navigation = NavigationBase as unknown as NavigationComponentType;

// Attach subcomponents
Navigation.Item = NavigationItem;
Navigation.Label = NavigationLabel;
Navigation.Section = NavigationSection;
Navigation.Search = NavigationSearch;
Navigation.Footer = NavigationFooter;

export const Navigations = Navigation;

export type { NavigationComponentType } from "./Navigation.types";

