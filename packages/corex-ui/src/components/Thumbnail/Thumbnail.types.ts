import type { PolarisPropsType } from "../../types/common";

type NativeThumbnailProps = PolarisPropsType<"s-thumbnail">;

export type ThumbnailPropsType = Omit<NativeThumbnailProps, "src"> & {
  /** The image URL. Supports both modern `src` and legacy Polaris `source`. */
  src?: string;
  source?: string;
};
