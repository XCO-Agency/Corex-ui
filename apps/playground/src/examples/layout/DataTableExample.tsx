import { Card, DataTable, Text } from "@xco-agency/corex-ui";

export function DataTableExample() {
  return (
    <Card padding="none">
      <DataTable
        columnContentTypes={["text", "numeric", "numeric"]}
        headings={["Product", "Units sold", "Net sales"]}
        rows={[
          ["Classic tee", "128", "$2,560.00"],
          ["Canvas cap", "64", "$768.00"],
          ["Leather tote", "12", "$1,440.00"],
          [
            <Text key="total" fontWeight="bold">
              Total
            </Text>,
            "204",
            "$4,768.00",
          ],
        ]}
      />
    </Card>
  );
}
