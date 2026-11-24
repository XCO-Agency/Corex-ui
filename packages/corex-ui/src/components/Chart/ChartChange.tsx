import { Text } from "../Text";
import type { ChartChangePropsType } from "./Chart.types";

/**
 * Shopify's change figure next to a value: "↗ 34%" in green, "↘ 12%" in
 * red, "→ 0%" when flat, and nothing without a previous period.
 */
export function ChartChange({ pct, label }: ChartChangePropsType) {
  if (pct == null) return null;
  const up = pct > 0;
  const flat = pct === 0;
  return (
    <Text
      as="span"
      variant="bodySm"
      fontWeight="semibold"
      color={flat ? "subdued" : up ? "success" : "critical"}
      aria-label={label}
    >
      {`${flat ? "→" : up ? "↗" : "↘"} ${Math.abs(pct)}%`}
    </Text>
  );
}
