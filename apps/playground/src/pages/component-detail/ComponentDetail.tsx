import * as React from "react";
import { Navigate, useParams } from "react-router-dom";
import { registry } from "@/data/registry";
import { ComponentHeader } from "./partials/ComponentHeader";
import { ComponentSandboxAlert } from "./partials/ComponentSandboxAlert";
import { ComponentExampleCard } from "./partials/ComponentExampleCard";
import { ComponentTableOfContents } from "./partials/ComponentTableOfContents";
import { ComponentPagination } from "./partials/ComponentPagination";
import type { TocItemType } from "./types";

export function ComponentDetail() {
  const { slug } = useParams<{ slug: string }>();
  const currentIndex = registry.findIndex((item) => item.slug === slug);
  const entry = registry[currentIndex];

  if (!entry) {
    return <Navigate to="/" replace />;
  }

  const prev = currentIndex > 0 ? registry[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < registry.length - 1 ? registry[currentIndex + 1] : null;

  const tocItems: TocItemType[] = React.useMemo(() => [
    { id: "overview", title: "Overview" },
    ...entry.examples.map((ex, index) => ({
      id: `example-${index}-${ex.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      title: ex.title,
    })),
  ], [entry.examples]);

  return (
    <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 lg:px-6 py-2 pb-16">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_220px]">
        {/* Main Content Column */}
        <div className="min-w-0 space-y-8">
          <ComponentHeader
            name={entry.name}
            category={entry.category}
            description={entry.description}
            requiresEmbeddedContext={entry.requiresEmbeddedContext}
          />

          {entry.requiresEmbeddedContext && <ComponentSandboxAlert />}

          {/* Examples Section */}
          <div className="space-y-12 pt-2">
            {entry.examples.map((example, index) => (
              <ComponentExampleCard
                key={example.title}
                example={example}
                index={index}
              />
            ))}
          </div>

          {/* Previous / Next Component Navigation */}
          <ComponentPagination prev={prev} next={next} />
        </div>

        {/* Right Sticky Table of Contents */}
        <ComponentTableOfContents items={tocItems} />
      </div>
    </div>
  );
}
