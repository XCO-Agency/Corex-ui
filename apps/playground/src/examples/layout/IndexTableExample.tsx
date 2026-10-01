import { useState } from "react";
import {
  Badge,
  Card,
  IndexTable,
  Text,
  useIndexResourceState,
} from "@xco-agency/corex-ui";

type OrderType = {
  id: string;
  name: string;
  customer: string;
  total: string;
  fulfilled: boolean;
};

const orders: OrderType[] = [
  {
    id: "1001",
    name: "#1001",
    customer: "Ada Lovelace",
    total: "$86.50",
    fulfilled: true,
  },
  {
    id: "1002",
    name: "#1002",
    customer: "Grace Hopper",
    total: "$24.00",
    fulfilled: false,
  },
  {
    id: "1003",
    name: "#1003",
    customer: "Alan Turing",
    total: "$142.90",
    fulfilled: true,
  },
];

export function IndexTableExample() {
  const [page, setPage] = useState(1);
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orders);

  return (
    <Card padding="none">
      <IndexTable
        resourceName={{ singular: "order", plural: "orders" }}
        itemCount={orders.length}
        selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length}
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: "Order" },
          { title: "Customer" },
          { title: "Status" },
          { title: "Total", format: "currency" },
        ]}
        promotedBulkActions={[
          { content: "Fulfil", onAction: () => alert(selectedResources.join(", ")) },
        ]}
        bulkActions={[{ content: "Archive", destructive: true }]}
        pagination={{
          hasPrevious: page > 1,
          hasNext: page < 3,
          onPrevious: () => setPage((current) => current - 1),
          onNext: () => setPage((current) => current + 1),
        }}
      >
        {orders.map((order) => (
          <IndexTable.Row
            key={order.id}
            id={order.id}
            selected={selectedResources.includes(order.id)}
            onClick={() => alert(`Open ${order.name}`)}
          >
            <IndexTable.Cell>
              <Text fontWeight="medium">{order.name}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>{order.customer}</IndexTable.Cell>
            <IndexTable.Cell>
              <Badge tone={order.fulfilled ? "success" : "attention"}>
                {order.fulfilled ? "Fulfilled" : "Unfulfilled"}
              </Badge>
            </IndexTable.Cell>
            <IndexTable.Cell>{order.total}</IndexTable.Cell>
          </IndexTable.Row>
        ))}
      </IndexTable>
    </Card>
  );
}
