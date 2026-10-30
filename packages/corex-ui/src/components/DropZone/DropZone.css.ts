/**
 * Injected once per document. Constrains `s-drop-zone` into a square,
 * icon-centered surface when `size="small"`.
 */
export const DROP_ZONE_STYLE_ID = "cx-drop-zone-styles";

export const DROP_ZONE_CSS = `
[data-slot="drop-zone"] {
  box-sizing: border-box;
  display: block;
  max-inline-size: 100%;
}

[data-slot="drop-zone"][data-size="small"] {
  inline-size: var(--cx-drop-zone-inline-size, 5rem);
}

[data-slot="drop-zone"][data-size="small"][data-inline-size="fill"] {
  inline-size: 100%;
}

[data-slot="drop-zone"][data-size="small"] > s-drop-zone {
  display: block;
  inline-size: 100%;
}

[data-slot="drop-zone-content"] {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 100%;
  aspect-ratio: 1 / 1;
  min-block-size: 0;
  pointer-events: none;
}
`;
