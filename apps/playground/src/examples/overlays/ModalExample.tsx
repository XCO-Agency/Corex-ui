import { useState } from "react";
import { Button, Modal, Text } from "@xco/corex-ui";

export function ModalExample() {
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
