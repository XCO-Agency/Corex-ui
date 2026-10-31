import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type RefAttributes,
} from "react";
import { useIsomorphicLayoutEffect } from "../../core/useIsomorphicLayoutEffect";
import { mergeRefs } from "../../core/mergeRefs";
import { DropZone } from "../DropZone";
import { Hoverable } from "../Hoverable";
import { Selectable } from "../Selectable";
import { Transition } from "../Transition";
import { MEDIA_CSS, MEDIA_STYLE_ID } from "./Media.css";
import type {
  MediaActionsPropsType,
  MediaBodyPropsType,
  MediaComponentType,
  MediaContentPropsType,
  MediaContextType,
  MediaDetailPropsType,
  MediaEmptyPropsType,
  MediaFiltersPropsType,
  MediaItemContextType,
  MediaItemPropsType,
  MediaMetaPropsType,
  MediaPreviewFitType,
  MediaPreviewPropsType,
  MediaPropsType,
  MediaToolbarPropsType,
  MediaTriggerPropsType,
  MediaUploadPropsType,
  MediaViewTogglePropsType,
  MediaViewType,
} from "./Media.types";

function ensureMediaStyles(node: HTMLElement | null) {
  const doc = node?.ownerDocument ?? (typeof document !== "undefined" ? document : null);
  if (!doc) return;
  const existing = doc.getElementById(MEDIA_STYLE_ID);
  if (existing) {
    if (existing.textContent !== MEDIA_CSS) existing.textContent = MEDIA_CSS;
    return;
  }
  const style = doc.createElement("style");
  style.id = MEDIA_STYLE_ID;
  style.textContent = MEDIA_CSS;
  doc.head.appendChild(style);
}

const MediaContext = createContext<MediaContextType | null>(null);
const MediaItemContext = createContext<MediaItemContextType | null>(null);

/** Reads the nearest `Media` root. Throws when used outside `<Media>`. */
export function useMedia(): MediaContextType {
  const ctx = useContext(MediaContext);
  if (!ctx) {
    throw new Error("Media compound components must be used within a <Media />");
  }
  return ctx;
}

/** Soft read of Media context; `null` outside a root. */
export function useMediaOptional(): MediaContextType | null {
  return useContext(MediaContext);
}

