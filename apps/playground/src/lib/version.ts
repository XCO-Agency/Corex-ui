declare const __COREX_UI_VERSION__: string | undefined;
import { COREX_UI_VERSION as CUIV } from "@xco-agency/corex-ui";

export const COREX_UI_VERSION: string =
  typeof __COREX_UI_VERSION__ !== "undefined" ? __COREX_UI_VERSION__ : CUIV;

export const VERSION_LABEL = `v${COREX_UI_VERSION} Ready`;
