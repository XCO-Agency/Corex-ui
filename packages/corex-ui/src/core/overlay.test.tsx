import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDismissableLayer } from "./overlay";

function DismissableLayerProbe({
  id,
  doc,
  onEscape,
}: {
  id: string;
  doc: Document;
  onEscape: () => void;
}) {
  useDismissableLayer({
    id,
    active: true,
    doc,
    getInside: () => [],
    onEscape,
  });
  return null;
}

describe("useDismissableLayer", () => {
  it("keeps the top-layer stack isolated per document", () => {
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    const frameDocument = iframe.contentDocument!;
    const frameContainer = frameDocument.createElement("div");
    frameDocument.body.appendChild(frameContainer);
    const onMainEscape = vi.fn();
    const onFrameEscape = vi.fn();

    const main = render(
      <DismissableLayerProbe
        id="shared-layer-id"
        doc={document}
        onEscape={onMainEscape}
      />,
    );
    const frame = render(
      <DismissableLayerProbe
        id="shared-layer-id"
        doc={frameDocument}
        onEscape={onFrameEscape}
      />,
      { container: frameContainer },
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onMainEscape).toHaveBeenCalledTimes(1);
    expect(onFrameEscape).not.toHaveBeenCalled();

    fireEvent.keyDown(frameDocument, { key: "Escape" });
    expect(onFrameEscape).toHaveBeenCalledTimes(1);

    frame.unmount();
    main.unmount();
    iframe.remove();
  });
});
