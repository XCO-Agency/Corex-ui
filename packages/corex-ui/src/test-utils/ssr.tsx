import type { ReactElement } from "react";
import { act } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot, type Root } from "react-dom/client";
import { vi } from "vitest";

export type HydrationResultType = {
  container: HTMLElement;
  root: Root;
  /** Every console.error / console.warn call made while hydrating. */
  messages: string[];
  unmount: () => void;
};

/**
 * Renders `serverElement` to HTML the way an SSR framework would, puts that
 * HTML in the document, then hydrates it with `clientElement` (the same tree
 * unless the test needs the client to differ, e.g. another timezone).
 *
 * `beforeHydrate` runs between the two, for switching environment state such
 * as the mocked clock or timezone.
 */
export function renderAndHydrate(
  serverElement: ReactElement,
  options: { clientElement?: ReactElement; beforeHydrate?: () => void } = {},
): HydrationResultType {
  const html = renderToString(serverElement);
  // Parsed in a separate document and kept detached, so the `s-*` elements
  // stay un-upgraded, as they are before the Polaris script runs. The jsdom
  // stubs in `registerPolarisStubs` render into light DOM (the real elements
  // use shadow DOM), which would change the server markup before React
  // compares it.
  const parsed = document.implementation.createHTMLDocument("");
  parsed.body.innerHTML = html;
  const container = document.createElement("div");
  const nodes = Array.from(parsed.body.childNodes);
  container.append(...nodes.map((node) => document.adoptNode(node)));

  options.beforeHydrate?.();

  const messages: string[] = [];
  const record = (...args: unknown[]) => {
    messages.push(args.map(String).join(" "));
  };
  const errorSpy = vi.spyOn(console, "error").mockImplementation(record);
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(record);

  let root!: Root;
  try {
    act(() => {
      root = hydrateRoot(container, options.clientElement ?? serverElement, {
        onRecoverableError: (error) => record(error),
      });
    });
  } finally {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  }

  return {
    container,
    root,
    messages,
    unmount: () => {
      act(() => root.unmount());
    },
  };
}
