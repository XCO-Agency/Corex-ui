import { useState } from "react";
import { ChoiceList, Grid } from "@xco-agency/corex-ui";

export function ChoiceListExample() {
  const [selected, setSelected] = useState<string[]>(["email"]);
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>(["email"]);
  return (
    <Grid columns={2} gap="base">
      <Grid.Item>
        <ChoiceList
          title="Normal choice list"
          choices={[
            { label: "Email", value: "email" },
            { label: "SMS", value: "sms" },
            { label: "WhatsApp", value: "whatsapp" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "DISABLED: Twitter", value: "twitter", disabled: true },
            { label: "Facebook", value: "facebook" },
            { label: "Snapchat", value: "snapchat" },
          ]}

          selected={selected}
          onChange={(value) => setSelected(value)}
        />
      </Grid.Item>
      <Grid.Item>
        <ChoiceList
          title="Allow multiple choice selection"
          choices={[
            { label: "Email", value: "email" },
            { label: "SMS", value: "sms" },
            { label: "Whatsapp", value: "whatsapp" },
            { label: "Telegram", value: "telegram" },
            { label: "DISABLED: Skype", value: "skype", disabled: true },
            { label: "DISABLED: Zoom", value: "zoom", disabled: true },
            { label: "Teams", value: "teams" },
          ]}

          selected={selectedMultiple}
          onChange={(value) => setSelectedMultiple(value)}
          allowMultiple
        />
      </Grid.Item>
    </Grid>
  );
}
