import { forwardRef, useState } from "react";
import { ButtonGroup } from "../ButtonGroup";
import { Button } from "../Button";
import { Box } from "../Box";
import type { TabsProps } from "./Tabs.types";

/**
 * Fully composed pattern: there is no native Polaris web component for
 * tabbed navigation, so `Tabs` is built entirely from other wrappers
 * (`ButtonGroup` + `Button` for the tab strip, `Box` for the panel) plus
 * local selection state — unlike every other component in this library, it
 * renders no `s-*` element of its own.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { tabs, selected, onSelect, children, ...rest },
  ref,
) {
  const [uncontrolledSelected, setUncontrolledSelected] = useState(0);
  const selectedIndex = selected ?? uncontrolledSelected;

  const handleSelect = (index: number) => {
    if (selected === undefined) {
      setUncontrolledSelected(index);
    }
    onSelect?.(index);
  };

  return (
    <div ref={ref} {...rest}>
      <ButtonGroup variant="segmented">
        {tabs.map((tab, index) => (
          <Button
            key={tab.id}
            pressed={index === selectedIndex}
            disabled={tab.disabled}
            accessibilityLabel={tab.accessibilityLabel}
            onClick={() => handleSelect(index)}
          >
            {tab.content}
          </Button>
        ))}
      </ButtonGroup>
      <Box padding="400">{children}</Box>
    </div>
  );
});
