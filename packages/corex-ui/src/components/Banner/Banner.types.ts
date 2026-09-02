import type { ReactNode } from "react";
import type { Tone } from "../../types/common";

export interface BannerProps {
  children?: ReactNode;
  title?: ReactNode;
  /** @deprecated Use `tone`. Kept for legacy-API compatibility. */
  status?: Tone;
  tone?: Tone;
  onDismiss?: () => void;
  className?: string;
  id?: string;
}
