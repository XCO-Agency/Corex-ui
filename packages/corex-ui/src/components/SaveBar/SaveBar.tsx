import { forwardRef, useEffect, useMemo, useRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { mergeRefs } from "../../core/mergeRefs";
import type { SaveBarPropsType } from "./SaveBar.types";

const UiSaveBar = createWebComponent<HTMLElement>("ui-save-bar");

/**
 * App Bridge component (see `docs/app-bridge.md`). Wraps `<ui-save-bar>` —
 * Shopify native App Bridge Save Bar web component.
 * Can be controlled declaratively via `open={isDirty}` or imperatively
 * via `useSaveBar().show(id)` / `.hide(id)`.
 */
export const SaveBar = forwardRef<HTMLElement, SaveBarPropsType>(function SaveBar(
  {
    id,
    open,
    saveText = "Save",
    discardText = "Discard",
    onSave,
    onDiscard,
    loading = false,
    disabled = false,
    discardConfirmation = true,
    children,
    ...rest
  },
  ref,
) {
  const resolvedId = id ?? "corex-ui-save-bar";
  const innerRef = useRef<HTMLElement>(null);
  const mergedRef = useMemo(() => mergeRefs(innerRef, ref), [ref]);

  useEffect(() => {
    const node = innerRef.current;
    if (!node) return;
    if (discardConfirmation !== undefined) {
      (node as any).discardConfirmation = Boolean(discardConfirmation);
      if (discardConfirmation) {
        node.setAttribute("discardconfirmation", "");
      } else {
        node.removeAttribute("discardconfirmation");
      }
    }
  }, [discardConfirmation]);

  useEffect(() => {
    if (open === undefined) return;
    const shopify = typeof window !== "undefined" ? (window as any).shopify : undefined;
    if (!shopify?.saveBar) return;

    if (open) {
      shopify.saveBar.show(resolvedId);
    } else {
      shopify.saveBar.hide(resolvedId);
    }
  }, [open, resolvedId]);

  useEffect(() => {
    return () => {
      const shopify = typeof window !== "undefined" ? (window as any).shopify : undefined;
      shopify?.saveBar?.hide(resolvedId);
    };
  }, [resolvedId]);

  const content = children ?? (
    <>
      <button
        type="button"
        variant="primary"
        onClick={onSave}
        disabled={disabled || Boolean(loading)}
        loading={loading ? "" : undefined}
      >
        {saveText}
      </button>
      <button type="button" onClick={onDiscard} disabled={disabled || Boolean(loading)}>
        {discardText}
      </button>
    </>
  );

  return (
    <UiSaveBar
      ref={mergedRef}
      id={resolvedId}
      discardConfirmation={discardConfirmation}
      {...rest}
    >
      {content}
    </UiSaveBar>
  );
});
