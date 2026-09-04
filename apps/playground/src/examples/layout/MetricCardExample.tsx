import { MetricCard } from "@xco/corex-ui";

export function MetricCardExample() {
  return (
    <s-box minInlineSize="260px">
      <MetricCard
        title="Total orders"
        value="1,234"
        tooltip="+10% from last month"
        id="MetricCard-id"
        icon="order"
        badge={{ value: "10%", dir: "down", tone: "critical" }}
        sparklineData={[
          0, 0, 16, 0, 80, 20, 100, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 100, 0, 0,
        ]}
        onClick={() => alert("Clickable action")}
        sparklineColor="critical"
      />
    </s-box>
  );
}
