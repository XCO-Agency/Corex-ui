import { useState } from "react";
import { Banner, Button } from "@xco/corex-ui";

export function BannerDismissible() {
  const [visible, setVisible] = useState(true);
  if (!visible) {
    return <Button onClick={() => setVisible(true)}>Show banner again</Button>;
  }
  return (
    <Banner title="Heads up" tone="warning" onDismiss={() => setVisible(false)}>
      Some line items are out of stock.
    </Banner>
  );
}
