import { Link } from "react-router-dom";
import { ArrowRight, Command, Sparkles } from "lucide-react";
import { categories, registry, blocks } from "../data/registry";
import { thumbnails } from "../components/icons/ComponentThumbnails";
import { getCategoryIcon } from "@/lib/category-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-lg font-semibold text-foreground">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

export function Overview() {
  const totalBlocks = blocks.reduce((acc, group) => acc + group.components.length, 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-3 pb-24 md:px-4">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-muted/60 via-background to-background px-6 py-12 sm:px-10 sm:py-16">
        <div className="relative flex max-w-2xl flex-col items-start gap-5">
          <Badge
            variant="outline"
            className="gap-1.5 border-border/80 bg-background/80 px-2.5 py-1 text-xs font-medium backdrop-blur"
          >
            <Command className="size-3.5 text-foreground/70" />
            <span>Corex UI &middot; Shopify UI library</span>
          </Badge>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Build Shopify apps, ship faster
          </h1>

          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            A legacy-
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
              @shopify/polaris
            </code>
            -compatible component library backed by Shopify's actively maintained Polaris
            web components. Swap the import, keep your code.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button size="lg" render={<Link to="/installation" />}>
              Get started
              <ArrowRight />
            </Button>
            <Button size="lg" variant="outline" render={<Link to="/utils" />}>
              Hooks &amp; Utils
            </Button>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-6">
            <Stat value={registry.length} label="Components" />
            <Stat value={totalBlocks} label="Blocks" />
            <Stat value={6} label="Hooks & Utils" />
            <Stat value="MIT" label="Licensed" />
          </div>
        </div>
      </section>

      {/* Quick category nav */}
      <nav className="flex flex-wrap gap-2 py-8" aria-label="Jump to category">
        {categories.map((category) => {
          const CategoryIcon = getCategoryIcon(category);
          const count = registry.filter((entry) => entry.category === category).length;
          if (count === 0) return null;
          return (
            <a
              key={category}
              href={`#${category}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
            >
              <CategoryIcon className="size-3.5" />
              {category}
              <span className="text-muted-foreground/70">{count}</span>
            </a>
          );
        })}
      </nav>

      <div id="components" className="scroll-mt-20">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Components</h2>
          <p className="text-sm text-muted-foreground">
            {registry.length} implemented in{" "}
            <code className="font-mono text-xs">@xco-agency/corex-ui</code>
          </p>
        </div>

        {categories.map((category) => {
          const items = registry.filter((entry) => entry.category === category);
          if (items.length === 0) return null;
          const CategoryIcon = getCategoryIcon(category);

          return (
            <section
              key={category}
              id={category}
              className="scroll-mt-20 border-t border-border py-8 first:border-t-0"
            >
              <div className="mb-4 flex items-center gap-2">
                <CategoryIcon className="size-4 text-muted-foreground" />
                <h3 className="text-base font-semibold text-foreground">{category}</h3>
                <span className="text-xs text-muted-foreground">{items.length}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {items.map((item) => {
                  const Thumbnail = thumbnails[item.slug];
                  return (
                    <Link
                      to={`/components/${item.slug}`}
                      key={item.slug}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-lg"
                    >
                      <div className="flex aspect-8/5 items-center justify-center bg-muted/30 p-4 transition-colors duration-200 group-hover:bg-muted/50">
                        {Thumbnail ? (
                          <Thumbnail />
                        ) : (
                          <span className="text-xs font-medium text-muted-foreground">
                            {item.name}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-1 border-t border-border p-3.5">
                        <h4 className="text-sm font-medium text-foreground">
                          {item.name}
                        </h4>
                        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {blocks.length > 0 && (
        <div id="blocks" className="scroll-mt-20 space-y-8 border-t border-border pt-10">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Blocks</h2>
            <p className="text-sm text-muted-foreground">
              Production-ready multi-component compositions and layout patterns for
              Shopify apps.
            </p>
          </div>

          {blocks.map(({ category, components }) => {
            const BlockIcon = getCategoryIcon(category);
            return (
              <section key={category}>
                <div className="mb-4 flex items-center gap-2">
                  <BlockIcon className="size-4 text-muted-foreground" />
                  <h3 className="text-base font-semibold text-foreground">{category}</h3>
                  <span className="text-xs text-muted-foreground">
                    {components.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {components.map((item) => {
                    const Thumbnail = thumbnails[item.slug];
                    return (
                      <Link
                        to={`/blocks/${item.slug}`}
                        key={item.slug}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-lg"
                      >
                        <div className="flex aspect-8/5 items-center justify-center bg-muted/30 p-4 transition-colors duration-200 group-hover:bg-muted/50">
                          {Thumbnail ? (
                            <Thumbnail />
                          ) : (
                            <BlockIcon className="size-8 text-foreground/40" />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col gap-1 border-t border-border p-3.5">
                          <h4 className="text-sm font-semibold text-foreground">
                            {item.name}
                          </h4>
                          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Footer CTA */}
      <div className="mt-12 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border/80 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-foreground/60" />
          <p className="text-sm text-foreground">
            New here? Set up the package in a few minutes.
          </p>
        </div>
        <Button render={<Link to="/installation" />}>
          View installation guide
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
