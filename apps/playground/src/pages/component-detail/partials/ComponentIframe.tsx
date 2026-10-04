import { cn } from "@/lib/utils";
import * as React from "react";
import { createPortal } from "react-dom";

export type ComponentIframePropsType = {
  children: React.ReactNode;
  className?: string;
};

export function ComponentIframe({ children, className }: ComponentIframePropsType) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let cancelled = false;

    const setup = async () => {
      const doc = iframe.contentDocument;
      const win = iframe.contentWindow;

      if (!doc || !win) return;
      {
        /* <script src="https://cdn.shopify.com/shopifycloud/polaris-2.0-rc.js"></script> */
      }
      /*
       * Create the iframe document once.
       */
      if (!doc.getElementById("preview-root")) {
        doc.open();

        doc.write(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />

              <base href="${window.location.origin}/" />

              <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
              />

              <style>
                *,
                *::before,
                *::after {
                  box-sizing: border-box;
                }

                html,
                body {
                  margin: 0;
                  padding: 0;
                  width: 100%;
                  min-height: 100%;
                  background: transparent;
                }

                body {
                  min-height: 160px;
                  padding: 24px;
                  color: #202223;
                  font-family:
                    Inter,
                    -apple-system,
                    BlinkMacSystemFont,
                    "San Francisco",
                    "Segoe UI",
                    Roboto,
                    Helvetica,
                    Arial,
                    sans-serif;
                  -webkit-font-smoothing: antialiased;
                }

                html.dark body {
                  color: #f6f6f7;
                }

                #preview-root {
                  width: 100%;
                }

                #preview-root:empty {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }

                s-page {
                  display: block;
                  width: 100%;
                }

                @keyframes spin {
                  to {
                    transform: rotate(360deg);
                  }
                }

                @keyframes shimmer {
                  0% {
                    background-position: 260% 0;
                  }

                  100% {
                    background-position: -260% 0;
                  }
                }

                @keyframes scanPulse {
                  0% {
                    transform: scale(0.65);
                    opacity: 0.55;
                  }

                  100% {
                    transform: scale(1.35);
                    opacity: 0;
                  }
                }

                @keyframes swatchPop {
                  0% {
                    transform: scale(1);
                  }

                  40% {
                    transform: scale(1.08);
                  }

                  100% {
                    transform: scale(1);
                  }
                }
              </style>

              <script
                src="/polaris-2.0-rc.js"
              ></script>
            </head>

            <body>
              <div id="preview-root"></div>
            </body>
          </html>
        `);

        doc.close();
      }

      /*
       * Wait until the iframe document has finished loading.
       */
      if (doc.readyState !== "complete") {
        await new Promise<void>((resolve) => {
          const onLoad = () => {
            iframe.removeEventListener("load", onLoad);
            resolve();
          };

          iframe.addEventListener("load", onLoad, { once: true });
        });
      }

      if (cancelled) return;

      /*
       * Sync styles from parent → iframe.
       */
      syncStyles(doc);

      /*
       * Sync theme.
       */
      syncTheme(doc);

      /*
       * Wait for Polaris itself.
       *
       * s-button is used as a Polaris bootstrap signal,
       * but we don't mount until it is actually defined.
       */
      await win.customElements.whenDefined("s-button");

      if (cancelled) return;

      /*
       * Now the iframe has Polaris available.
       */
      const root = doc.getElementById("preview-root");

      if (root) {
        setMountNode(root);
      }
    };

    setup();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Sync theme changes.
   */
  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;

      syncTheme(doc);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  /*
   * Resize iframe after React/Polaris renders.
   */
  React.useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !mountNode) return;

    const updateHeight = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      const root = doc.getElementById("preview-root");
      if (!root) return;

      // Body padding is 24px on each side. `body.scrollHeight` is left out: the
      // body has `min-height: 100%`, so it would pin the iframe at its current size.
      const height = Math.max(160, root.scrollHeight + 48);

      iframe.style.height = `${height}px`;
    };

    const resizeObserver = new ResizeObserver(updateHeight);

    resizeObserver.observe(mountNode);

    const mutationObserver = new MutationObserver(updateHeight);

    mutationObserver.observe(mountNode, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    updateHeight();

    const timer = window.setTimeout(updateHeight, 100);

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.clearTimeout(timer);
    };
  }, [mountNode]);

  return (
    <iframe
      ref={iframeRef}
      title="Component Preview"
      className={cn("w-full border-0 bg-transparent", className)}
      style={{
        minHeight: "160px",
        display: "block",
      }}
    >
      {mountNode ? createPortal(children, mountNode) : null}
    </iframe>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function syncTheme(doc: Document) {
  const isDark = document.documentElement.classList.contains("dark");

  doc.documentElement.classList.toggle("dark", isDark);
}

function syncStyles(doc: Document) {
  const parentStyles = document.querySelectorAll("style, link[rel='stylesheet']");

  parentStyles.forEach((el) => {
    if (el.tagName === "LINK") {
      const link = el as HTMLLinkElement;
      const href = link.href;

      if (!href || href.includes("fonts.googleapis.com")) {
        return;
      }

      if (doc.querySelector(`link[data-parent-style="${CSS.escape(href)}"]`)) {
        return;
      }

      const cloned = doc.createElement("link");

      cloned.rel = "stylesheet";
      cloned.href = href;
      cloned.dataset.parentStyle = href;

      doc.head.appendChild(cloned);

      return;
    }

    const style = el as HTMLStyleElement;

    const viteId = style.getAttribute("data-vite-dev-id");

    if (viteId && doc.querySelector(`style[data-vite-dev-id="${CSS.escape(viteId)}"]`)) {
      return;
    }

    const cloned = doc.createElement("style");

    if (viteId) {
      cloned.setAttribute("data-vite-dev-id", viteId);
    }

    cloned.textContent = style.textContent;

    doc.head.appendChild(cloned);
  });
}
