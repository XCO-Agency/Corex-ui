import { Card, ChartDonut } from "@xco-agency/corex-ui";

export function ChartDonutExample() {
  return (
    <Card heading="Sales by channel">
      <ChartDonut
        ariaLabel="Sales by channel"
        total="$29,020"
        totalLabel="Total"
        slices={[
          { id: "online", label: "Online Store", value: 18420, display: "$18,420" },
          { id: "pos", label: "Point of Sale", value: 6210, display: "$6,210" },
          { id: "shop", label: "Shop app", value: 3150, display: "$3,150" },
          { id: "social", label: "Social", value: 1240, display: "$1,240" },
        ]}
      />
    </Card>
  );
}
