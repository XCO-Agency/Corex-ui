import { MetricCard, Box, Grid } from "@xco-agency/corex-ui";

export function MetricCardExample() {
  return (
    <Box minInlineSize="520px">
      <Grid columns={2} gap="base">
        <MetricCard
          title="Total orders"
          value="1,234"
          tooltip="+10% from last month"
          icon="order"
          badge={{ value: "10%", dir: "down", tone: "critical" }}
          sparklineData={[
            0, 0, 16, 0, 80, 20, 100, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 100, 0, 0,
          ]}
          onClick={() => alert("Clickable action")}
          sparklineColor="critical"
        />
        <MetricCard
          title="A Skeleton metric"
          icon="order"
          fetching
          sparklineData={[]}
          onClick={() => alert("Clickable action")}
          sparklineColor="critical"
        />
      </Grid>
    </Box>
  );
}
