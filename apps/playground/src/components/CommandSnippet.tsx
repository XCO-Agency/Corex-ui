import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export type CommandSnippetPropsType = {
  command: string;
  /** Shell prompt shown before the command; pass `null` for non-shell snippets. */
  prompt?: string | null;
  className?: string;
};

/** Single-line, copyable command, e.g. `pnpm add @xco-agency/corex-ui`. */
export function CommandSnippet({ command, prompt = "$", className }: CommandSnippetPropsType) {
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
    <div
      className={cn(
        "flex h-9 min-w-0 items-center gap-2 rounded-lg border border-border/80 bg-muted/30 pr-1 pl-3 font-mono text-[12.5px]",
        className,
      )}
    >
      {prompt && <span className="select-none text-muted-foreground/60">{prompt}</span>}
      <code className="min-w-0 flex-1 truncate text-foreground/90">{command}</code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy command"}
        className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
      >
        {copied ? (
          <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
    </div>
  );
}
