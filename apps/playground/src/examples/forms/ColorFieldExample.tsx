import { useState } from "react";
import { Grid, ColorField } from "@xco-agency/corex-ui";

export function ColorFieldExample() {
  const [brandColor, setBrandColor] = useState("#008060");
  const [accentColor, setAccentColor] = useState("#5c6ac4");

  return (
    <Grid columns={2} gap="base">
      <Grid.Item>
        <ColorField
          label="Brand primary color"
          value={brandColor}
          details="Used for primary buttons, banners, and links"
          onChange={(val: string) => setBrandColor(val)}
        />
      </Grid.Item>

      <Grid.Item>
        <ColorField
          label="Accent color (with alpha)"
          value={accentColor}
          alpha
          details="Supports opacity and transparency controls"
          onChange={(val: string) => setAccentColor(val)}
        />
      </Grid.Item>
    </Grid>
  );
}
