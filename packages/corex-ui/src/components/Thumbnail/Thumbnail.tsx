import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { ThumbnailPropsType } from "./Thumbnail.types";

const SThumbnail = createWebComponent<HTMLElement>("s-thumbnail");

export const Thumbnail = forwardRef<HTMLElement, ThumbnailPropsType>(
  function Thumbnail({ source, src, ...rest }, ref) {
    const finalSrc = src ?? source;
    return (
      <SThumbnail
        ref={ref}
        src={finalSrc}
        {...(source ? { source } : finalSrc ? { source: finalSrc } : {})}
        {...rest}
      />
    );
  },
);
