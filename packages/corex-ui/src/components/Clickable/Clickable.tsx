import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { ClickablePropsType } from "./Clickable.types";
import {
  mapLegacyBackground,
  mapLegacyBorderColor,
  mapLegacyBorderRadius,
  mapLegacyBorderWidth,
  mapLegacySpacing,
} from "../../core/legacySpacing";

const SClickable = createWebComponent<
  HTMLElement,
  {
    onClick: "click";
    onBlur: "blur";
    onFocus: "focus";
  }
>("s-clickable", {
  events: {
    onClick: "click",
    onBlur: "blur",
    onFocus: "focus",
  },
  domProps: [
    "disabled",
    "loading",
    "padding",
    "paddingBlock",
    "paddingBlockStart",
    "paddingBlockEnd",
    "paddingInline",
    "paddingInlineStart",
    "paddingInlineEnd",
    "background",
    "borderColor",
    "borderRadius",
    "borderWidth",
    "borderStyle",
    "blockSize",
    "minBlockSize",
    "maxBlockSize",
    "inlineSize",
    "minInlineSize",
    "maxInlineSize",
    "display",
    "overflow",
  ],
});

/**
 * Clickable component wrapping Polaris `<s-clickable>`.
 *
 * Implements the full `s-clickable` specification, inheriting all BoxProps
 * (`background`, `borderWidth`, `borderStyle`, `borderColor`, `borderRadius`,
 * `padding`, `blockSize`, `inlineSize`, `display`, `overflow`, `accessibilityRole`, etc.)
 * alongside action properties (`href`/`url`, `target`/`external`, `disabled`,
 * `loading`, `download`, `type`, `command`, `commandFor`, `interestFor`,
 * `onClick`, `onBlur`, `onFocus`).
 */
export const Clickable = forwardRef<HTMLElement, ClickablePropsType>(function Clickable(
  {
    children,
    content,
    href,
    url,
    target,
    external,
    disabled,
    loading,
    download,
    type,
    command,
    commandFor,
    interestFor,
    lang,
    background,
    borderWidth,
    borderStyle,
    borderColor,
    borderRadius,
    border,
    padding,
    paddingBlock,
    paddingBlockStart,
    paddingBlockEnd,
    paddingInline,
    paddingInlineStart,
    paddingInlineEnd,
    display,
    blockSize,
    minBlockSize,
    maxBlockSize,
    inlineSize,
    minInlineSize,
    maxInlineSize,
    overflow,
    accessibilityLabel,
    accessibilityRole,
    accessibilityVisibility,
    onClick,
    onclick,
    onBlur,
    onblur,
    onFocus,
    onfocus,
    ...rest
  },
  ref,
) {
  const resolvedHref = href ?? url;
  const resolvedTarget = target ?? (external ? "_blank" : undefined);
  const resolvedRel = external ? "noopener noreferrer" : undefined;
  const resolvedOnClick = onClick ?? onclick ?? undefined;
  const resolvedOnBlur = onBlur ?? onblur ?? undefined;
  const resolvedOnFocus = onFocus ?? onfocus ?? undefined;
  const resolvedDownload =
    typeof download === "boolean" ? (download ? "" : undefined) : download;

  return (
    <SClickable
      ref={ref}
      href={resolvedHref}
      target={resolvedTarget}
      rel={resolvedRel}
      disabled={disabled}
      loading={loading}
      download={resolvedDownload}
      type={type}
      command={command}
      commandFor={commandFor}
      interestFor={interestFor}
      lang={lang}
      background={mapLegacyBackground(background)}
      borderWidth={mapLegacyBorderWidth(borderWidth)}
      borderStyle={borderStyle}
      borderColor={mapLegacyBorderColor(borderColor)}
      borderRadius={mapLegacyBorderRadius(borderRadius)}
      border={border}
      padding={mapLegacySpacing(padding)}
      paddingBlock={mapLegacySpacing(paddingBlock)}
      paddingBlockStart={mapLegacySpacing(paddingBlockStart)}
      paddingBlockEnd={mapLegacySpacing(paddingBlockEnd)}
      paddingInline={mapLegacySpacing(paddingInline)}
      paddingInlineStart={mapLegacySpacing(paddingInlineStart)}
      paddingInlineEnd={mapLegacySpacing(paddingInlineEnd)}
      display={display}
      blockSize={blockSize}
      minBlockSize={minBlockSize}
      maxBlockSize={maxBlockSize}
      inlineSize={inlineSize}
      minInlineSize={minInlineSize}
      maxInlineSize={maxInlineSize}
      overflow={overflow}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityVisibility={accessibilityVisibility}
      onClick={resolvedOnClick}
      onBlur={resolvedOnBlur}
      onFocus={resolvedOnFocus}
      {...rest}
    >
      {content ?? children}
    </SClickable>
  );
});

/**
 * ClickableAction is an alias for Clickable.
 */
export const ClickableAction = Clickable;
