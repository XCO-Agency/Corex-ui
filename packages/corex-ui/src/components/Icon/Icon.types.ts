import type * as React from "react";
import type { IconType, ToneType } from "../../types/common";

export type IconSourceType =
  | IconType
  | React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  | React.ComponentType<{ className?: string }>;

export type IconPropsType = {
  /** Icon name (e.g. `"save"`, `"search"`, `"star"`) or a Polaris SVG component. */
  source?: IconSourceType;
  tone?: ToneType;
  type?: IconType;
  accessibilityLabel?: string;
  id?: string;
  style?: React.CSSProperties;
};

export type IconProps = IconPropsType;
