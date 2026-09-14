import type { ComponentEntry } from "../types";
import { ModalExample } from "@/examples/overlays/ModalExample";
import ModalExampleRaw from "@/examples/overlays/ModalExample.tsx?raw";
import { ModalMaxInlineSaveBarExample } from "@/examples/overlays/ModalMaxInlineSaveBarExample";
import ModalMaxInlineSaveBarExampleRaw from "@/examples/overlays/ModalMaxInlineSaveBarExample.tsx?raw";
import { ModalMaxIframeSaveBarExample } from "@/examples/overlays/ModalMaxIframeSaveBarExample";
import ModalMaxIframeSaveBarExampleRaw from "@/examples/overlays/ModalMaxIframeSaveBarExample.tsx?raw";
import { FloatingControlsExample } from "@/examples/overlays/FloatingControlsExample";
import FloatingControlsExampleRaw from "@/examples/overlays/FloatingControlsExample.tsx?raw";
import { FloatingAbsoluteExample } from "@/examples/overlays/FloatingAbsoluteExample";
import FloatingAbsoluteExampleRaw from "@/examples/overlays/FloatingAbsoluteExample.tsx?raw";
import { PopoverExample } from "@/examples/overlays/PopoverExample";
import PopoverExampleRaw from "@/examples/overlays/PopoverExample.tsx?raw";

const PATTERN_B_IFRAME_CODE = `// Iframe Route (app.preferences.settings.tsx)
import { useEffect, useState } from "react";
import { Card, TextField, BlockStack } from "@xco-agency/corex-ui";

export function IframePreferencesPage() {
  const [storeEmail, setStoreEmail] = useState("contact@store.com");
  const [initialEmail] = useState("contact@store.com");
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = storeEmail !== initialEmail;
  const isValid = storeEmail.includes("@");

  // Report dirty/saving/validity state to host modal
  useEffect(() => {
    const ch = new BroadcastChannel("claimify-preferences");
    ch.postMessage({
      type: "claimify-save-state",
      visible: hasChanges,
      disabled: !isValid,
      saving: isSaving,
    });
    ch.close();
  }, [hasChanges, isValid, isSaving]);

  // Receive Save and Discard commands from host SaveBar
  useEffect(() => {
    const ch = new BroadcastChannel("claimify-preferences");
    ch.onmessage = (e) => {
      if (e.data?.type === "claimify-modal-save") handleUnifiedSave();
      if (e.data?.type === "claimify-modal-discard") handleDiscard();
    };
    return () => ch.close();
  }, [storeEmail]);

  const handleUnifiedSave = async () => {
    setIsSaving(true);
    await fakeApiSave({ storeEmail });
    setIsSaving(false);
  };

  const handleDiscard = () => {
    setStoreEmail(initialEmail);
  };

  return (
    <Card>
      <BlockStack gap="base">
        <TextField label="Store Sender Email" value={storeEmail} onChange={setStoreEmail} />
      </BlockStack>
    </Card>
  );
}`;

export const overlaysComponents: ComponentEntry[] = [
  {
    name: "Floating",
    slug: "floating",
    category: "Overlays",
    description:
      "A flexible, transparent floating overlay container with customizable edge offsets, anchoring positions, and collapsible mode.",
    examples: [
      {
        title: "Floating Controls & Positions",
        Example: FloatingControlsExample,
        code: FloatingControlsExampleRaw,
      },
      {
        title: "In-Container Absolute Floating Showcase",
        Example: FloatingAbsoluteExample,
        code: FloatingAbsoluteExampleRaw,
      },
    ],
  },
  {
    name: "Modal",
    slug: "modal",
    category: "Overlays",
    description:
      "A focused overlay dialog for confirmations or tasks, supporting App Bridge variant='max' with native contextual SaveBar.",
    examples: [
      {
        title: "Max Modal + Contextual SaveBar (Inline Pattern A)",
        Example: ModalMaxInlineSaveBarExample,
        code: ModalMaxInlineSaveBarExampleRaw,
      },
      {
        title: "Max Modal + Cross-Document SaveBar (Iframe Pattern B)",
        Example: ModalMaxIframeSaveBarExample,
        code: ModalMaxIframeSaveBarExampleRaw,
        files: [
          {
            name: "HostPreferencesModal.tsx",
            path: "HostPreferencesModal.tsx",
            code: ModalMaxIframeSaveBarExampleRaw,
          },
          {
            name: "app.preferences.settings.tsx (Iframe)",
            path: "app.preferences.settings.tsx",
            code: PATTERN_B_IFRAME_CODE,
          },
        ],
      },
      {
        title: "Confirmation modal",
        Example: ModalExample,
        code: ModalExampleRaw,
      },
    ],
  },
  {
    name: "Popover",
    slug: "popover",
    category: "Overlays",
    description:
      "A non-modal contextual overlay anchored to a trigger, with programmatic close actions via usePopover.",
    examples: [
      {
        title: "Filter Popover with programmatic close",
        Example: PopoverExample,
        code: PopoverExampleRaw,
      },
    ],
  },
];
