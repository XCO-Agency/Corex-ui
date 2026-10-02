import type { PolarisPropsType, SizeType } from "../../types/common";

type NativeAvatarProps = PolarisPropsType<"s-avatar">;

export type AvatarPropsType = Omit<NativeAvatarProps, "size"> & {
  /** Name of person or entity (used for initials calculation / accessibility). */
  name?: string;
  /** Shape of the avatar ('round' | 'square'). */
  shape?: "round" | "square" | (string & {});
  /** Visually hidden label describing avatar. */
  accessibilityLabel?: string;
  /** Source image URL (legacy Polaris prop mapping to `src`). */
  source?: string;
  /** Image URL alias mapping to `src`. */
  image?: string;
  size?: NativeAvatarProps["size"] | SizeType;
  /**
   * v12's `customer` placeholder glyph. `s-avatar` renders initials or a generic
   * person, so this is accepted and ignored, with a development warning.
   */
  customer?: boolean;
};
