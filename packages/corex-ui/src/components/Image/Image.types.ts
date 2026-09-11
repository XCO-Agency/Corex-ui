import type { CSSProperties } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeImageProps = PolarisPropsType<"s-image">;

export type ImagePropsType = Omit<
  NativeImageProps,
  "src" | "onLoad" | "onError"
> & {
  /**
   * Source URL of the image.
   */
  src?: string;
  /**
   * Legacy Polaris alias for `src`.
   */
  source?: string;
  /**
   * Alternative text for accessibility. Required by Shopify Polaris guidelines.
   */
  alt: string;
  /**
   * One or more image candidate URLs with pixel density or width descriptors.
   */
  srcSet?: string;
  /**
   * Media conditions indicating image slot width.
   */
  sizes?: string;
  /**
   * Explicit aspect ratio (e.g. `"16/9"`, `"1/1"`).
   */
  aspectRatio?: string | number;
  /**
   * How the image fits its container (`"cover" | "contain" | "fill" | "none" | "scale-down"`).
   */
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  /**
   * Browser loading strategy (`"lazy" | "eager"`).
   */
  loading?: "lazy" | "eager";
  /**
   * Explicit width of the image.
   */
  width?: string | number;
  /**
   * Explicit height of the image.
   */
  height?: string | number;
  /**
   * Border radius (supports Polaris tokens e.g. `"small"`, `"base"`).
   */
  borderRadius?: string;
  /**
   * Callback fired when the image successfully loads.
   */
  onLoad?: (event: Event) => void;
  /**
   * Callback fired if the image fails to load.
   */
  onError?: (event: Event) => void;
  className?: string;
  style?: CSSProperties;
  id?: string;
};
