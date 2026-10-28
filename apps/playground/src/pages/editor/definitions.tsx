import { blockDefinitions } from "./blocks";
import { componentDefinitions, ROOT_TYPE } from "./catalog";
import type { ComponentDefinitionType, ComponentGroupType, NodePropsType } from "./types";

export { ROOT_TYPE };
export { presets } from "./catalog";

export const definitions = componentDefinitions;

/** Drops empty values so generated code and rendered props stay minimal. */
export function compact(props: NodePropsType): NodePropsType {
  return Object.fromEntries(
    Object.entries(props).filter(
      ([, value]) => value !== "" && value !== undefined && value !== null,
    ),
  );
}

const byType = new Map(
  [...definitions, ...blockDefinitions].map((definition) => [
    definition.type,
    definition,
  ]),
);

export function getDefinition(type: string): ComponentDefinitionType | undefined {
  return byType.get(type);
}

/** Whether a `childType` node may live directly inside a `parentType` container. */
export function canContain(parentType: string, childType: string) {
  const parent = getDefinition(parentType);
  const child = getDefinition(childType);
  if (!parent?.isContainer || !child) return false;
  if (parent.accepts && !parent.accepts.includes(childType)) return false;
  if (child.parents && !child.parents.includes(parentType)) return false;
  return true;
}

/**
 * `canContain`, plus `ancestors`: Drawer and Command parts read their root's
 * context, so they must land somewhere inside it. `ancestry` lists the types from
 * the canvas root down to the would-be parent.
 */
export function canPlace(ancestry: string[], childType: string) {
  const parentType = ancestry[ancestry.length - 1];
  if (!parentType || !canContain(parentType, childType)) return false;
  const required = getDefinition(childType)?.ancestors;
  return !required || ancestry.some((type) => required.includes(type));
}

export const GROUP_ORDER: ComponentGroupType[] = [
  "Layout",
  "Typography",
  "Actions",
  "Forms",
  "Feedback",
  "Media",
  "Navigation",
  "Overlays",
  "App Bridge",
];
