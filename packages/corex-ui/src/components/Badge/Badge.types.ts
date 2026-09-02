import type { ReactNode } from "react";
import type { Size, Tone } from "../../types/common";

export interface BadgeProps {
  children?: ReactNode;
  tone?: Tone;
  size?: Size;
  progress?: "incomplete" | "partiallyComplete" | "complete";
  className?: string;
  id?: string;
}
