import * as React from "react";
import { Highlight, themes } from "prism-react-renderer";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  InlineStack,
  Text,
  Tooltip,
} from "@xco-agency/corex-ui";
import type { FileItemType } from "@/data/types";
import { FileTree } from "./FileTree";

export type ComponentCodeViewerPropsType = {
  code: string;
  filename?: string;
  files?: FileItemType[];
  language?: string;
  className?: string;
};

export function ComponentCodeViewer({
  code,
  filename = "component.tsx",
  files,
  language = "tsx",
  className,
}: ComponentCodeViewerPropsType) {
  const [copied, setCopied] = React.useState(false);
  const [activeFilePath, setActiveFilePath] = React.useState<string>(
    files && files.length > 0 ? files[0]!.path : filename,
  );
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const activeFile = React.useMemo(() => {
    if (files && files.length > 0) {
      return files.find((file) => file.path === activeFilePath) ?? files[0]!;
    }
    return { name: filename, path: filename, code };
  }, [files, activeFilePath, filename, code]);

  const activeCode = (activeFile.code || code || "").trim();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const hasMultipleFiles = Boolean(files && files.length > 0);
  const languageLabel =
    {
      tsx: "TS",
      ts: "TS",
      jsx: "JS",
      js: "JS",
      bash: "SH",
      sh: "SH",
      markup: "HTML",
      html: "HTML",
      json: "JSON",
    }[language] ?? language.slice(0, 4).toUpperCase();

  return (
    <Box className={className} background="base" overflow="hidden">
      <InlineStack alignItems="stretch" wrap>
        {hasMultipleFiles && (
          <FileTree
            files={files!}
            activeFilePath={activeFilePath}
            onSelectFile={setActiveFilePath}
          />
        )}
        <BlockStack gap="none" grow minInlineSize="0">
          <Box paddingInline="small" paddingBlock="small-200" background="subdued">
            <InlineStack alignItems="center" justifyContent="space-between" gap="small">
              <InlineStack alignItems="center" gap="small-200">
                <Badge>{languageLabel}</Badge>
                <Text variant="small">{activeFile.path}</Text>
              </InlineStack>
              <Tooltip content={copied ? "Copied code" : "Copy code"}>
                <Button
                  icon={copied ? "check" : "clipboard"}
                  variant="tertiary"
                  accessibilityLabel={copied ? "Copied code" : "Copy code"}
                  onClick={handleCopy}
                />
              </Tooltip>
            </InlineStack>
          </Box>
          <Box padding="small" overflow="hidden">
            <Highlight
              theme={isDark ? themes.vsDark : themes.github}
              code={activeCode}
              language={language}
            >
              {({ className: highlightClass, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={highlightClass} style={{ ...style, background: "transparent", margin: 0 }}>
                  {tokens.map((line, lineIndex) => (
                    <div key={lineIndex} {...getLineProps({ line })}>
                      <Text color="subdued" variant="small">
                        {lineIndex + 1}{" "}
                      </Text>
                      {line.map((token, tokenIndex) => (
                        <span key={tokenIndex} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </Box>
        </BlockStack>
      </InlineStack>
    </Box>
  );
}
