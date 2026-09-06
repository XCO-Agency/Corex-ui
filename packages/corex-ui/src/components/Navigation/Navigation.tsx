import * as React from "react";
import { NavigationContext } from "./Navigation.context";
import { NavigationItem } from "./NavigationItem";
import { NavigationLabel } from "./NavigationLabel";
import { NavigationSection } from "./NavigationSection";
import { NavigationSearch } from "./NavigationSearch";
import { NavigationFooter } from "./NavigationFooter";
import type { NavigationPropsType } from "./Navigation.types";
import { Box } from "../Box";

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
  function Navigation({ sectionned, children, defaultSelected, ...rest }, ref) {
    const [selectedId, onSelect] = React.useState(defaultSelected);
    const [search, setSearch] = React.useState("");

    return (
      <NavigationContext.Provider
        value={{
          search,
          setSearch,
          selectedId,
          onSelect,
        }}
      >
        <Box
          {...rest}
          background={sectionned ? "base" : rest.background}
          inlineSize={rest.inlineSize || "100%"}
          blockSize={rest.blockSize || "100%"}
          borderRadius={sectionned ? "large" : rest.borderRadius}
          border={sectionned ? "base" : rest.border}
          padding={sectionned ? "small" : rest.padding}
        >
          {children}
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
