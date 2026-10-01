import { Children, isValidElement } from "react";
import type { ReactNode } from "react";

/**
 * Collects the visible text of a React subtree.
 *
 * Used to derive an accessible name from `children`. A button written as
 * `<Button><Icon type="play" /> Resume</Button>` has *array* children, so a
 * `typeof children === "string"` check misses the label entirely and the button
 * ends up announcing a generated placeholder instead of "Resume".
 *
 * Only strings and numbers contribute; elements are walked through their own
 * `children`. Function components are not invoked, so a label rendered inside
 * one is not visible here.
 */
export function childrenText(children: ReactNode): string {
  const parts: string[] = [];

  const walk = (node: ReactNode): void => {
    if (node === null || node === undefined || typeof node === "boolean") return;
    if (typeof node === "string" || typeof node === "number") {
      parts.push(String(node));
      return;
    }
    if (Array.isArray(node)) {
      Children.toArray(node).forEach(walk);
      return;
    }
    if (isValidElement(node)) {
      walk((node.props as { children?: ReactNode }).children);
    }
  };

  walk(children);

  return parts.join(" ").replace(/\s+/g, " ").trim();
}
