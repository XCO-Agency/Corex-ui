import { useState, useMemo, Fragment } from "react";
import type { MouseEvent } from "react";
import type { DatePresetItemType } from "./DatePicker.types";
import { getDefaultPresets } from "./datePickerUtils";
import { BlockStack } from "../BlockStack";
import { Clickable } from "../Clickable";
import { Box } from "../Box";
import { Divider } from "../Divider";
import { Icon } from "../Icon";
import { InlineStack } from "../InlineStack";
import { Text } from "../Text";
import { Transition } from "../Transition";

export type DatePickerPresetsPropsType = {
  presets?: boolean | DatePresetItemType[];
  activePresetId?: string;
  onSelectPreset: (preset: DatePresetItemType) => void;
  className?: string;
};

function hasChildren(item: DatePresetItemType): boolean {
  return Boolean(item.children && item.children.length > 0);
}

/** True when `item` is the active preset or holds it somewhere in its submenu. */
function containsActive(item: DatePresetItemType, activeId?: string): boolean {
  if (!activeId) return false;
  if (item.id === activeId) return true;
  return Boolean(item.children?.some((child) => containsActive(child, activeId)));
}

export function DatePickerPresets({
  presets,
  activePresetId,
  onSelectPreset,
  className,
}: DatePickerPresetsPropsType) {
  const [activeSubmenuId, setActiveSubmenuId] = useState<string | null>(null);
  // Which way the last navigation went; null until the user first navigates,
  // so the initial render doesn't animate.
  const [direction, setDirection] = useState<"forward" | "back" | null>(null);

  const presetList = useMemo(() => {
    const list: DatePresetItemType[] = Array.isArray(presets)
      ? [...presets]
      : getDefaultPresets();

    // When presets are shown, always offer "Custom range" if the list lacks it
    if (!list.some((p) => p.id === "custom")) {
      list.push({ id: "custom", label: "Custom range", divider: true });
    }

    return list;
  }, [presets]);

  // Looked up from the current list so the submenu never renders stale items
  const activeSubmenu = activeSubmenuId
    ? (presetList.find((p) => p.id === activeSubmenuId) ?? null)
    : null;

  const handlePresetClick = (preset: DatePresetItemType, e: MouseEvent) => {
    e.stopPropagation();
    if (hasChildren(preset)) {
      setDirection("forward");
      setActiveSubmenuId(preset.id);
    } else {
      onSelectPreset(preset);
    }
  };

  const handleBackClick = (e: MouseEvent) => {
    e.stopPropagation();
    setDirection("back");
    setActiveSubmenuId(null);
  };

  // Show either the top-level list or the open submenu — never both
  const items = activeSubmenu?.children ?? presetList;

  return (
    <Box
      inlineSize="200px"
      minInlineSize="200px"
      padding="small-200"
      overflow="hidden"
      className={className}
    >
      {/* Keyed so each switch remounts and plays the enter animation:
          submenus slide in from the right, going back slides in from the left. */}
      <Transition
        key={activeSubmenuId ?? "root"}
        variant={direction === "back" ? "slide-right" : "slide-left"}
        appear={direction !== null}
        duration={220}
      >
        <BlockStack gap="small-500">
          {activeSubmenu && (
            <>
              <Clickable
                padding="small-400"
                borderRadius="base"
                inlineSize="fill"
                type="button"
                onClick={handleBackClick}
              >
                <InlineStack alignItems="center" gap="small-300">
                  <Icon type="arrow-left" />
                  <Text heading>{activeSubmenu.label}</Text>
                </InlineStack>
              </Clickable>
              <Divider />
            </>
          )}

          {items.map((item) => (
            <Fragment key={item.id}>
              {item.divider && <Divider />}
              <Clickable
                padding="small-400"
                borderRadius="base"
                inlineSize="fill"
                type="button"
                background={
                  containsActive(item, activePresetId) ? "strong" : "transparent"
                }
                onClick={(e) => handlePresetClick(item, e)}
              >
                <InlineStack
                  alignItems="center"
                  justifyContent="space-between"
                  gap="small-500"
                >
                  <Text>{item.label}</Text>
                  {hasChildren(item) && <Icon type="chevron-right" />}
                </InlineStack>
              </Clickable>
            </Fragment>
          ))}
        </BlockStack>
      </Transition>
    </Box>
  );
}
