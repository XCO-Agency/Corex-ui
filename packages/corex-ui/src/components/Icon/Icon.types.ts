import type { Tone } from "../../types/common";

export interface IconProps {
  /** Icon name, e.g. `"save"`, `"delete"`. Best-effort — verify against your installed polaris-1.js. */
  source: string;
  tone?: Tone;
  accessibilityLabel?: string;
  id?: string;
  className?: string;
}
