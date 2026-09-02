import type { ReactNode } from "react";

export interface TooltipProps {
  /** The element the tooltip is anchored to. */
  children: ReactNode;
  content: ReactNode;
  id?: string;
  className?: string;
}
