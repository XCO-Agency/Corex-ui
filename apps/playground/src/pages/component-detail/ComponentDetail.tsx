import * as React from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { blocks, registry } from "@/data/registry";
import { toReferenceName } from "@/lib/skill-reference";
import { ComponentHeader } from "./partials/ComponentHeader";
import { ComponentSandboxAlert } from "./partials/ComponentSandboxAlert";
import { ComponentExampleCard } from "./partials/ComponentExampleCard";
import { ComponentTableOfContents } from "./partials/ComponentTableOfContents";
import { ComponentPagination } from "./partials/ComponentPagination";
import {
  API_SECTION_IDS,
  ComponentApiReference,
  extraTableId,
} from "./partials/ComponentApiReference";
import { useComponentReference } from "./useComponentReference";
import type { TocItemType } from "./types";

const blockEntries = blocks.flatMap((group) => group.components);

const exampleAnchor = (index: number, title: string) =>
  `example-${index}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export function ComponentDetail() {
  const { slug } = useParams<{ slug: string }>();
  const isBlock = useLocation().pathname.startsWith("/blocks/");

  // Prev/next stay within the section being browsed.
  const entries = isBlock ? blockEntries : registry;
  const currentIndex = entries.findIndex((item) => item.slug === slug);
  const entry = entries[currentIndex];

  const reference = useComponentReference(entry?.name, Boolean(entry) && !isBlock);

  const tocItems = React.useMemo<TocItemType[]>(() => {
    if (!entry) return [];
    const items: TocItemType[] = [{ id: "overview", title: "Overview" }];
    entry.examples.forEach((ex, index) =>
      items.push({ id: exampleAnchor(index, ex.title), title: ex.title }),
    );
    if (reference) {
      items.push({ id: "api-reference", title: "API reference" });
      if (reference.props.length)
        items.push({ id: API_SECTION_IDS.props, title: "Props", level: 2 });
      if (reference.subcomponents)
        items.push({ id: API_SECTION_IDS.subcomponents, title: "Subcomponents", level: 2 });
      reference.extraTables.forEach((table) =>
        items.push({
          id: extraTableId(table.title),
          title: table.title.replace(/\s*\(.*\)$/, ""),
          level: 2,
        }),
      );
      if (reference.deprecations.length)
        items.push({ id: API_SECTION_IDS.deprecated, title: "Deprecated", level: 2 });
    }
    return items;
  }, [entry, reference]);

  if (!entry) {
    return <Navigate to="/" replace />;
  }

  const basePath = isBlock ? "/blocks" : "/components";
  const prev = currentIndex > 0 ? entries[currentIndex - 1] : null;
  const next = currentIndex < entries.length - 1 ? entries[currentIndex + 1] : null;

  return (
    <div className="mx-auto w-full max-w-6xl pb-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_180px] xl:gap-14">
        <div className="min-w-0 space-y-8">
          <ComponentHeader
            name={entry.name}
            category={entry.category}
            description={entry.description}
            requiresEmbeddedContext={entry.requiresEmbeddedContext}
            isBlock={isBlock}
            importName={toReferenceName(entry.name)}
          />

          {entry.requiresEmbeddedContext && <ComponentSandboxAlert />}

          <div className="space-y-8">
            {entry.examples.map((example, index) => (
              <ComponentExampleCard
                key={example.title}
                example={example}
                index={index}
                componentName={toReferenceName(entry.name)}
              />
            ))}
          </div>

          {!isBlock && <ComponentApiReference reference={reference} />}

          <ComponentPagination prev={prev} next={next} basePath={basePath} />
        </div>

        <ComponentTableOfContents items={tocItems} />
      </div>
    </div>
  );
}
