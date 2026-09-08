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

import { AppWindowSaveBarExample } from "@/examples/app-bridge/AppWindowSaveBarExample";
import AppWindowSaveBarExampleRaw from "@/examples/app-bridge/AppWindowSaveBarExample.tsx?raw";

const CHILD_IFRAME_CODE = `import { useState } from "react";
import {
  useAppWindowSaveBar,
  Page,
  Card,
  TextField,
  BlockStack,
} from "@xco-agency/corex-ui";

export function ChildIframePage() {
  const [title, setTitle] = useState("Winter Wool Jacket");
  const [initialTitle] = useState("Winter Wool Jacket");
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = title !== initialTitle;

  // Bidirectional SaveBar hook inside child AppWindow iframe:
  // Automatically syncs 'open', 'loading', 'disabled' to the host <AppWindow saveBar />
  // and receives Save/Discard actions clicked by the merchant on the host page.
  useAppWindowSaveBar({
    windowId: "demo-app-window-savebar",
    open: isDirty,
    loading: isSaving,
    saveText: "Save changes",
    discardText: "Discard",
    onSave: async () => {
      setIsSaving(true);
      await fakeApiSave({ title });
      setIsSaving(false);
    },
    onDiscard: () => {
      setTitle(initialTitle);
    },
  });

  return (
    <Page title="Child Window Content">
      <Card>
        <BlockStack gap="base">
          <TextField
            label="Product Title"
            value={title}
            onChange={setTitle}
            helpText="Editing this input marks the form dirty and reveals the host SaveBar."
          />
        </BlockStack>
      </Card>
    </Page>
  );
}`;

export const appBridgeComponents: ComponentEntry[] = [
  {
    name: "AppWindow",
    slug: "app-window",
    category: "App Bridge",
    description:
      "Loads another page in an embedded window, shown/hidden via ref or command/commandFor. Supports automatic host SaveBar synchronization.",
    requiresEmbeddedContext: true,
    examples: [
      {
        title: "SaveBar two-way bridge (saveBar prop)",
        Example: AppWindowSaveBarExample,
        code: AppWindowSaveBarExampleRaw,
        files: [
          {
            name: "HostPage.tsx",
            path: "HostPage.tsx",
            code: AppWindowSaveBarExampleRaw,
          },
          {
            name: "ChildIframePage.tsx",
            path: "ChildIframePage.tsx",
            code: CHILD_IFRAME_CODE,
          },
        ],
      },
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
