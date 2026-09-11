import { forwardRef, type CSSProperties } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { mapLegacyBorderRadius } from "../../core/legacySpacing";
import type { ImagePropsType } from "./Image.types";

type ImageEvents = { onLoad: "load"; onError: "error" };
const imageEvents: ImageEvents = { onLoad: "load", onError: "error" };

const SImage = createWebComponent<HTMLElement, ImageEvents>("s-image", {
  events: imageEvents,
  domProps: [
    "src",
    "srcSet",
    "sizes",
    "alt",
    "aspectRatio",
    "objectFit",
    "loading",
    "accessibilityRole",
    "inlineSize",
    "border",
    "borderWidth",
    "borderStyle",
    "borderColor",
    "borderRadius",
  ],
});

/**
 * Image component wrapping Polaris `<s-image>`.
 * Supports responsive image sets, aspect ratio, fit controls, and legacy Polaris props.
 */
export const Image = forwardRef<HTMLElement, ImagePropsType>(function Image(
  {
    src,
    source,
    alt,
    srcSet,
    sizes,
    aspectRatio,
    objectFit,
    loading,
    width,
    height,
    inlineSize,
    borderRadius,
    style,
    className,
    ...rest
  },
  ref,
) {
  const resolvedSrc = src ?? source;
  const resolvedInlineSize =
    inlineSize ?? (typeof width === "number" ? `${width}px` : width);
  const resolvedBorderRadius = mapLegacyBorderRadius(borderRadius);

  const combinedStyles: CSSProperties = {
    ...(height !== undefined
      ? { height: typeof height === "number" ? `${height}px` : height }
      : {}),
    ...style,
  };

  return (
    <SImage
      ref={ref}
      src={resolvedSrc}
      alt={alt}
      srcSet={srcSet}
      sizes={sizes}
      aspectRatio={aspectRatio as any}
      objectFit={objectFit}
      loading={loading}
      inlineSize={resolvedInlineSize}
      borderRadius={resolvedBorderRadius}
      style={combinedStyles}
      className={className}
      {...rest}
    />
  );
});
