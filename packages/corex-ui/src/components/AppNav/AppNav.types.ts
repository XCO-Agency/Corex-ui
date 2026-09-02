import type { ReactNode } from "react";

export interface AppNavProps {
  /** `Link` children, e.g. `<Link url="/app" rel="home">Home</Link>`. */
  children?: ReactNode;
  className?: string;
  id?: string;
}
