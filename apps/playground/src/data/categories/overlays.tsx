import { useState } from "react";
import { Button, Modal, Text } from "@xco/corex-ui";
import type { ComponentEntry } from "../types";

function ModalExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete product</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delete product"
        primaryAction={{ content: "Delete", destructive: true, onAction: () => setOpen(false) }}
        secondaryActions={[{ content: "Cancel", onAction: () => setOpen(false) }]}
      >
        <Text>This can&rsquo;t be undone.</Text>
      </Modal>
    </>
  );
}

export const overlaysComponents: ComponentEntry[] = [
  {
    name: "Modal",
    slug: "modal",
    category: "Overlays",
    description: "A focused overlay dialog for confirmations or short focused tasks.",
    examples: [
      {
        title: "Confirmation modal",
        Example: ModalExample,
        code: `const [open, setOpen] = useState(false);

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Delete product"
  primaryAction={{ content: "Delete", destructive: true, onAction: () => setOpen(false) }}
  secondaryActions={[{ content: "Cancel", onAction: () => setOpen(false) }]}
>
  <Text>This can't be undone.</Text>
</Modal>`,
      },
    ],
  },
];
