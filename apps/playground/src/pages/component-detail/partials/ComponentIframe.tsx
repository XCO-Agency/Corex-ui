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

    const setupIframe = () => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      // Only initialize document structure once
      if (!doc.getElementById("preview-root")) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <base href="${window.location.origin}/" />
              <!-- Shopify Polaris Web Components CDN -->
              <script src="https://cdn.shopify.com/shopifycloud/polaris-1.js"></script>
              <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
              <style>
                *, *::before, *::after {
                  box-sizing: border-box;
                }
                html, body {
                  margin: 0;
                  padding: 0;
                  width: 100%;
                  min-height: 100%;
                  background: transparent;
                  font-family: Inter, -apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, Helvetica, sans-serif;
                  -webkit-font-smoothing: antialiased;
                }
                body {
                  min-height: 240px;
                  padding: 20px;
                  color: #202223;
                  box-sizing: border-box;
                }
                html.dark body {
                  color: #f6f6f7;
                }
                #preview-root {
                  width: 100%;
                  min-height: 200px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                /* Do not flex-center full-width page layouts */
                #preview-root:has(s-page) {
                  display: block;
                  padding: 0;
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
            </head>
            <body>
              <div id="preview-root"></div>
            </body>
          </html>
        `);
        doc.close();
      }

      // Sync styles from parent document into iframe head
      const parentStyles = document.querySelectorAll("style, link[rel='stylesheet']");
      parentStyles.forEach((el) => {
        if (el.tagName === "LINK") {
          const href = (el as HTMLLinkElement).href;
          if (href.includes("fonts.googleapis.com")) return;
          if (doc.querySelector(`link[href="${href}"]`)) return;
          const link = doc.createElement("link");
          link.rel = "stylesheet";
          link.href = href;
          doc.head.appendChild(link);
        } else if (el.tagName === "STYLE") {
          const viteId = el.getAttribute("data-vite-dev-id");
          if (viteId && doc.querySelector(`style[data-vite-dev-id="${viteId}"]`)) return;
          const style = doc.createElement("style");
          if (viteId) style.setAttribute("data-vite-dev-id", viteId);
          style.textContent = el.textContent;
          doc.head.appendChild(style);
        }
      });

      // Sync dark mode class
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark) {
        doc.documentElement.classList.add("dark");
      } else {
        doc.documentElement.classList.remove("dark");
      }

      const root = doc.getElementById("preview-root");
      const win = iframe.contentWindow;
      if (root && win) {
        if (win.customElements?.whenDefined) {
          Promise.all([
            win.customElements.whenDefined("s-button"),
            win.customElements.whenDefined("s-page"),
          ])
            .then(() => {
              setMountNode(root);
            })
            .catch(() => {
              setMountNode(root);
            });
        } else {
          setMountNode(root);
        }
      }
    };

    if (iframe.contentDocument?.readyState === "complete") {
      setupIframe();
    } else {
      iframe.addEventListener("load", setupIframe, { once: true });
    }
  }, []);

  // Synchronize dark mode changes dynamically
  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;
      const isDark = document.documentElement.classList.contains("dark");
      doc.documentElement.classList.toggle("dark", isDark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Automatically adjust iframe height to fit children without scrollbars
  React.useEffect(() => {
    if (!mountNode || !iframeRef.current) return;

    const updateHeight = () => {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentDocument) return;
      const doc = iframe.contentDocument;
      const body = doc.body;
      const root = doc.getElementById("preview-root");
      if (!body || !root) return;

      const contentHeight = Math.max(240, root.scrollHeight + 48);
      iframe.style.height = `${contentHeight}px`;
    };

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(mountNode);
    updateHeight();

    return () => resizeObserver.disconnect();
  }, [mountNode]);

  return (
    <iframe
      ref={iframeRef}
      title="Component Preview"
      className={className ?? "w-full border-0 bg-transparent transition-all"}
      style={{ minHeight: "460px", display: "block" }}
    >
      {mountNode ? createPortal(children, mountNode) : null}
    </iframe>
  );
}
