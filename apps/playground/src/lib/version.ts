declare const __COREX_UI_VERSION__: string | undefined;

export const COREX_UI_VERSION: string =
  typeof __COREX_UI_VERSION__ !== "undefined" ? __COREX_UI_VERSION__ : "0.1.5";

export const VERSION_LABEL = `v${COREX_UI_VERSION} Ready`;
