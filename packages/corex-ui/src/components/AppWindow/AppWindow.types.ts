import type { PolarisPropsType } from "../../types/common";

type NativeAppWindowProps = PolarisPropsType<"s-app-window">;

export type AppWindowPropsType = Omit<NativeAppWindowProps, "src"> & {
  /** URL of the page to load inside the window. */
  src: string;
  id?: string;
  className?: string;
};
