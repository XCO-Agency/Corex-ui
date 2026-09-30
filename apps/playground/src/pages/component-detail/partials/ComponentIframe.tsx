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

  const setupIframe = React.useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc || !doc.body) return;

    // 1. Ensure <base> tag exists for relative assets
    if (!doc.querySelector("base")) {
      const base = doc.createElement("base");
      base.href = `${window.location.origin}/`;
      doc.head.prepend(base);
    }

    // 2. Ensure Inter font stylesheet
    if (!doc.querySelector('link[href*="fonts.googleapis.com"]')) {
      const fontLink = doc.createElement("link");
      fontLink.rel = "stylesheet";
      fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
      doc.head.appendChild(fontLink);
    }

    // 3. Ensure Shopify Polaris Web Components script is loaded
    if (!doc.querySelector('script[src*="polaris-2.0-rc.js"]')) {
      const polarisScript = doc.createElement("script");
      polarisScript.src = `${window.location.origin}/polaris-2.0-rc.js`;
      polarisScript.async = true;
      doc.head.appendChild(polarisScript);
    }

    // 4. Ensure base preview styles
    if (!doc.getElementById("preview-base-styles")) {
      const style = doc.createElement("style");
      style.id = "preview-base-styles";
      style.textContent = `
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
      `;
      doc.head.appendChild(style);
    }

    // 5. Sync parent styles into iframe head (Vite styles, Corex UI stylesheets)
    const parentStyles = document.querySelectorAll("style, link[rel='stylesheet']");
    parentStyles.forEach((el, index) => {
      if (el.tagName === "LINK") {
        const linkEl = el as HTMLLinkElement;
        const href = linkEl.href;
        if (href.includes("fonts.googleapis.com")) return;
        if (doc.querySelector(`link[href="${href}"]`)) return;
        const link = doc.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        if (linkEl.crossOrigin) link.crossOrigin = linkEl.crossOrigin;
        doc.head.appendChild(link);
      } else if (el.tagName === "STYLE") {
        const viteId = el.getAttribute("data-vite-dev-id");
        const key = viteId || `parent-style-${index}`;
        if (doc.querySelector(`style[data-synced-style="${key}"]`)) return;
        const style = doc.createElement("style");
        style.setAttribute("data-synced-style", key);
        if (viteId) style.setAttribute("data-vite-dev-id", viteId);
        style.textContent = el.textContent;
        doc.head.appendChild(style);
      }
    });

    // 6. Sync dark mode class
    const isDark = document.documentElement.classList.contains("dark");
    doc.documentElement.classList.toggle("dark", isDark);

    // 7. Ensure #preview-root exists in iframe body
    let root = doc.getElementById("preview-root");
    if (!root) {
      root = doc.createElement("div");
      root.id = "preview-root";
      doc.body.appendChild(root);
    }

    // 8. Set mount node for React portal
    setMountNode(root);
  }, []);

  React.useEffect(() => {
    setupIframe();

    const iframe = iframeRef.current;
    if (!iframe) return;

    iframe.addEventListener("load", setupIframe);
    return () => {
      iframe.removeEventListener("load", setupIframe);
    };
  }, [setupIframe]);

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

    // Trigger updates after short delays to account for custom element upgrade rendering
    const timer1 = setTimeout(updateHeight, 150);
    const timer2 = setTimeout(updateHeight, 400);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [mountNode]);

  return (
    <iframe
      ref={iframeRef}
      onLoad={setupIframe}
      title="Component Preview"
      className={cn(className, "w-full border-0 bg-transparent transition-all")}
      style={{ minHeight: "460px", display: "block" }}
    >
      {mountNode ? createPortal(children, mountNode) : null}
    </iframe>
  );
}
