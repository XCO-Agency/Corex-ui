import * as React from "react";
import {
  InlineStack,
  Text,
  Button,
} from "@xco-agency/corex-ui";
import { FILTER_OPTIONS } from "../constants";
import type { ActivityFiltersPropsType } from "../types";

export function ActivityFilters({
  activeFilter,
  onSelectFilter,
  onRefresh,
  isRefreshing,
}: ActivityFiltersPropsType) {
  const [filterOpen, setFilterOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterOpen]);

  const activeOption = FILTER_OPTIONS.find((opt) => opt.value === activeFilter);
  const filterButtonLabel =
    activeFilter === "all" ? "Filter" : `Filter: ${activeOption?.label ?? ""}`;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingBottom: "8px",
      }}
    >
      <Text variant="large" heading>
        Recent Activity
      </Text>

      <InlineStack gap="small-200" alignItems="center">
        {/* Filter Dropdown */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <Button
            variant="secondary"
            size="small"
            onClick={() => setFilterOpen((prev) => !prev)}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>{filterButtonLabel}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </Button>

          {filterOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 4px)",
                zIndex: 100,
                backgroundColor: "var(--p-color-bg-surface, #ffffff)",
                border: "1px solid var(--p-color-border-subdued, #e1e3e5)",
                borderRadius: "8px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                minWidth: "190px",
                padding: "4px 0",
                overflow: "hidden",
              }}
            >
              {FILTER_OPTIONS.map((opt) => {
                const isSelected = activeFilter === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSelectFilter(opt.value);
                      setFilterOpen(false);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 14px",
                      background: isSelected
                        ? "var(--p-color-bg-surface-secondary, #f6f6f7)"
                        : "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: isSelected ? 600 : 400,
                      color: "var(--p-color-text, #202223)",
                    }}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <span
                        style={{
                          color: "var(--p-color-text-success, #108043)",
                          fontWeight: 700,
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <Button
          variant="secondary"
          size="small"
          onClick={onRefresh}
          accessibilityLabel="Refresh activities"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              display: "block",
              transition: "transform 0.4s ease",
              transform: isRefreshing ? "rotate(360deg)" : "none",
            }}
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
        </Button>
      </InlineStack>
    </div>
  );
}
