import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { AvatarProps } from "./Avatar.types";

const SAvatar = createWebComponent<HTMLElement>("s-avatar");

export const Avatar = forwardRef<HTMLElement, AvatarProps>(function Avatar(props, ref) {
  return <SAvatar ref={ref} {...props} />;
});
