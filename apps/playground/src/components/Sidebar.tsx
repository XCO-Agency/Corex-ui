import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { categories, registry } from "../data/registry";

export function Sidebar() {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!normalizedQuery) return registry;
    return registry.filter((entry) => entry.name.toLowerCase().includes(normalizedQuery));
  }, [normalizedQuery]);

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-name">Corex UI</span>
        <span className="sidebar-brand-subtitle">Component playground</span>
      </div>

      <input
        type="search"
        className="sidebar-search"
        placeholder="Search components..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label="Search components"
      />

      {!normalizedQuery && (
        <NavLink to="/" end className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
          Overview
        </NavLink>
      )}

      {categories.map((category) => {
        const items = filtered.filter((entry) => entry.category === category);
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

      {normalizedQuery && filtered.length === 0 && (
        <p className="sidebar-empty">No components match &ldquo;{query}&rdquo;.</p>
      )}
    </nav>
  );
}
