import { type ReactNode, type JSX } from "react";
import { MetricCardPropsType } from "./MetricCard.types";
import { Text } from "../Text";
import { Box } from "../Box";
import { BlockStack } from "../BlockStack";
import { Icon } from "../Icon";

const SPARK_W = 64;
const SPARK_H = 24;
const SPARK_PADDING_X = 1;
const SPARK_PADDING_Y = 3;

const SPARK_STROKE = "#7a7e82";
const SPARK_STROKE_WIDTH = 1.8;

function buildSmoothPath(data: number[], width: number, height: number): string {
  if (data.length < 2) return "";

  const minV = Math.min(...data);
  const maxV = Math.max(...data);
  const range = maxV - minV || 1;

  const innerWidth = width - SPARK_PADDING_X * 2;
  const innerHeight = height - SPARK_PADDING_Y * 2;

  const points = data.map((value, index) => ({
    x: SPARK_PADDING_X + (index / (data.length - 1)) * innerWidth,
    y: SPARK_PADDING_Y + ((maxV - value) / range) * innerHeight,
  }));

  if (points.length === 2) {
    return `M ${points[0]?.x.toFixed(2)} ${points[0]?.y.toFixed(2)}
            L ${points[1]?.x.toFixed(2)} ${points[1]?.y.toFixed(2)}`;
  }

  let path = `M ${points[0]?.x.toFixed(2)} ${points[0]?.y.toFixed(2)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i] ?? { x: 0, y: 0 };
    const p1 = points[i] ?? { x: 0, y: 0 };
    const p2 = points[i + 1] ?? { x: 0, y: 0 };
    const p3 = points[i + 2] ?? { x: 0, y: 0 };

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;

    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += `
      C
      ${cp1x.toFixed(2)} ${cp1y.toFixed(2)},
      ${cp2x.toFixed(2)} ${cp2y.toFixed(2)},
      ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}
    `;
  }

  return path;
}

const TONE_COLOR_MAP: Record<string, string> = {
  auto: SPARK_STROKE,
  neutral: "var(--p-color-text-neutral, #616161)",
  success: "var(--p-color-text-success, #108043)",
  warning: "var(--p-color-text-warning, #b98900)",
  critical: "var(--p-color-text-critical, #d72c0d)",
  info: "var(--p-color-text-info, #2c6ecb)",
  caution: "var(--p-color-text-warning, #b98900)",
};

function resolveSparklineColor(color?: string): string {
  if (!color) return SPARK_STROKE;
  return TONE_COLOR_MAP[color] ?? color;
}

type SparklinePropsType = {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showArea?: boolean;
  showEndpoint?: boolean;
};

function buildAreaPath(linePath: string, width: number, height: number): string {
  return `
    ${linePath}
    L ${width - SPARK_PADDING_X} ${height}
    L ${SPARK_PADDING_X} ${height}
    Z
  `;
}

export function Sparkline({
  data,
  width = SPARK_W,
  height = SPARK_H,
  color,
  strokeWidth = SPARK_STROKE_WIDTH,
  showArea = true,
  showEndpoint = true,
}: SparklinePropsType): JSX.Element | null {
  if (data.length < 2) return null;

  const resolvedStroke = resolveSparklineColor(color ?? SPARK_STROKE);
  const linePath = buildSmoothPath(data, width, height);

  if (!linePath) return null;

  const lastValue = data[data.length - 1] ?? 0;
  const minV = Math.min(...data);
  const maxV = Math.max(...data);
  const range = maxV - minV || 1;

  const endpointX = width - SPARK_PADDING_X;
  const endpointY =
    SPARK_PADDING_Y + ((maxV - lastValue) / range) * (height - SPARK_PADDING_Y * 2);

  const gradientId = `spark-gradient-${Math.random().toString(36).slice(2)}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      style={{
        display: "block",
        overflow: "visible",
        flexShrink: 0,
      }}
    >
      {showArea && (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={resolvedStroke} stopOpacity="0.16" />
              <stop offset="100%" stopColor={resolvedStroke} stopOpacity="0" />
            </linearGradient>
          </defs>

          <path d={buildAreaPath(linePath, width, height)} fill={`url(#${gradientId})`} />
        </>
      )}

      <path
        d={linePath}
        fill="none"
        stroke={resolvedStroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {showEndpoint && (
        <>
          <circle cx={endpointX} cy={endpointY} r="3" fill="white" />

          <circle cx={endpointX} cy={endpointY} r="1.75" fill={resolvedStroke} />
        </>
      )}
    </svg>
  );
}

// ─── MetricCard Component ───────────────────────────────────────────────────────
export function MetricCard({
  id,
  title,
  value,
  icon,
  iconTone = "auto",
  tooltip,
  badge,
  sparklineData,
  sparklineColor,
  sparklineWidth,
  sparklineHeight,
  onClick,
}: MetricCardPropsType): JSX.Element {
  const innerContent = (
    <Box padding="small-200">
      <BlockStack gap="small-100">
        {/* Header: icon + title + tooltip + badge */}
        <s-stack direction="inline" justifyContent="space-between" alignItems="center">
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flex: 1,
            }}
          >
            {icon && <Icon type={icon} tone={iconTone} />}
            <span
              style={{
                flex: 1,
                textDecoration: tooltip
                  ? "underline 2px dotted var(--p-color-border-tertiary, rgba(204, 204, 204, 1))"
                  : "none",
                textUnderlineOffset: tooltip ? 5 : "none",
              }}
            >
              <Text type="strong" truncate interestFor={id}>
                {title}
              </Text>
            </span>
            {tooltip && <s-tooltip id={id}>{tooltip}</s-tooltip>}
            {badge && badge.value && (
              <s-badge
                tone={badge?.tone ?? "neutral"}

                icon={
                  badge?.dir
                    ? badge?.dir === "up"
                      ? "arrow-up"
                      : "arrow-down"
                    : undefined
                }
              >
                {badge.value}
              </s-badge>
            )}
          </div>
        </s-stack>

        {/* Value + sparkline */}
        <s-stack direction="inline" justifyContent="space-between" alignItems="end">
          <s-stack direction="inline" gap="small-200" alignItems="end">
            <s-text fontVariantNumeric="tabular-nums">
              <strong>{value}</strong>
            </s-text>
          </s-stack>
          {sparklineData && (
            <Sparkline
              data={sparklineData}
              color={sparklineColor}
              width={sparklineWidth}
              height={sparklineHeight}
            />
          )}
        </s-stack>
      </BlockStack>
    </Box>
  );

  return (
    <s-section padding="none">
      <s-box padding="small-300">
        {onClick ? (
          <s-clickable onClick={onClick} borderRadius="base">
            {innerContent}
          </s-clickable>
        ) : (
          innerContent
        )}
      </s-box>
    </s-section>
  );
}
