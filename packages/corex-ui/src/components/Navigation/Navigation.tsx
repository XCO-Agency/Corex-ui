import * as React from "react";
import { NavigationContext } from "./Navigation.context";
import { NavigationItem } from "./NavigationItem";
import { NavigationLabel } from "./NavigationLabel";
import { NavigationSection } from "./NavigationSection";
import { NavigationSearch } from "./NavigationSearch";
import { NavigationFooter } from "./NavigationFooter";
import type { NavigationPropsType } from "./Navigation.types";
import { Box } from "../Box";
import { BlockStack } from "../BlockStack";

export type NavigationComponentType = React.ForwardRefExoticComponent<
  NavigationPropsType & React.RefAttributes<HTMLElement>
> & {
  Item: typeof NavigationItem;
  Label: typeof NavigationLabel;
  Section: typeof NavigationSection;
  Search: typeof NavigationSearch;
  Footer: typeof NavigationFooter;
};

const NavigationBase = React.forwardRef<HTMLElement, NavigationPropsType>(
  function Navigation(
    {
      sectionned,
      children,
      sticky,
      selected,
      defaultSelected,
      onChange,
      onSelect,
      ...rest
    },
    ref,
  ) {
    const [internalSelectedId, setInternalSelectedId] = React.useState(
      selected ?? defaultSelected,
    );
    const [search, setSearch] = React.useState("");

    React.useEffect(() => {
      if (selected !== undefined) {
        setInternalSelectedId(selected);
      }
    }, [selected]);

    const handleSelect = React.useCallback(
      (id: string) => {
        if (selected === undefined) {
          setInternalSelectedId(id);
        }
        onChange?.(id);
        onSelect?.(id);
      },
      [selected, onChange, onSelect],
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
  },
);

export const Navigation = NavigationBase as NavigationComponentType;

// Attach subcomponents
Navigation.Item = NavigationItem;
Navigation.Label = NavigationLabel;
Navigation.Section = NavigationSection;
Navigation.Search = NavigationSearch;
Navigation.Footer = NavigationFooter;

export const Navigations = Navigation;
