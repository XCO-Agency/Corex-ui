import { forwardRef } from "react";
import { childrenText } from "../../core/childrenText";
import { createWebComponent } from "../../core/createWebComponent";
import { devWarning } from "../../utils/devWarning";
import type { TagPropsType } from "./Tag.types";

const SChip = createWebComponent<HTMLElement, { onRemove: "remove" }>("s-chip", {
  events: { onRemove: "remove" },
});

/**
 * A pill, on `s-chip`.
 *
 * `removable` follows from `onRemove` the way it did in v12: a tag with a handler
 * draws its own remove control, and the element fires `remove` when it is used.
 */
export const Tag = forwardRef<HTMLElement, TagPropsType>(function Tag(
  { children, onRemove, disabled, url, removable, accessibilityLabel, ...rest },
  ref,
) {
  if (url !== undefined) {
    devWarning("Tag", "`url` is ignored; wrap the tag in a `Link` instead.");
  }

  return (
    <SChip
      ref={ref}
      removable={removable ?? (onRemove ? !disabled : undefined)}
      accessibilityLabel={
        accessibilityLabel || (childrenText(children) ? undefined : "Tag")
      }
      onRemove={onRemove ? () => onRemove() : undefined}
      {...rest}
    >
      {children}
    </SChip>
  );
});
