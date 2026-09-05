import type * as React from "react";
import type { IconType, PolarisPropsType, ToneType } from "../../types/common";

type NativeIconProps = PolarisPropsType<"s-icon">;

export type IconSourceType =
  | IconType
  | React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  | React.ComponentType<{ className?: string }>;

export type IconPropsType = Omit<NativeIconProps, "source" | "tone" | "type"> & {
  /** Icon name (e.g. `"save"`, `"search"`, `"star"`) or a Polaris SVG component. */
  source?: IconSourceType;
  tone?: ToneType;
  type?: IconType;
  accessibilityLabel?: string;
  id?: string;
  style?: React.CSSProperties;
};
