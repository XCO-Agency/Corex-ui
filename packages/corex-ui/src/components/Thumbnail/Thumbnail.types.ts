import type { PolarisPropsType, SizeType } from "../../types/common";

type NativeThumbnailProps = PolarisPropsType<"s-thumbnail">;

export type ThumbnailPropsType = Omit<NativeThumbnailProps, "size"> & {
  source: string;
  alt: string;
  size?: NativeThumbnailProps["size"] | SizeType;
  id?: string;
  className?: string;
};
