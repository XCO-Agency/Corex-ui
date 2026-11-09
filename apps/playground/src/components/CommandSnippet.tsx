import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, InlineStack, Text } from "@xco-agency/corex-ui";

export type CommandSnippetPropsType = {
  command: string;
  /** Shell prompt shown before the command; pass `null` for non-shell snippets. */
  prompt?: string | null;
  className?: string;
};

/** Single-line, copyable command, e.g. `pnpm add @xco-agency/corex-ui`. */
export function CommandSnippet({
  command,
  prompt = "$",
  className,
}: CommandSnippetPropsType) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <Box
      borderWidth="base"
      borderColor="base"
      borderRadius="base"
      background="subdued"
      paddingInline="small"
      paddingBlock="small-300"
    >
      <InlineStack alignItems="center" gap="small-200">
        {prompt ? (
          <Text color="subdued" variant="small">
            {prompt}
          </Text>
        ) : null}
        <Text variant="small" lineClamp={1}>
          {command}
        </Text>
        <Button
          icon={copied ? "check" : "clipboard"}
          variant="tertiary"
          accessibilityLabel={copied ? "Copied" : "Copy command"}
          onClick={handleCopy}
        />
      </InlineStack>
    </Box>
  );
}
