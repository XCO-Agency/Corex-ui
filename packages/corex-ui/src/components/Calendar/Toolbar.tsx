import { Fragment } from "react";
import { Button } from "../Button";
import { Text } from "../Text";
import type { CalendarHeaderToolbarType, CalendarViewType } from "./Calendar.types";

const VIEW_LABELS: Record<CalendarViewType, string> = {
  month: "Month",
  week: "Week",
  day: "Day",
  list: "List",
};

export type ToolbarPropsType = {
  config: CalendarHeaderToolbarType;
  title: string;
  view: CalendarViewType;
  views: CalendarViewType[];
  direction: "ltr" | "rtl";
  className?: string;
  titleClassName?: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onView: (view: CalendarViewType) => void;
};

export const DEFAULT_TOOLBAR: Required<CalendarHeaderToolbarType> = {
  start: "prev,next today",
  center: "title",
  end: "month,week,day,list",
};

function isView(token: string): token is CalendarViewType {
  return token === "month" || token === "week" || token === "day" || token === "list";
}

export function Toolbar({
  config,
  title,
  view,
  views,
  direction,
  className,
  titleClassName,
  onPrev,
  onNext,
  onToday,
  onView,
}: ToolbarPropsType) {
  const rtl = direction === "rtl";

  const renderToken = (token: string) => {
    switch (token) {
      case "title":
        // The live region in the root is the accessible title; this copy is visual.
        return (
          <span
            key={token}
            aria-hidden="true"
            data-slot="calendar-title"
            className={titleClassName}
          >
            <Text as="span" variant="headingMd">
              {title}
            </Text>
          </span>
        );
      case "prev":
        return (
          <Button
            key={token}
            variant="secondary"
            icon={rtl ? "chevron-right" : "chevron-left"}
            accessibilityLabel="Previous"
            data-calendar-action="prev"
            onClick={onPrev}
          />
        );
      case "next":
        return (
          <Button
            key={token}
            variant="secondary"
            icon={rtl ? "chevron-left" : "chevron-right"}
            accessibilityLabel="Next"
            data-calendar-action="next"
            onClick={onNext}
          />
        );
      case "today":
        return (
          <Button
            key={token}
            variant="secondary"
            data-calendar-action="today"
            onClick={onToday}
          >
            Today
          </Button>
        );
      default:
        return null;
    }
  };

  const renderSection = (value: string | undefined, slot: string) => {
    if (!value) return <div data-slot="calendar-toolbar-section" data-section={slot} />;
    const groups = value.split(/\s+/).filter(Boolean);
    return (
      <div data-slot="calendar-toolbar-section" data-section={slot}>
        {groups.map((group, groupIndex) => {
          const tokens = group.split(",").filter(Boolean);
          const viewTokens = tokens
            .filter(isView)
            .filter((token) => views.includes(token));
          if (viewTokens.length > 0 && viewTokens.length === tokens.length) {
            if (viewTokens.length === 1 && views.length === 1) return null;
            return (
              // Segmented switcher. Not a ButtonGroup: s-button-group forces one
              // variant on every child, which would hide the selected state.
              <div
                key={group + groupIndex}
                data-slot="calendar-views"
                role="group"
                aria-label="Calendar view"
              >
                {viewTokens.map((token) => (
                  <Button
                    key={token}
                    variant={view === token ? "primary" : "tertiary"}
                    aria-pressed={view === token}
                    data-calendar-action={`view-${token}`}
                    onClick={() => onView(token)}
                  >
                    {VIEW_LABELS[token]}
                  </Button>
                ))}
              </div>
            );
          }
          return (
            <div key={group + groupIndex} data-slot="calendar-button-group">
              {tokens.map((token) => (
                <Fragment key={token}>{renderToken(token)}</Fragment>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div data-slot="calendar-toolbar" className={className}>
      {renderSection(config.start, "start")}
      {renderSection(config.center, "center")}
      {renderSection(config.end, "end")}
    </div>
  );
}
