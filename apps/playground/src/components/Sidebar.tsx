import { NavLink } from "react-router-dom";
import { categories, registry } from "../data/registry";

export function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-name">Corex UI</span>
        <span className="sidebar-brand-subtitle">Component playground</span>
      </div>

      <NavLink to="/" end className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
        Overview
      </NavLink>

      {categories.map((category) => {
        const items = registry.filter((entry) => entry.category === category);
        if (items.length === 0) return null;

        return (
          <div className="sidebar-section" key={category}>
            <h3>{category}</h3>
            <ul>
              {items.map((item) => (
                <li key={item.slug}>
                  <NavLink
                    to={`/components/${item.slug}`}
                    className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
