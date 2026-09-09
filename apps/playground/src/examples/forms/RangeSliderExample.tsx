import { useState } from "react";
import { BlockStack, Grid, RangeSlider } from "@xco-agency/corex-ui";

export function RangeSliderExample() {
  const [opacity, setOpacity] = useState<number>(32);
  const [volume, setVolume] = useState<number>(60);

  return (
    <Grid columns={2} gap="base">
      <Grid.Item>
        <BlockStack gap="base">
          <RangeSlider
            label="Opacity"
            value={opacity}
            min={0}
            max={100}
            step={1}
            output
            suffix={<p>{opacity}%</p>}
            onChange={(value) => setOpacity(value)}
            helpText="Adjust element opacity with active value tooltip."
          />
        </BlockStack>
      </Grid.Item>
      <Grid.Item>
        <BlockStack gap="base">
          <RangeSlider
            label="Volume"
            value={volume}
            min={0}
            max={100}
            step={5}
            output
            suffix={<p>{volume}dB</p>}
            onChange={(value) => setVolume(value)}
            helpText="Set maximum audio output level."
          />
        </BlockStack>
      </Grid.Item>
    </Grid>
  );
}
