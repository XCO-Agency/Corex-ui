import { BlockStack, Box, Text, Link } from "@xco-agency/corex-ui";
import type { AnnotatedSectionPropsType } from "../types";

export function AnnotatedSection({
  title,
  description,
  action,
  children,
}: AnnotatedSectionPropsType) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
      <div style={{ flex: "1 1 260px", maxWidth: "340px" }}>
        <BlockStack gap="200">
          <Text as="h2" variant="headingMd">
            {title}
          </Text>
          <Text as="p" variant="bodySm" tone="neutral">
            {description}
          </Text>
          {action ? (
            <Box padding="100">
              <Link
                url={action.url}
                external={Boolean(action.url)}
                onClick={action.onAction}
              >
                {action.content}
              </Link>
            </Box>
          ) : null}
        </BlockStack>
      </div>

      <div style={{ flex: "2 1 420px", minWidth: "280px" }}>
        {children}
      </div>
    </div>
  );
}
