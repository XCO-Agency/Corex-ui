import type { ComponentEntry } from "../types";
import { AppWindowExample } from "@/examples/app-bridge/AppWindowExample";
import AppWindowExampleRaw from "@/examples/app-bridge/AppWindowExample.tsx?raw";
import { AppWindowDeclarativeExample } from "@/examples/app-bridge/AppWindowDeclarativeExample";
import AppWindowDeclarativeExampleRaw from "@/examples/app-bridge/AppWindowDeclarativeExample.tsx?raw";
import { AppWindowTitleBarExample } from "@/examples/app-bridge/AppWindowTitleBarExample";
import AppWindowTitleBarExampleRaw from "@/examples/app-bridge/AppWindowTitleBarExample.tsx?raw";
import { AppNavExample } from "@/examples/app-bridge/AppNavExample";
import AppNavExampleRaw from "@/examples/app-bridge/AppNavExample.tsx?raw";
import { MenuInTitleBarExample } from "@/examples/app-bridge/MenuInTitleBarExample";
import MenuInTitleBarExampleRaw from "@/examples/app-bridge/MenuInTitleBarExample.tsx?raw";
import { ToastExample } from "@/examples/app-bridge/ToastExample";
import ToastExampleRaw from "@/examples/app-bridge/ToastExample.tsx?raw";
import { SaveBarExample } from "@/examples/app-bridge/SaveBarExample";
import SaveBarExampleRaw from "@/examples/app-bridge/SaveBarExample.tsx?raw";
import { SaveBarFormExample } from "@/examples/app-bridge/SaveBarFormExample";
import SaveBarFormExampleRaw from "@/examples/app-bridge/SaveBarFormExample.tsx?raw";

export const appBridgeComponents: ComponentEntry[] = [
  {
    name: "AppWindow",
    slug: "app-window",
    category: "App Bridge",
    description:
      "Loads another page in an embedded window, shown/hidden via ref or command/commandFor.",
    requiresEmbeddedContext: true,
    examples: [
      {
        title: "Imperative show/hide via ref",
        Example: AppWindowExample,
        code: AppWindowExampleRaw,
      },
      {
        title: "Declarative trigger (no JS)",
        Example: AppWindowDeclarativeExample,
        code: AppWindowDeclarativeExampleRaw,
      },
      {
        title: "Title bar accessory + menu (inside the window's content page)",
        Example: AppWindowTitleBarExample,
        code: AppWindowTitleBarExampleRaw,
      },
    ],
  },
  {
    name: "AppNav",
    slug: "app-nav",
    category: "App Bridge",
    description: "The embedded app's top-level navigation bar.",
    requiresEmbeddedContext: true,
    examples: [
      {
        title: "Nav links",
        Example: AppNavExample,
        code: AppNavExampleRaw,
      },
    ],
  },
  {
    name: "Menu (title bar)",
    slug: "app-bridge-menu",
    category: "App Bridge",
    description:
      "A secondary-actions Menu placed in a Page's title bar, opened via commandFor.",
    requiresEmbeddedContext: true,
    examples: [
      {
        title: "Title bar icons and menu",
        Example: MenuInTitleBarExample,
        code: MenuInTitleBarExampleRaw,
      },
    ],
  },
  {
    name: "Toast",
    slug: "toast",
    category: "App Bridge",
    description:
      "A brief, non-blocking confirmation message, shown via the useToast() hook.",
    requiresEmbeddedContext: true,
    examples: [
      {
        title: "Show a toast",
        Example: ToastExample,
        code: ToastExampleRaw,
      },
    ],
  },
  {
    name: "SaveBar",
    slug: "save-bar",
    category: "App Bridge",
    description:
      "A persistent bar prompting the merchant to save or discard unsaved changes.",
    requiresEmbeddedContext: true,
    examples: [
      {
        title: "Save bar with useSaveBar()",
        Example: SaveBarExample,
        code: SaveBarExampleRaw,
      },
      {
        title: "Same-page form (no wrapper needed)",
        Example: SaveBarFormExample,
        code: SaveBarFormExampleRaw,
      },
    ],
  },
];
