import { Badge, type BadgePropsType } from "@xco-agency/corex-ui";
import { COREX_UI_VERSION, VERSION_LABEL } from "@/lib/version";

export type VersionBadgePropsType = Omit<BadgePropsType, "children"> & {
  label?: string;
};

export function VersionBadge({
  label = VERSION_LABEL,
  tone = "success",
  ...props
}: VersionBadgePropsType) {
  return (
    <Badge tone={tone} {...props}>
      {label}
    </Badge>
  );
}

export { COREX_UI_VERSION, VERSION_LABEL };
