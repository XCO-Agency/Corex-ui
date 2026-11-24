import { Card, ChartFunnel } from "@xco-agency/corex-ui";

export function ChartFunnelExample() {
  return (
    <Card heading="Conversion rate breakdown">
      <ChartFunnel
        ariaLabel="Conversion rate breakdown"
        stages={[
          {
            id: "sessions",
            label: "Sessions",
            help: "Visits to the online store.",
            value: 15840,
            share: 100,
            shareDisplay: "100%",
            display: "15,840",
            change: 8.2,
          },
          {
            id: "cart",
            label: "Added to cart",
            value: 1426,
            share: 9,
            shareDisplay: "9%",
            display: "1,426",
            note: "9% of the previous step",
            change: 3.1,
            details: [{ label: "Drop-off", value: "−91%" }],
          },
          {
            id: "checkout",
            label: "Reached checkout",
            value: 792,
            share: 5,
            shareDisplay: "5%",
            display: "792",
            note: "55.5% of the previous step",
            change: -1.4,
            details: [{ label: "Drop-off", value: "−44.5%" }],
          },
          {
            id: "converted",
            label: "Converted",
            value: 507,
            share: 3.2,
            shareDisplay: "3.2%",
            display: "507",
            note: "64% of the previous step",
            change: 0,
            details: [{ label: "Drop-off", value: "−36%" }],
          },
        ]}
      />
    </Card>
  );
}
