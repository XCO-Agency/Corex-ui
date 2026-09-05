import { useState, useMemo, Fragment } from "react";
import type { CSSProperties, MouseEvent } from "react";
import type { DatePresetItemType, DateRangeType } from "./DatePicker.types";
import { getDefaultPresets } from "./datePickerUtils";
import { Button } from "../Button";
import { Clickable } from "../Clickable";
import { Box } from "../Box";
import { Divider } from "../Divider";
import { Icon } from "../Icon";
import { InlineStack } from "../InlineStack";

export type DatePickerPresetsPropsType = {
  presets?: boolean | DatePresetItemType[];
  activePresetId?: string;
  onSelectPreset: (preset: DatePresetItemType) => void;
  className?: string;
};

export function DatePickerPresets({
  presets,
  activePresetId,
  onSelectPreset,
  className = "",
}: DatePickerPresetsPropsType) {
  const [activeSubmenu, setActiveSubmenu] = useState<DatePresetItemType | null>(null);

  const presetList = useMemo(() => {
    let list: DatePresetItemType[] = [];
    if (Array.isArray(presets)) {
      list = [...presets];
    } else {
      list = getDefaultPresets();
    }

    // Requirement 2: when presets available, always include "Custom range" if not present
    const hasCustom = list.some((p) => p.id === "custom");
    if (!hasCustom) {
      list.push({
        id: "custom",
        label: "Custom range",
      });
    }

    return list;
  }, [presets]);

  const handlePresetClick = (preset: DatePresetItemType, e: MouseEvent) => {
    e.stopPropagation();
    if (preset.children && preset.children.length > 0) {
      setActiveSubmenu(preset);
    } else {
      onSelectPreset(preset);
    }
  };

  const handleBackClick = () => {
    setActiveSubmenu(null);
  };

  const isSubmenuOpen = Boolean(activeSubmenu);

  const trackStyle: CSSProperties = {
    display: "flex",
    width: "200%",
    transform: isSubmenuOpen ? "translateX(-50%)" : "translateX(0%)",
    transition: "transform 0.22s cubic-bezier(0.2, 0, 0, 1)",
  };

  const paneStyle: CSSProperties = {
    width: "50%",
    flexShrink: 0,
    padding: "10px 8px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  };

  return (
    <Box background="base" overflow="hidden" inlineSize="180px" className={className}>
      <div style={trackStyle}>
        {/* Main Presets Pane */}
        <div style={paneStyle}>
          {presetList.map((item) => {
            const isSelected = activePresetId === item.id;
            const isCustom = item.id === "custom";

            return (
              <Fragment key={item.id}>
                {isCustom && <Divider />}
                <Clickable
                  padding="small-400"
                  borderRadius="base"
                  onClick={(e) => handlePresetClick(item, e)}
                  type="button"
                  background={isSelected ? "strong" : "transparent"}
                >
                  {item.label}
                </Clickable>
              </Fragment>
            );
          })}
        </div>

        {/* Nested Submenu Pane */}
        <div style={paneStyle}>
          {/* Back button with arrow */}
          <Clickable
            padding="small-400 small-500"
            borderRadius="base"
            onClick={handleBackClick}
          >
            <InlineStack alignItems="center" justifyContent="start" gap="small-500">
              <Icon type="arrow-left" />
            </InlineStack>
          </Clickable>

          {/* Submenu items */}
          {activeSubmenu?.children?.map((child) => {
            const isSelected = activePresetId === child.id;
            return (
              <Clickable
                key={child.id}
                padding="small-400"
                borderRadius="base"
                onClick={(e) => handlePresetClick(child, e)}
                type="button"
                background={isSelected ? "strong" : "transparent"}
              >
                {child.label}
              </Clickable>
            );
          })}
        </div>
      </div>
    </Box>
  );
}
