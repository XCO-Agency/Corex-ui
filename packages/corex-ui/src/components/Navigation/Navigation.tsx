import * as React from "react";
import { BlockStack } from "../BlockStack";
import { Box } from "../Box";
import { Text } from "../Text";
import { Icon } from "../Icon";
import type { NavigationItemType, NavigationPropsType } from "./Navigation.types";

export const Navigation = React.forwardRef<HTMLElement, NavigationPropsType>(
  function Navigation(
    {
      sections,
      selectedId,
      onSelect,
      searchable = false,
      searchPlaceholder = "Search (Ctrl + Shift + F)",
      searchValue,
      onSearchChange,
      children,
      id,
    },
    ref
  ) {
    const [internalSearch, setInternalSearch] = React.useState("");
    const [hoveredId, setHoveredId] = React.useState<string | null>(null);

    const activeSearch = searchValue !== undefined ? searchValue : internalSearch;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (searchValue === undefined) {
        setInternalSearch(val);
      }
      onSearchChange?.(val);
    };

    const filterItem = (item: NavigationItemType): boolean => {
      if (!activeSearch.trim()) return true;
      const term = activeSearch.toLowerCase();
      return item.label.toLowerCase().includes(term);
    };

    const renderItemIcon = (icon: NavigationItemType["icon"]) => {
      if (!icon) return null;
      if (typeof icon === "string" || typeof icon === "function") {
        return <Icon source={icon} />;
      }
      if (React.isValidElement(icon)) {
        return icon;
      }
      return null;
    };

    return (
      <nav
        ref={ref}
        id={id}
        aria-label="Sidebar navigation"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "280px",
          minWidth: "220px",
          boxSizing: "border-box",
        }}
      >
        <BlockStack gap="400">
          {searchable && (
            <Box padding="100">
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  borderRadius: "8px",
                  border: "1px solid #dcdfe3",
                  backgroundColor: "#ffffff",
                  padding: "6px 10px",
                  boxSizing: "border-box",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    color: "#6d7175",
                  }}
                >
                  <Icon source="search" />
                </div>
                <input
                  type="text"
                  value={activeSearch}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "12px",
                    color: "#202223",
                    width: "100%",
                  }}
                />
              </div>
            </Box>
          )}

          {sections.map((section, sIdx) => {
            const visibleItems = section.items.filter(filterItem);
            if (visibleItems.length === 0 && activeSearch.trim()) return null;

            return (
              <div key={sIdx} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {section.title && (
                  <div style={{ padding: "4px 8px 6px 8px" }}>
                    <Text as="h3" variant="bodySm" tone="neutral">
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          color: "#6d7175",
                        }}
                      >
                        {section.title}
                      </span>
                    </Text>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {visibleItems.map((item) => {
                    const isSelected = item.selected ?? (selectedId !== undefined && selectedId === item.id);
                    const isHovered = hoveredId === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={item.disabled}
                        onClick={() => {
                          item.onClick?.();
                          onSelect?.(item.id);
                        }}
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          padding: "7px 10px",
                          border: "none",
                          borderRadius: "8px",
                          backgroundColor: isSelected
                            ? "#f1f2f4"
                            : isHovered
                            ? "#f6f6f7"
                            : "transparent",
                          color: isSelected ? "#202223" : item.disabled ? "#8c9196" : "#4a4d50",
                          fontWeight: isSelected ? 600 : 450,
                          fontSize: "13px",
                          textAlign: "left",
                          cursor: item.disabled ? "not-allowed" : "pointer",
                          transition: "background-color 0.12s ease",
                          boxSizing: "border-box",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            minWidth: 0,
                            overflow: "hidden",
                          }}
                        >
                          {item.icon && (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                color: isSelected ? "#202223" : "#6d7175",
                              }}
                            >
                              {renderItemIcon(item.icon)}
                            </span>
                          )}
                          <span
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.label}
                          </span>
                        </div>

                        {item.badge && <span style={{ flexShrink: 0 }}>{item.badge}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {children}
        </BlockStack>
      </nav>
    );
  }
);

export const Navigations = Navigation;
