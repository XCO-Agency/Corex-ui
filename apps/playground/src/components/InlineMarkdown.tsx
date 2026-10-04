import * as React from "react";
import { cn } from "@/lib/utils";

export type InlineMarkdownPropsType = {
  children: string;
  className?: string;
  codeClassName?: string;
};

/** Renders the inline subset used in SKILL.md tables: `code`, **bold** and *italic*. */
export function InlineMarkdown({ children, className, codeClassName }: InlineMarkdownPropsType) {
  const parts = children.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={index}
              className={cn(
                "rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground",
                codeClassName,
              )}
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          return <em key={index}>{part.slice(1, -1)}</em>;
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}
