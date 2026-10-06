import {
  forwardRef,
  useEffect,
  useId,
  useLayoutEffect,
  useState,
  type CSSProperties,
} from "react";
import { InlineStack } from "../InlineStack";
import { Button } from "../Button";
import { Modal } from "../Modal";
import { TextField } from "../TextField";
import { useIndexFiltersContext } from "./IndexFiltersContext";
import type {
  IndexFiltersSaveActionType,
  IndexFiltersViewVisibleActiveFilterPropsType,
} from "./IndexFilters.types";

/**
 * Shows its children only while a search or filter is active, expanding and
 * collapsing them horizontally. Outside `IndexFilters` it is always visible.
 *
 * Each instance animates on its own, so the built-in save action and any
 * number of custom `ViewVisibleActiveFilter` groups never interfere.
 */
export const IndexFiltersViewVisibleActiveFilter = forwardRef<
  HTMLDivElement,
  IndexFiltersViewVisibleActiveFilterPropsType
>(function IndexFiltersViewVisibleActiveFilter({ children, visible, duration = 200 }, ref) {
  const context = useIndexFiltersContext();
  const shown = visible ?? context?.active ?? true;

  // Grid track 0fr ↔ 1fr animates to the content's natural width without
  // measuring it. Visibility flips after the collapse so hidden actions leave
  // the tab order.
  const trackStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: shown ? "1fr" : "0fr",
    opacity: shown ? 1 : 0,
    visibility: shown ? "visible" : "hidden",
    pointerEvents: shown ? undefined : "none",
    transition: [
      `grid-template-columns ${duration}ms ease-in-out`,
      `opacity ${duration}ms ease-in-out`,
      `visibility 0ms linear ${shown ? 0 : duration}ms`,
    ].join(", "),
  };

  return (
    <InlineStack
      ref={ref}
      alignItems="center"
      aria-hidden={shown ? undefined : true}
      data-corex-index-filters-active-only={shown ? "visible" : "hidden"}
      style={trackStyle}
    >
      <InlineStack
        alignItems="center"
        gap="small-400"
        minInlineSize={0}
        overflow="hidden"
        wrap={false}
      >
        {children}
      </InlineStack>
    </InlineStack>
  );
});
IndexFiltersViewVisibleActiveFilter.displayName = "IndexFiltersViewVisibleActiveFilter";

/** The save button itself; visible only while filters are active. */
export function IndexFiltersSaveButton() {
  const context = useIndexFiltersContext();
  if (!context?.saveEnabled) return null;

  return (
    <IndexFiltersViewVisibleActiveFilter>
      <Button
        variant="tertiary"
        disabled={context.saveDisabled}
        onClick={context.openSaveModal}
      >
        {context.saveLabel}
      </Button>
    </IndexFiltersViewVisibleActiveFilter>
  );
}

/**
 * Places the built-in save action explicitly. By default it renders at the
 * end of `IndexFilters.Actions`; render this to put it elsewhere instead.
 */
export function IndexFiltersSaveAction() {
  const id = useId();
  const registerSaveAction = useIndexFiltersContext()?.registerSaveAction;

  useLayoutEffect(() => registerSaveAction?.(id), [registerSaveAction, id]);

  return <IndexFiltersSaveButton />;
}
IndexFiltersSaveAction.displayName = "IndexFiltersSaveAction";

type IndexFiltersSaveModalPropsType = {
  open: boolean;
  config: IndexFiltersSaveActionType;
  onClose: () => void;
  onSave: (name: string) => void | Promise<void>;
};

/** Modal asking for the name of the new view. */
export function IndexFiltersSaveModal({
  open,
  config,
  onClose,
  onSave,
}: IndexFiltersSaveModalPropsType) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  // Start from a blank form each time the modal opens.
  useEffect(() => {
    if (open) {
      setName("");
      setError(undefined);
      setSaving(false);
    }
  }, [open]);

  const trimmedName = name.trim();

  const handleSave = async () => {
    if (!trimmedName || saving) return;
    const validationError = config.validateName?.(trimmedName);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    try {
      await onSave(trimmedName);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save view");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={config.modalTitle ?? "Save as new view"}
      primaryAction={{
        content: config.saveLabel ?? "Save",
        onAction: handleSave,
        disabled: !trimmedName,
        loading: saving,
      }}
      secondaryActions={[{ content: config.cancelLabel ?? "Cancel", onAction: onClose }]}
    >
      <TextField
        label={config.nameLabel ?? "Name"}
        placeholder={config.namePlaceholder}
        value={name}
        error={error}
        autoComplete="off"
        onChange={(next) => {
          setName(next);
          if (error) setError(undefined);
        }}
      />
    </Modal>
  );
}
