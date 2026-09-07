import type { ReactNode, CSSProperties } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeQueryContainerProps = PolarisPropsType<"s-query-container">;

export type QueryContainerPropsType = NativeQueryContainerProps & {
  children?: ReactNode;
  containerName?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  slot?: string;
};
