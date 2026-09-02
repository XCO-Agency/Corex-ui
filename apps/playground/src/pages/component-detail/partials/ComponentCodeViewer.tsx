import * as React from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Check, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type ComponentCodeViewerPropsType = {
  code: string;
  language?: string;
  className?: string;
  maxCollapsedLines?: number;
};

export function ComponentCodeViewer({
  code,
  language = "tsx",
  className,
  maxCollapsedLines = 22,
}: ComponentCodeViewerPropsType) {
  const [copied, setCopied] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  const cleanCode = code.trim();
  const lineCount = cleanCode.split("\n").length;
  const isCollapsible = lineCount > maxCollapsedLines;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
      <div
        className={cn(
          "relative overflow-hidden rounded-b-xl border-t border-border/40 bg-[#121316] text-[#e4e4e7] dark:bg-[#0c0d0e]",
          className
        )}
      >
        {/* Top bar inside code block */}
        <div className="flex h-10 items-center justify-between border-b border-white/10 bg-white/5 px-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-emerald-500/80" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {language}
            </span>
            <span className="text-[11px] text-muted-foreground/60">
              ({lineCount} lines)
            </span>
          </div>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:bg-white/10 hover:text-white"
                  onClick={handleCopy}
                />
              }
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy</span>
                </>
              )}
            </TooltipTrigger>
            <TooltipContent>
              {copied ? "Copied code snippet!" : "Copy code"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Code Content */}
        <div
          className={cn(
            "relative overflow-x-auto transition-[max-height] duration-300",
            isCollapsible && !expanded && "max-h-[380px]"
          )}
        >
          <Highlight theme={themes.vsDark} code={cleanCode} language={language}>
            {({ className: highlightClass, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={cn(
                  highlightClass,
                  "m-0 p-4 font-mono text-[13px] leading-relaxed select-text"
                )}
                style={{ ...style, background: "transparent" }}
              >
                {tokens.map((line, lineIndex) => (
                  <div key={lineIndex} {...getLineProps({ line })} className="table-row">
                    <span className="table-cell select-none pr-4 text-right font-mono text-[11px] text-muted-foreground/40">
                      {lineIndex + 1}
                    </span>
                    <span className="table-cell">
                      {line.map((token, tokenIndex) => (
                        <span key={tokenIndex} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                ))}
              </pre>
            )}
          </Highlight>

          {/* Fade overlay when collapsed */}
          {isCollapsible && !expanded && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#121316] to-transparent dark:from-[#0c0d0e]" />
          )}
        </div>

        {/* Expand / Collapse toggle footer */}
        {isCollapsible && (
          <div className="flex items-center justify-center border-t border-white/5 bg-white/2 py-2">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="h-6 gap-1 text-xs text-muted-foreground hover:bg-white/10 hover:text-white"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  <ChevronUp className="size-3" />
                  <span>Collapse code</span>
                </>
              ) : (
                <>
                  <ChevronDown className="size-3" />
                  <span>Expand code ({lineCount} lines)</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>
  );
}