/** Soft read of the nearest `Media.Item`; `null` outside one. */
export function useMediaItem(): MediaItemContextType | null {
  return useContext(MediaItemContext);
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 4.5C4.5 4.5 1.5 10 1.5 10s3 5.5 8.5 5.5S18.5 10 18.5 10 15.5 4.5 10 4.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M3.5 3.5h5v5h-5v-5Zm8 0h5v5h-5v-5Zm-8 8h5v5h-5v-5Zm8 0h5v5h-5v-5Z" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M3 4.5h14v1.5H3V4.5Zm0 4.75h14v1.5H3v-1.5Zm0 4.75h14V15.5H3v-1.5Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5.5 5.5 14.5 14.5M14.5 5.5 5.5 14.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const MediaRoot: ForwardRefExoticComponent<
  MediaPropsType & RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, MediaPropsType>(function Media(
  {
    children,
    value: controlledValue,
    defaultValue = [],
    onChange,
    multiple = false,
    view: controlledView,
    defaultView = "grid",
    onViewChange,
    detailValue: controlledDetail,
    defaultDetailValue = null,
    onDetailChange,
    tone = "neutral",
    disabled = false,
    accessibilityLabel,
    gridMinInlineSize = "9.5rem",
    columns,
    contentMaxBlockSize,
    previewFit = "cover",
    id,
    className,
    style,
  },
  ref,
): ReactElement {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  useIsomorphicLayoutEffect(() => ensureMediaStyles(nodeRef.current), []);

  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const selectedValues = controlledValue ?? internalValue;

  const [internalView, setInternalView] = useState<MediaViewType>(defaultView);
  const view = controlledView ?? internalView;

  const [internalDetail, setInternalDetail] = useState<string | null>(defaultDetailValue);
  const detailValue = controlledDetail !== undefined ? controlledDetail : internalDetail;

  const handleSelectionChange = useCallback(
    (next: string[]) => {
      if (controlledValue === undefined) setInternalValue(next);
      onChange?.(next);
    },
    [controlledValue, onChange],
  );

  const clearSelection = useCallback(() => {
    handleSelectionChange([]);
  }, [handleSelectionChange]);

  const setView = useCallback(
    (next: MediaViewType) => {
      if (controlledView === undefined) setInternalView(next);
      onViewChange?.(next);
    },
    [controlledView, onViewChange],
  );

  const toggleView = useCallback(() => {
    setView(view === "grid" ? "list" : "grid");
  }, [setView, view]);

  const setDetailValue = useCallback(
    (next: string | null) => {
      if (controlledDetail === undefined) setInternalDetail(next);
      onDetailChange?.(next);
    },
    [controlledDetail, onDetailChange],
  );

  const context = useMemo<MediaContextType>(
    () => ({
      view,
      setView,
      toggleView,
      selectedValues,
      selectedCount: selectedValues.length,
      multiple,
      disabled,
      tone,
      detailValue,
      setDetailValue,
      clearSelection,
      previewFit,
    }),
    [
      view,
      setView,
      toggleView,
      selectedValues,
      multiple,
      disabled,
      tone,
      detailValue,
      setDetailValue,
      clearSelection,
      previewFit,
    ],
  );

  const cssVars = {
    "--cx-media-col-min": gridMinInlineSize,
    ...(columns
      ? { "--cx-media-grid-cols": `repeat(${Math.max(1, columns)}, minmax(0, 1fr))` }
      : {}),
    ...(contentMaxBlockSize ? { "--cx-media-content-max": contentMaxBlockSize } : {}),
    "--cx-media-preview-fit": previewFit,
    ...style,
  } as CSSProperties;

  return (
    <MediaContext.Provider value={context}>
      <Selectable.Group
        multiple={multiple}
        value={selectedValues}
        onChange={handleSelectionChange}
        tone={tone}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
      >
        <div
          ref={mergeRefs(nodeRef, ref)}
          id={id}
          data-slot="media"
          data-view={view}
          data-detail={detailValue ? "true" : "false"}
          data-selected-count={selectedValues.length}
          className={className}
          style={cssVars}
        >
          {children}
        </div>
      </Selectable.Group>
    </MediaContext.Provider>
  );
});
MediaRoot.displayName = "Media";

const MediaToolbar = forwardRef<HTMLDivElement, MediaToolbarPropsType>(
  function MediaToolbar({ children, className, style, id }, ref) {
    useMedia();
    return (
      <div ref={ref} id={id} data-slot="media-toolbar" className={className} style={style}>
        {children}
      </div>
    );
  },
);
MediaToolbar.displayName = "Media.Toolbar";

const MediaFilters = forwardRef<HTMLDivElement, MediaFiltersPropsType>(
  function MediaFilters({ children, className, style, id }, ref) {
    useMedia();
    return (
      <div ref={ref} id={id} data-slot="media-filters" className={className} style={style}>
        {children}
      </div>
    );
  },
);
MediaFilters.displayName = "Media.Filters";

const MediaBody = forwardRef<HTMLDivElement, MediaBodyPropsType>(
  function MediaBody({ children, className, style, id }, ref) {
    useMedia();
    return (
      <div ref={ref} id={id} data-slot="media-body" className={className} style={style}>
        {children}
      </div>
    );
  },
);
MediaBody.displayName = "Media.Body";

const MediaContent = forwardRef<HTMLDivElement, MediaContentPropsType>(
  function MediaContent({ children, maxBlockSize, className, style, id }, ref) {
    const { view } = useMedia();
    const mergedStyle = {
      ...(maxBlockSize ? { "--cx-media-content-max": maxBlockSize } : {}),
      ...style,
    } as CSSProperties;

    return (
      <div
        ref={ref}
        id={id}
        data-slot="media-content"
        data-view={view}
        className={className}
        style={mergedStyle}
        role="presentation"
      >
        {children}
      </div>
    );
  },
);
MediaContent.displayName = "Media.Content";

const MediaItem = forwardRef<HTMLDivElement, MediaItemPropsType>(function MediaItem(
  {
    children,
    value,
    accessibilityLabel,
    indicator,
    onActivate,
    openDetailOnActivate = true,
    disabled,
    className,
    style,
    id,
  },
  ref,
) {
  const {
    view,
    selectedValues,
    multiple,
    tone,
    disabled: groupDisabled,
    setDetailValue,
  } = useMedia();
  const selected = selectedValues.includes(value);
  const itemCtx = useMemo<MediaItemContextType>(
    () => ({ value, selected }),
    [value, selected],
  );

  const resolvedIndicator =
    indicator === undefined ? (multiple ? "checkbox" : "radio") : indicator;

  const activate = useCallback(() => {
    onActivate?.(value);
    if (openDetailOnActivate) setDetailValue(value);
  }, [onActivate, openDetailOnActivate, setDetailValue, value]);

  return (
    <MediaItemContext.Provider value={itemCtx}>
      <Hoverable disabled={disabled || groupDisabled}>
        <Selectable
          value={value}
          indicator={resolvedIndicator}
          tone={tone}
          disabled={disabled}
          borderRadius="base"
          accessibilityLabel={accessibilityLabel}
        >
          <div
            ref={ref}
            id={id}
            data-slot="media-item"
            data-view={view}
            data-selected={selected ? "true" : "false"}
            data-active={selectedValues.length && selected ? "true" : undefined}
            className={className}
            style={style}
            onDoubleClick={(event) => {
              event.preventDefault();
              activate();
            }}
          >
            {children}
          </div>
        </Selectable>
      </Hoverable>
    </MediaItemContext.Provider>
  );
});
MediaItem.displayName = "Media.Item";

const MediaPreview = forwardRef<HTMLDivElement, MediaPreviewPropsType>(
  function MediaPreview(
    { children, src, alt = "", fit, aspectRatio, className, style, id },
    ref,
  ) {
    const { previewFit } = useMedia();
    const resolvedFit: MediaPreviewFitType = fit ?? previewFit;
    const ratio =
      aspectRatio === undefined
        ? undefined
        : typeof aspectRatio === "number"
          ? String(aspectRatio)
          : aspectRatio;

    return (
      <div
        ref={ref}
        id={id}
        data-slot="media-preview"
        data-fit={resolvedFit}
        className={className}
        style={
          {
            "--cx-media-preview-fit": resolvedFit,
            ...(ratio ? { "--cx-media-preview-ratio": ratio } : {}),
            ...style,
          } as CSSProperties
        }
      >
        {src ? <img src={src} alt={alt} draggable={false} /> : null}
        {children}
      </div>
    );
  },
);
MediaPreview.displayName = "Media.Preview";

const MediaMeta = forwardRef<HTMLDivElement, MediaMetaPropsType>(function MediaMeta(
  { children, name, type, orientation, date, className, style, id },
  ref,
) {
  useMedia();
  return (
    <div ref={ref} id={id} data-slot="media-meta" className={className} style={style}>
      {name != null ? (
        <span data-slot="media-meta-name" title={typeof name === "string" ? name : undefined}>
          {name}
        </span>
      ) : null}
      {type != null ? <span data-slot="media-meta-type">{type}</span> : null}
      {orientation != null ? (
        <span data-slot="media-meta-orientation">{orientation}</span>
      ) : null}
      {date != null ? <span data-slot="media-meta-date">{date}</span> : null}
      {children}
    </div>
  );
});
MediaMeta.displayName = "Media.Meta";

const MediaActions = forwardRef<HTMLDivElement, MediaActionsPropsType>(
  function MediaActions(
    { children, animation = "fade", duration = 150, className, style, id },
    ref,
  ) {
    useMedia();

    const stop = (event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => {
      event.stopPropagation();
    };

    const content = (
      <div
        ref={ref}
        id={id}
        data-slot="media-actions"
        className={className}
        style={style}
        onClick={stop}
        onMouseDown={stop}
        onKeyDown={stop}
      >
        {children}
      </div>
    );

    if (animation === false) return content;

    return (
      <Hoverable.Show animation={animation} duration={duration} keepSpace={false}>
        {content}
      </Hoverable.Show>
    );
  },
);
MediaActions.displayName = "Media.Actions";

const MediaUpload = forwardRef<HTMLDivElement, MediaUploadPropsType>(
  function MediaUpload(
    { children, variant = "dashed", dropZone = false, className, style, id },
    ref,
  ) {
    useMedia();
    const dropZoneProps =
      dropZone === true ? {} : dropZone === false ? null : dropZone;

    return (
      <div
        ref={ref}
        id={id}
        data-slot="media-upload"
        data-variant={variant}
        className={className}
        style={style}
      >
        {dropZoneProps ? (
          <DropZone accept="image/*" multiple {...dropZoneProps}>
            {children}
          </DropZone>
        ) : (
          children
        )}
      </div>
    );
  },
);
MediaUpload.displayName = "Media.Upload";

const MediaDetail = forwardRef<HTMLDivElement, MediaDetailPropsType>(
  function MediaDetail(
    {
      children,
      heading,
      closable,
      closeAccessibilityLabel = "Close preview",
      gated = true,
      animate = "fade-left",
      duration = 220,
      inlineSize = "18rem",
      maxInlineSize = "22rem",
      className,
      style,
      id,
    },
    ref,
  ) {
    const { detailValue, setDetailValue } = useMedia();
    const open = !gated || detailValue != null;
    const showClose = closable ?? heading != null;

    return (
      <Transition
        ref={ref}
        show={open}
        animate={animate}
        duration={duration}
        appear
        as="aside"
        id={id}
        className={className}
        style={
          {
            "--cx-media-detail-size": inlineSize,
            "--cx-media-detail-max": maxInlineSize,
            ...style,
          } as CSSProperties
        }
        {...{
          "data-slot": "media-detail",
          "aria-label": typeof heading === "string" ? heading : "Preview",
        }}
      >
        {heading != null || showClose ? (
          <div data-slot="media-detail-header">
            {heading != null ? (
              <h3 data-slot="media-detail-heading">{heading}</h3>
            ) : (
              <span />
            )}
            {showClose ? (
              <button
                type="button"
                data-slot="media-action-chip"
                aria-label={closeAccessibilityLabel}
                onClick={() => setDetailValue(null)}
              >
                <CloseIcon />
              </button>
            ) : null}
          </div>
        ) : null}
        <div data-slot="media-detail-body">{children}</div>
      </Transition>
    );
  },
);
MediaDetail.displayName = "Media.Detail";

const MediaEmpty = forwardRef<HTMLDivElement, MediaEmptyPropsType>(
  function MediaEmpty({ children, className, style, id }, ref) {
    useMedia();
    return (
      <div ref={ref} id={id} data-slot="media-empty" className={className} style={style}>
        {children}
      </div>
    );
  },
);
MediaEmpty.displayName = "Media.Empty";

const MediaTrigger = forwardRef<HTMLElement, MediaTriggerPropsType>(
  function MediaTrigger(
    {
      children,
      variant = "default",
      accessibilityLabel = "Preview",
      onClick,
      className,
      style,
      id,
    },
    ref,
  ) {
    const media = useMedia();
    const item = useMediaItem();

    const handleActivate = (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      if (item) media.setDetailValue(item.value);
      onClick?.(event);
    };

    if (variant === "preview" && children == null) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          id={id}
          data-slot="media-action-chip"
          className={className}
          style={style}
          aria-label={accessibilityLabel}
          onClick={handleActivate}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <EyeIcon />
        </button>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        id={id}
        data-slot="media-trigger"
        className={className}
        style={style}
        onClick={handleActivate}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    );
  },
);
MediaTrigger.displayName = "Media.Trigger";

const MediaViewToggle = forwardRef<HTMLButtonElement, MediaViewTogglePropsType>(
  function MediaViewToggle(
    {
      gridLabel = "Grid view",
      listLabel = "List view",
      className,
      style,
      id,
    },
    ref,
  ) {
    const { view, toggleView } = useMedia();
    const nextIsList = view === "grid";

    return (
      <button
        ref={ref}
        type="button"
        id={id}
        data-slot="media-view-toggle"
        data-view={view}
        className={className}
        style={style}
        aria-label={nextIsList ? listLabel : gridLabel}
        title={nextIsList ? listLabel : gridLabel}
        onClick={toggleView}
      >
        {nextIsList ? <ListIcon /> : <GridIcon />}
      </button>
    );
  },
);
MediaViewToggle.displayName = "Media.ViewToggle";

export const Media = Object.assign(MediaRoot, {
  Toolbar: MediaToolbar,
  Filters: MediaFilters,
  Body: MediaBody,
  Content: MediaContent,
  Item: MediaItem,
  Preview: MediaPreview,
  Meta: MediaMeta,
  Actions: MediaActions,
  Upload: MediaUpload,
  Detail: MediaDetail,
  Empty: MediaEmpty,
  Trigger: MediaTrigger,
  ViewToggle: MediaViewToggle,
}) as unknown as MediaComponentType;
