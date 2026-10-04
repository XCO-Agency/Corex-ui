import * as React from "react";
import { Ban, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { InlineMarkdown } from "@/components/InlineMarkdown";
import type {
  ComponentReferenceType,
  ReferencePropType,
  ReferenceTableType,
} from "@/lib/skill-reference";
import { cn } from "@/lib/utils";

export const API_SECTION_IDS = {
  props: "api-props",
  subcomponents: "api-subcomponents",
  deprecated: "api-deprecated",
} as const;

export const extraTableId = (title: string) =>
  `api-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

/** Large native prop dumps (event handlers, slots) are collapsed by default. */
const COLLAPSED_PROP_COUNT = 14;

function SectionHeading({ id, title, count }: { id: string; title: string; count?: number }) {
  return (
    <h3
      id={id}
      className="flex scroll-mt-20 items-center gap-2 text-sm font-semibold tracking-tight text-foreground"
    >
      <InlineMarkdown>{title}</InlineMarkdown>
      {count !== undefined && (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground tabular-nums">
          {count}
        </span>
      )}
    </h3>
  );
}

function TypeCell({ value }: { value: string }) {
  // Drop the noise every optional prop carries.
  const cleaned = value.replace(/\s*\|\s*undefined$/, "");
  return (
    <code className="break-words font-mono text-[12px] leading-relaxed text-sky-700 dark:text-sky-300">
      {cleaned}
    </code>
  );
}

function PropsTable({ props }: { props: ReferencePropType[] }) {
  const [query, setQuery] = React.useState("");
  const [expanded, setExpanded] = React.useState(false);

  // Required first, then documented props, then undocumented pass-throughs.
  const sorted = React.useMemo(
    () =>
      [...props].sort(
        (a, b) =>
          Number(b.required) - Number(a.required) ||
          Number(Boolean(b.description)) - Number(Boolean(a.description)),
      ),
    [props],
  );

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? sorted.filter(
        (p) =>
          p.name.toLowerCase().includes(normalized) ||
          p.description.toLowerCase().includes(normalized),
      )
    : sorted;
  const canCollapse = !normalized && filtered.length > COLLAPSED_PROP_COUNT;
  const visible = canCollapse && !expanded ? filtered.slice(0, COLLAPSED_PROP_COUNT) : filtered;

  return (
    <div className="space-y-3">
      {props.length > 6 && (
        <div className="relative max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Filter ${props.length} props…`}
            className="h-8 pl-8 text-xs"
            aria-label="Filter props"
          />
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border/80">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <colgroup>
            <col className="w-[30%] sm:w-[24%]" />
            <col className="w-[30%] sm:w-[28%]" />
            <col />
          </colgroup>
          <thead className="bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Prop</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {visible.map((prop) => (
              <tr key={prop.name} className="align-top transition-colors hover:bg-muted/20">
                <td className="px-3 py-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <code className="break-all font-mono text-[12.5px] font-semibold text-foreground">
                      {prop.name}
                    </code>
                    {prop.required && (
                      <span className="rounded bg-rose-500/10 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300">
                        Required
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <TypeCell value={prop.type} />
                </td>
                <td className="px-3 py-2 text-[13px] leading-relaxed text-muted-foreground">
                  {prop.description ? (
                    <InlineMarkdown>{prop.description}</InlineMarkdown>
                  ) : (
                    <span className="text-muted-foreground/50">—</span>
                  )}
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-xs text-muted-foreground">
                  No props match “{query}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {canCollapse && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="w-full cursor-pointer border-t border-border/70 bg-muted/20 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
          >
            {expanded ? "Show fewer props" : `Show all ${filtered.length} props`}
          </button>
        )}
      </div>
    </div>
  );
}

function GenericTable({ table }: { table: ReferenceTableType }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/80">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-muted/40 text-xs text-muted-foreground">
          <tr>
            {table.headers.map((header) => (
              <th key={header} className="px-3 py-2 font-medium whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/70">
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="align-top">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    "px-3 py-2 text-[13px] leading-relaxed",
                    cellIndex === 0 ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {cell === "—" ? (
                    <span className="text-muted-foreground/50">—</span>
                  ) : (
                    <InlineMarkdown>{cell}</InlineMarkdown>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DeprecationList({ items }: { items: ComponentReferenceType["deprecations"] }) {
  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Ban className="size-3.5 shrink-0" />
        Accepted for legacy compatibility only. Don't use these in new code.
      </p>
      <ul className="divide-y divide-border/60 rounded-lg border border-border/80">
        {items.map((item) => (
          <li
            key={item.prop}
            className="flex flex-col gap-0.5 px-3 py-2 text-[13px] leading-relaxed sm:flex-row sm:items-baseline sm:gap-4"
          >
            <InlineMarkdown
              className="shrink-0 font-mono text-[12.5px] text-muted-foreground line-through decoration-muted-foreground/50 sm:w-1/3"
              codeClassName="bg-transparent p-0 text-[1em]"
            >
              {item.prop.includes("`") ? item.prop : `\`${item.prop}\``}
            </InlineMarkdown>
            {item.note && (
              <InlineMarkdown className="text-muted-foreground">
                {item.note}
              </InlineMarkdown>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export type ComponentApiReferencePropsType = {
  reference: ComponentReferenceType | null | undefined;
};

export function ComponentApiReference({ reference }: ComponentApiReferencePropsType) {
  if (reference === null) return null;

  return (
    <section id="api-reference" className="scroll-mt-20 space-y-6 border-t border-border/60 pt-8">
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">API reference</h2>
        <p className="text-[13px] text-muted-foreground">
          Modern props only, generated from the Corex UI agent skill.
        </p>
      </div>

      {reference === undefined ? (
        <div className="space-y-3">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      ) : (
        <>
          {reference.props.length > 0 && (
            <div className="space-y-3">
              <SectionHeading id={API_SECTION_IDS.props} title="Props" count={reference.props.length} />
              <PropsTable props={reference.props} />
            </div>
          )}

          {reference.subcomponents && (
            <div className="space-y-3">
              <SectionHeading
                id={API_SECTION_IDS.subcomponents}
                title="Subcomponents"
                count={reference.subcomponents.rows.length}
              />
              <GenericTable table={reference.subcomponents} />
            </div>
          )}

          {reference.extraTables.map((table) => (
            <div key={table.title} className="space-y-3">
              <SectionHeading id={extraTableId(table.title)} title={table.title} />
              <GenericTable table={table} />
            </div>
          ))}

          {reference.deprecations.length > 0 && (
            <div className="space-y-3">
              <SectionHeading
                id={API_SECTION_IDS.deprecated}
                title="Deprecated props"
                count={reference.deprecations.length}
              />
              <DeprecationList items={reference.deprecations} />
            </div>
          )}
        </>
      )}
    </section>
  );
}
