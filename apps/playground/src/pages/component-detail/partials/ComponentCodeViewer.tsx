import * as React from "react";
import { Highlight, themes } from "prism-react-renderer";
import {
  Check,
  Copy,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { FileItemType } from "@/data/types";

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
    files && files.length > 0 ? files[0]!.path : filename
  );
  const [openFolders, setOpenFolders] = React.useState<Record<string, boolean>>({
    app: true,
    components: true,
    login: true,
  });

  // Theme detection for light (themes.github) and dark (themes.vsDark)
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
      return files.find((f) => f.path === activeFilePath) ?? files[0]!;
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

  const toggleFolder = (folderName: string) => {
    setOpenFolders((prev) => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  const hasMultipleFiles = Boolean(files && files.length > 0);

  return (
    <div
      className={cn(
        "relative flex flex-col md:flex-row overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs",
        className
      )}
    >
      {/* Optional File Tree (only for future multi-file blocks) */}
      {hasMultipleFiles && (
        <aside className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-border/70 bg-muted/20">
          <div className="flex h-10 items-center border-b border-border/70 px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Files
          </div>
          <div className="p-2 text-xs space-y-1 overflow-y-auto max-h-[400px]">
            {files!.map((file) => {
              const isSelected = file.path === activeFilePath;
              return (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => setActiveFilePath(file.path)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left font-mono transition-colors",
                    isSelected
                      ? "bg-muted font-semibold text-foreground shadow-2xs"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <FileCode className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{file.path}</span>
                </button>
              );
            })}
          </div>
        </aside>
      )}

      {/* Main Code Editor Panel */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header Bar */}
        <div className="flex h-10 items-center justify-between border-b border-border/70 bg-muted/30 px-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded bg-zinc-800 dark:bg-zinc-700 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white tracking-wide">
              TS
            </span>
            <span className="font-mono text-xs text-foreground/80 font-medium">
              {activeFile.path}
            </span>
          </div>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="size-7 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={handleCopy}
                />
              }
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              {copied ? "Copied code!" : "Copy code"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="overflow-x-auto p-4 select-text">
          <Highlight
            theme={isDark ? themes.vsDark : themes.github}
            code={activeCode}
            language={language}
          >
            {({ className: highlightClass, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={cn(
                  highlightClass,
                  "m-0 font-mono text-[13px] leading-relaxed"
                )}
                style={{ ...style, background: "transparent" }}
              >
                {tokens.map((line, lineIndex) => (
                  <div key={lineIndex} {...getLineProps({ line })} className="table-row">
                    <span className="table-cell select-none pr-5 text-right font-mono text-xs text-muted-foreground/45 min-w-[2rem]">
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
        </div>
      </div>
    </div>
  );
}
