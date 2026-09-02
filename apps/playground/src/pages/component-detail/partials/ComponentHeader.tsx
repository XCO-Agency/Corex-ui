import { Sparkles, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCategoryIcon } from "@/lib/category-icons";

export type ComponentHeaderPropsType = {
  name: string;
  category: string;
  description: string;
  requiresEmbeddedContext?: boolean;
};

export function ComponentHeader({
  name,
  category,
  description,
  requiresEmbeddedContext,
}: ComponentHeaderPropsType) {
  const CategoryIcon = getCategoryIcon(category);

  return (
    <header id="overview" className="space-y-4 pb-2">
      {/* Badges Row */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="gap-1.5 px-2.5 py-1 text-xs font-medium">
          <CategoryIcon className="size-3.5 text-muted-foreground" />
          <span>{category}</span>
        </Badge>

        <Badge variant="success" className="gap-1.5 px-2.5 py-1 text-xs font-medium">
          <Sparkles className="size-3" />
          <span>v0.1.0 Ready</span>
        </Badge>

        {requiresEmbeddedContext && (
          <Badge
            variant="secondary"
            className="gap-1.5 px-2.5 py-1 text-xs font-medium border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200"
          >
            <ShoppingBag className="size-3 text-amber-600 dark:text-amber-400" />
            <span>App Bridge Session</span>
          </Badge>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        {name}
      </h1>

      {/* Description */}
      <p className="max-w-3xl text-base text-muted-foreground leading-relaxed">
        {description}
      </p>
    </header>
  );
}
