import type { Size } from "../../types/common";

export interface ThumbnailProps {
  source: string;
  alt: string;
  size?: Size;
  id?: string;
  className?: string;
}
