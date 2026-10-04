import * as React from "react";
import { Check, Copy, FileCode2, ShoppingBag, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div className="flex h-7 min-w-0 max-w-full items-center gap-2 rounded-md border border-border/80 bg-muted/30 pr-0.5 pl-2.5">
      <code className="min-w-0 truncate font-mono text-xs text-foreground/90">
        <span className="text-violet-600 dark:text-violet-400">import</span> {"{ "}
        <span className="font-semibold">{importName}</span>
        {" }"} <span className="text-violet-600 dark:text-violet-400">from</span>{" "}
        <span className="text-emerald-700 dark:text-emerald-400">"@xco-agency/corex-ui"</span>
      </code>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={handleCopy}
        aria-label={copied ? "Copied import" : "Copy import"}
        className="size-6 shrink-0 text-muted-foreground"
      >
        {copied ? <Check className="text-emerald-600" /> : <Copy />}
      </Button>
    </div>
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
  const CategoryIcon = getCategoryIcon(category);

  return (
    <header id="overview" className="scroll-mt-20 space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
          <CategoryIcon className="size-3.5" />
          {isBlock ? `Blocks · ${category}` : category}
        </span>
        <span className="text-border">/</span>
        <span className="font-mono text-muted-foreground">v{COREX_UI_VERSION}</span>
        {requiresEmbeddedContext && (
          <Badge
            variant="secondary"
            className="gap-1.5 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-amber-900 dark:text-amber-200"
          >
            <ShoppingBag className="text-amber-600 dark:text-amber-400" />
            App Bridge session
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
          {name}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {!isBlock && (
        <div className="flex flex-wrap items-center gap-2">
          <ImportSnippet importName={importName} />
          <Button
            variant="ghost"
            nativeButton={false}
            size="xs"
            className="h-7 px-2 text-xs text-muted-foreground"
            render={
              <a
                href={`${REPO_URL}/packages/corex-ui/src/components/${importName}/${importName}.tsx`}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <FileCode2 />
            Source
          </Button>
          <Button
            variant="ghost"
            nativeButton={false}
            size="xs"
            className="h-7 px-2 text-xs text-muted-foreground"
            render={
              <a
                href={`${REPO_URL}/.agents/skills/corex-ui-components/SKILL.md#${importName.toLowerCase()}`}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <Sparkles />
            AI skill
          </Button>
        </div>
      )}
    </header>
  );
}
