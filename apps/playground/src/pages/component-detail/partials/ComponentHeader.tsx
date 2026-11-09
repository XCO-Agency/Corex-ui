import * as React from "react";
import {
  Badge,
  BlockStack,
  Button,
  Icon,
  InlineCode,
  InlineStack,
  Text,
} from "@xco-agency/corex-ui";
import { COREX_UI_VERSION } from "@/lib/version";
import { getCategoryIcon } from "@/lib/category-icons";

const REPO_URL = "https://github.com/XCO-Agency/Corex-ui/blob/main";

export type ComponentHeaderPropsType = {
  name: string;
  category: string;
  description: string;
  requiresEmbeddedContext?: boolean;
  /** Blocks are copied in via the registry, so they have no import or source link. */
  isBlock?: boolean;
  /** The library export to import; differs from `name` for entries like "Menu (title bar)". */
  importName?: string;
};

function ImportSnippet({ importName }: { importName: string }) {
  const [copied, setCopied] = React.useState(false);
  const code = `import { ${importName} } from "@xco-agency/corex-ui";`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <InlineStack alignItems="center" gap="small-200">
      <InlineCode>{code}</InlineCode>
      <Button
        icon={copied ? "check" : "clipboard"}
        variant="tertiary"
        accessibilityLabel={copied ? "Copied import" : "Copy import"}
        onClick={handleCopy}
      />
    </InlineStack>
  );
}

export function ComponentHeader({
  name,
  category,
  description,
  requiresEmbeddedContext,
  isBlock,
  importName = name,
}: ComponentHeaderPropsType) {
  return (
    <BlockStack gap="small" id="overview">
      <InlineStack gap="small-200" alignItems="center" wrap>
        <InlineStack gap="small-300" alignItems="center">
          <Icon source={getCategoryIcon(category)} />
          <Text color="subdued">{isBlock ? `Blocks · ${category}` : category}</Text>
        </InlineStack>
        <Text color="subdued">/</Text>
        <Text color="subdued">v{COREX_UI_VERSION}</Text>
        {requiresEmbeddedContext && <Badge tone="warning">App Bridge session</Badge>}
      </InlineStack>

      <BlockStack gap="small-200">
        <Text as="h1" variant="headingXl" heading>
          {name}
        </Text>
        <Text as="p" color="subdued">
          {description}
        </Text>
      </BlockStack>

      {!isBlock && (
        <InlineStack gap="small-200" alignItems="center" wrap>
          <ImportSnippet importName={importName} />
          <Button
            icon="file"
            variant="tertiary"
            href={`${REPO_URL}/packages/corex-ui/src/components/${importName}/${importName}.tsx`}
            target="_blank"
          >
            Source
          </Button>
          <Button
            icon="wand"
            variant="tertiary"
            href={`${REPO_URL}/.agents/skills/corex-ui-components/SKILL.md#${importName.toLowerCase()}`}
            target="_blank"
          >
            AI skill
          </Button>
        </InlineStack>
      )}
    </BlockStack>
  );
}
