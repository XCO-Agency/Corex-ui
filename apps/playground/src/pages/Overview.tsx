import { Link } from "react-router-dom";
import { categories, registry } from "../data/registry";
import { thumbnails } from "../components/icons/ComponentThumbnails";

export function Overview() {
  return (
    <div className="page">
      <h1>Components</h1>
      <p className="page-intro">
        All {registry.length} components currently implemented in <code>@xco-agency/corex-ui</code>,
        grouped the same way as the sidebar. Pick one to see a live example and its code.
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
                  <Link to={`/components/${item.slug}`} className="component-card" key={item.slug}>
                    <div className="component-thumb">{Thumbnail ? <Thumbnail /> : null}</div>
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
    </div>
  );
}
