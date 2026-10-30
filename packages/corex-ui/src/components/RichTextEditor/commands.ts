import type { RichTextAlignType, RichTextBlockType } from "./RichTextEditor.types";

const BLOCK_TAG: Record<RichTextBlockType, string> = {
  paragraph: "p",
  heading1: "h1",
  heading2: "h2",
  heading3: "h3",
  heading4: "h4",
  heading5: "h5",
  heading6: "h6",
  blockquote: "blockquote",
};

export const BLOCK_LABELS: Record<RichTextBlockType, string> = {
  paragraph: "Paragraph",
  heading1: "Heading 1",
  heading2: "Heading 2",
  heading3: "Heading 3",
  heading4: "Heading 4",
  heading5: "Heading 5",
  heading6: "Heading 6",
  blockquote: "Blockquote",
};

export const TEXT_COLORS = [
  "#000000",
  "#303030",
  "#6d7175",
  "#ffffff",
  "#d72c0d",
  "#b98900",
  "#108043",
  "#005bd3",
  "#5c6ac4",
  "#9c6ade",
] as const;

function docOf(editor: HTMLElement | null): Document {
  return editor?.ownerDocument ?? document;
}

export function focusEditor(editor: HTMLElement | null) {
  editor?.focus({ preventScroll: true });
}

/** Snapshot the current selection inside the editor (survives toolbar focus). */
export function saveSelection(editor: HTMLElement | null): Range | null {
  if (!editor) return null;
  const selection = docOf(editor).getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return null;
  return range.cloneRange();
}

export function restoreSelection(editor: HTMLElement | null, range: Range | null) {
  if (!editor) return;
  focusEditor(editor);
  const selection = docOf(editor).getSelection();
  if (!selection) return;

  if (range) {
    try {
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    } catch {
      // Range may be detached after a remount — fall through to caret-at-end.
    }
  }

  const fallback = docOf(editor).createRange();
  fallback.selectNodeContents(editor);
  fallback.collapse(false);
  selection.removeAllRanges();
  selection.addRange(fallback);
}

/**
 * Run a contentEditable command against the editor's document.
 * Important: playground previews (and many hosts) mount inside an iframe —
 * `document.execCommand` on the parent page is a no-op.
 */
export function runCommand(
  editor: HTMLElement | null,
  command: string,
  value?: string,
): boolean {
  if (!editor) return false;
  try {
    focusEditor(editor);
    return docOf(editor).execCommand(command, false, value);
  } catch {
    return false;
  }
}

export function queryCommandState(editor: HTMLElement | null, command: string): boolean {
  if (!editor) return false;
  try {
    return docOf(editor).queryCommandState(command);
  } catch {
    return false;
  }
}

export function setBlockType(editor: HTMLElement | null, type: RichTextBlockType) {
  const tag = BLOCK_TAG[type];
  // Prefer bracketed form — more consistent across engines.
  if (!runCommand(editor, "formatBlock", `<${tag}>`)) {
    runCommand(editor, "formatBlock", tag);
  }
}

export function setAlign(editor: HTMLElement | null, align: RichTextAlignType) {
  const map: Record<RichTextAlignType, string> = {
    left: "justifyLeft",
    center: "justifyCenter",
    right: "justifyRight",
    justify: "justifyFull",
  };
  runCommand(editor, map[align]);
}

export function setTextColor(editor: HTMLElement | null, color: string) {
  runCommand(editor, "foreColor", color);
}

export function insertHtml(editor: HTMLElement | null, html: string) {
  if (!runCommand(editor, "insertHTML", html)) {
    runCommand(editor, "insertText", html.replace(/<[^>]+>/g, ""));
  }
}

export function insertLink(editor: HTMLElement | null, url: string) {
  const href = url.trim();
  if (!href || href === "https://" || href === "http://") return;
  const safeHref = href.replace(/"/g, "&quot;");

  const selection = docOf(editor).getSelection();
  const selectedText = selection?.toString() ?? "";
  const hasText = !!selection && !selection.isCollapsed && selectedText.trim().length > 0;

  if (!hasText) {
    insertHtml(
      editor,
      `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${safeHref}</a>`,
    );
    return;
  }

  if (runCommand(editor, "createLink", href)) return;

  // Fallback when createLink is unavailable or the selection was lost.
  insertHtml(
    editor,
    `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${selectedText.replace(
      /</g,
      "&lt;",
    )}</a>`,
  );
}

export function insertImage(editor: HTMLElement | null, url: string, alt = "") {
  const src = url.trim();
  if (!src || src === "https://" || src === "http://") return;
  const safeAlt = alt.replace(/"/g, "&quot;");
  insertHtml(
    editor,
    `<img src="${src.replace(/"/g, "&quot;")}" alt="${safeAlt}" />`,
  );
}

/** Accepts a full iframe embed snippet or a bare URL and inserts a video embed. */
export function insertVideoEmbed(editor: HTMLElement | null, snippetOrUrl: string) {
  const raw = snippetOrUrl.trim();
  if (!raw) return;

  const iframeMatch = raw.match(/<iframe[\s\S]*?<\/iframe>/i);
  if (iframeMatch) {
    insertHtml(editor, `<div data-rte-video>${iframeMatch[0]}</div>`);
    return;
  }

  const src = raw.replace(/"/g, "&quot;");
  insertHtml(
    editor,
    `<div data-rte-video><iframe src="${src}" title="Embedded video" width="560" height="315" allowfullscreen loading="lazy"></iframe></div>`,
  );
}

export function insertTable(editor: HTMLElement | null, rows = 2, cols = 2) {
  const cells = Array.from({ length: cols }, () => "<td><br/></td>").join("");
  const body = Array.from({ length: rows }, () => `<tr>${cells}</tr>`).join("");
  insertHtml(editor, `<table><tbody>${body}</tbody></table><p><br/></p>`);
}

export function getActiveBlockType(editor: HTMLElement | null): RichTextBlockType {
  if (!editor) return "paragraph";
  const selection = docOf(editor).getSelection();
  if (!selection || selection.rangeCount === 0) return "paragraph";

  let node: Node | null = selection.anchorNode;
  if (node?.nodeType === Node.TEXT_NODE) node = node.parentElement;
  while (node && node !== editor) {
    if (node instanceof HTMLElement) {
      const tag = node.tagName.toLowerCase();
      if (tag === "h1") return "heading1";
      if (tag === "h2") return "heading2";
      if (tag === "h3") return "heading3";
      if (tag === "h4") return "heading4";
      if (tag === "h5") return "heading5";
      if (tag === "h6") return "heading6";
      if (tag === "blockquote") return "blockquote";
      if (tag === "p") return "paragraph";
    }
    node = node.parentNode;
  }
  return "paragraph";
}

export function isEditorEmpty(html: string): boolean {
  const normalized = html
    .replace(/&nbsp;/gi, " ")
    .replace(/<br\s*\/?>/gi, "")
    .replace(/<div><\/div>/gi, "")
    .replace(/<p><\/p>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
  return normalized.length === 0;
}

export function readEditorHtml(editor: HTMLElement | null): string {
  if (!editor) return "";
  return editor.innerHTML;
}
