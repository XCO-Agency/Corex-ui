import * as React from "react";
import { cn } from "@/lib/utils";
import type { TocItemType } from "../types";

export type ComponentTableOfContentsPropsType = {
  items: TocItemType[];
};

export function ComponentTableOfContents({ items }: ComponentTableOfContentsPropsType) {
  const [activeId, setActiveId] = React.useState<string>(items[0]?.id || "");

  React.useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [items]);

  const scrollToId = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
      window.history.pushState(null, "", `#${id}`);
    }
  };

  if (items.length <= 1) {
    return null;
  }

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pl-6 border-l border-border/60">
        <p className="mb-3 text-xs font-semibold tracking-wider text-foreground uppercase">
          On this page
        </p>

        <nav aria-label="Table of contents">
          <ul className="space-y-2 text-xs">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => scrollToId(e, item.id)}
                    className={cn(
                      "block line-clamp-1 py-1 transition-colors hover:text-foreground",
                      isActive
                        ? "font-semibold text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
