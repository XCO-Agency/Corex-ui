import type { ReactNode } from "react";
import type { Size, Tone } from "../../types/common";

export interface BadgeProps {
  children?: ReactNode;
  tone?: Tone;
  size?: Size;
  progress?: "incomplete" | "partiallyComplete" | "complete";
  className?: string;
  id?: string;
  /** Standard HTML slot attribute, e.g. placing a Badge into a Page's `accessory` slot. */
  slot?: string;
}
