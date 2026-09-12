import * as React from "react";
import { Sparkles } from "lucide-react";
import { Badge, type BadgePropsType } from "@/components/ui/badge";
import { COREX_UI_VERSION, VERSION_LABEL } from "@/lib/version";
import { cn } from "@/lib/utils";

export type VersionBadgePropsType = Omit<BadgePropsType, "children"> & {
  label?: string;
  showIcon?: boolean;
};

export function VersionBadge({
  className,
  variant = "success",
  label = VERSION_LABEL,
  showIcon = true,
  ...props
}: VersionBadgePropsType) {
  return (
    <Badge
      variant={variant}
      className={cn("gap-1.5 px-2.5 py-1 text-xs font-medium", className)}
      {...props}
    >
      {showIcon && <Sparkles className="size-3" />}
      <span>{label}</span>
    </Badge>
  );
}

export { COREX_UI_VERSION, VERSION_LABEL };
