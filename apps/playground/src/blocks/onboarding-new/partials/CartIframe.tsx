import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Box } from "@xco-agency/corex-ui";
import type { BrandColorsType, CartPresetIdType } from "../types";
import { CartDrawerContent } from "./CartDrawerContent";
import styles from "../cart-variants.module.css";

export interface CartIframePropsType {
  preset: CartPresetIdType;
  brand: BrandColorsType;
  currency?: string;
  mode?: "preview" | "full";
  interactive?: boolean;
  onClose?: () => void;
}

export function CartIframe({
  preset,
  brand,
  currency = "MAD",
  mode = "preview",
  interactive = mode === "full",
  onClose,
}: CartIframePropsType) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scaleWrapperRef = useRef<HTMLDivElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  // Initialize iframe document and synchronize stylesheet tags from host document
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const setupIframe = () => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      if (!doc.getElementById("cart-root")) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
              <base href="${typeof window !== "undefined" ? window.location.origin : ""}/" />
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
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
                  -webkit-font-smoothing: antialiased;
                  overflow-x: hidden;
                }
                /* Custom slim scrollbar */
                ::-webkit-scrollbar {
                  width: 5px;
                }
                ::-webkit-scrollbar-track {
                  background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                  background: rgba(0, 0, 0, 0.15);
                  border-radius: 999px;
                }
                ::-webkit-scrollbar-thumb:hover {
                  background: rgba(0, 0, 0, 0.25);
                }
              </style>
            </head>
            <body>
              <div id="cart-root" style="width: 100%; min-height: 100%;"></div>
            </body>
          </html>
        `);
        doc.close();
      }

      // Sync existing host styles into iframe
      const syncStyles = () => {
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
      };

      syncStyles();

      // Mirror new styles dynamically (HMR or asynchronous CSS)
      const observer = new MutationObserver(() => syncStyles());
      observer.observe(document.head, { childList: true, subtree: true });

      const root = doc.getElementById("cart-root");
      if (root) {
        setMountNode(root);
      }
    };

    if (iframe.contentDocument?.readyState === "complete") {
      setupIframe();
    } else {
      iframe.addEventListener("load", setupIframe, { once: true });
    }
  }, []);

  // Compute responsive miniature scale for preview mode based on card container width
  useEffect(() => {
    if (mode !== "preview") return;
    const updateScale = () => {
      if (containerRef.current && scaleWrapperRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        if (containerWidth > 0) {
          // Internal virtual mobile viewport is 380px
          const calculatedScale = Math.min(0.55, Math.max(0.38, containerWidth / 380));
          scaleWrapperRef.current.style.setProperty(
            "--preview-scale",
            String(calculatedScale),
          );
        }
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [mode]);

  if (mode === "preview") {
    return (
      <Box
        position="relative"
        inlineSize="100%"
        className={styles.miniPhoneContainer}
      >
        <Box
          position="relative"
          className={`${styles.miniPhoneChassis} ${
            preset === "bold" ? styles.miniPhoneChassisBold : ""
          }`}
        >
          <Box className={styles.miniPhoneSpeaker} />
          <Box className={styles.miniPhoneScreen}>
            <iframe
              ref={iframeRef}
              title={`Cart Drawer Preview - ${preset}`}
              className={styles.miniPhoneIframe}
              tabIndex={-1}
            />
          </Box>
        </Box>
        {mountNode
          ? createPortal(
              <CartDrawerContent
                preset={preset}
                brand={brand}
                currency={currency}
                interactive={false}
              />,
              mountNode,
            )
          : null}
      </Box>
    );
  }

  // Full-size interactive viewport (for modal)
  return (
    <Box
      inlineSize="100%"
      blockSize="100%"
      position="relative"
      background="transparent"
      overflow="hidden"
    >
      <iframe
        ref={iframeRef}
        title={`Full Cart Drawer Preview - ${preset}`}
        className={styles.fullIframe}
      />
      {mountNode
        ? createPortal(
            <CartDrawerContent
              preset={preset}
              brand={brand}
              currency={currency}
              interactive={interactive}
              onClose={onClose}
            />,
            mountNode,
          )
        : null}
    </Box>
  );
}
