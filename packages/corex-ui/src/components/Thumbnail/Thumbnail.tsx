import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { ThumbnailPropsType } from "./Thumbnail.types";

const SThumbnail = createWebComponent<HTMLElement>("s-thumbnail");

export const Thumbnail = forwardRef<HTMLElement, ThumbnailPropsType>(
  function Thumbnail(props, ref) {
    return <SThumbnail ref={ref} {...props} />;
  },
);
