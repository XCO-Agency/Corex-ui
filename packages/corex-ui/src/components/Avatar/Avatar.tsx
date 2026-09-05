import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { AvatarPropsType } from "./Avatar.types";

const SAvatar = createWebComponent<HTMLElement>("s-avatar", {
  domProps: [
    "name",
    "initials",
    "src",
    "alt",
    "size",
    "shape",
    "accessibilityLabel",
  ],
});

export const Avatar = forwardRef<HTMLElement, AvatarPropsType>(function Avatar(
  { source, image, src, ...rest },
  ref,
) {
  return <SAvatar ref={ref} src={src ?? image ?? source} {...rest} />;
});
