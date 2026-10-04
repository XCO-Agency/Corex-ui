import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories, registry, blocks, type ComponentEntry } from "../data/registry";
import { thumbnails } from "../components/icons/ComponentThumbnails";
import { Button } from "@/components/ui/button";
import { CommandSnippet } from "@/components/CommandSnippet";
import { COREX_UI_VERSION } from "@/lib/version";
import { cn } from "@/lib/utils";

function Tile({ item, href, wide }: { item: ComponentEntry; href: string; wide?: boolean }) {
  const Thumbnail = thumbnails[item.slug];
  return (
    <Link
      to={href}
      className="group flex flex-col overflow-hidden rounded-lg border border-border/70 bg-card transition-colors hover:border-foreground/25"
    >
      <div
        className={cn(
          "flex items-center justify-center overflow-hidden bg-muted/30 p-3 transition-colors group-hover:bg-muted/50",
          wide ? "aspect-5/2" : "aspect-2/1",
        )}
      >
        {Thumbnail ? (
          <div className="flex size-full items-center justify-center [&>svg]:max-h-full">
            <Thumbnail />
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">{item.name}</span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 border-t border-border/60 px-3 py-2">
        <span className="truncate text-[13px] font-medium text-foreground">{item.name}</span>
        <span className="truncate text-[11.5px] text-muted-foreground">{item.description}</span>
      </div>
    </Link>
  );
}

function GroupHeading({ id, title, count }: { id: string; title: string; count: number }) {
  return (
    <h3
      id={id}
      className="mb-3 flex scroll-mt-28 items-baseline gap-2 text-[13px] font-semibold text-foreground"
    >
      {title}
      <span className="font-mono text-[11px] font-normal text-muted-foreground">{count}</span>
    </h3>
  );
}

export function Overview() {
  const { hash } = useLocation();

  // Client-side navigation to "/#blocks" doesn't scroll by itself.
  React.useEffect(() => {
    if (!hash) return;
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [hash]);

  const totalBlocks = blocks.reduce((acc, group) => acc + group.components.length, 0);
  const componentGroups = categories
    .map((category) => ({
      category,
      items: registry.filter((entry) => entry.category === category),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="mx-auto w-full max-w-6xl pb-16">
      {/* Hero */}
      <section className="max-w-2xl space-y-4 pt-4 pb-10">
        <p className="font-mono text-[11px] text-muted-foreground">
          v{COREX_UI_VERSION} · MIT
        </p>
        <h1 className="text-[28px] font-semibold tracking-tight text-foreground sm:text-[32px]">
          Build Shopify apps, ship faster
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          A legacy <code className="font-mono text-[0.9em] text-foreground">@shopify/polaris</code>
          -compatible component library backed by Shopify's Polaris web components. Swap the
          import, keep your code.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <CommandSnippet command="pnpm add @xco-agency/corex-ui" className="w-full sm:w-80" />
          <Button
            size="sm"
            nativeButton={false}
            className="h-9 px-3"
            render={<Link to="/installation" />}
          >
            Get started
            <ArrowRight />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="text-foreground">{registry.length}</span> components ·{" "}
          <span className="text-foreground">{totalBlocks}</span> blocks ·{" "}
          <span className="text-foreground">6</span> hooks &amp; utils
        </p>
      </section>

      {/* Category jump links */}
      <nav
        aria-label="Jump to category"
        className="sticky top-11 z-10 -mx-1 mb-6 flex gap-1 overflow-x-auto border-b border-border/60 bg-background/90 px-1 py-2 backdrop-blur-md"
      >
        {componentGroups.map(({ category, items }) => (
          <a
            key={category}
            href={`#${category}`}
            className="shrink-0 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {category}
            <span className="ml-1 font-mono text-[10px] text-muted-foreground/60">
              {items.length}
            </span>
          </a>
        ))}
        {blocks.length > 0 && (
          <a
            href="#blocks"
            className="shrink-0 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Blocks
            <span className="ml-1 font-mono text-[10px] text-muted-foreground/60">
              {totalBlocks}
            </span>
          </a>
        )}
      </nav>

      <div className="space-y-8">
        {componentGroups.map(({ category, items }) => (
          <section key={category}>
            <GroupHeading id={category} title={category} count={items.length} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {items.map((item) => (
                <Tile key={item.slug} item={item} href={`/components/${item.slug}`} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {blocks.length > 0 && (
        <div id="blocks" className="mt-12 scroll-mt-16 space-y-8 border-t border-border/60 pt-8">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Blocks</h2>
            <p className="text-[13px] text-muted-foreground">
              Ready-made compositions you copy into your app with one command.
            </p>
          </div>
          {blocks.map(({ category, components }) => (
            <section key={category}>
              <GroupHeading id={`blocks-${category}`} title={category} count={components.length} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {components.map((item) => (
                  <Tile key={item.slug} item={item} href={`/blocks/${item.slug}`} wide />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
