import type { ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeAppNavProps = PolarisPropsType<"s-app-nav">;

export type AppNavPropsType = Omit<NativeAppNavProps, "children"> & {
  /** `Link` children, e.g. `<Link url="/app" rel="home">Home</Link>`. */
  children?: ReactNode;
  className?: string;
  id?: string;
};
