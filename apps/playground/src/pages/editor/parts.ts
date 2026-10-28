import { getDefinition } from "./definitions";
import type { ComponentDefinitionType } from "./types";

/** "Drawer pre-footer", shown inside its Drawer, reads as "Pre-footer". */
export function partLabel(part: ComponentDefinitionType) {
  const parent = part.partOf ? (getDefinition(part.partOf)?.label ?? part.partOf) : "";
  if (parent && part.label.toLowerCase().startsWith(`${parent.toLowerCase()} `)) {
    const rest = part.label.slice(parent.length + 1);
    return rest.charAt(0).toUpperCase() + rest.slice(1);
  }
  return part.label;
}
