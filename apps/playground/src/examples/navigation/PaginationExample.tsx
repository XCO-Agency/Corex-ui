import { useState } from "react";
import { BlockStack, Card, Pagination, Text } from "@xco-agency/corex-ui";

const pageCount = 4;
const perPage = 20;
const total = 68;

export function PaginationExample() {
  const [page, setPage] = useState(1);
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <Card>
      <BlockStack gap="small-200" inlineAlign="center">
        <Text heading>Page {page}</Text>
        <Pagination
          hasPrevious={page > 1}
          hasNext={page < pageCount}
          onPrevious={() => setPage((current) => current - 1)}
          onNext={() => setPage((current) => current + 1)}
          label={`${start} – ${end} of ${total}`}
        />
      </BlockStack>
    </Card>
  );
}
