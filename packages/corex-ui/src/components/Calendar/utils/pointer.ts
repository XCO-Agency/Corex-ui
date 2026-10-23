/** Set when a drag ends so the click that follows it can be ignored. */
export const dragGuard = { endedAt: 0 };

export function wasJustDragged(): boolean {
  return Date.now() - dragGuard.endedAt < 80;
}

/** The document a node lives in — the calendar may render into an iframe from the parent realm. */
export function ownerDocumentOf(target: EventTarget | null): Document | null {
  if (target && "ownerDocument" in target) return (target as Node).ownerDocument;
  return typeof document === "undefined" ? null : document;
}

/** The first element at the point (through overlays) carrying `data-cx-date`, as a date key. */
export function dateKeyFromPoint(
  doc: Document | null,
  clientX: number,
  clientY: number,
): string | null {
  if (!doc || typeof doc.elementsFromPoint !== "function") return null;
  for (const element of doc.elementsFromPoint(clientX, clientY)) {
    const key = element.getAttribute("data-cx-date");
    if (key) return key;
  }
  return null;
}

export type PointerSessionOptionsType = {
  /** Pixels the pointer must travel before the session counts as a drag. */
  threshold: number;
  onStart?: (event: PointerEvent) => void;
  onMove: (event: PointerEvent, dragging: boolean) => void;
  /** `dragging` is false for a plain click/tap. */
  onEnd: (event: PointerEvent, dragging: boolean) => void;
  /** Escape or pointercancel. */
  onCancel: (dragging: boolean) => void;
};

/**
 * Tracks one pointer gesture on the owning window, so mouse and touch share a code
 * path. Esc cancels. Returns a function that tears the session down.
 */
export function beginPointerSession(
  origin: { clientX: number; clientY: number; pointerId: number; target: EventTarget | null },
  options: PointerSessionOptionsType,
): () => void {
  const doc = ownerDocumentOf(origin.target);
  const view = doc?.defaultView;
  if (!doc || !view) return () => {};
  const root = doc.documentElement;
  let dragging = false;
  let finished = false;

  const teardown = () => {
    finished = true;
    view.removeEventListener("pointermove", handleMove);
    view.removeEventListener("pointerup", handleUp);
    view.removeEventListener("pointercancel", handleCancel);
    view.removeEventListener("keydown", handleKey, true);
    root.removeAttribute("data-cx-calendar-dragging");
  };

  function handleMove(event: PointerEvent) {
    if (finished || event.pointerId !== origin.pointerId) return;
    if (!dragging) {
      const distance = Math.hypot(event.clientX - origin.clientX, event.clientY - origin.clientY);
      if (distance < options.threshold) return;
      dragging = true;
      root.setAttribute("data-cx-calendar-dragging", "");
      options.onStart?.(event);
    }
    options.onMove(event, true);
  }

  function handleUp(event: PointerEvent) {
    if (finished || event.pointerId !== origin.pointerId) return;
    const wasDragging = dragging;
    teardown();
    if (wasDragging) dragGuard.endedAt = Date.now();
    options.onEnd(event, wasDragging);
  }

  function handleCancel(event?: PointerEvent) {
    if (finished || (event && event.pointerId !== origin.pointerId)) return;
    const wasDragging = dragging;
    teardown();
    options.onCancel(wasDragging);
  }

  function handleKey(event: KeyboardEvent) {
    if (event.key !== "Escape") return;
    event.stopPropagation();
    handleCancel();
  }

  view.addEventListener("pointermove", handleMove);
  view.addEventListener("pointerup", handleUp);
  view.addEventListener("pointercancel", handleCancel);
  view.addEventListener("keydown", handleKey, true);

  return () => {
    if (!finished) teardown();
  };
}

/** Runs `callback` at most once per animation frame with the latest argument. */
export function rafThrottle<T>(callback: (value: T) => void): {
  (value: T): void;
  cancel: () => void;
} {
  let frame = 0;
  let latest: T;
  const run = (value: T) => {
    latest = value;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      callback(latest);
    });
  };
  run.cancel = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };
  return run;
}
