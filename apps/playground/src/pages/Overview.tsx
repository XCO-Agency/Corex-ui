import { Link } from "react-router-dom";
import { categories, registry } from "../data/registry";

export function Overview() {
  return (
    <div className="page">
      <h1>Components</h1>
      <p className="page-intro">
        All {registry.length} components currently implemented in <code>@xco/corex-ui</code>,
        grouped the same way as the sidebar. Pick one to see a live example and its code.
      </p>

      {categories.map((category) => {
        const items = registry.filter((entry) => entry.category === category);
        if (items.length === 0) return null;

        return (
          <section key={category} className="overview-section">
            <h2>{category}</h2>
            <div className="component-grid">
              {items.map((item) => (
                <Link to={`/components/${item.slug}`} className="component-card" key={item.slug}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
