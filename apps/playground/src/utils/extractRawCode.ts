/**
 * Extracts and formats clean, readable raw code from a rendered DOM container.
 */

export type CodeFormatType = "html" | "jsx";

const TAG_TO_REACT: Record<string, string> = {
  "s-stack": "InlineStack", // contextual: InlineStack if direction="inline", BlockStack if direction="block"
  "s-button": "Button",
  "s-button-group": "ButtonGroup",
  "s-box": "Box",
  "s-section": "Card",
  "s-badge": "Badge",
  "s-banner": "Banner",
  "s-text": "Text",
  "s-heading": "Text",
  "s-link": "Link",
  "s-icon": "Icon",
  "s-menu": "Menu",
  "s-divider": "Divider",
  "s-avatar": "Avatar",
  "s-thumbnail": "Thumbnail",
  "s-spinner": "Spinner",
  "s-checkbox": "Checkbox",
  "s-select": "Select",
  "s-text-field": "TextField",
  "s-date-field": "DateField",
  "s-date-picker": "DatePicker",
  "s-choice-list": "ChoiceList",
  "s-modal": "Modal",
  "s-page": "Page",
  "s-tooltip": "Tooltip",
  "s-tabs": "Tabs",
};

/**
 * Formats a DOM element and its children into indented raw HTML code.
 */
export function extractRawCode(container: HTMLElement | null, format: CodeFormatType = "html"): string {
  if (!container) return "";

  const children = Array.from(container.children) as HTMLElement[];
  if (children.length === 0) {
    return container.innerHTML.trim();
  }

  function serializeElement(el: HTMLElement, indent: number): string {
    const spaces = "  ".repeat(indent);
    const rawTag = el.tagName.toLowerCase();

    let tag = rawTag;
    const attributes: Array<{ name: string; value: string | true }> = [];

    // Check direction for s-stack to determine React component
    const hasInline = el.getAttribute("direction") === "inline";
    const hasBlock = el.getAttribute("direction") === "block";

    if (format === "jsx") {
      if (rawTag === "s-stack") {
        tag = hasInline ? "InlineStack" : hasBlock ? "BlockStack" : "Stack";
      } else {
        tag = TAG_TO_REACT[rawTag] ?? rawTag;
      }
    }

    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      const name = attr.name;
      const value = attr.value;

      // Skip internal / noise attributes
      if (name.startsWith("data-react") || name === "data-stub-open") {
        continue;
      }
      if (format === "jsx" && rawTag === "s-stack" && name === "direction") {
        // Handled by InlineStack / BlockStack component tag
        continue;
      }
      if (value === "" && name === "class") {
        continue;
      }
      if (value === "" && name === "style") {
        continue;
      }

      // Boolean attribute or string attribute
      if (value === "" || value === name) {
        attributes.push({ name, value: true });
      } else {
        attributes.push({ name, value });
      }
    }

    const attrString = attributes.length
      ? " " +
        attributes
          .map((a) => (a.value === true ? a.name : `${a.name}="${a.value}"`))
          .join(" ")
      : "";

    // Slotted / light DOM children
    const childNodes = Array.from(el.childNodes).filter((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        return Boolean(child.textContent?.trim());
      }
      return child.nodeType === Node.ELEMENT_NODE;
    });

    if (childNodes.length === 0) {
      return `${spaces}<${tag}${attrString} />`;
    }

    // If single text child, inline it
    if (childNodes.length === 1 && childNodes[0].nodeType === Node.TEXT_NODE) {
      const text = childNodes[0].textContent?.trim() ?? "";
      return `${spaces}<${tag}${attrString}>${text}</${tag}>`;
    }

    const childStrings = childNodes
      .map((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent?.trim();
          return text ? `${spaces}  ${text}` : "";
        }
        return serializeElement(child as HTMLElement, indent + 1);
      })
      .filter(Boolean)
      .join("\n");

    return `${spaces}<${tag}${attrString}>\n${childStrings}\n${spaces}</${tag}>`;
  }

  return children.map((child) => serializeElement(child, 0)).join("\n");
}
