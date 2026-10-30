import * as React from "react";
import { useParams } from "react-router-dom";
import { findEntryBySlug } from "@/data/registry";
import { ComponentIframe } from "@/pages/component-detail/partials/ComponentIframe";

const FRAME_W = 640;
const FRAME_H = 320;
const FRAME_BG = "#ffffff";

/**
 * Minimal chrome-free page used by `scripts/capture-thumbnails.mjs` to
 * screenshot each component's first example for Overview tiles.
 *
 * Fixed 640×320 frame matches the Overview card aspect (~2:1).
 */
export function ThumbnailCapture() {
  const { slug = "" } = useParams();
  const entry = findEntryBySlug(slug);
  const example = entry?.examples[0];
  const [ready, setReady] = React.useState(false);
  const hostRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setReady(false);
    if (!example) return;

    let cancelled = false;
    const started = Date.now();

    const tick = () => {
      if (cancelled) return;
      const iframe = hostRef.current?.querySelector("iframe");
      const root = iframe?.contentDocument?.getElementById("preview-root");
      const hasContent = Boolean(root && root.childElementCount > 0);
      const polarisReady = Boolean(iframe?.contentWindow?.customElements?.get("s-button"));

      if (hasContent && polarisReady) {
        window.requestAnimationFrame(() => {
          if (!cancelled) setReady(true);
        });
        return;
      }

      if (Date.now() - started > 15000) {
        setReady(true);
        return;
      }

      window.setTimeout(tick, 100);
    };

    tick();
    return () => {
      cancelled = true;
    };
  }, [example, slug]);

  React.useEffect(() => {
    document.documentElement.style.background = FRAME_BG;
    document.body.style.margin = "0";
    document.body.style.background = FRAME_BG;
    return () => {
      document.documentElement.style.background = "";
      document.body.style.margin = "";
      document.body.style.background = "";
    };
  }, []);

  if (!entry || !example) {
    return (
      <div
        data-thumbnail-frame
        data-thumbnail-ready="missing"
        style={{
          width: FRAME_W,
          height: FRAME_H,
          display: "grid",
          placeItems: "center",
          background: FRAME_BG,
          color: "#8c9196",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 14,
        }}
      >
        Unknown slug: {slug}
      </div>
    );
  }

  const Example = example.Example;

  return (
    <div
      ref={hostRef}
      data-thumbnail-frame
      data-thumbnail-slug={slug}
      data-thumbnail-ready={ready ? "true" : "false"}
      style={{
        width: FRAME_W,
        height: FRAME_H,
        overflow: "hidden",
        background: FRAME_BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ComponentIframe
        compact
        className="h-auto! min-h-0! w-full max-w-full border-0 bg-transparent shadow-none"
        style={{ backgroundColor: FRAME_BG }}
      >
        <Example />
      </ComponentIframe>
    </div>
  );
}
