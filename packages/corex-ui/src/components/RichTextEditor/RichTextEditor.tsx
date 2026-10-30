import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { ActionList } from "../ActionList";
import { BlockStack } from "../BlockStack";
import { Button } from "../Button";
import { Modal } from "../Modal";
import { Popover } from "../Popover";
import { Text } from "../Text";
import { TextField } from "../TextField";
import {
  BLOCK_LABELS,
  TEXT_COLORS,
  getActiveBlockType,
  insertImage,
  insertLink,
  insertTable,
  insertVideoEmbed,
  isEditorEmpty,
  readEditorHtml,
  queryCommandState,
  restoreSelection,
  runCommand,
  saveSelection,
  setAlign,
  setBlockType,
  setTextColor,
} from "./commands";
import { RICH_TEXT_EDITOR_CSS, RICH_TEXT_EDITOR_STYLE_ID } from "./RichTextEditor.css";
import type {
  RichTextAlignType,
  RichTextBlockType,
  RichTextEditorPropsType,
} from "./RichTextEditor.types";

function ensureRichTextEditorStyles(node: HTMLElement | null) {
  const doc = node?.ownerDocument ?? (typeof document !== "undefined" ? document : null);
  if (!doc) return;
  const existing = doc.getElementById(RICH_TEXT_EDITOR_STYLE_ID);
  if (existing) {
    if (existing.textContent !== RICH_TEXT_EDITOR_CSS) {
      existing.textContent = RICH_TEXT_EDITOR_CSS;
    }
    return;
  }
  const style = doc.createElement("style");
  style.id = RICH_TEXT_EDITOR_STYLE_ID;
  style.textContent = RICH_TEXT_EDITOR_CSS;
  doc.head.appendChild(style);
}

const BLOCK_ITEMS: RichTextBlockType[] = [
  "paragraph",
  "heading1",
  "heading2",
  "heading3",
  "heading4",
  "heading5",
  "heading6",
  "blockquote",
];

function blockPreview(type: RichTextBlockType) {
  if (type === "blockquote") {
    return (
      <span data-slot="rich-text-block-preview-quote">
        <Text color="subdued">{BLOCK_LABELS[type]}</Text>
      </span>
    );
  }

  const variantMap: Partial<
    Record<
      RichTextBlockType,
      "headingXl" | "headingLg" | "headingMd" | "headingSm" | "base" | "small"
    >
  > = {
    paragraph: "base",
    heading1: "headingXl",
    heading2: "headingLg",
    heading3: "headingMd",
    heading4: "headingSm",
    heading5: "base",
    heading6: "small",
  };

  return (
    <Text
      variant={variantMap[type] ?? "base"}
      fontWeight={type === "paragraph" ? "regular" : "bold"}
      color={type === "heading6" ? "subdued" : undefined}
    >
      {BLOCK_LABELS[type]}
    </Text>
  );
}

/**
 * Shopify-admin-style rich text editor: bordered shell, subdued toolbar, and a
 * contentEditable surface. Self-contained (no TipTap/Quill) — formatting uses
 * the browser Selection/`document.execCommand` APIs and emits HTML via `onChange`.
 */
