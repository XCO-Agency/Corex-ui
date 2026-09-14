import type { ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeTitleBarProps = PolarisPropsType<"ui-title-bar">;

export type TitleBarPropsType = Omit<NativeTitleBarProps, "title"> & {
  /** The title text displayed in the modal title bar. */
  title?: string;
  /** Action buttons or content placed within the title bar. */
  children?: ReactNode;
};
