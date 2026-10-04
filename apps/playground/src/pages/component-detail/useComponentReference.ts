import * as React from "react";
import {
  loadSkillReference,
  toReferenceName,
  type ComponentReferenceType,
} from "@/lib/skill-reference";

/** `undefined` while loading, `null` when the skill has no section for the entry. */
export function useComponentReference(entryName: string | undefined, enabled = true) {
  const [reference, setReference] = React.useState<ComponentReferenceType | null | undefined>(
    enabled ? undefined : null,
  );

  React.useEffect(() => {
    if (!enabled || !entryName) {
      setReference(null);
      return;
    }
    let active = true;
    setReference(undefined);
    loadSkillReference()
      .then((sections) => {
        if (active) setReference(sections.get(toReferenceName(entryName)) ?? null);
      })
      .catch(() => {
        if (active) setReference(null);
      });
    return () => {
      active = false;
    };
  }, [entryName, enabled]);

  return reference;
}