export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorPropsType>(
  function RichTextEditor(
    {
      label,
      labelHidden = false,
      value,
      defaultValue = "",
      onChange,
      placeholder = "Start typing…",
      disabled = false,
      minHeight = "120px",
      id,
      name,
      className,
      style,
    },
    ref,
  ) {
    const generatedId = useId();
    const editorId = id ?? generatedId;
    const labelId = `${editorId}-label`;
    const isControlled = value !== undefined;

    const rootRef = useRef<HTMLDivElement | null>(null);
    const editorRef = useRef<HTMLDivElement | null>(null);
    const lastEmittedRef = useRef(isControlled ? value! : defaultValue);
    const seededRef = useRef(false);
    const savedSelectionRef = useRef<Range | null>(null);

    const [codeMode, setCodeMode] = useState(false);
    const [codeValue, setCodeValue] = useState(isControlled ? value! : defaultValue);
    const [empty, setEmpty] = useState(() =>
      isEditorEmpty(isControlled ? value! : defaultValue),
    );
    const [activeBlock, setActiveBlock] = useState<RichTextBlockType>("paragraph");
    const [activeMarks, setActiveMarks] = useState({
      bold: false,
      italic: false,
      underline: false,
    });

    const [linkOpen, setLinkOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState("https://");
    const [imageOpen, setImageOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("https://");
    const [imageAlt, setImageAlt] = useState("");
    const [videoOpen, setVideoOpen] = useState(false);
    const [videoSnippet, setVideoSnippet] = useState("");

    const linkUrlRef = useRef(linkUrl);
    const imageUrlRef = useRef(imageUrl);
    const imageAltRef = useRef(imageAlt);
    const videoSnippetRef = useRef(videoSnippet);
    linkUrlRef.current = linkUrl;
    imageUrlRef.current = imageUrl;
    imageAltRef.current = imageAlt;
    videoSnippetRef.current = videoSnippet;

    const setRootRef = useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        ensureRichTextEditorStyles(node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const emitChange = useCallback(
      (html: string) => {
        lastEmittedRef.current = html;
        setEmpty(isEditorEmpty(html));
        setCodeValue(html);
        onChange?.(html);
      },
      [onChange],
    );

    const syncToolbar = useCallback(() => {
      const editor = editorRef.current;
      setActiveBlock(getActiveBlockType(editor));
      setActiveMarks({
        bold: queryCommandState(editor, "bold"),
        italic: queryCommandState(editor, "italic"),
        underline: queryCommandState(editor, "underline"),
      });
    }, []);

    const captureSelection = useCallback(() => {
      const range = saveSelection(editorRef.current);
      if (range) savedSelectionRef.current = range;
    }, []);

    const withEditor = useCallback(
      (action: (editor: HTMLElement) => void) => {
        if (disabled || codeMode) return;
        const editor = editorRef.current;
        if (!editor) return;
        restoreSelection(editor, savedSelectionRef.current);
        action(editor);
        savedSelectionRef.current = saveSelection(editor);
        emitChange(readEditorHtml(editor));
        syncToolbar();
      },
      [codeMode, disabled, emitChange, syncToolbar],
    );

    const readModalFieldValue = useCallback((heading: string, fallback: string) => {
      const doc = rootRef.current?.ownerDocument ?? document;
      const modal = Array.from(doc.querySelectorAll("s-modal")).find(
        (node) => node.getAttribute("heading") === heading,
      );
      const field = modal?.querySelector("s-text-field, s-text-area, input, textarea") as
        | (HTMLElement & { value?: string })
        | null;
      const live = field?.value?.trim();
      return live || fallback;
    }, []);

    useLayoutEffect(() => {
      ensureRichTextEditorStyles(rootRef.current);
      const editor = editorRef.current;
      if (!editor || codeMode) return;
      if (seededRef.current) return;
      const initial =
        lastEmittedRef.current ||
        (isControlled ? (value ?? "") : defaultValue);
      editor.innerHTML = initial;
      lastEmittedRef.current = initial;
      seededRef.current = true;
      setEmpty(isEditorEmpty(initial));
    }, [codeMode, defaultValue, isControlled, value]);

    useEffect(() => {
      if (!isControlled || codeMode) return;
      if (value === lastEmittedRef.current) return;
      const editor = editorRef.current;
      if (!editor) return;
      editor.innerHTML = value ?? "";
      lastEmittedRef.current = value ?? "";
      setEmpty(isEditorEmpty(value ?? ""));
      setCodeValue(value ?? "");
    }, [codeMode, isControlled, value]);

    useEffect(() => {
      const doc = rootRef.current?.ownerDocument ?? document;
      const onSelectionChange = () => {
        const selection = doc.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const node = selection.anchorNode;
        if (!node || !editorRef.current?.contains(node)) return;
        syncToolbar();
      };
      doc.addEventListener("selectionchange", onSelectionChange);
      return () => doc.removeEventListener("selectionchange", onSelectionChange);
    }, [syncToolbar]);

    const handleInput = () => {
      emitChange(readEditorHtml(editorRef.current));
      syncToolbar();
    };

    const toggleCodeMode = () => {
      if (disabled) return;
      if (codeMode) {
        const html = codeValue;
        seededRef.current = false;
        setCodeMode(false);
        // Surface remounts after code mode; seed on next layout with current HTML.
        lastEmittedRef.current = html;
        emitChange(html);
        return;
      }
      setCodeValue(readEditorHtml(editorRef.current));
      setCodeMode(true);
    };

    const onToolbarMouseDown = (event: ReactMouseEvent) => {
      captureSelection();
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
      ) {
        return;
      }

      // Polaris popovers open via command/--toggle on the activator. Preventing
      // default on those mousedowns stops s-popover from opening — only suppress
      // focus for plain formatting controls that must keep the text selection.
      const host =
        (target.closest("s-button") as HTMLElement | null) ??
        (target.closest("button") as HTMLElement | null);
      if (!host) return;
      if (host.getAttribute("commandfor") || host.getAttribute("commandFor")) {
        return;
      }

      event.preventDefault();
    };

    const shellStyle = {
      ...style,
      ["--rte-min-height" as string]: minHeight,
    } as CSSProperties;

    return (
      <BlockStack gap="small-100">
        {label && !labelHidden ? (
          <Text id={labelId} as="span" variant="bodyMd" fontWeight="medium">
            {label}
          </Text>
        ) : null}

        <div
          ref={setRootRef}
          data-slot="rich-text-editor"
          data-disabled={disabled ? "true" : undefined}
          className={className}
          style={shellStyle}
        >
          <div
            data-slot="rich-text-toolbar"
            role="toolbar"
            aria-label="Formatting"
            onMouseDown={onToolbarMouseDown}
          >
            <div data-slot="rich-text-toolbar-group">
              <ActionList
                items={BLOCK_ITEMS.map((type) => ({
                  content: blockPreview(type),
                  active: activeBlock === type,
                  onAction: () => withEditor((editor) => setBlockType(editor, type)),
                }))}
              >
                <Button
                  variant="tertiary"
                  icon="caret-down"
                  disabled={disabled || codeMode}
                >
                  {BLOCK_LABELS[activeBlock]}
                </Button>
              </ActionList>
            </div>

            <div data-slot="rich-text-toolbar-divider" aria-hidden="true" />

            <div data-slot="rich-text-toolbar-group">
              <span data-slot="rich-text-tool" data-active={activeMarks.bold ? "true" : undefined}>
                <Button
                  variant="tertiary"
                  icon="text-bold"
                  accessibilityLabel="Bold"
                  disabled={disabled || codeMode}
                  onClick={() => withEditor((editor) => runCommand(editor, "bold"))}
                />
              </span>
              <span data-slot="rich-text-tool" data-active={activeMarks.italic ? "true" : undefined}>
                <Button
                  variant="tertiary"
                  icon="text-italic"
                  accessibilityLabel="Italic"
                  disabled={disabled || codeMode}
                  onClick={() => withEditor((editor) => runCommand(editor, "italic"))}
                />
              </span>
              <span
                data-slot="rich-text-tool"
                data-active={activeMarks.underline ? "true" : undefined}
              >
                <Button
                  variant="tertiary"
                  icon="text-underline"
                  accessibilityLabel="Underline"
                  disabled={disabled || codeMode}
                  onClick={() => withEditor((editor) => runCommand(editor, "underline"))}
                />
              </span>
              <Popover>
                <Popover.Trigger>
                  <Button
                    variant="tertiary"
                    icon="text-color"
                    accessibilityLabel="Text color"
                    disabled={disabled || codeMode}
                  />
                </Popover.Trigger>
                <Popover.Content>
                  <div data-slot="rich-text-color-swatches">
                    {TEXT_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        data-slot="rich-text-color-swatch"
                        style={{ ["--swatch-color" as string]: color }}
                        aria-label={`Color ${color}`}
                        onMouseDown={(event) => {
                          captureSelection();
                          event.preventDefault();
                        }}
                        onClick={() => withEditor((editor) => setTextColor(editor, color))}
                      />
                    ))}
                  </div>
                </Popover.Content>
              </Popover>
            </div>

            <div data-slot="rich-text-toolbar-divider" aria-hidden="true" />

            <div data-slot="rich-text-toolbar-group">
              <ActionList
                items={(
                  [
                    ["left", "text-align-left", "Align left"],
                    ["center", "text-align-center", "Align center"],
                    ["right", "text-align-right", "Align right"],
                    ["justify", "text-align-left", "Justify"],
                  ] as const
                ).map(([align, icon, content]) => ({
                  content,
                  icon,
                  onAction: () =>
                    withEditor((editor) => setAlign(editor, align as RichTextAlignType)),
                }))}
              >
                <Button
                  variant="tertiary"
                  icon="text-align-left"
                  accessibilityLabel="Alignment"
                  disabled={disabled || codeMode}
                />
              </ActionList>
            </div>

            <div data-slot="rich-text-toolbar-divider" aria-hidden="true" />

            <div data-slot="rich-text-toolbar-group">
              <Button
                variant="tertiary"
                icon="link"
                accessibilityLabel="Insert link"
                disabled={disabled || codeMode}
                onClick={() => {
                  captureSelection();
                  setLinkOpen(true);
                }}
              />
              <Button
                variant="tertiary"
                icon="image"
                accessibilityLabel="Insert image"
                disabled={disabled || codeMode}
                onClick={() => {
                  captureSelection();
                  setImageOpen(true);
                }}
              />
              <Button
                variant="tertiary"
                icon="play-circle"
                accessibilityLabel="Insert video"
                disabled={disabled || codeMode}
                onClick={() => {
                  captureSelection();
                  setVideoOpen(true);
                }}
              />
              <ActionList
                items={[
                  {
                    content: "Insert 2×2 table",
                    icon: "table",
                    onAction: () => withEditor((editor) => insertTable(editor, 2, 2)),
                  },
                  {
                    content: "Insert 3×3 table",
                    icon: "table",
                    onAction: () => withEditor((editor) => insertTable(editor, 3, 3)),
                  },
                ]}
              >
                <Button
                  variant="tertiary"
                  icon="table"
                  accessibilityLabel="Insert table"
                  disabled={disabled || codeMode}
                />
              </ActionList>
            </div>

            <div data-slot="rich-text-toolbar-divider" aria-hidden="true" />

            <div data-slot="rich-text-toolbar-group">
              <ActionList
                items={[
                  {
                    content: "Bulleted list",
                    icon: "list-bulleted",
                    onAction: () =>
                      withEditor((editor) => runCommand(editor, "insertUnorderedList")),
                  },
                  {
                    content: "Numbered list",
                    icon: "list-numbered",
                    onAction: () =>
                      withEditor((editor) => runCommand(editor, "insertOrderedList")),
                  },
                  {
                    content: "Strikethrough",
                    onAction: () =>
                      withEditor((editor) => runCommand(editor, "strikeThrough")),
                  },
                  {
                    content: "Clear formatting",
                    onAction: () =>
                      withEditor((editor) => runCommand(editor, "removeFormat")),
                  },
                ]}
              >
                <Button
                  variant="tertiary"
                  icon="menu-horizontal"
                  accessibilityLabel="More formatting"
                  disabled={disabled || codeMode}
                />
              </ActionList>
            </div>

            <div data-slot="rich-text-toolbar-spacer" />

            <div data-slot="rich-text-toolbar-group">
              <Button
                variant="tertiary"
                icon="code"
                accessibilityLabel={codeMode ? "Exit HTML view" : "Show HTML"}
                disabled={disabled}
                onClick={toggleCodeMode}
              />
            </div>
          </div>

          {codeMode ? (
            <textarea
              data-slot="rich-text-code"
              aria-labelledby={label ? labelId : undefined}
              aria-label={label ? undefined : "HTML source"}
              disabled={disabled}
              value={codeValue}
              name={name}
              onChange={(event) => {
                const next = event.target.value;
                setCodeValue(next);
                emitChange(next);
              }}
            />
          ) : (
            <div
              ref={editorRef}
              id={editorId}
              data-slot="rich-text-surface"
              data-empty={empty ? "true" : undefined}
              data-placeholder={placeholder}
              contentEditable={!disabled}
              suppressContentEditableWarning
              role="textbox"
              aria-multiline="true"
              aria-labelledby={label ? labelId : undefined}
              aria-label={label ? undefined : "Rich text editor"}
              aria-disabled={disabled || undefined}
              onInput={handleInput}
              onBlur={handleInput}
              onKeyUp={syncToolbar}
              onMouseUp={syncToolbar}
            />
          )}

          {name && !codeMode ? (
            <input type="hidden" name={name} value={lastEmittedRef.current} readOnly />
          ) : null}
        </div>

        <Modal
          open={linkOpen}
          onClose={() => setLinkOpen(false)}
          title="Insert link"
          primaryAction={{
            content: "Insert link",
            onAction: () => {
              const href = readModalFieldValue("Insert link", linkUrlRef.current);
              setLinkOpen(false);
              setLinkUrl("https://");
              // Apply after the modal releases focus — execCommand needs the editor focused.
              window.setTimeout(() => {
                withEditor((editor) => insertLink(editor, href));
              }, 0);
            },
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => setLinkOpen(false),
            },
          ]}
        >
          <TextField
            label="Link URL"
            value={linkUrl}
            onChange={(next) => setLinkUrl(next)}
            autoComplete="off"
          />
        </Modal>

        <Modal
          open={imageOpen}
          onClose={() => setImageOpen(false)}
          title="Insert image"
          primaryAction={{
            content: "Insert image",
            onAction: () => {
              const src = readModalFieldValue("Insert image", imageUrlRef.current);
              const alt = imageAltRef.current;
              setImageOpen(false);
              setImageUrl("https://");
              setImageAlt("");
              window.setTimeout(() => {
                withEditor((editor) => insertImage(editor, src, alt));
              }, 0);
            },
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => setImageOpen(false),
            },
          ]}
        >
          <BlockStack gap="base">
            <TextField
              label="Image URL"
              value={imageUrl}
              onChange={(next) => setImageUrl(next)}
              autoComplete="off"
            />
            <TextField
              label="Alt text"
              value={imageAlt}
              onChange={(next) => setImageAlt(next)}
              autoComplete="off"
            />
          </BlockStack>
        </Modal>

        <Modal
          open={videoOpen}
          onClose={() => setVideoOpen(false)}
          title="Insert video"
          primaryAction={{
            content: "Insert video",
            onAction: () => {
              const snippet = readModalFieldValue(
                "Insert video",
                videoSnippetRef.current,
              );
              setVideoOpen(false);
              setVideoSnippet("");
              window.setTimeout(() => {
                withEditor((editor) => insertVideoEmbed(editor, snippet));
              }, 0);
            },
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => setVideoOpen(false),
            },
          ]}
        >
          <BlockStack gap="small-100">
            <Text>Insert a video by pasting the embed snippet in the box below.</Text>
            <TextField
              label="Embed snippet"
              multiline={4}
              value={videoSnippet}
              onChange={(next) => setVideoSnippet(next)}
              placeholder={'<iframe src="…"></iframe>'}
              helpText="The embed snippet usually starts with '<iframe …'"
              autoComplete="off"
            />
          </BlockStack>
        </Modal>
      </BlockStack>
    );
  },
);
