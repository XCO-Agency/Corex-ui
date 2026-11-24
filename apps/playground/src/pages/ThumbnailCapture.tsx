import * as React from "react";
import { useParams } from "react-router-dom";
import { findEntryBySlug } from "@/data/registry";
import { ComponentIframe } from "@/pages/component-detail/partials/ComponentIframe";
import { resolvePreviewLayout } from "@/pages/component-detail/previewLayout";

/** 4:3, the ratio of the Overview tile image. */
const FRAME_W = 640;
const FRAME_H = 480;
/** Small components are enlarged to fill about this share of the frame, up to MAX_SCALE. */
const FILL_W = 0.8;
const FILL_H = 0.62;
const MAX_SCALE = 3.6;
const FRAME_BG = "#ffffff";

/**
 * Minimal chrome-free page used by `scripts/capture-thumbnails.mjs` to
 * screenshot each component's first example for Overview tiles.
 *
 * Fixed 640×480 (4:3) frame matches the Overview tile image. Components
 * (`layout: "centered"`) are centred and scaled up to fill it; blocks and pages
 * (`layout: "full"`) keep their natural size from the top.
 */
/**
 * The boxes of the innermost visible elements under `node`, shadow roots included.
 * Wrappers are skipped, so a full-width wrapper around a small component does not
 * stop it from being enlarged; `display: contents` elements have no box and are
 * looked through.
 */
function innermostBoxes(node: Element | ShadowRoot): DOMRect[] {
  const boxes: DOMRect[] = [];
  const visit = (el: Element): boolean => {
    const rect = el.getBoundingClientRect();
    const inner = [
      ...Array.from(el.children),
      ...(el.shadowRoot ? Array.from(el.shadowRoot.children) : []),
    ];
    const innerHasBox = inner.map(visit).some(Boolean);
    const hasBox = rect.width > 0 && rect.height > 0;
    if (hasBox && !innerHasBox) boxes.push(rect);
    return hasBox || innerHasBox;
  };
  Array.from(node.children).forEach(visit);
  return boxes;
}

/** Scales the centred content up (never down) so it fills the frame, around its centre. */
function fitToFrame(root: HTMLElement): void {
  const boxes = innermostBoxes(root);
  if (boxes.length === 0) return;
  const width =
    Math.max(...boxes.map((b) => b.right)) - Math.min(...boxes.map((b) => b.left));
  const height =
    Math.max(...boxes.map((b) => b.bottom)) - Math.min(...boxes.map((b) => b.top));
  if (!(width > 0) || !(height > 0)) return;
  const scale = Math.min(
    MAX_SCALE,
    (FRAME_W * FILL_W) / width,
    (FRAME_H * FILL_H) / height,
  );
  if (scale <= 1) return;
  root.style.transform = `scale(${scale.toFixed(3)})`;
  root.style.transformOrigin = "center";
}

export function ThumbnailCapture() {
  const { slug = "" } = useParams();
  const entry = findEntryBySlug(slug);
  const example = entry?.examples[0];
  const layout = entry && example ? resolvePreviewLayout(entry, example) : "full";
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
      const polarisReady = Boolean(
        iframe?.contentWindow?.customElements?.get("s-button"),
      );

      if (hasContent && polarisReady) {
        window.requestAnimationFrame(() => {
          if (cancelled) return;
          if (root && layout === "centered") fitToFrame(root);
          setReady(true);
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
  }, [example, slug, layout]);

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

  const Example = entry.thumbnail ?? example.Example;

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
        fill
        layout={layout}
        className="w-full max-w-full border-0 bg-transparent shadow-none"
        style={{ backgroundColor: FRAME_BG, height: FRAME_H, minHeight: 0 }}
      >
        <Example />
      </ComponentIframe>
    </div>
  );
}
