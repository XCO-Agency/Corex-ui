import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { devWarning } from "../../utils/devWarning";
import type { AvatarPropsType } from "./Avatar.types";

const SAvatar = createWebComponent<HTMLElement>("s-avatar", {
  domProps: ["name", "initials", "src", "alt", "size", "shape", "accessibilityLabel"],
});

export const Avatar = forwardRef<HTMLElement, AvatarPropsType>(function Avatar(
  { source, image, src, customer, ...rest },
  ref,
) {
  if (customer) {
    devWarning(
      "Avatar",
      "`customer` is ignored: `s-avatar` renders initials or a generic person, and v12's variant only changed that glyph.",
    );
  }

  return <SAvatar ref={ref} src={src ?? image ?? source} {...rest} />;
});
