import * as React from "react";
import { createPortal } from "react-dom";
import { syncStyles } from "@/pages/component-detail/partials/ComponentIframe";

const FRAME_DOCUMENT = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <base href="${window.location.origin}/" />
    <script src="/polaris-2.0-rc.js"></script>
  </head>
  <body><div id="editor-root"></div></body>
</html>`;

/*
 * Appended after the synced app styles so it wins over them. While editing,
 * component internals ignore the pointer: clicks and drags land on the node
 * wrappers instead of on buttons, inputs or links inside them.
 */
const EDITOR_CSS = `
html, body { margin: 0; height: 100%; background: transparent; }
body {
  color: #303030;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}
/*
 * The canvas root renders a fragment. While editing, its wrapper fills the frame
 * (100vh is the iframe's height) so empty space below the last element takes drops;
 * Preview keeps plain block flow.
 */
#editor-root { display: flow-root; min-height: 100%; }
[data-cx-editing] { display: flex; flex-direction: column; min-height: 100vh; }
[data-cx-editing] [data-cx-node="root"] { flex: 1 0 auto; display: flow-root; }
[data-cx-editing] [data-cx-node] * { pointer-events: none; }
[data-cx-editing] [data-cx-node] { pointer-events: auto; min-width: 0; cursor: default; }
[data-cx-editing] [data-cx-node] > s-section { height: 100%; }
[data-cx-dragging] [data-cx-node] { cursor: copy; }
[data-cx-empty] {
  display: flex; align-items: center; justify-content: center;
  min-height: 64px; padding: 12px;
  border: 1px dashed rgba(48, 48, 48, 0.25); border-radius: 10px;
  background: rgba(255, 255, 255, 0.55);
  color: rgba(48, 48, 48, 0.55); font-size: 12px;
}
[data-cx-empty][data-cx-root-empty] { min-height: 320px; flex-direction: column; gap: 6px; }
[data-cx-editing] [data-cx-node]:not([data-cx-node="root"]) { position: relative; }
[data-cx-chip] {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px; border-radius: 999px;
  border: 1px dashed rgba(48, 48, 48, 0.3); background: rgba(255, 255, 255, 0.8);
  color: rgba(48, 48, 48, 0.7); font-size: 11px; font-weight: 500;
}
[data-cx-broken] {
  padding: 8px 12px; border-radius: 8px; font-size: 12px;
  background: #fff1f0; color: #8e1f0b; border: 1px solid #fdb4a6;
}
`;

export type FrameContextType = { doc: Document; win: Window };

const FrameContext = React.createContext<FrameContextType | null>(null);

export const useFrame = () => React.useContext(FrameContext);

export type EditorFramePropsType = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onReady?: (frame: FrameContextType) => void;
};

/**
 * An iframe that loads the real Polaris script and portals React into it, so
 * canvas components render exactly as they do in an embedded app.
 */
export function EditorFrame({
  children,
  className,
  style,
  onReady,
}: EditorFramePropsType) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [frame, setFrame] = React.useState<
    (FrameContextType & { mount: HTMLElement }) | null
  >(null);
  const onReadyRef = React.useRef(onReady);
  onReadyRef.current = onReady;

  React.useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    let cancelled = false;

    const setup = async () => {
      const doc = iframe.contentDocument;
      const win = iframe.contentWindow;
      if (!doc || !win) return;

      if (!doc.getElementById("editor-root")) {
        doc.open();
        doc.write(FRAME_DOCUMENT);
        doc.close();
      }
      if (doc.readyState !== "complete") {
        await new Promise<void>((resolve) =>
          iframe.addEventListener("load", () => resolve(), { once: true }),
        );
      }
      if (cancelled) return;

      syncStyles(doc);
      const editorStyle = doc.createElement("style");
      editorStyle.textContent = EDITOR_CSS;
      doc.head.appendChild(editorStyle);

      await win.customElements.whenDefined("s-button");
      if (cancelled) return;

      const mount = doc.getElementById("editor-root")!;
      setFrame({ doc, win, mount });
      onReadyRef.current?.({ doc, win });
    };

    setup();
    return () => {
      cancelled = true;
    };
  }, []);

  const context = React.useMemo(
    () => (frame ? { doc: frame.doc, win: frame.win } : null),
    [frame],
  );

  return (
    <iframe
      ref={iframeRef}
      title="Editor canvas"
      className={className}
      style={{
        display: "block",
        border: 0,
        padding: 8,
        margin: 0,
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      {frame && context
        ? createPortal(
            <FrameContext.Provider value={context}>{children}</FrameContext.Provider>,
            frame.mount,
          )
        : null}
    </iframe>
  );
}
