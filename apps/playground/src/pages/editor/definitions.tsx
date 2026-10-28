import { blockDefinitions } from "./blocks";
import { componentDefinitions, ROOT_TYPE } from "./catalog";
import { ancestryOf, findNode } from "./tree";
import type {
  ComponentDefinitionType,
  ComponentGroupType,
  EditorNodeType,
  NodePropsType,
} from "./types";

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

/**
 * Full insertion check for one node: placement rules (`canPlace`), slot limits
 * (one Drawer.Header) and single-child containers (Drawer.Trigger). `movingId`
 * is left out of the counts when a node is being moved within the same parent.
 */
export function canInsert(
  root: EditorNodeType,
  parentId: string,
  childType: string,
  movingId?: string,
) {
  const parent = findNode(root, parentId);
  const definition = parent && getDefinition(parent.type);
  if (!parent || !definition || !canPlace(ancestryOf(root, parentId), childType))
    return false;
  const siblings = (parent.children ?? []).filter((child) => child.id !== movingId);
  return hasRoom(definition, siblings, childType);
}

/** Slot limits and `maxChildren` for adding `childType` next to `siblings`. */
export function hasRoom(
  definition: ComponentDefinitionType,
  siblings: EditorNodeType[],
  childType: string,
) {
  if (definition.maxChildren !== undefined && siblings.length >= definition.maxChildren) {
    return false;
  }
  const slot = definition.slots?.find((entry) => entry.type === childType);
  if (slot?.max !== undefined) {
    return siblings.filter((child) => child.type === childType).length < slot.max;
  }
  return true;
}

/** Slots of `node` that still have room, in order (for "Add inside" and Layers). */
export function openSlots(root: EditorNodeType, node: EditorNodeType) {
  return (getDefinition(node.type)?.slots ?? []).filter((slot) =>
    canInsert(root, node.id, slot.type),
  );
}

/**
 * In a container built only from slots (`accepts`), a part goes to its slot's
 * place: a Footer added first still lands after Header and Body. Repeatable
 * parts keep the requested spot among their own kind (reordering rows).
 * Returns an index for `insertNode`, or for `moveNode` when `movingId` is set.
 */
export function slotIndex(
  parent: EditorNodeType,
  childType: string,
  requested: number,
  movingId?: string,
) {
  const definition = getDefinition(parent.type);
  const slots = definition?.slots;
  if (!slots || !definition.accepts) return requested;
  const rank = (type: string) => slots.findIndex((slot) => slot.type === type);
  const own = rank(childType);
  if (own === -1) return requested;

  const children = parent.children ?? [];
  const from = movingId ? children.findIndex((child) => child.id === movingId) : -1;
  const siblings = children.filter((child) => child.id !== movingId);
  // `requested` is relative to the full list; convert it to the list without the moving node.
  const wanted = from !== -1 && from < requested ? requested - 1 : requested;

  let start = -1;
  let end = 0;
  siblings.forEach((child, index) => {
    const childRank = rank(child.type);
    if (childRank === own && start === -1) start = index;
    if (childRank !== -1 && childRank <= own) end = index + 1;
  });
  const index = start !== -1 && wanted >= start && wanted <= end ? wanted : end;
  return from !== -1 && from <= index ? index + 1 : index;
}
