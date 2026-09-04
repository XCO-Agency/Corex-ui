import { Link } from "react-router-dom";
import { categories, registry, blocks } from "../data/registry";
import { thumbnails } from "../components/icons/ComponentThumbnails";
import { SlidersHorizontal } from "lucide-react";

export function Overview() {
  return (
    <div className="page">
      <h1>Components</h1>
      <p className="page-intro">
        All {registry.length} components currently implemented in{" "}
        <code>@xco-agency/corex-ui</code>, grouped the same way as the sidebar. Pick one
        to see a live example and its code.
      </p>

      {categories.map((category) => {
        const items = registry.filter((entry) => entry.category === category);
        if (items.length === 0) return null;

        return (
          <section key={category} className="overview-section">
            <h2>{category}</h2>
            <div className="component-grid">
              {items.map((item) => {
                const Thumbnail = thumbnails[item.slug];
                return (
                  <Link
                    to={`/components/${item.slug}`}
                    className="component-card"
                    key={item.slug}
                  >
                    <div className="component-thumb">
                      {Thumbnail ? <Thumbnail /> : null}
                    </div>
                    <div className="component-card-body">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {blocks.length > 0 && (
        <div className="mt-12 space-y-6 border-t border-border pt-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Blocks</h2>
            <p className="page-intro mt-1 text-sm text-muted-foreground">
              Ready-to-use, multi-component application layouts and full page patterns
              built with Corex UI.
            </p>
          </div>

          {blocks.map(({ category, components }) => (
            <section key={category} className="overview-section">
              <h3 className="text-lg font-semibold text-foreground mb-4">{category}</h3>
              <div className="component-grid">
                {components.map((item) => (
                  <Link
                    to={`/blocks/${item.slug}`}
                    className="component-card"
                    key={item.slug}
                  >
                    <div className="component-thumb flex items-center justify-center bg-muted/40 text-muted-foreground">
                      <SlidersHorizontal className="size-8 text-primary/70" />
                    </div>
                    <div className="component-card-body">
                      <h4 className="font-semibold text-foreground">{item.name}</h4>
                      <p>{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
